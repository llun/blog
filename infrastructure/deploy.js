#!/usr/bin/env node
// @ts-check
const AWS = require('aws-sdk')
const StackName = 'Website'
const Bucket = 'ContentBucket'

const s3Resources = {
  [Bucket]: {
    Type: 'AWS::S3::Bucket',
    Properties: {
      AccessControl: 'PublicRead',
      BucketName: 'www.llun.me',
      WebsiteConfiguration: {
        IndexDocument: 'index.html',
        ErrorDocument: '404.html'
      }
    }
  },
  [`${Bucket}Policy`]: {
    Type: 'AWS::S3::BucketPolicy',
    Properties: {
      Bucket: { Ref: Bucket },
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Sid: 'PublicReadGetObject',
            Effect: 'Allow',
            Principal: '*',
            Action: 's3:GetObject',
            Resource: {
              'Fn::Join': ['', ['arn:aws:s3:::', { Ref: Bucket }, '/*']]
            }
          }
        ]
      }
    }
  }
}
const cdnResources = {
  [`${Bucket}CachePolicy`]: {
    Type: 'AWS::CloudFront::CachePolicy',
    Properties: {
      CachePolicyConfig: {
        Comment: `Cache policy for ${Bucket}`,
        DefaultTTL: 86400,
        MaxTTL: 31536000,
        MinTTL: 1,
        Name: `${Bucket}CachePolicy`,
        ParametersInCacheKeyAndForwardedToOrigin: {
          CookiesConfig: {
            CookieBehavior: 'none'
          },
          EnableAcceptEncodingBrotli: true,
          EnableAcceptEncodingGzip: true,
          HeadersConfig: {
            HeaderBehavior: 'whitelist',
            Headers: ['Host', 'Origin']
          },
          QueryStringsConfig: {
            QueryStringBehavior: 'none'
          }
        }
      }
    }
  },
  [`${Bucket}OriginRequestPolicy`]: {
    Type: 'AWS::CloudFront::OriginRequestPolicy',
    Properties: {
      OriginRequestPolicyConfig: {
        Comment: `Origin request policy for ${Bucket}`,
        CookiesConfig: {
          CookieBehavior: 'none'
        },
        HeadersConfig: {
          HeaderBehavior: 'whitelist',
          Headers: ['Host']
        },
        Name: `${Bucket}OriginRequestPolicy`,
        QueryStringsConfig: {
          QueryStringBehavior: 'none'
        }
      }
    }
  },
  [`${Bucket}CDN`]: {
    Type: 'AWS::CloudFront::Distribution',
    Properties: {
      DistributionConfig: {
        Aliases: ['llun.me', 'www.llun.me', 'llun.dev', 'www.llun.dev'],
        Origins: [
          {
            Id: Bucket,
            DomainName: {
              'Fn::Join': [
                '.',
                [
                  { Ref: Bucket },
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
        Comment: 'Blog Content',
        DefaultRootObject: 'index.html',
        PriceClass: 'PriceClass_All',
        IPV6Enabled: true,
        DefaultCacheBehavior: {
          TargetOriginId: Bucket,
          CachePolicyId: {
            Ref: `${Bucket}CachePolicy`
          },
          OriginRequestPolicyId: {
            Ref: `${Bucket}OriginRequestPolicy`
          },
          Compress: true,
          ViewerProtocolPolicy: 'redirect-to-https',
          LambdaFunctionAssociations: [
            {
              EventType: 'origin-request',
              LambdaFunctionARN:
                'arn:aws:lambda:us-east-1:107563078874:function:Blog_Edge_redirectDomain:15'
            }
          ]
        },
        ViewerCertificate: {
          AcmCertificateArn:
            'arn:aws:acm:us-east-1:107563078874:certificate/95decd54-eaa2-4433-b0ad-dd6dffe0ca08',
          SslSupportMethod: 'sni-only',
          MinimumProtocolVersion: 'TLSv1.2_2019'
        },
        Logging: {
          Bucket: 'llun.logs.s3.amazonaws.com',
          Prefix: 'cloudfront/llun.me'
        }
      }
    }
  }
}

const template = {
  AWSTemplateFormatVersion: '2010-09-09',
  Description: 'Blog storage and CDN',
  Mappings: {
    RegionToS3DomainSuffix: {
      'ap-southeast-1': {
        suffix: 's3-website-ap-southeast-1.amazonaws.com'
      }
    }
  },
  Resources: {
    ...s3Resources,
    ...cdnResources
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

    console.log('Creating new stack')
    await cloudformation
      .createStack({
        StackName,
        TemplateBody: JSON.stringify(template)
      })
      .promise()
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
