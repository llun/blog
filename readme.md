# LLUN.ME - Personal Website and Blog

My personal website and blog. 👉 https://www.llun.me

## Features

- Static site generation with Next.js App Router
- Dark mode support with system preference detection
- Markdown-based blog posts with syntax highlighting
- Interactive maps for cycling activities using Mapbox
- Strava activity integration for tracking rides
- RSS/Atom feed support
- Responsive design with Tailwind CSS
- Optimized images and assets for fast loading

## Technologies

- [Next.js 16](https://nextjs.org/) with App Router
- [React 19](https://react.dev/) for UI components
- [TypeScript 5.9](https://www.typescriptlang.org/) for type safety
- [Tailwind CSS 4](https://tailwindcss.com/) for styling
- [next-themes](https://github.com/pacocoursey/next-themes) for dark mode support
- [Lucide React](https://lucide.dev/icons/) for icons
- [Mapbox GL](https://www.mapbox.com/) for interactive maps
- [Markdown-it](https://github.com/markdown-it/markdown-it) for markdown rendering

## Setup

### Prerequisites

- Node.js 24 or later
- Yarn 4.12.0 (managed via Corepack)

### Installation

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

# Export static site
yarn export

# Run linting
yarn lint

# Process Strava activities and generate ride statistics
yarn ride

# Optimize images
yarn optimize-images
```

## Scripts

The `scripts/` directory contains utility scripts for data processing:

- `load-netherlands-activities.ts` - Fetches Strava activities from Netherlands
- `load-slovenia-activities.ts` - Fetches Strava activities from Slovenia
- `load-singapore-activities.ts` - Fetches Strava activities from Singapore
- `simplify-gps.ts` - Simplifies GPS coordinates for better performance
- `generate-rides-stats.ts` - Generates statistics from ride data
- `optimize-images.sh` - Optimizes images for web delivery
- `strava.ts` - Strava API integration utilities
- `ride-utils.ts` - Utility functions for processing ride data
- `country-utils.ts` - Country-specific utility functions

## Code Style

This project uses ESLint and Prettier for code formatting and quality.

### Import Organization

- Imports should be organized in the following order:
  1. Third-party library imports
  2. Local application imports
  3. CSS/style imports
- Each import section should be separated by a blank line
- Imports should be sorted alphabetically within each section

### Special Configurations

- SVG files are imported as React components using `@svgr/webpack`
- Turbopack is configured for faster development builds with SVG support

## Project Structure

- `app/` - Next.js 16 App Router pages and layouts
  - `(header)/` - Pages with header layout
  - `(noheader)/` - Pages without header layout
  - `api/` - API routes
- `components/` - React components
- `contents/` - Blog posts and content in markdown format
- `infrastructure/` - AWS infrastructure deployment scripts
  - `deploy.js` - Main deployment script
  - `edge.js` - CloudFront edge functions
  - `functions/` - Lambda functions
- `libs/` - Shared utility libraries
- `public/` - Static assets
- `scripts/` - Data processing and build scripts

## Infrastructure

The site is deployed using a multi-stage GitHub Actions workflow:

1. **Build**: Exports static site using Next.js
2. **Upload to S3**: Parallel uploads of different asset types
   - HTML/CSS/JS with no caching (always fresh)
   - Images with 7-day cache
   - RSS/Atom feeds with proper content-type headers
3. **CDN Invalidation**: CloudFront cache invalidation for immediate updates

Architecture:
- S3 buckets for storing all blog contents and images
- GitHub stores original content
- GitHub Actions builds and deploys on every push to master
- CloudFront in front of S3 buckets for global CDN
- Node.js 24 used in CI/CD pipeline

### Required GitHub Secrets

For the deployment workflow to work, configure these secrets in your repository:
- `AWS_ACCESS_KEY_ID` - AWS access key for deployment
- `AWS_SECRET_ACCESS_KEY` - AWS secret key for deployment
- `AWS_S3_BUCKET` - S3 bucket name for hosting
- `AWS_DISTRIBUTION_ID` - CloudFront distribution ID

## Notes

- When changing ActivityPub server domain, update `infrastructure/functions/updateHost/index.js` script to the new domain
- Most icons are from [favicon.io](https://favicon.io/emoji-favicons/) except the GitHub icon

## License

This project is unlicensed. All rights reserved.

## Author

Maythee Anegboonlap - [contact@llun.dev](mailto:contact@llun.dev)
