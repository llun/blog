#!/usr/bin/env node
// @ts-check
/**
 * @typedef {{ awsid: string, cloudfront: string }} Arguments
 * @typedef {{ name: string, description: string, memory: number, timeout: number, role: string, handler: string, runtime: string, environment: Object | null | undefined }} ProjectConfig
 */
const fs = require('fs')
const {
  LambdaClient,
  GetFunctionConfigurationCommand,
  UpdateFunctionConfigurationCommand,
  UpdateFunctionCodeCommand,
  PublishVersionCommand,
  UpdateAliasCommand,
  CreateFunctionCommand,
  CreateAliasCommand
} = require('@aws-sdk/client-lambda')
const {
  CloudFrontClient,
  GetDistributionConfigCommand,
  UpdateDistributionCommand,
  CreateInvalidationCommand
} = require('@aws-sdk/client-cloudfront')
const archiver = require('archiver')
const streamBuffers = require('stream-buffers')
const crypto = require('crypto')
const _ = require('lodash')

const N_VIRGINIA = 'us-east-1'

const argv = /** @type {Arguments} */ (
  require('yargs')
    .option('awsid', {
      describe: 'AWS Account ID',
      required: true,
      type: 'string'
    })
    .option('cloudfront', {
      describe: 'Cloudfront distribution id',
      required: true,
      type: 'string'
    })
    .help().argv
)

const distributionId = argv.cloudfront
const awsId = argv.awsid
const projectConfig = /** @type {ProjectConfig} */ (
  JSON.parse(fs.readFileSync('project.json', { encoding: 'utf-8' }).toString())
)

/**
 *
 * @param {string} functionName
 * @returns {Promise<[string, Buffer | null]>}
 */
async function archivingFunction(functionName) {
  const name = `${projectConfig.name}_${functionName}`
  return new Promise((resolve, reject) => {
    console.log(`> Creating ${name} archive`)
    const buffers = new streamBuffers.WritableStreamBuffer({
      initialSize: 100 * 1024, // start at 100 kilobytes.
      incrementAmount: 10 * 1024 // grow by 10 kilobytes each time buffer overflows.
    })

    const archive = archiver('zip', { zlib: { level: -1 } })
    archive.on('error', (error) => reject(error))
    archive.pipe(buffers)

    buffers.on('finish', () => {
      const content = buffers.getContents()
      if (!content) {
        return resolve(['', null])
      }

      const hash = crypto.createHash('sha256')
      hash.update(content)
      const digest = hash.digest('base64')
      resolve([digest, content])
    })

    archive.directory(`${__dirname}/functions/${functionName}`, false)
    archive.finalize()
  })
}

/**
 *
 * @param {string} functionName
 * @returns {Promise<string | undefined>}
 */
