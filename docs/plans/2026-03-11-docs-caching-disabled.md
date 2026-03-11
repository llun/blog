# docs.llun.dev Managed CachingDisabled Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the custom `docs.llun.dev` CloudFront cache policy with AWS managed `CachingDisabled`.

**Architecture:** The `Docs` CloudFront distribution in `infrastructure/deploy.js` will stop referencing a locally defined cache policy resource and instead use the AWS-managed cache policy ID for `CachingDisabled`. The distribution's managed origin request policy, origin settings, and allowed methods remain unchanged.

**Tech Stack:** Node.js, AWS CloudFormation, CloudFront

---

### Task 1: Remove the custom Docs cache policy resource

**Files:**
- Modify: `infrastructure/deploy.js`

**Step 1: Delete the bespoke CloudFormation resource**

Remove the `DocsCachePolicy` block from `docsResources`.

**Step 2: Verify the distribution still has a cache policy**

Confirm `DocsCDN.DefaultCacheBehavior.CachePolicyId` remains defined after the resource removal.

**Step 3: Commit**

```bash
git add infrastructure/deploy.js
git commit -m "chore: use managed cache policy for docs CDN"
```

### Task 2: Point the distribution at AWS managed CachingDisabled

**Files:**
- Modify: `infrastructure/deploy.js`

**Step 1: Replace the cache policy reference**

Change `DefaultCacheBehavior.CachePolicyId` from `{ Ref: \`${Docs}CachePolicy\` }` to the AWS managed CloudFront `CachingDisabled` policy ID: `4135ea2d-6df8-44a3-9df3-4b5a84be39ad`.

**Step 2: Keep request forwarding behavior unchanged**

Leave the managed origin request policy ID `b689b0a8-53d0-40ab-baf2-68738e2966ac` in place.

**Step 3: Commit**

```bash
git add infrastructure/deploy.js
git commit -m "chore: switch docs CDN to managed CachingDisabled"
```

### Task 3: Deploy and verify the stack update

**Files:**
- Modify: `infrastructure/deploy.js`

**Step 1: Run the deployment script**

```bash
node infrastructure/deploy.js
```

Expected: CloudFormation accepts the stack update and the script exits cleanly.

**Step 2: Review the resulting diff**

```bash
git diff -- infrastructure/deploy.js docs/plans/2026-03-11-docs-caching-disabled-design.md docs/plans/2026-03-11-docs-caching-disabled.md
```

Expected: The diff shows the removed custom cache policy resource, the managed cache policy ID on the distribution, and the new planning docs.

**Step 3: Commit**

```bash
git add infrastructure/deploy.js docs/plans/2026-03-11-docs-caching-disabled-design.md docs/plans/2026-03-11-docs-caching-disabled.md
git commit -m "chore: use managed CloudFront caching disabled for docs"
```
