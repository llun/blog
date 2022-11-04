---
title: Container Query & overscroll-behavior
lang: th
description: New CSS feature, container query and overscroll-behavior
date: 2022-11-04T20:11:19+01:00
tags:
  - CSS
  - Container Query
  - overscroll-behavior
---

อาทิตย์นี้เจอ css property ที่น่าสนใจสองอย่าง `@container` กับ `overscroll-behavior` ทั้งสองอันรองรับใน iOS แล้วด้วย แต่อาจจะต้องรออีกหน่อยเพราะ iOS16 พึ่งออก ถ้าใช้ CSS สองอย่างนี้คนใช้ iOS ส่วนใหญ่อาจจะยังไม่เห็น แต่คนใช้ iPhone ส่วนใหญ่ก็อัพเกรดกันเร็วอยู่แล้ว

## Container Query

[@container](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Container_Queries) ทำงานคล้ายกับ Media Query ที่ใช้กันมานาน แต่ต่างจาก Media Query คือแทนที่จะจะอิงกับขนาดของ Window และ Media type (screen, print). Container Query อิงกับขนาดของ parent container แทน.

ที่สนใจเพราะ Container Query นี่ทำให้เอามาใช้กับ Web ที่แบ่งหน้าเป็นส่วนๆ เช่นด้านซ้ายเป็น Navigation แล้วด้านขวาเป็น Content ได้ง่ายกว่า Media Query มากไม่ต้องคอยคิดว่า หน้าจอขนาดนี้อะไรจะกระทบบ้างจากกฏไม่กี่อันอีกต่อไป แต่ไปขึ้นกับขนาดของ Parent Container แทน

<iframe height="300" style="width: 100%;" scrolling="no" title="Container Query" src="https://codepen.io/llun/embed/preview/RwJRNWZ?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/llun/pen/RwJRNWZ">
  Container Query</a> by Maythee Anegboonlap (<a href="https://codepen.io/llun">@llun</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

จาก code ด้านบนถ้า resize หน้าจอลงเรื่อยๆ จน dom conversations ย่อลงจนถึงขนาดที่กำหนด แถบเวลาจะเลื่อนลงมา

## overscroll-behavior

อีก property ที่พึ่งรู้จักแต่อยู่ใน css มาได้ซักพักแล้ว `overscroll-behavior` ที่ไว้แก้ปัญหาเรื่อง overflow ที่เวลา scroll content ไปจนสุดแล้ว browser จะพยายามเลื่อนต่อถ้าหน้านั้นมี scroll ข้างนอกด้วย

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/llun/embed/preview/VwdjEOR?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/llun/pen/VwdjEOR">
  Untitled</a> by Maythee Anegboonlap (<a href="https://codepen.io/llun">@llun</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

จาก code ด้านบนถ้าไม่ใส่ `overscroll-behavior` หลังจาก scroll menu ไปจนสุดแล้ว frame ด้านนอกจะ scroll ต่อ แต่พอใช้ `overscroll-behavior: contain` แล้ว scroll จะหยุดแค่ใน navigations

`overscroll-behavior` ตั้งได้สามอย่างคือ

1.  `auto` ที่ให้ scroll ต่อถ้า frame ด้านนอก scroll ได้ด้วย
2.  `contain` ให้ scroll แล้วหยุดใน dom นั้นไม่สนใจ scroll ด้านนอก แต่ถ้าเว็บ load ใน iframe แล้วหน้านอก iframe มีแถบให้เลื่อนก็จะ scroll ต่อนอก iframe
3.  `none` ให้ scroll แล้วหยุดใน dom และไม่ส่งไปนอก iframe ด้วย

## Browser supported

Container Query ยังค่อนข้างใหม่อยู่ Browser ที่รองรับหลักๆ มี Chrome กับ Safari ล่าสุด แต่ Firefox ยังไม่รองรับ ส่วน `overscroll-behavior` นี่รองรับหมดแล้ว

หลังจากไม่ได้ตาม CSS มานานหลังจากเจอสองอย่างนี้ก็รู้สึกว่า CSS เดี๋ยวนี้ใช้ง่ายขึ้นมาก ยังไม่ต้องพูดถึง grid layout ที่ทำให้ทำตารางที่คุมความกว้างและความสูงง่ายขึ้นมาก จนรู้สึกกลับมาทำเว็บสนุกอีกครั้ง
