# LLUN.ME - Personal Website and Blog

My personal website and blog. 👉 https://www.llun.me

## Technologies

- [Next.js 15](https://nextjs.org/) with App Router
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [next-themes](https://github.com/pacocoursey/next-themes) for dark mode support
- [Lucide React](https://lucide.dev/icons/) for icons
- [Mapbox GL](https://www.mapbox.com/) for interactive maps

## Setup

1. Install all dependencies with `yarn install`
2. Add `.env.local` with these environment variables:
   - `NEXT_PUBLIC_DOMAIN` - Domain name for localhost, default: `http://127.0.0.1:3000`. Used for links in the page so local links work properly. Set to `https://llun.me` in GitHub Actions.
   - `STRAVA_TOKEN` - Strava access token with access to `read_all` and `activity:read_all` scopes for fetching Strava activities and details.
   - `AWS_ACCOUNT_ID` - AWS Account ID
   - `AWS_ACCESS_KEY_ID` - AWS Key for running infrastructure code
   - `AWS_CLOUDFRONT_DISTRIBUTION` - CloudFront distribution ID
   - `AWS_SECRET_ACCESS_KEY` - AWS Secret for running infrastructure code
   - `MAPBOX_PUBLIC_KEY` - Mapbox API key for interactive maps

## Development

```bash
# Start development server
yarn dev

# Build for production
yarn build

# Run linting
yarn lint
```

## Code Style

- Imports should be organized in the following order:
  1. Third-party library imports
  2. Local application imports
  3. CSS/style imports
- Each import section should be separated by a blank line
- Imports should be sorted alphabetically within each section

## Infrastructure

The site is deployed using the following services:
- S3 buckets for storing all blog contents and images
- GitHub stores original content
- GitHub Actions builds blog contents and deploys to S3
- CloudFront in front of S3 Buckets and ActivityPub server in Vercel
- CloudFront routes requests to the appropriate origin based on domain

## Notes

- When changing ActivityPub server domain, update `infrastructure/functions/updateHost/index.js` script to the new domain
- Most icons are from [favicon.io](https://favicon.io/emoji-favicons/) except the GitHub icon
