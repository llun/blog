---
title: Feeds 2.5, bring back files storage
lang: en
description: sqlite.wasm result in my feeds site that bring me to roll back to file storage.
date: 2023-03-12T09:56:52+01:00
tags:
  - Feeds
  - sqlite.wasm
---

[Around beginning of last year](https://github.com/llun/feeds/releases/tag/2.0.0) when I moved my feed site from 11ty to NextJS. I also tried using sqlite database as feed content storage. The idea is based on this [post](https://phiresky.github.io/blog/2021/hosting-sqlite-databases-on-github-pages/) so I think, using database that can query in chunks for feeds might be a good idea especially if the feed list is getting long and content of feed item is big but it's never happen to [my site](https://feeds.llun.dev).

The whole site is alway less than 10MB and the file that contains index and id link to the full content is less than 300KB which is a lot less than the [sqlite wasm](https://github.com/llunbot/personal-feeds/blob/contents/sql-wasm.wasm) (the database `wasm` file alone is 1.24MB) making using the database is a lot slower compared to using json file that I used in 11ty.

Other issue with the sqlite chunk is, if the database need to refresh (and for my feed site it refreshes every hour) the whole site will need to refresh compared to file with hash base on site url, the old index that already loads is still useful and I don't need to refresh a whole site when the content is refresh. This is the main reason I want to add the old file storage back.

So, since the version 2.4, I added the old json structure that I use in 11ty version back and make it default as in 2.5. This should make the site that has small list of sites load faster and when continue reading while leave the page for sometime work without need to refresh again.

I think the sqlite with chunk loading from the browser is still useful but only if the content in the database is large (more than 100MB maybe) then it will useful. Otherwise, small plain index file is better than using the sqlite in the browser or the structure of the database must be very complex e.g. need to create multiple different index files and need to join those information later then the sqlite will be more useful than the custom text structure that you need to design where should the file look like or where should it live.
