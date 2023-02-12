---
title: Mastodon timeline
lang: en
description: A short note about Mastodon timeline
date: 2023-02-12T19:40:07+01:00
tags:
  - Mastodon
  - Timeline
---

One of the tricky thing in the Mastodon is the timeline and there are a few timelines inside the service, actor public timeline, notification timeline, main timeline, etc. This note is about main timeline.

The main timeline is the list of Notes, Boosts (and Poll if supported) that shows up after logging in. I thought it's simple just grab all the following people statuses and show it in chronological and that's it. However there are few things that needs to include

1. What's happen to the status that reply but actor is not following to the actor status, should it include too?
2. How about the non-following that reply to the following one?
3. And the boost that the actor boost by themself, should it shows as Boost status again along with the original status that just get boosted?
4. How about multiple boosted from different following but same status?

[![All messages that possible showing in timeline](timeline-small.jpg)](timeline.png)

From those 4 items above, only the multiple boost I still showing multiple time in the main timeline, because it can be in the different time, e.g. First boost happen and follows by few statuses and the Second boost happen. It's a bit annoy when first boost and second boost happen next to each other but that can group in the client side.

I was naively implement this by simple query get all the statuses that user follows and doesn't have reply. This made me miss a few replies because when the status has replies, it won't show on my timeline at all and I don't have a notification timeline yet in my instance.

It took me sometime before I build a [new timeline](https://github.com/llun/activities.next/blob/main/lib/timelines/main.ts) which will apply to all statuses that receive by instance and tag the timelines to it. This cause a few issues e.g. if the user unfollow, I will need to update all those timelines or rebuild it (which I don't do yet) or it can get slower when the instance has a lot of users.

One way I think might help on this is, rebuilding the timeline every time when user open the page which might be the way that misskey.io doing now because for the first load, it took a few seconds to show the timeline.

I'm not sure which way is better yet, for the user experience loading the page, instant timeline is way better than taking few seconds like what misskey.io doing now but this will revisit in another time.
