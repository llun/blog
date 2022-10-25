---
title: iCloud Photos shared album
lang: th
description: Put iCloud photos shared album on website
date: 2022-10-25T20:12:38+02:00
image: shared.png
tags:
  - Apple
  - iCloud
  - Photos
---

สุดสัปดาห์ที่ผ่านมาลองเปิด Shared Album ใน Apple Photos app แล้วเจอว่ามี Public Website ให้เอา link ไปแจกให้คนอื่นเข้ามาดูรูปได้ ลองกดดูว่ามันดึงรูปมายังไงก็เจอว่า Apple มี API สองอันไว้ดึงรูป เลยได้ idea ว่าจะเอารูปใน iCloud มาใส่ไว้ในเว็บตัวเอง

API ที่ Apple ใช้มีด้วยกันสองอัน `webstream` กับ `webassetsurls`

## Token & API Cluster

ก่อนที่จะเรียก API ได้ต้องรู้สองอย่างคือ token และ API cluster เพราะ URL ของ API มีหน้าตาประมาณนี้ `https://p[cluster-id]-sharedstreams.icloud.com/[token]/sharedstreams/webstream`

Token ได้มาจาก URL ที่ Apple ให้มาหลังจาก enable public website เช่น `https://www.icloud.com/sharedalbum/#B12GfnH8tC0ZuK` Token ของ album คือ `B12GfnH8tC0ZuK`

[![Album token จาก Shared Album settings ใน Photos App](shared-album-setting-small.png)](shared-album-setting.png)

ใน Token นี้มีรายละเอียดของ cluster ซ่อนอยู่โดยแกะจาก token 3 ตัวแรก จาก Token ด้านบนถ้าตัวอักษรแรกเป็น `A` cluster id คือตัวอักษรที่สองจาก token ด้านบนก็คือ `1` แล้ว id ใน URL ให้ pad 0 เข้าไปด้านเป็น `01` แต่ถ้าตัวอักษรแรกเป็น `B` ต้องแกะเพิ่มนิดหน่อยโดยเอาตัวอักษรที่ 2 กับ 3 มาถอดเช่น token ด้านบน cluster id อยู่ใน `12` เอามาถอดด้วย Base62 จะได้ cluster ID ออกมาเป็น `64` (ถ้าเป็นเลขหลักเดียวทำเช่นเดียวกับ `A` คือ pad 0) URL ที่ใช้เรียก API เต็มๆ ก็จะเป็น `https://p64-sharedstreams.icloud.com/B12GfnH8tC0ZuK/sharedstreams/webstream`

## webstream API

Webstream API, `sharedstreams/webstream` เป็น API ไว้เรียกดูรายละเอียดของ Album ว่ามีรูปอะไรบ้างแต่ละรูปมีความละเอียดเท่าไหร่ หรือวิดีโอมีความละเอียดเท่าไหร่บ้างที่ดึงมาดูได้ เรียกโดยส่ง Post call ไปที่ `sharedstreams/webstream` API เช่น

```
curl 'https://p64-sharedstreams.icloud.com/B12GfnH8tC0ZuK/sharedstreams/webstream' \
  --data-raw '{"streamCtag":null}' \
  --compressed
```

`streamCtag` เป็น pagination id เวลา album มีรูปเยอะมาก โดยเอาจาก response ที่คืนมาจาก API ที่หน้าตาประมาณนี้

```
{
  "userLastName": "Anegboonlap",
  "streamCtag": "FT=-@RU=05cd8aa0-51d9-4671-bfa5-e10cdf277e04@S=16559",
  "itemsReturned": "0",
  "locations": {},
  "userFirstName": "Maythee",
  "streamName": "Sample",
  "photos": [
    {
      "batchGuid": "ACEEC3D1-D3AF-4A21-809B-6E3A043606D8",
      "derivatives": {
        "342": {
          "fileSize": "43050",
          "checksum": "01f4ef240d7581f208b76b2498789ba759bee245be",
          "width": "257",
          "height": "342"
        },
        "2049": {
          "fileSize": "985681",
          "checksum": "010ca39ab9acf31d14f853ea47a1c110a425f99f27",
          "width": "1537",
          "height": "2049"
        }
      },
      "contributorLastName": "Anegboonlap",
      "batchDateCreated": "2022-10-25T17:13:49Z",
      "dateCreated": "2016-11-03T12:49:49Z",
      "contributorFirstName": "Maythee",
      "photoGuid": "2C50FDDE-A9D8-4D28-B99B-4265CF2F1D8A",
      "contributorFullName": "Maythee Anegboonlap",
      "width": "1537",
      "caption": "",
      "height": "2049"
    },

  ],
  "items": {}
}
```

