---
title: Cloud services for my personal projects in 2023
lang: en
description: Cloud services I use for my projects are getting more in number recently with distributed tracing and Redis that just added to my list. I start to forget what are the services I am using now.
date: 2023-10-27T16:28:38+02:00
tags:
  - hobby project
  - cloud services
---

Cloud services I use for my projects are getting more in number recently with distributed tracing and Redis that just added to my list. I start to forget what are the services I am using now.

Most of the services I use are mostly Serverless, basically no fixed cost monthly and only pay for what you use e.g. by storage size, compute time or bandwidth. Only exception is Vercel which at some point I probably need to pay for team plan but at that point I might move out from Vercel too because it's quite steep jump from 0 to $20 a month. If it's $5 I probably pay it right now but still, there are so many options for function as a service too with less limitations compared to Vercel too.

## Services

- **Function as a service, [Vercel](https://vercel.com/)**, I don't use any container right now because of the fixed cost, cheapest from AWS Fargate spot prices is ~$3 per month, or other services will probably around $2.5 per month. With FAAS is usually lower than that depending on how many requests come to the service. With Vercel hobby plan, currently it's $0 per month.
- **Redis, [Upstash](https://upstash.com/)**, This is for server requests cache at the moment that [Got](https://github.com/sindresorhus/got/blob/main/documentation/cache.md) allow to use. It's quite useful for ActivityPub network that help reduce number of requests to the server which many times is unreliable. Upstash also have a queue service that can request to api, which I want to try too.
- **Grafana, [Grafana Cloud](https://grafana.com/)**, They have the most generous cloud services for Logs and Distributed tracing collector. Dashboard is a bit hard to use and the location of the services are always in US (except you upgrade to Pro.) Currently I use it for trace with OpenTelemetry but other services also quite good except it's not integrated with Vercel yet.
  \
  \
   Other similar services I explored are, \
  - logz.io, the price is similar but for tracing it needs collector\
  - baselime.io, the calculation is different they use events/month compared to size of data like in Grafana, so it's more expensive but dashboard is better than Grafana and it doesn't need collector for tracing\
  - axiom.co, they have integration with Vercel and I used it for sometime. Logs exploring and dashboard is quite useful and they have tracing recently. Might revisit again.\
  - [GCP Cloud Trace](https://cloud.google.com/trace), this is probably major cloud service that I looked at because I use Firebase as database and price is pay as you use.
- **Email, [Resend](https://resend.com/)**, I was plan to use AWS SES before. It's the cheapest option for email service except it needs to get approved by AWS too and making sure that email that send out is not going to get mark as spam (for email reputation.) Which for small, personal project. It's too much, so I ended up with resend which underneath is also SES service (They also have backup with other email senders.)
- **Database, [Firebase](https://firebase.google.com/)**, Good and cheap database for a moment. Latency is not great, but it 's probably because the function is running outside GCP.
- **CDN, [Cloudfront](https://aws.amazon.com/cloudfront/)**, This is probably not a cheapest option but because it shares with my blog and I already have cloud formation to automate it, so it will be as it is for now. Also with current traffic, the cost is not so bad too.

## Total costs

Total cost per month for ActivityPub service I run is below $1 currently, because most of the services are free (except the Cloudfront which is shared. So I don't use add that cost for now but it's also quite low and some optimisation that cut the traffic out of Vercel) and I still happy with it. For hobby project, using pay as you use is always cheaper but with more traffic this might not be the case and need a different calculation. Hopefully, it still in manageable level later.
