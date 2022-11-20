---
title: Mastodon server with NextJS
lang: en
description: Personal Mastodon Server with Next.JS
date: 2022-11-20T21:23:16+01:00
tags:
  - Mastodon
  - ActivityPub
  - NextJS
---

# Mastodon server with NextJS

In the last few weeks, I tried to get my Mastodon accounts for various servers, first with mas.to which is very unreliable lately, then glasgow.social which is also very unreliable in the first few days and the last few days end up in mastodon.in.th. Only issue with mastodon.in.th for me is, I live in the Netherlands, using the server in Thailand is a bit slower.

Another issue with all these Mastodon servers is I don’t have control over my followers or any messages that I put in and with these unreliable issues I don’t feel my account on these small federate servers is safe also, moving account informations (followers, followings, messages etc) without needing to ask everyone is to control the domain and no federate server is supporting using your own domain now. (also no migration option if the server is going down, your mastodon account is gone)

One option to solve this is setting up my Mastodon server, but with [all these requirements](https://github.com/mastodon/mastodon#requirements) it’s not going to be cheap, another option is [Pleroma](https://docs-develop.pleroma.social/backend/installation/debian_based_en/) which is not going to be cheap either (cheap here is basically $0 for single person which for both options, it needs 1 database and another container to run the server itself)

The good thing about Mastodon is, it’s using [ActivityPub](https://www.w3.org/TR/activitypub/), so I can just build something that is compatible with it and use something that is cheaper than those sql servers and that was what I did with this [activities.next project](https://github.com/llun/activities.next).

The server is not really fully functional like Mastodon yet, it still lacks a lot of things e.g. reply, mention someone else, post an image and poll support etc. However, at this point, it can receive messages and send them to anyone who follows me already. It also supports follow and unfollow people. One thing I would like to add that Mastodon won’t support is supporting Actor domain name, so anyone that registers with this server can use any domain that points to it.

## What is required to run this server

Two things currently,
Container?, AWS Lambda, Vercel or Cloud Function basically anything that can run Node.js as compute layer
Database, currently it supports only Firebase and Sqlite3 (that I tested out but the query is built with Knex.js so technically, it should be able to be used with any SQL database with [this schema](https://github.com/llun/activities.next/blob/main/migrations/20221110192701_init.ts)).

## What next?

My plan after this is
Mention and Reply
Outbox timeline and pagination
Main timeline query with proper to and cc
Media storage (via Apple Shared Album)
Media storage (via S3/GCS?)

Currently, my main Mastodon account is [@null@llun.dev](https://llun.dev/@null), this can be followed from any Mastodon (or ActivityPub server) ping me there!
