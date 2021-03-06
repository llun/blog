---
title: Bounce & Complaint
lang: th
description: จัดการ SES reputation ยังไงให้ยังส่ง marketing email ได้
date: 2020-11-19
tags:
  - email
  - marketing
  - AWS SES
  - AWS
---

ช่วงนี้ยุ่งกับระบบอีเมล์ที่ต้องแก้ให้ AWS ไม่แบนจนส่งอีเมล์ไม่ได้ แต่ด้วยงานบริษัทที่ทำมันตรงข้ามกับ good practice ของการส่งอีเมล์มาก คือต้องหาทางให้ส่งอีเมล์เชื้อชวนโฆษณาได้อยู่ ในปริมาณมหาศาลโดยไม่โดน email provider ต่างๆ ด่าแล้วโยนอีเมล์ลง spam box

โดยหลักแล้ว จะไม่ให้ email provider โกรธก็ต้องคอย monitor อยู่สองอย่าง จำนวนอีเมล์ที่ไม่มีอยู่จริง Bounce กับจำนวนอีเมล์ที่โดนแจ้งมาว่าเป็น spam หรือ Complaint ทั้งสองอย่างมี rate ที่ SES กำหนดไว้อยู่ว่าไม่ควรเกินเท่าไหร่ อย่างเช่น Bounce ก็ไม่ควรเกิน 5% ส่วน Complaint ไม่ควรเกิน 0.1% ถ้า Bounce เกิน 10% หรือ Complaint เกิน 0.5% จะโดนทักมาให้แก้ และต้องคอยหาเหตุผลมาเล่าว่าทำอะไรไปแล้วบ้างเพื่อให้สองอย่างนี้ลด และต้องทำอะไรเพิ่มบ้าง ซึ่ง Best practice ที่ AWS ให้มาก็มีตั้งแต่

1.ส่งเมล์ไปถามว่ายังอยากรับ อีเมล์อยู่ไหม ถ้าไม่ตอบก็หยุดส่ง
2.ใช้อีเมล์ให้ตรงกับ brand ที่คนรับไปสมัครมาซะ
3.แก้ไขหน้าตาอีเมล์ให้รู้ว่ามาจากเว็บที่คนรับรู้จัก ไม่ได้ใช้ template ทั่วๆ ไปที่เหมือนกันทั้งระบบ

แต่ถึงทำทั้งหมดนี่แล้ว Bounce/Complaint ก็อาจจะไม่ลดอยู่ดี คือได้ consent มาแล้วแต่คนส่วนใหญ่ถ้าเห็นเป็นโฆษณาก็จดกด mark as spam อยู่ดี วิธีดั้งเดิมแรกสุดที่ทำคือลูกค้าเจ้าไหนโดนกด report บ่อยก็ throttle ลูกค้าเจ้านั้นไป หรืองดส่งไปเลย ซึ่งก็ทำให้ชีวิตปกติสุขมาได้อยู่ประมาณสองปี

จนมาปีนี้ไม่รู้เกิดอะไรขึ้น เหมือน SES โดน report ไปเยอะจาก email provider เจ้านึง แม้ bounce กับ complaint rate จะดีแค่ไหน อยู่ดีๆ ก็ส่งเมล์มาบอกว่า ส่ง spam ไปเยอะนะให้แก้ พร้อมกับ email pattern เดิมๆ ว่ามันต้องทำอะไรบ้าง (กลับไปดูสามข้อด้านบน) รอบนี้เลยกลับมารื้อดูว่า domain ไหนมัน report spam มาเยอะสุดบ้าง (ซึ่งทั้งโลกก็มีเป็นแสนโดเมน จะบอกว่าน้อยก็น้อย แต่ส่วนตัวก็รู้จัก email provider ไม่กี่เจ้า) แล้วก็ throttle เป็น domain ไปเลย ตอนนี้ก็รอดูว่าจะแก้ได้ดีขนาดไหน แต่ก็เถียง AWS กับดัน spam rate ลงมาบ้างแล้วและโดนปลด review ไปแล้วสถานะ healthy ปกติ ก็หวังว่าจะผ่านช่วง black friday กับ christmas ไปโดยไม่มีเหตุการณ์อะไรให้ปวดหัวอีก

อย่างนึงที่รู้จาก review รอบล่าสุดนี้คือ จง monitor bounce/complaint เป็นรายโดเมนไปซะ และหา timeseries database ดีๆ มาใช้เพื่อหา top 10 ง่ายๆ อย่าคิดหาทำใช้ DynamoDB เพราะ query ลำบากกว่า (ไม่ได้แพงกว่า timeseries ที่ AWS มีให้หรอกแต่ query ช้ากว่าเยอะ)
