---
title: Memoize and memory leak
lang: en
description: Memory leak issue in Next.js when using it with unbound parameters and t function.
date: 2024-03-03T11:25:33+01:00
tags:
  - memory leak
  - memoize
  - javascript
---

Last month I got one of interesting problem, the NextJS service has a memory leak. Profiling it suggests that i18next translation that creates by `cloneInstance` doesn’t get remove when the request is done and turn out it’s because the `memoize` function that we use to store the response of one API causing this

```js
const apiResponse = memoize((apiParam: number) => {
  const data = await fetch(api, { body: JSON.stringify({ apiParam }) })
	return `${t('key')}-${data.value}`
})
```

The function looks simple and the memoize was making sense to me in the beginning however, because the `apiParams` can be anything, and the `t` function which store all the translations is inside this causing it to never release and get collect by garbage collector.

This was working when we use it in the browser before because the lifetime of the code is short lived compared to the server side that we use in Next.JS. In the end, we remove the memoize part and making sure this in the practice that when we use memoize, making sure that parameter of the function has a limit boundary and this solve the problem.
