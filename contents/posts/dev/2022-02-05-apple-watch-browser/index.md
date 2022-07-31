---
title: Apple Watch Browser
lang: th
description: Testing browser in Apple Watch
date: 2022-02-05T16:49:30+08:00
image: wwdc2018.jpeg
tags:
  - Apple Watch
  - Browser
---

อาทิตย์ที่แล้วเจอว่า [Apple Watch มี web browser ซ่อนอยู่](https://www.makeuseof.com/how-to-use-safari-browser-apple-watch/)
เลยลองเปิดเว็บต่างๆ เล่นดู เพราะอยากรู้ว่ามันจะใช้ได้ขนาดไหน Apple Watch ที่ใช้อยู่เป็น [Apple Watch 6 44mm](https://support.apple.com/kb/SP826?locale=en_SG)
ถ้าดูจากเว็บ Apple ขนาดหน้าจอก็จะประมาณ​ นิ้วครึ่งกับความละเอียด 368 x 448 pixels พอเอามาเปิดเว็บต่างๆ ก็ได้ประมาณด้านล่าง

เริ่มจากเว็บตัวเองก่อนเลย

![หน้าเว็บ blog ตัวเอง อ่านได้อยู่](IMG_2026.jpeg)

![Javascript ทั้งหลายทำงานได้ดีอยู่](IMG_2027.jpeg)

![ลองเปิด feeds reader ที่ทำไว้ ดับ เหมือนจะไม่มี web worker เพราะงั้น sqlite wasm เลยใช้ไม่ได้](IMG_2029.jpeg)

ไม่เป็นไรลองเล่นเกมที่กำลังฮิตช่วงนี้อย่าง [Wordle](https://www.powerlanguage.co.uk/wordle/)

![เปิดได้!](IMG_2037.jpeg)

![แต่เห็นแค่แถวเดียวนะ 🥲](IMG_2039.jpeg)

สรุปเล่นได้ แต่ความยากโหดกว่าเดิมเยอะ เพราะไม่เห็นตัวอักษรที่ทายถูกผิดหลังจากแถวที่หนึ่ง ถัดมาลองเล่น[ภาษาจีน](https://cheeaun.github.io/chengyu-wordle/)

![ดูดี เห็นมากกว่าหนึ่งแถว](IMG_2031.jpeg)

![เล่นได้เหมือนบนมือถือเลยหละ!](IMG_2033.jpeg)

![ผ่านแล้ว! 🎉](IMG_2035.jpeg)

สุดท้ายแล้วลอง[ภาษาไทย](https://thwordle.vercel.app/)บ้าง

![ต้อง scroll เยอะกว่าภาษาจีน เพราะตัวอักษรไทยมาแบบเต็ม แต่เล่นได้ดีกว่า Wordle ต้นฉบับ](IMG_2045.jpeg)

![Scroll ลงมาดู keyboard ก็ไม่เห็นอะไรหละ 😂](IMG_2046.jpeg)

![ชนะแล้ว](IMG_2047.jpeg)

แต่ภาษาไทยมีดีกว่าภาษาอื่นอย่างตรงที่กดตรง "คลิกที่นี่เพื่อใช้คีย์บอร์ด" ได้ สามารถทายแบบใช้เสียงได้!

![ภาษาไทยชนะภาษาอื่นตรงนี้หละ 😂](IMG_2050.jpeg)

สรุปเหมือนทดสอบ Wordle ภาษาอื่นๆ บน Apple Watch ซะมากกว่า แต่ก็ทำให้รู้ว่าถ้าจะเขียนเว็บให้ Apple Watch ก็ต้องระวัง
เรื่อง scroll พอสมควร หลังจากหาต่ออีกหน่อยก็เจอ [video นี้จาก WWDC 2018!](https://developer.apple.com/videos/play/wwdc2018/239/) สรุปมีมาสี่ปีแล้วพึ่งรู้
