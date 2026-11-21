# LLUN.ME - Personal Website and Blog

My personal website and blog. 👉 https://www.llun.me

## Features

- Static site generation with Next.js App Router
- Dark mode support with system preference detection
- Markdown-based blog posts with syntax highlighting
- Interactive maps for cycling activities using Mapbox
- Strava activity integration for tracking rides
- Photo galleries backed by iCloud shared albums
- RSS, Atom and JSON feed support
- Responsive design with Tailwind CSS: square black, grey and white "Ink" theme, Noto Sans with the looped Noto Sans Thai and JetBrains Mono for labels (loaded with `next/font`)
- Responsive WebP copies of post images generated at build time, with a build-time internal link check

## Technologies

- [Next.js 16](https://nextjs.org/) with App Router
- [React 19](https://react.dev/) for UI components
- [TypeScript 6](https://www.typescriptlang.org/) for type safety
- [Tailwind CSS 4](https://tailwindcss.com/) for styling
- [next-themes](https://github.com/pacocoursey/next-themes) for dark mode support
- [Lucide React](https://lucide.dev/icons/) for icons
- [Mapbox GL](https://www.mapbox.com/) for interactive maps
- [Markdown-it](https://github.com/markdown-it/markdown-it) for markdown rendering

## Setup

### Prerequisites

- Node.js 24 or later
- Yarn 4.17.0 (managed via Corepack)
- ImageMagick 7 (the `magick` command) for `yarn optimize-images`

### Installation

1. Install all dependencies with `yarn install`
2. Add `.env.local` with these environment variables:
   - `NEXT_PUBLIC_MAPBOX_PUBLIC_KEY` - Mapbox public token for interactive maps. Read by `libs/config.ts`; required for any page that renders a map.
   - `NEXT_PUBLIC_DOMAIN` - Base URL used for links, feeds and metadata. Optional; when unset the code falls back to `https://www.llun.me` (`libs/blog.ts`). The deploy workflow does not set it, so production builds use that fallback. Set it locally only when links need to point somewhere else.
   - `STRAVA_TOKEN` - Strava access token with `read_all` and `activity:read_all` scopes, used to fetch activities and streams.
   - `STRAVA_CLIENT_ID` - Strava API application client ID, used to refresh the access token.
   - `STRAVA_CLIENT_SECRET` - Strava API application client secret, used to refresh the access token.
   - `STRAVA_REFRESH_TOKEN` - Strava refresh token. Strava rotates this on every refresh, so it has to be persisted between runs.

When `STRAVA_TOKEN` is rejected, `scripts/strava.ts` refreshes it with the client ID, client secret and refresh token, then **rewrites `.env.local` in place** - it replaces the existing `STRAVA_TOKEN` and `STRAVA_REFRESH_TOKEN` lines, or appends them if they are missing, and creates the file with mode `0600` when it does not exist yet. The rest of the file, including comments on other lines, is preserved. Anything on the same line as those two keys is not, and a key written with a prefix such as `export ` or with leading whitespace is not recognised and gets appended a second time.

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

# Type check without emitting
yarn typecheck

# Process Strava activities and generate ride statistics
yarn ride

# Optimize gallery cover images (needs ImageMagick)
yarn optimize-images

# Resize post, ride and site images (runs before dev, build and export)
yarn images

# Check out/ for internal links that 404 (runs after export)
yarn check-links

# Check the JSON-LD on every exported page (runs after export)
yarn check-structured-data
```

Images in posts need no manual step: `yarn images` (`scripts/optimize-images.ts`, with sharp) writes WebP copies 640, 1280 and 2000 px wide (never wider than the original, re-encoded at lower quality until under 300 KB) and a 1200 px JPEG social card for every image in `public/posts`, `public/tags` and `public/img` into the git-ignored `public/_img/`, and lists their sizes in `.cache/image-manifest.json`. The markdown renderer points `<img>` at those copies with `srcset`, `sizes`, `width`/`height` and `loading="lazy"` (except the first image), and links to an image (such as `route-full.png`) open the 2000 px copy. Only images whose content changed are encoded again; CI caches `public/_img`. Without the manifest (`next dev` alone) pages fall back to the originals.

Every page carries schema.org JSON-LD built in `libs/structuredData.ts`: `BlogPosting` on posts, `WebSite` and `Person` on the home page, `CollectionPage` on lists, `ImageGallery` on albums and bird pages, and a `BreadcrumbList` everywhere. The builders are typed with `schema-dts`, so `yarn typecheck` rejects properties or values schema.org does not define.

`BLOG_OFFLINE=1 yarn export` builds without calling iCloud or Google Photos (albums render with no photos), for machines that cannot reach them.

`NEXT_PUBLIC_MAPBOX_PUBLIC_KEY` must be present in `.env.local` before starting the dev server. Without it the Mapbox token resolves to an empty string and every page with a map - the ride pages - throws `An API access token is required to use Mapbox GL` at runtime and fails to render. Next.js inlines `NEXT_PUBLIC_*` values at build time, so restart `yarn dev` after adding it.

## Gallery

Each album is a markdown file in `contents/galleries/` whose front matter names the album `token` and the `image` base name in `public/gallery/`. Every album needs two images there:

- `<image>.jpg` - 512 x 512 square, shown on the gallery list page
- `<image>.card.jpg` - 1200 x 630, the album page's social card (`og:image`)

Keep the source photo's embedded colour profile (often Display P3) when cropping or resizing; dropping it makes the image look darker or washed out. Run `yarn optimize-images` afterwards to generate the `.webp` and `.avif` copies. The token must also be in `ALLOW_TOKEN_IDS` in `libs/config.ts`, or `/api/apple/` refuses it.

Two kinds of iCloud shared album links work, told apart by the token's shape:

- Old links, `https://www.icloud.com/sharedalbum/#B2GGPCdxkGnUx1C`: the token is the part after `#`, 14-15 characters. Read through the sharedstreams API in `libs/apple/webstream.ts`.
- New links, `https://photos.icloud.com/shared/album/0a96jkMunB-gI9iQ-A54WJZKQ/`: the token is the 25-character key in the path. Read through CloudKit in `libs/apple/cloudkit.ts`: `public/records/resolve` exchanges the key for an anonymous 20-minute access token and the album's zone, then `shared/records/query` lists the photos at build time and `shared/records/lookup` returns fresh download URLs (they expire after about an hour) when `/api/apple/` is called. New albums carry no captions.

## Scripts

The `scripts/` directory contains utility scripts for data processing.

`yarn ride` runs this pipeline in order:

- `load-netherlands-activities.ts` - Fetches Strava activities from Netherlands
- `load-slovenia-activities.ts` - Fetches Strava activities from Slovenia
- `simplify-gps.ts` - Simplifies GPS coordinates for better performance
- `generate-rides-stats.ts` - Generates statistics from ride data

Run on demand, outside the pipeline:

- `load-singapore-activities.ts` - Fetches Strava activities from Singapore. Deliberately left out of `yarn ride`; the Singapore rides are historical and only need re-fetching by hand.
- `merge-gps.ts` - Experimental kd-tree matching of overlapping Netherlands ride tracks. Not wired into any script, writes scratch GeoJSON into `scripts/`, and is run directly when exploring route overlaps.
- `optimize-images.sh` - Optimizes images for web delivery, via `yarn optimize-images`. Requires ImageMagick 7.

Shared modules:

- `strava.ts` - Strava API integration utilities, including token refresh
- `ride-utils.ts` - Utility functions for processing ride data
- `country-utils.ts` - Country-specific utility functions
- `constTypes.ts` - Shared types and data paths used by the ride scripts

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
  - `api/` - API routes. `api/apple/` proxies iCloud shared album asset URLs. It is not part of the static export - `yarn export` sets `output: 'export'`, which drops route handlers - and is served by the Vercel deployment instead, so it is live code even though it never appears in `out/`.
- `components/` - React components
- `contents/` - Blog posts and content in markdown format
- `libs/` - Shared utility libraries
- `public/` - Static assets
- `scripts/` - Data processing and build scripts

## Infrastructure

The project has two deployment targets and both are live.

**1. Static site on S3 + CloudFront** - the public website at https://www.llun.me. Deployed by `.github/workflows/deploy.yml` on every push to master, in four stages:

1. **Build**: Exports static site using Next.js (`yarn export`, which sets `BLOG_EXPORT=1` and turns on `output: 'export'`)
2. **Upload to S3**: Four parallel syncs, one per caching policy
   - HTML and other text assets (and the Atom feeds) with `public, max-age=0, s-maxage=86400, stale-while-revalidate=604800`: CloudFront keeps them a day and serves a stale copy while it refetches, browsers revalidate every time, and the invalidation below makes new posts show at once
   - Content-hashed build output under `_next/static/` with a one-year immutable cache - the filename changes whenever the bytes do
   - Images (jpg, jpeg, png, webp, avif, ico) with a 7-day cache
   - Atom feeds (`feeds/main`, `feeds/atom.xml`) with an `application/atom+xml` content-type
   - Then an empty object with a website redirect at every page folder without its slash (`posts/x` -> `/posts/x/`, listed by `scripts/list-page-dirs.mjs`), so the S3 website origin answers slashless URLs with a 301 instead of its default 302
3. **CDN Invalidation**: CloudFront cache invalidation for immediate updates, then a check that prints the home page's TTFB and cache headers
4. **IndexNow**: `scripts/indexnow.mjs` compares the new `sitemap.xml` with the one that was live before the deploy and submits the new or changed URLs (by `<lastmod>`) to `https://api.indexnow.org`. The key is `public/<key>.txt`; a post edited after publishing should set `updated:` in its front matter so its lastmod moves

**2. Vercel** - builds the same repository without `BLOG_EXPORT`, so `output: 'export'` stays off and `app/api/apple` is deployed as a real route handler. This is the only thing Vercel serves that the static site cannot do itself: the exported pages call it cross-origin at `https://next.llun.dev/api/apple/` (`libs/apple/media.ts`) to resolve iCloud shared album asset URLs, and the route restricts callers with the `ALLOW_ORIGINS` and `ALLOW_TOKEN_IDS` lists in `libs/config.ts`. In development the same code calls the local `/api/apple/` route instead. There is no `vercel.json` in the repository, so the Vercel side is configured in its dashboard rather than here.

Architecture:
- S3 buckets for storing all blog contents and images
- GitHub stores original content
- GitHub Actions builds and deploys on every push to master
- CloudFront in front of S3 buckets for global CDN
- Vercel hosting the API route the static site depends on
- Node.js 24 used in CI/CD pipeline

### Continuous Integration

`.github/workflows/ci.yml` runs on pull requests (and can be dispatched manually) and checks the branch with `yarn lint`, `yarn typecheck` and `yarn export` - the same static export the deploy workflow builds. Run the same three commands locally before pushing.

### Required GitHub Secrets and Variables

For the deployment workflow to work, configure these in your repository:
- `NEXT_PUBLIC_MAPBOX_PUBLIC_KEY` (secret) - Mapbox public token, inlined into the site during the build step
- `AWS_S3_BUCKET` (secret) - S3 bucket name for hosting
- `AWS_DISTRIBUTION_ID` (secret) - CloudFront distribution ID
- `AWS_DEPLOY_ROLE_ARN` (variable) - the IAM role the upload and invalidation jobs assume through GitHub OIDC; there are no stored AWS keys. The role, its trust policy (this repo's `master` only) and its permissions live in llun/labs `infrastructure/aws/blog/github-deploy.*.json`.

The build job runs in the `production` environment, so `NEXT_PUBLIC_MAPBOX_PUBLIC_KEY` has to be reachable from that environment. The upload and invalidation jobs declare no environment, so their OIDC token's subject is `repo:llun/blog:ref:refs/heads/master`, which the role's trust policy requires, and they read the `AWS_*` secrets at repository level.

## Notes

- The CloudFront stack and edge functions for this site live in [llun/labs `infrastructure/aws/blog`](https://github.com/llun/labs/tree/main/infrastructure/aws/blog). Change the ActivityPub server domain there, in `functions/updateHost/index.js`.
- Most icons are from [favicon.io](https://favicon.io/emoji-favicons/) except the GitHub icon

## License

This project is unlicensed. All rights reserved.

## Author

Maythee Anegboonlap - [contact@llun.dev](mailto:contact@llun.dev)
