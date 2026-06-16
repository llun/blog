#!/usr/bin/env node
// @ts-check
import 'dotenv-flow/config'
import {
  CloudFormationClient,
  DescribeStacksCommand,
  CreateStackCommand,
  UpdateStackCommand
} from '@aws-sdk/client-cloudformation'
const StackName = 'Website'
const BlogBucket = 'ContentBucket'
const ActivityPub = 'ActivityPubSource'
const Docs = 'Docs'

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
              'Accept',
              // Defense-in-depth fail-safe against Web Cache Deception:
              // authenticated Mastodon API calls under /api/* carry a bearer
              // token here, so even if the origin ever returned an
              // authenticated response with a cacheable Cache-Control,
              // CloudFront keys it per-token and can never serve it to another
              // user. Requests without the header (HTTP-Signature federation,
              // anonymous/public ActivityPub) all collapse to one cache entry,
              // so public caching is unaffected. Cache-key headers are also
              // automatically forwarded to the origin for every HTTP method
              // (including non-cacheable POST/PUT/PATCH/DELETE — posting,
              // follows, favourites), so authenticated writes get the token
              // without listing it in the origin-request policy.
              'Authorization'
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
            'Origin',
            // Idempotency-Key lets Mastodon clients dedupe a retried
            // POST /api/v1/statuses so it doesn't double-post (forwarded only;
            // not in the cache key). Authorization is intentionally NOT here:
            // it lives in ActivityPubCachePolicy's cache key, and cache-key
            // headers are automatically forwarded to the origin for every HTTP
            // method (including non-cacheable POST/PUT/PATCH/DELETE), so adding
            // it here would be redundant.
            'Idempotency-Key'
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
          // The NodeInfo document (/nodeinfo and /nodeinfo/2.0) is public
          // instance metadata that clients fetch when adding the server. Route
          // it to the app origin so it no longer falls through to the blog
          // default behaviour (which 302s it to www.llun.me). Two exact
          // patterns rather than a greedy /nodeinfo* so unrelated paths such as
          // /nodeinfo-anything stay on the blog default behaviour.
          activityPubBehaviour('/nodeinfo', `${ActivityPub}StaticCachePolicy`),
          activityPubBehaviour(
            '/nodeinfo/*',
            `${ActivityPub}StaticCachePolicy`
          ),
          activityPubBehaviour(
            '/api/v1/medias/apple*',
            `${ActivityPub}StaticCachePolicy`
          ),
          // Timelines are per-account and change constantly; they must not be
          // shared-cached (a token-blind static cache key would leak one
          // account's feed to another and serve stale feeds). They fall
          // through to the dynamic /api/* behaviour below (DefaultTTL 0).
          activityPubBehaviour('/api/*'),
          // Sign-in UI pages and Mastodon OAuth flow live outside /api/.
          // Forward them to the activities.next origin with the dynamic
          // (no-cache, forward-all-cookies) policy so credential/session
          // cookies reach the origin and nothing is cached.
          activityPubBehaviour('/auth/*'),
          activityPubBehaviour('/oauth/*'),
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

const docsResources = {
  [`${Docs}CDN`]: {
    Type: 'AWS::CloudFront::Distribution',
    Properties: {
      DistributionConfig: {
        Aliases: ['docs.llun.dev'],
        Origins: [
          {
            Id: Docs,
            DomainName: 'vm.llun.dev',
            OriginCustomHeaders: [
              {
                HeaderName: 'X-Gateway-Host',
                HeaderValue: 'docs.llun.dev'
              }
            ],
            CustomOriginConfig: {
              OriginProtocolPolicy: 'https-only'
            }
          }
        ],
        Enabled: true,
        HttpVersion: 'http2and3',
        Comment: 'Docs',
        IPV6Enabled: true,
        DefaultCacheBehavior: {
          AllowedMethods: [
            'GET',
            'HEAD',
            'OPTIONS',
            'PUT',
            'PATCH',
            'POST',
            'DELETE'
          ],
          TargetOriginId: Docs,
          // Managed policy: CachingDisabled.
          CachePolicyId: '4135ea2d-6df8-44a3-9df3-4b5a84be39ad',
          // Managed policy: all viewer headers/cookies/query strings except Host.
          OriginRequestPolicyId: 'b689b0a8-53d0-40ab-baf2-68738e2966ac',
          Compress: true,
          ViewerProtocolPolicy: 'redirect-to-https'
        },
        ViewerCertificate: {
          AcmCertificateArn:
            'arn:aws:acm:us-east-1:107563078874:certificate/fe8a4665-e248-4f64-91e9-929fd8c4cc9d',
          SslSupportMethod: 'sni-only',
          MinimumProtocolVersion: 'TLSv1.2_2021'
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
    ...cdnResources,
    ...docsResources
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
