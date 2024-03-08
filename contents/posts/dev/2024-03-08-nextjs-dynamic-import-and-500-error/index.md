---
title: Next.JS dynamic import and 500 error
lang: en
description: Catch all path in Next.JS with dynamic imports can cause 500 errors in different page, here is the detail why
date: 2024-03-08T19:09:28+01:00
tags:
  - dynamic import
  - nextjs
---

Another problem come by, we have a mysterious 500 error showing after we deploy a new page that move to Next.JS. The page works fine and returns however, when users go to the next page, it shows 500 error. Open that page directly doesn’t make it returns 500

Looking into the logs, it’s showing like this

```
 ⨯ Error: Cannot find module 'test'
    at /path/to/project/.next/server/pages/[[...page]].js:1:182 {
  code: 'MODULE_NOT_FOUND'
```

Which point to the dynamic loading that is using in the first page and it’s not supposed to affect the other page. The problem here is the path that import is not exists and normally this would get catch in the build time but this is not happened because this part of the code is using variable to point to the module name.

Changing the file name to `page.js` fix the problem, however, this makes the page not catching all the requests. Another way is fixing the variable value and making sure the import path must exists but both of these doesn’t answer why does the error from first page showing in the subsequent page when click on the link.

Looking into Next.JS server code, when the page is render, it’s try to load all the dynamic imports here https://github.com/vercel/next.js/blob/v14.1.3/packages/next/src/server/render.tsx#L630 which will call through `ALL_INITIALIZERS` here https://github.com/vercel/next.js/blob/v14.1.3/packages/next/src/shared/lib/loadable.shared-runtime.tsx#L275-L279. This was shared between catch all page and the page that more specific.

Here is a sample project testing this issue https://github.com/llun/nextjs-catchall-dynamic-import-500

The solution for this is, making sure that the dynamic imports are exists or don’t use catch all like this. It can make the NextJS returns 500 error to a random requests.
