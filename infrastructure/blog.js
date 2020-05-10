// @ts-check
const AWS = require('aws-sdk')

const StackName = 'WebSite'
const ContentBucket = 'ContentBucket'

const template = {
  AWSTemplateFormatVersion: '2010-09-09',
  Description: 'Blog',
  Mappings: {
    RegionToS3DomainSuffix: {
      'ap-southeast-1': {
        suffix: 's3-website-ap-southeast-1.amazonaws.com'
      }
    }
  },
  Resources: {
    [ContentBucket]: {
      Type: 'AWS::S3::Bucket',
      Properties: {
        AccessControl: 'PublicRead',
        BucketName: 'llun.me',
        WebsiteConfiguration: {
          IndexDocument: 'index.html',
          ErrorDocument: '404.html'
        }
      },
      DeletionPolicy: 'Retain'
    },
    [`${ContentBucket}Policy`]: {
      Type: 'AWS::S3::BucketPolicy',
      Properties: {
        Bucket: { Ref: ContentBucket },
        PolicyDocument: {
          Version: '2012-10-17',
          Statement: [
            {
              Sid: 'PublicReadGetObject',
              Effect: 'Allow',
              Principal: '*',
              Action: 's3:GetObject',
              Resource: {
                'Fn::Join': [
                  '',
                  ['arn:aws:s3:::', { Ref: ContentBucket }, '/*']
                ]
              }
            }
          ]
        }
      }
    },
    [`${ContentBucket}CDN`]: {
      Type: 'AWS::CloudFront::Distribution',
      Properties: {
        DistributionConfig: {
          Aliases: ['llun.me', 'www.llun.me'],
          Origins: [
            {
              Id: ContentBucket,
              DomainName: {
                'Fn::Join': [
                  '.',
                  [
                    { Ref: ContentBucket },
                    {
                      'Fn::FindInMap': [
                        'RegionToS3DomainSuffix',
                        { Ref: 'AWS::Region' },
                        'suffix'
                      ]
                    }
                  ]
                ]
              },
              CustomOriginConfig: {
                OriginProtocolPolicy: 'http-only'
              }
            }
          ],
          Enabled: true,
          HttpVersion: 'http2',
          Comment: 'Main Web Content',
          DefaultRootObject: 'index.html',
          PriceClass: 'PriceClass_All',
          DefaultCacheBehavior: {
            TargetOriginId: ContentBucket,
            ForwardedValues: {
              QueryString: true
            },
            Compress: true,
            ViewerProtocolPolicy: 'redirect-to-https'
          },
          ViewerCertificate: {
            AcmCertificateArn:
              'arn:aws:acm:us-east-1:107563078874:certificate/620c6054-43e6-4545-822b-56d45254e06e',
            SslSupportMethod: 'sni-only'
          },
          Logging: {
            Bucket: 'llun.logs.s3.amazonaws.com',
            Prefix: 'cloudfront/llun.me'
          }
        }
      }
    }
  }
}

const cloudformation = new AWS.CloudFormation({ region: 'ap-southeast-1' })

async function run() {
  try {
    await cloudformation.describeStacks({ StackName }).promise()
    console.log('Updating stack')
    await cloudformation
      .updateStack({ StackName, TemplateBody: JSON.stringify(template) })
      .promise()
  } catch (error) {
    if (!error.message.endsWith('does not exist')) {
      throw error
    }

    await cloudformation.createStack({
      StackName,
      TemplateBody: JSON.stringify(template)
    })
  }
}

run()
  .then(() => {
    console.log('Finished')
    process.exit(0)
  })
  .catch((error) => {
    console.error(error.message)
    console.error(error.stack)
    process.exit(-1)
  })
