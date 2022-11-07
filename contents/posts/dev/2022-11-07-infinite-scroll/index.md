---
title: Infinite Scroll
lang: th
description: Modern way on building web with infinite scroll
date: 2022-11-07T20:26:28+01:00
tags:
  - JS
  - infinite scroll
  - Intersection Observer API
  - scroll
---

แต่ก่อนเวลาทำ Infinite Scroll ท่าที่ทำกันส่วนใหญ่ในเว็บคือใข้ Scroll event แล้วดู scroll position ว่าถึงตำแหน่งที่ควรจะดึงข้อมูลหน้าถัดไปแล้วหรือยัง ซึ่งส่วนใหญ่จะเป็นเกือบๆ สุด list หรือที่ท้าย list ก็ได้แล้วแสดง UI ว่ากำลังโหลดข้อมูลช่วงต่อไป

<iframe height="300" style="width: 100%;" scrolling="no" title="Scroll event" src="https://codepen.io/llun/embed/preview/RwJoRpm?default-tab=js%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/llun/pen/RwJoRpm">
  Scroll event</a> by Maythee Anegboonlap (<a href="https://codepen.io/llun">@llun</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

ข้อเสียของวิธีนี้คือ scroll event ยิงออกมาบ่อยมาก ถ้า event handler เขียนไม่ดีหรือ throttle จำนวน event ที่รับมาจะมีผลกับ UI หน้าเว็บทันที ตั้งแต่เวลาเลื่อน list จะเห็นว่า list scroll แล้วกระตุก หรือไม่ก็ทำให้หน้าเว็บกิน battery มากขึ้น ทางแก้ที่ทำกันก็คือเอาส่วนที่ทำงานหนักเวลา scroll ไปใส่ใน throttle function ซะ ไม่ว่าจะเป็น `requestAnimationFrame` หรือ `_.throttle` ใน lodash

แต่ปีนี้ 2022 แล้ว browser ทุกเจ้ามี API อีกตัวที่ออกมาเพื่อแก้ปัญหานี้โดยเฉพาะ นั่นคือ [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) ที่ไม่ยิง event มาที่ฟังก์ชั่นตลอดหรือถี่อีกต่อไปแล้ว แต่ยิงมาเฉพาะตอนที่ DOM ที่เรา monitor ไว้โผล่มาเมื่อไหร่เท่านั้น จะให้โผล่มา 25% 50% หรือทั้งหมดแล้วเรียก function เพื่อโหลดข้อมูลหน้าถัดไปก็ได้

<iframe height="300" style="width: 100%;" scrolling="no" title="Intersection Observer" src="https://codepen.io/llun/embed/preview/vYryXLL?default-tab=js%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/llun/pen/vYryXLL">
  Intersection Observer</a> by Maythee Anegboonlap (<a href="https://codepen.io/llun">@llun</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

ข้อดีของวิธีนี้คือไม่ต้อง Throttle, กำหนดเอาได้เลยว่าเลื่อนถึง element ไหนแล้วโหลด จะเลื่อนจนถึง element สุดท้าย หรือกลางๆ ก็ได้ ไม่ต้องคำนวนจากความสูงเหมือนแต่ก่อน และ browser ก็รองรับหมดแล้ว (คงไม่มีใครใช้ Internet Explorer แล้วมั้งปีนี้)
