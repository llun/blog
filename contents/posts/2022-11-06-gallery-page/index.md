---
title: Gallery Page
lang: en
description: หน้ารวมรูปแทนที่ Flickr ที่รูปทั้งหมดอยู่ใน Apple Photos และ Apple CDN
image: card.jpg
date: 2022-11-06T12:00:01+01:00
tags:
  - apple
  - photos
  - gallery
---

หลังจากเอารูปที่ปั่นจักรยานลงหน้าปั่นเสร็จ ก็คิดว่าไหนๆ ก็ย้ายออกจาก Flickr แล้วทำหน้าที่ใช้แทน Flickr ด้วยเลยดีกว่า เพราะรูปทั้งหมดก็อยู่ใน iCloud เกือบหมดแล้วด้วย เหลือแค่บางช่วงที่ตอน Import รูปจาก Flickr รอบที่แล้วลง Photos app แล้ว error ไว้ถ้าเอาลงใหม่ได้ทั้งหมดก็คงได้เอา Album ทั้งหมดใน Flickr มาลงด้วย

ตอนนี้หน้า [Gallery](https://www.llun.me/gallery/) ก็คิดว่าเสร็จแล้ว มีรูปของปีนี้เกือบทั้งหมดแล้วด้วย (ยกเว้นรูปปั่นที่แยกไปไว้หน้าปั่นทั้งหมด)

[![หน้า Gallery ที่น่าจะเสร็จหละ](gallery.png)](https://www.llun.me/gallery/)

ปัญหาเดียวที่เจอตอนนี้คือ Apple มี Throttle เวลาโหลดรูปบ่อยๆ แต่เท่าที่ลองมาก็เจอแค่ครั้ง
เดียวตอนที่แก้หน้า Gallery แล้วโหลดรูปทั้ง Gallery หลายรอบติดต่อกัน

![520 Request Throttled พึ่งเคยเจอ status code นี้จาก Apple นี่แหละ](throttle.png)

ต่อจากนี้กำลังคิดว่า จริงๆ แล้วไม่ต้องทำ API พิเศษแล้ว host ไว้ใน Vercel ก็ได้เพราะรูปที่ใส่ไว้ใน Apple มีระยะเวลาตั้งวันนึงกว่าที่ link จะหมดอายุ ถ้าใช้ Github Cron คอยดึง json มาเก็บไว้แล้ว serve แบบ static ทั้งหมดก็น่าจะได้ (ยกเว้นว่า Apple จะเปลี่ยนเอา CORS ใส่ใน link รูปด้วยก็จบกัน) เดี๋ยวเอารูปทั้งหมดที่อยู่ใน Flickr มาใส่ใน Gallery คิดว่าเดี๋ยวจะลองทำ Github Actions อีกอันเล่นๆ ไว้ทำ Gallery จาก Apple Shared Album หละ
