---
title: Firestore
lang: en
description: My Firestore note compare to DynamoDB after 2 months
date: 2023-01-29T15:00:55+01:00
tags:
  - Google Firestore
  - AWS DynamoDB
---

[ActivityPub server](https://github.com/llun/activities.next) I'm building is using Google Firestore as the database (it's also supporting SQL too but I mainly use Firestore now). It's a good opportunity to try it after staying with DynamoDB for a long time and almost using DynamoDB too but decided to try a new database.

In DynamoDB, all data are store in column like a table, and if you want to separate the type of data, you can do in two ways, different column with index or different database altogether. Each has it own problems and benefits, using single table with different index make maintenance a bit simpler because you can do everything in single table but when the table is getting bigger and you have a lot of changes, indexing time increasing a lot and it can be days before you can use those index for query.

Using multiple tables in DynamoDB makes schema changes easier but need tools to help maintaining different tables and schema (CloudFormation or Terraform)

In Firestore, those problems are gone away, database has concept of collections and it can have multiple collections in single unit. Also, it doesn't have schema that needs to declare upfront before you can use the database, the index will generate automatically when you insert the data which is a lot easier compared to DynamoDB.

Another thing that Firestore is more powerful than DynamoDB is, it can has sub-collections! So, instead of have only plain table (or indexes) for different type of data, those can be inside the document that already inside another collections. This make some structure and query a lot simples e.g. Status likes, that can store inside the status itself instead of having it own collection separately and have to query who own this Like, same as attachments.

And the most powerful one of sub-collections is Google Firestore can query across those sub-collections by creating an [CollectionGroup index](https://firebase.blog/posts/2019/06/understanding-collection-group-queries), so, if I want to find how many likes or attachments by whom span across those statuses, it's still possible.

One thing I hope that Firestore has is `OR` query condition. Currently if I want something to include more than one possibility, I have to do it with multiple queries and merge the result or add a new property that compute a result of or before and using that with index. Query multiple times makes pagination tricky because the number of items can be different per page, creating the index has an issue if something is updated affect the result of those index later (e.g. unfollowing/following cause the main timeline in ActivityPub changes)

DynamoDB supports this but it also has some limitation when using it (similar to `array-contains` or `in` key word in Firestore) so I think this is equal point for both databases.

Cost of both databases are cheap (but also can be expensive) and for personal use like single actor ActivityPub server, it can be free most of the time. With TTL that help cleaning the old data in both databases would be better too. I already need to pay for Firestore a little but that's because I need to change the schema after learning how the sub-collection works but it's still less than $1 USD, so doesn't hurt so much yet. Might need to see in long term when I have data more than a million records but that milestone seem very far away for now.
