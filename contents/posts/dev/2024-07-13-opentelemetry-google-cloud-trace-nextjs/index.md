---
title: OpenTelemetry for NextJS and Google Cloud Trace
lang: en
description: Configure opentelemetry in Next.JS project and making it export trace data to Google Cloud Trace
date: 2024-07-13T12:27:41+02:00
tags:
  - opentelemetry
  - Google Cloud Trace
  - nextjs
---

NextJS has OpenTelemetry embedded in the framework however, to use it has a few more steps to configure. For Google Cloud Trace, that step including updating `next.config.json` to exclude library that suppose to run in the server side.

The official guide from [Vercel is here](https://nextjs.org/docs/app/building-your-application/optimizing/open-telemetry) which using OLTP to export the data. However, Google has their own package for exporting trace data `@google-cloud/opentelemetry-cloud-trace-exporter`

[Document in Google](https://cloud.google.com/trace/docs/setup/nodejs-ot) shows how to configure the OpenTelemetry which can be use with Vercel document and add to `instrumentation.node.ts` file. After follow the google document, add `google-proto-files` into the `serverComponentsExternalPackages` in `next.config.js` file and the trace data should appear in the cloud trace dashboard.
