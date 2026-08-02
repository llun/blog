# docs.llun.dev Managed CachingDisabled Design

**Summary:** Replace the custom CloudFront cache policy for `docs.llun.dev` with AWS managed `CachingDisabled`, while keeping the managed origin request policy unchanged.

**Problem:** The `Docs` CloudFront distribution currently defines a bespoke no-cache policy even though AWS already provides an equivalent managed policy. This adds infrastructure that does not encode app-specific behavior.

**Approach:** Remove the `DocsCachePolicy` CloudFormation resource from `infrastructure/deploy.js` and point the `Docs` distribution's `DefaultCacheBehavior.CachePolicyId` at the AWS managed `CachingDisabled` policy. Leave the origin, allowed methods, custom header, and managed origin request policy untouched.

**Why this approach:** The origin behind `docs.llun.dev` is dynamic and potentially auth-sensitive, so caching should stay disabled. Using the AWS managed policy preserves that behavior while reducing custom configuration.

**Risks:** Switching to a cache-enabled managed policy would be unsafe for authenticated GET traffic. This change avoids that risk by using `CachingDisabled`.

**Validation:** Run `node infrastructure/deploy.js` and confirm CloudFormation accepts the template update.
