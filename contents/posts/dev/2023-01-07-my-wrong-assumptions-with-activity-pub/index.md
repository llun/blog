---
title: My wrong assumptions with ActivityPub
lang: en
description: A collection of my mistakes while building my ActivityPub server.
date: 2023-01-07T19:01:24+01:00
tags:
  - Mastodon
  - ActivityPub
  - NextJS
---

While I'm building [my ActivityPub server](https://github.com/llun/activities.next), I went through a lot of wrong of Assumption that cause a few problems now, so this is a note about my mistakes while implementing it

1. Actor id contains a username. Actor id is a URL or identifier of resource telling who doing it or own it. For Mastodon, it looks like this `https://server.tld/users/username`. So I assume that, it will alway have the user name in the last part which is totally wrong.\
   \
   Recently I tried to follow Misskey.io actor and found out Misskey.io `actorId` doesn't contain `username` but a random id in the end and to get the username, the request to actorId is required.
2. To make mentions works, it has to put in tags too. The issue here is if the Note doesn't have Tag with mentions, although it can send to the recipient in Mastodon, but it won't shows as Mention on that side and won't have any notification telling the recipient that he got mentions too.
3. Better to compact JSON input receives from other and also compact JSON output before sending out. At one point, I was moving all the ActivityStream context url to constant however, I also have a constant for public ActivityStream too which I use it wrong when I move the JSON output to it causing all my message cannot send out. It took me awhile to find out.
4. Follower id is not alway in `https://server.tld/users/username/follower` format. This is the same issue as Actor id. I assume that follower id is alway `actorId` + `/follower` but it can be anything like `https://server.tld/follower/username` or something else. The URL is from the `actorId` result, follower property. I haven't fixed this issue yet, so my server will alway send the message out with wrong follower id for non-Mastodon server.
5. User timeline contain only non-reply messages. This is another issue that I can't figure out yet how to display the main timeline. In the beginning, I just returns all the statuses that I receive because I thought it contains only statuses from whom I follow but in reality, it contains the statuses that those following got replies too which for some actor, it's a bit too much.\
   \
   So, I reduce it to only status that original post by whom I'm following but this cause me missing some reply to myself. Now, I include the reply but it's also missing the status that reply to another reply but original status is my status which left me at this point.\
   \
   The tricky part is, for Firebase, it's not just update the query to change the result but I have to construct the index to make the query work which can be expensive if this is growing.\
   \
   Another issue is, if I unfollow the user, in Twitter, statuses from that user will disappear from the timeline which probably can do easily by joining the following users and status on SQL database but that's not true for Firebase. So, this is an another problem that I don't have a solution just yet. (Kind of have an idea e.g. update the local recipients when unfollow but that's still tricky and can be expensive)

So, these are my major mistakes so far, my ActivityPub server is running quite fine now with few missing features but the main next two that I would like to add is boost and likes and I think that will cover a major functionality for ActivityPub.
