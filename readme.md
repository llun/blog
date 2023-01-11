# Main site & blog posts

My main website and blog posts. 👉 https://www.llun.me

## Setup

1. Install all dependencies with `yarn install`
2. Add `.env.local` with these environment variabels.
   - `NEXT_PUBLIC_DOMAIN` is domain name for localhost, `http://127.0.0.1:3000`. It uses for link
     in the page, so the link in localhost works locally. This is set to `https://llun.me` in
     Github.
   - `STRAVA_TOKEN`, generate access token with access to `read_all` and `activity:read_all`
     for fetching Strava activities and detail.
   - `AWS_ACCOUNT_ID`, AWS Account id
   - `AWS_ACCESS_KEY_ID`, AWS Key for running infrastructure code
   - `AWS_CLOUDFRONT_DISTRIBUTION`, Cloudfront distribution id
   - `AWS_SECRET_ACCESS_KEY`, AWS Secret for running infrastructure code

## Icons

Most of the icons are from [favicon.io](https://favicon.io/emoji-favicons/) except Github icon

## Notes

- Changing ActivityPub server domain, updates `infrastructure/functions/updateHost/index.js` script to new domain too
- services

  - S3 buckets for storing all blog contents and images
  - Github stores original contents
  - Github Actions builds blog contents and send to S3
  - Cloudfront in front of S3 Buckets and ActivityPub server in Vercel
  - Cloudfront decides which domain to go to which origin, blog domain goes to S3, ActivityPub domain, updating the request with `updateHost` function and send to Vercel