## webassetsurls

หลังจากได้ `photoGuid` จาก `webstream` มาแล้วจะเอา URL รูปไว้สำหรับใส่ img หรือ video source tag ต้องใช้ `webassetsurls` เช่นเดียวกับ `webstream` API นี้เป็น POST call เช่นเดียวกัน

Post body ที่ต้องส่งไปก็คือ `photoGuid` ที่ได้มาแล้วต้องการ URL รูปกลับมา เช่น

```
curl 'https://p64-sharedstreams.icloud.com/B12GfnH8tC0ZuK/sharedstreams/webasseturls' \
  --data-raw '{"photoGuids":["2C50FDDE-A9D8-4D28-B99B-4265CF2F1D8A"]}' \
  --compressed
```

Response ที่ได้กลับมาจะเป็น map ระหว่าง checksum ของรูปกับ url

```
{
  "locations": {
    "cvws.icloud-content.com": {
      "scheme": "https",
      "hosts": ["cvws.icloud-content.com"]
    }
  },
  "items": {
    "01f4ef240d7581f208b76b2498789ba759bee245be": {
      "url_expiry": "2022-10-25T20:24:35Z",
      "url_location": "cvws.icloud-content.com",
      "url_path": "/S/AfTvJA11gfIIt2skmHibp1m-4kW-/PB030703.JPG?o=AqAFUL40Bn0KCw60prfUdSWcesRlPbNNjkXjivIBuF1M&v=1&z=https%3A%2F%2Fp64-content.icloud.com%3A443&x=1&a=CAogF8lO2X9BoWWM7YKIEtInjsSSZKRvKSXXkIpAFoflsrwSZRC_5rKBwTAYv_3FhsEwIgEAUgS-4kW-aiWzPwvbIdF-8fxta-bfw_DwKbBU-F0LVEwU2_NU8wE9husrBWsmciVQwi_Si9bGqbIi9Y_EupbNdAvIPlFWslPObm19Oh120GcygDeT&e=1666729475&r=7dc2183b-3f0f-47ef-a03a-ab4c76d397a6-13&s=64dLJRQ4LomOTK0BykgYZ7QyUf4"
    }
  }
}
```

เวลาเอาไปใช้คือเอา `url_locations` รวมกับ `scheme` ด้านบน และ `url_path` ก็จะได้ url รูปภาพที่เอาไปใส่ใน tag ได้

## Limitation

ข้อจำกัดของ Shared Album Apple มีอย่างเดียวคือขนาดรูปหรือ Video ที่ไม่ได้ออกมาตามที่เก็บไว้ใน iCloud [แต่เป็นรูปหรือ video ที่ย่อมาแล้ว](https://support.apple.com/en-us/HT202786)

ถ้าเป็นรูปก็จะถูกย่อลงมาเหลือ 2048px ส่วน video ถ้าถ่ายมามากกว่า 720p ก็จะเหลือ 720p ส่วนตัวไม่มีปัญหาอะไรกับข้อจำกัดนี้ แต่ถ้าเทียบกับ Google Photos แล้วข้อจำกัดก็เยอะกว่ามาก แถมถ้าเทียบกับ Google ที่มีรายละเอียดของ API ชัดเจนว่าให้เล่นยังไง แทนที่จะต้องแกะเอาเอง ถ้าไม่ได้ใช้มือถือ Google แล้วอยากเอาภาพมาแปะในเว็บก็คงไม่ย้ายมา iCloud

## Gallery

ตอนนี้มีอยู่สองหน้าที่ตอนนี้แปะภาพจาก iCloud ไว้คือหน้าที่เก็บรายละเอียดปั่นจักรยานไว้ทั้ง [Netherlands](https://www.llun.me/tags/ride/netherlands/) และ [Singapore](https://www.llun.me/tags/ride/singapore/) ยังทำไม่เสร็จดีเท่าไหร่ แต่ถ้าอยากดูตัวอย่างก็ลองไปดูได้ที่ URL ด้านบน ส่วนตัวอย่าง code แบบ typescript อยู่นี่ https://github.com/llun/blog/blob/master/libs/apple/webstream.ts