async function deploy(functionName) {
  const name = `${projectConfig.name}_${functionName}`
  const lambda = new LambdaClient({ region: N_VIRGINIA })

  let shouldPublishVersion = false
  /** @type {string | undefined} */
  let version

  console.log(`> Loading ${name} configuration`)
  try {
    const configuration = await lambda.send(
      new GetFunctionConfigurationCommand({
        FunctionName: name,
        Qualifier: 'current'
      })
    )

    const current = {
      memory: configuration.MemorySize,
      timeout: configuration.Timeout,
      handler: configuration.Handler,
      runtime: configuration.Runtime,
      role: configuration.Role,
      environment:
        (configuration.Environment && configuration.Environment.Variables) || {}
    }
    version = configuration.Version

    const local = _.pick(projectConfig, [
      'memory',
      'timeout',
      'handler',
      'runtime',
      'environment',
      'role'
    ])
    if (!_.isEqual(current, local)) {
      console.log(`> Updating ${name} configuration`)
      const params = {
        FunctionName: name,
        Handler: local.handler,
        MemorySize: local.memory,
        Runtime: local.runtime,
        Timeout: local.timeout,
        Role: local.role,
        Environment: {
          Variables: local.environment
        }
      }
      await lambda.send(new UpdateFunctionConfigurationCommand(params))
      shouldPublishVersion = true
    }

    const [digest, content] = await archivingFunction(functionName)
    if (!content) {
      throw new Error(`Fail to create ${functionName} archive`)
    }
    if (configuration.CodeSha256 !== digest) {
      console.log('> Updating function code')
      await lambda.send(
        new UpdateFunctionCodeCommand({
          FunctionName: name,
          ZipFile: content
        })
      )
      shouldPublishVersion = true
    }

    if (shouldPublishVersion) {
      console.log('> Publishing new version')
      const params = {
        CodeSha256: digest,
        FunctionName: name
      }
      const latestVersion = await lambda.send(new PublishVersionCommand(params))

      console.log(`> Move current alias to version ${latestVersion.Version}`)
      await lambda.send(
        new UpdateAliasCommand({
          FunctionName: name,
          FunctionVersion: latestVersion.Version,
          Name: 'current'
        })
      )
      version = latestVersion.Version
    }
  } catch (error) {
    if (error.code !== 'ResourceNotFoundException') {
      throw error
    }

    const [digest, content] = await archivingFunction(functionName)
    if (!content) {
      throw new Error(`Fail to create ${functionName} archive`)
    }

    console.log(`> Create new function ${name}`)
    const createdResult = await lambda.send(
      new CreateFunctionCommand({
        FunctionName: name,
        Runtime: projectConfig.runtime,
        Handler: projectConfig.handler,
        Role: projectConfig.role,
        Timeout: projectConfig.timeout,
        Description: projectConfig.description,
        Code: {
          ZipFile: content
        },
        MemorySize: projectConfig.memory
      })
    )

    console.log('> Publishing new version')
    const latestVersion = await lambda.send(
      new PublishVersionCommand({
        CodeSha256: digest,
        FunctionName: name
      })
    )

    console.log(`> Create current alias for version ${latestVersion.Version}`)
    await lambda.send(
      new CreateAliasCommand({
        FunctionName: name,
        FunctionVersion: latestVersion.Version || '$LATEST',
        Name: 'current'
      })
    )
    version = latestVersion.Version
  }

  return version
}

/**
 *
 * @param {'viewer-request' | 'viewer-response' | 'origin-request' | 'origin-response'} eventType
 * @param {string} version
 * @param {string} functionName
 * @returns {Promise<void>}
 */
async function updateCloudfront(eventType, version, functionName) {
  if (!distributionId) {
    throw new Error('Distribution ID is required')
  }

  console.log(`> Updating cloudfront`)
  const cloudfront = new CloudFrontClient({})
  const config = await cloudfront.send(
    new GetDistributionConfigCommand({ Id: distributionId })
  )
  if (!config.DistributionConfig) {
    throw new Error('Fail to load distribution configuration')
  }

  const name = `${projectConfig.name}_${functionName}`
  if (!config.DistributionConfig.DefaultCacheBehavior) {
    console.log(`Fail to load default cache behavior for ${distributionId}`)
    return
  }

  const lambdas = config.DistributionConfig.DefaultCacheBehavior
    .LambdaFunctionAssociations || {
    Items: [],
    Quantity: 0
  }
  const handlers = [
    {
      EventType: eventType,
      LambdaFunctionARN: `arn:aws:lambda:us-east-1:${awsId}:function:${name}:${version}`
    }
  ]

  lambdas.Items = handlers
  lambdas.Quantity = handlers.length

  config.DistributionConfig.DefaultCacheBehavior.LambdaFunctionAssociations =
    lambdas

  await cloudfront.send(
    new UpdateDistributionCommand({
      DistributionConfig: {
        ...config.DistributionConfig
      },
      Id: distributionId,
      IfMatch: config.ETag
    })
  )
  await cloudfront.send(
    new CreateInvalidationCommand({
      DistributionId: distributionId,
      InvalidationBatch: {
        CallerReference: `${Date.now()}-invalidation`,
        Paths: {
          Quantity: 1,
          Items: ['/*']
        }
      }
    })
  )
}

async function run() {
  const targetFunction = 'redirectDomain'
  const version = await deploy(targetFunction)
  if (!version) {
    throw new Error('Fail to deploy function')
  }
  await updateCloudfront('origin-request', version, targetFunction)
}

run()
  .then(() => {
    console.log('Finished')
  })
  .catch((error) => {
    console.error(error.message)
    console.error(error.stack)
  })
