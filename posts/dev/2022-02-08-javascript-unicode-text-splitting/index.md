---
title: Javascript unicode text splitting
lang: th
description: How to split emoji text in javascript
date: 2022-02-08
tags:
  - Javascript
  - unicode
---

สองสามวันก่อนทำ[หน้าเก็บสถิติ Wordle ตัวเอง](https://www.llun.me/journeys/wordle/) โดยเก็บจากตอนเล่น Wordle เสร็จแล้วกด share จากนั้นก็เอามาใส่ code ไว้จากนั้นค่อยเอามา render ใน page ด้วย Next.js เอา ก็คิดว่าไม่น่าจะมีปัญหาอะไรอย่างวันนี้เล่นเสร็จกด share ก็ได้ออกมาประมาณนี้

```
Wordle 234 3/6

⬜🟩🟩⬜🟩
⬜🟩🟩⬜🟩
🟩🟩🟩🟩🟩
```

ก็ตัดแบ่งเอาบรรทัดบนสุดไปใส่ title จากนั้นส่วนที่เป็น emoji ก็แบ่งบรรทัดกับแบ่ง block render ใส่ html code เอา ซึ่งตอนแบ่งบรรทัดก็ไม่มีปัญหาอะไรหรอก มามีปัญหาตอนจะตัดแบ่ง block ในบรรทัดเดียวกันนี่แหละเพราะว่า ถ้าจะเอา `⬜🟨🟨⬜🟩` มาแบ่งด้วย `.split()` ใน javascript ปกติผลที่ได้ก็จะออกมาเป็น `["⬜", "\ud83d", "\udfe8", "\ud83d", "\udfe8", "⬜", "\ud83d", "\udfe9"]` เกินกว่าจะนวนอักขระที่เห็นตอน render

และพอจะแปลงจาก emoji กลับเป็นกล่องสี่เหลี่ยมธรรมดาแบบ render สีเองวิธี match ด้วย `.charAt` ทั้งหลายเลยใช้ไม่ได้ต้องไปหาวิธีแบ่ง emoji text ใหม่ ซึ่งใน [MDN ก็มีบอกแหละว่า split มีปัญหานี้](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split)

วิธีที่ง่ายที่สุดถ้า emoji ไม่ซับซ้อนมากคือ spread string ออกมาเป็น array ก่อน `[...text]` จากนั้นก็ใช้ตำแหน่งใน array หรือเอา array range ไปใช้แทน string.length เอา ซึ่งมันก็ใช้ได้ในระดับนึง เช่น emoji block ใน wordle หรือตัวอักษรจีนส่วนใหญ่

แต่ถ้าเจอสุดยอด [emoji อย่าง `👨‍👨‍👧‍👧`](https://stackoverflow.com/questions/24531751/how-can-i-split-a-string-containing-emoji-into-an-array) spread ก็พังเหมือนกันเพราะมันจะได้ออกมาเป็น `['👨', '‍', '👨', '‍', '👧', '‍', '👧']` แทน

คำแนะนำใน Stackoverflow ด้านบนที่ safe ที่สุดตอนนี้คือไปใช้ [grapheme-split](https://github.com/orling/grapheme-splitter) ซะ ซึ่งก็ดูเหมือนไม่มีทางเลือกอื่นตอนนี้
