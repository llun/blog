---
title: NextJS middleware 12.1 vs 12.2
lang: th
description: NextJS middleware difference between 12.1 and 12.2
date: 2022-07-31
tags:
  - NextJS
---

NextJS 12.2 มี big change อย่างนึงที่เกี่ยวเนื่องกับงานที่ทำอยู่คือ [Middleware ที่หลุด Beta](https://nextjs.org/blog/next-12-2#middleware-stable)
ใน version นี้ ที่เปลี่ยนแล้วเห็นชัดสุดคือไม่มี Nested Middleware แล้ว เหตุผลหลักๆ ที่ NextJS ให้มาคือ
[มันเร็วขึ้นและซับซ้อนน้อยกว่า](https://nextjs.org/docs/messages/middleware-upgrade-guide#no-nested-middleware)

แต่อีกอย่างที่เปลี่ยนและกระทบกับ code เดิมพอกันคือ Middleware ต่อไปนี้[ทำงานก่อนหน้า internal route](https://nextjs.org/docs/messages/middleware-upgrade-guide#executing-middleware-on-internal-nextjs-requests)
ด้วยเช่น `_next/data` ตอนนี้งานเจอผลจากเรื่องนี้เต็มๆ เพราะจากเดิมที่คาดหวังว่า `_next/data` จะไม่โดน
เรียกใน Middleware พวก `getStaticProps` และ `getServerSideProps` ก็คืน json ให้เป็นปกติเวลา
ที่ฝั่ง NextJS client prefetch ข้อมูลพวกนี้มาที่ NextJS server แต่ว่าต่อไปนี้ ถ้ามี rewrite แล้วผลลัพธ์
rewrite ไม่เหมือนกัน (ตอนนี้งานตกเข้าประเด็นนี้) จากปกติที่ `_next/data` returns json data อาจจะ
returns 404 หรือ html fallback page แทน

`_next/data` ไม่ returns JSON ปกติก็ไม่มีปัญหาอะไร แต่ที่เจอปัจจุบันอาจทำให้หน้าทั้งหน้าพังได้ เพราะ
client ไม่สามารถ hydrate html ได้ ตอนนี้ง่ายสุดคือหาทางเลี่ยง Middleware ใน NextJS ซะ
หรือไม่ก็ต้องมั่นใจว่า rewrite ออกมาแล้ว path ถูก
