#!/usr/bin/env node
// @ts-check
/**
 * @typedef {{ awsid: string, cloudfront: string }} Arguments
 * @typedef {{ name: string, description: string, memory: number, timeout: number, role: string, handler: string, runtime: string, environment: Object | null | undefined }} ProjectConfig
 * @typedef {import('@aws-sdk/client-lambda').Runtime} Runtime
 */
import 'dotenv-flow/config'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import _ from 'lodash'
import { ZipFile } from 'yazl'
import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
import {
  LambdaClient,
  GetFunctionConfigurationCommand,
  UpdateFunctionConfigurationCommand,
  UpdateFunctionCodeCommand,
  PublishVersionCommand,
  UpdateAliasCommand,
  CreateFunctionCommand,
  CreateAliasCommand,
  waitUntilFunctionUpdated,
  waitUntilFunctionActive
} from '@aws-sdk/client-lambda'
import {
  CloudFrontClient,
  GetDistributionConfigCommand,
  UpdateDistributionCommand,
  CreateInvalidationCommand
} from '@aws-sdk/client-cloudfront'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const N_VIRGINIA = 'us-east-1'

const argv = /** @type {Arguments} */ (
  yargs(hideBin(process.argv))
    .option('awsid', {
      describe: 'AWS Account ID',
      required: true,
      type: 'string',
      default: process.env.AWS_ACCOUNT_ID
    })
    .option('cloudfront', {
      describe: 'Cloudfront distribution id',
      required: true,
      type: 'string',
      default: process.env.AWS_CLOUDFRONT_DISTRIBUTION
    })
    .help()
    .parseSync()
)

const distributionId = argv.cloudfront
const awsId = argv.awsid
const projectConfig = /** @type {ProjectConfig} */ (
  JSON.parse(
    fs
      .readFileSync(path.join(__dirname, 'project.json'), { encoding: 'utf-8' })
      .toString()
  )
)

/**
 *
 * @param {string} functionName
 * @returns {Promise<[string, Buffer | null]>}
 */
async function archivingFunction(functionName) {
  const name = `${projectConfig.name}_${functionName}`
  const directory = path.join(__dirname, 'functions', functionName)

  return new Promise((resolve, reject) => {
    console.log(`> Creating ${name} archive`)
    const zip = new ZipFile()
    const chunks = []

    try {
      addDirectoryToZip(zip, directory, directory)
    } catch (error) {
      reject(error)
      return
    }

    zip.outputStream.on('data', (chunk) => {
      chunks.push(chunk)
    })
    zip.outputStream.on('error', (error) => reject(error))
    zip.outputStream.on('end', () => {
      const content = Buffer.concat(chunks)
      if (content.length === 0) {
        return resolve(['', null])
      }

      const hash = crypto.createHash('sha256')
      hash.update(content)
      const digest = hash.digest('base64')
      resolve([digest, content])
    })

    zip.end()
  })
}

/**
 * @param {ZipFile} zip
 * @param {string} rootPath
 * @param {string} currentPath
 * @returns {void}
 */
function addDirectoryToZip(zip, rootPath, currentPath) {
  const entries = fs.readdirSync(currentPath, { withFileTypes: true })
  entries.sort((a, b) => a.name.localeCompare(b.name))

  for (const entry of entries) {
    const absolutePath = path.join(currentPath, entry.name)
    if (entry.isDirectory()) {
      addDirectoryToZip(zip, rootPath, absolutePath)
      continue
    }

    if (!entry.isFile()) {
      continue
    }

    const relativePath = path
      .relative(rootPath, absolutePath)
      .split(path.sep)
      .join('/')
    zip.addFile(absolutePath, relativePath)
  }
}

/**
 *
 * @param {LambdaClient} lambda
 * @param {string} functionName
 */
async function waitUpdate(lambda, functionName) {
  await waitUntilFunctionUpdated(
    { client: lambda, maxWaitTime: 10 },
    {
      FunctionName: functionName
    }
  )
}

/**
 *
 * @param {LambdaClient} lambda
 * @param {string} functionName
 */
async function waitActive(lambda, functionName) {
  await waitUntilFunctionActive(
    { client: lambda, maxWaitTime: 30 },
    {
      FunctionName: functionName
    }
  )
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
        Runtime: /** @type {Runtime} */ (local.runtime),
        Timeout: local.timeout,
        Role: local.role,
        Environment: {
          Variables: local.environment
        }
      }
      await lambda.send(new UpdateFunctionConfigurationCommand(params))
      await waitUpdate(lambda, name)
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
      await waitUpdate(lambda, name)
      shouldPublishVersion = true
    }

    if (shouldPublishVersion) {
      console.log('> Publishing new version')
      const params = {
        CodeSha256: digest,
        FunctionName: name
      }
      const latestVersion = await lambda.send(new PublishVersionCommand(params))
      await waitUpdate(lambda, name)

      console.log(`> Move current alias to version ${latestVersion.Version}`)
      await lambda.send(
        new UpdateAliasCommand({
          FunctionName: name,
          FunctionVersion: latestVersion.Version,
          Name: 'current'
        })
      )
      await waitUpdate(lambda, name)
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
    await lambda.send(
      new CreateFunctionCommand({
        FunctionName: name,
        Runtime: /** @type {Runtime} */ (projectConfig.runtime),
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
    await waitActive(lambda, name)
    console.log('> Publishing new version')
    const latestVersion = await lambda.send(
      new PublishVersionCommand({
        CodeSha256: digest,
        FunctionName: name
      })
    )
    await waitUpdate(lambda, name)
    console.log(`> Create current alias for version ${latestVersion.Version}`)
    await lambda.send(
      new CreateAliasCommand({
        FunctionName: name,
        FunctionVersion: latestVersion.Version || '$LATEST',
        Name: 'current'
      })
    )
    await waitUpdate(lambda, name)
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
  const cloudfront = new CloudFrontClient({ region: 'us-east-1' })
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

async function deployRedirectDomain() {
  const targetFunction = 'redirectDomain'
  const version = await deploy(targetFunction)
  if (!version) {
    throw new Error('Fail to deploy function')
  }
  await updateCloudfront('origin-request', version, targetFunction)
}

async function deployUpdateHost() {
  const targetFunction = 'updateHost'
  const version = await deploy(targetFunction)
  if (!version) {
    throw new Error('Fail to deploy function')
  }
}

async function run() {
  await deployRedirectDomain()
  await deployUpdateHost()
}

run()
  .then(() => {
    console.log('Finished')
  })
  .catch((error) => {
    console.error(error.message)
    console.error(error.stack)
  })
