#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */
// @ts-check
require('dotenv-flow/config')
const {
  CloudFormationClient,
  DescribeStacksCommand,
  CreateStackCommand,
  UpdateStackCommand
} = require('@aws-sdk/client-cloudformation')
const StackName = 'Website'
const BlogBucket = 'ContentBucket'
const ActivityPub = 'ActivityPubSource'

const activityPubBehaviour = (
  pathPattern,
  cachePolicy = `${ActivityPub}CachePolicy`
) => ({
  AllowedMethods: ['GET', 'HEAD', 'OPTIONS', 'PUT', 'PATCH', 'POST', 'DELETE'],
  PathPattern: pathPattern,
  TargetOriginId: ActivityPub,
  CachePolicyId: {
    Ref: cachePolicy
  },
  OriginRequestPolicyId: {
    Ref: `${ActivityPub}OriginRequestPolicy`
  },
  Compress: true,
  ViewerProtocolPolicy: 'redirect-to-https',
  LambdaFunctionAssociations: [
    {
      EventType: 'origin-request',
      LambdaFunctionARN:
        'arn:aws:lambda:us-east-1:107563078874:function:Blog_Edge_updateHost:12'
    }
  ]
})

const blogS3Resources = {
  [BlogBucket]: {
    Type: 'AWS::S3::Bucket',
    Properties: {
      AccessControl: 'PublicRead',
      BucketName: 'www.llun.me',
      WebsiteConfiguration: {
        IndexDocument: 'index.html',
        ErrorDocument: '404.html',
        RoutingRules: [
          {
            RoutingRuleCondition: {
              KeyPrefixEquals: 'journeys/amsterdam/cycling/'
            },
            RedirectRule: {
              HttpRedirectCode: '302',
              ReplaceKeyPrefixWith: 'tags/ride/posts/'
            }
          }
        ]
      }
    }
  },
  [`${BlogBucket}Policy`]: {
    Type: 'AWS::S3::BucketPolicy',
    Properties: {
      Bucket: { Ref: BlogBucket },
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Sid: 'PublicReadGetObject',
            Effect: 'Allow',
            Principal: '*',
            Action: 's3:GetObject',
            Resource: {
              'Fn::Join': ['', ['arn:aws:s3:::', { Ref: BlogBucket }, '/*']]
            }
          }
        ]
      }
    }
  }
}
const cdnResources = {
  [`${BlogBucket}CachePolicy`]: {
    Type: 'AWS::CloudFront::CachePolicy',
    Properties: {
      CachePolicyConfig: {
        Comment: `Cache policy for ${BlogBucket}`,
        DefaultTTL: 86400,
        MaxTTL: 31536000,
        MinTTL: 1,
        Name: `${BlogBucket}CachePolicy`,
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
  [`${ActivityPub}CachePolicy`]: {
    Type: 'AWS::CloudFront::CachePolicy',
    Properties: {
      CachePolicyConfig: {
        Comment: `Cache policy for ${ActivityPub} API`,
        DefaultTTL: 0,
        MaxTTL: 60,
        MinTTL: 0,
        Name: `${ActivityPub}CachePolicy`,
        ParametersInCacheKeyAndForwardedToOrigin: {
          CookiesConfig: {
            CookieBehavior: 'none'
          },
          EnableAcceptEncodingBrotli: true,
          EnableAcceptEncodingGzip: true,
          HeadersConfig: {
            HeaderBehavior: 'whitelist',
            Headers: [
              'Origin',
              'Date',
              'Digest',
              'Content-Type',
              'Signature',
              'Accept'
            ]
          },
          QueryStringsConfig: {
            QueryStringBehavior: 'all'
          }
        }
      }
    }
  },
  [`${ActivityPub}StaticCachePolicy`]: {
    Type: 'AWS::CloudFront::CachePolicy',
    Properties: {
      CachePolicyConfig: {
        Comment: `Cache policy for ${ActivityPub} Static resource`,
        DefaultTTL: 3600,
        MaxTTL: 3600,
        MinTTL: 1800,
        Name: `${ActivityPub}StaticCachePolicy`,
        ParametersInCacheKeyAndForwardedToOrigin: {
          CookiesConfig: {
            CookieBehavior: 'none'
          },
          EnableAcceptEncodingBrotli: true,
          EnableAcceptEncodingGzip: true,
          HeadersConfig: {
            HeaderBehavior: 'whitelist',
            Headers: ['Accept']
          },
          QueryStringsConfig: {
            QueryStringBehavior: 'none'
          }
        }
      }
    }
  },
  [`${ActivityPub}OriginRequestPolicy`]: {
    Type: 'AWS::CloudFront::OriginRequestPolicy',
    Properties: {
      OriginRequestPolicyConfig: {
        Comment: `Origin request policy for ${ActivityPub}`,
        CookiesConfig: {
          CookieBehavior: 'all'
        },
        HeadersConfig: {
          HeaderBehavior: 'whitelist',
          Headers: [
            'Host',
            'X-Forwarded-Host',
            'X-Activity-Next-Host',
            'Referer',
            'Accept',
            'Origin'
          ]
        },
        Name: `${ActivityPub}OriginRequestPolicy`,
        QueryStringsConfig: {
          QueryStringBehavior: 'all'
        }
      }
    }
  },
  [`${BlogBucket}OriginRequestPolicy`]: {
    Type: 'AWS::CloudFront::OriginRequestPolicy',
    Properties: {
      OriginRequestPolicyConfig: {
        Comment: `Origin request policy for ${BlogBucket}`,
        CookiesConfig: {
          CookieBehavior: 'none'
        },
        HeadersConfig: {
          HeaderBehavior: 'whitelist',
          Headers: ['Host']
        },
        Name: `${BlogBucket}OriginRequestPolicy`,
        QueryStringsConfig: {
          QueryStringBehavior: 'none'
        }
      }
    }
  },
  [`${BlogBucket}CDN`]: {
    Type: 'AWS::CloudFront::Distribution',
    Properties: {
      DistributionConfig: {
        Aliases: ['llun.me', 'www.llun.me', 'llun.dev', 'www.llun.dev'],
        Origins: [
          {
            Id: BlogBucket,
            DomainName: {
              'Fn::Join': [
                '.',
                [
                  { Ref: BlogBucket },
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
          },
          {
            Id: ActivityPub,
            DomainName: 'cloudrun.llun.social',
            CustomOriginConfig: {
              OriginProtocolPolicy: 'https-only'
            }
          }
        ],
        Enabled: true,
        HttpVersion: 'http2and3',
        Comment: 'Blog Content',
        DefaultRootObject: 'index.html',
        PriceClass: 'PriceClass_All',
        IPV6Enabled: true,
        DefaultCacheBehavior: {
          TargetOriginId: BlogBucket,
          CachePolicyId: {
            Ref: `${BlogBucket}CachePolicy`
          },
          OriginRequestPolicyId: {
            Ref: `${BlogBucket}OriginRequestPolicy`
          },
          Compress: true,
          ViewerProtocolPolicy: 'redirect-to-https',
          LambdaFunctionAssociations: [
            {
              EventType: 'origin-request',
              LambdaFunctionARN:
                'arn:aws:lambda:us-east-1:107563078874:function:Blog_Edge_redirectDomain:24'
            }
          ]
        },
        CacheBehaviors: [
          activityPubBehaviour('/.well-known/*'),
          activityPubBehaviour(
            '/api/v1/medias/apple*',
            `${ActivityPub}StaticCachePolicy`
          ),
          activityPubBehaviour(
            '/api/v1/timelines*',
            `${ActivityPub}StaticCachePolicy`
          ),
          activityPubBehaviour('/api/*'),
          activityPubBehaviour(
            '/users/*/statuses/*',
            `${ActivityPub}StaticCachePolicy`
          ),
          activityPubBehaviour('/users/*'),
          activityPubBehaviour('/inbox'),
          activityPubBehaviour('/@null/*', `${ActivityPub}StaticCachePolicy`),
          activityPubBehaviour('/@null', `${ActivityPub}StaticCachePolicy`),
          activityPubBehaviour(
            '/@null@llun.dev',
            `${ActivityPub}StaticCachePolicy`
          ),
          activityPubBehaviour(
            '/@null@llun.dev/*',
            `${ActivityPub}StaticCachePolicy`
          ),
          activityPubBehaviour(
            '/activities/_next/static*',
            `${ActivityPub}StaticCachePolicy`
          ),
          activityPubBehaviour(
            '/_next/data/activities*',
            `${BlogBucket}CachePolicy`
          )
        ],
        ViewerCertificate: {
          AcmCertificateArn:
            'arn:aws:acm:us-east-1:107563078874:certificate/21fc0bc7-2820-462b-bfa6-e5c0241233dc',
          SslSupportMethod: 'sni-only',
          MinimumProtocolVersion: 'TLSv1.2_2021'
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
    ...blogS3Resources,
    ...cdnResources
  }
}

const cloudformation = new CloudFormationClient({ region: 'ap-southeast-1' })

async function run() {
  try {
    await cloudformation.send(new DescribeStacksCommand({ StackName }))
    console.log('Updating stack')
    await cloudformation.send(
      new UpdateStackCommand({
        StackName,
        TemplateBody: JSON.stringify(template)
      })
    )
  } catch (error) {
    if (!error.message.endsWith('does not exist')) {
      throw error
    }

    console.log('Creating new stack')
    await cloudformation.send(
      new CreateStackCommand({
        StackName,
        TemplateBody: JSON.stringify(template)
      })
    )
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
