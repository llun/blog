---
title: LLM
lang: th
description: Thought about LLM and my current workflow and how does it help making my life easier
date: 2025-03-02T21:03:41+01:00
tags:
  - LLM
  - ChatGPT
  - Deepseek
---

ประมาณปลายปีที่แล้วช่วงที่ไป Slovenia อีกรอบได้ลอง ChatGPT ครั้งแรก (ช้ากว่าชาวบ้านเยอะมาก) สิ่งที่ทำให้รู้สึกว้าวตอนเล่นคือ สามารถใช้เสียงคุยกับ ChatGPT ได้ แล้วมันตอบได้ราบรื่นมาเหมือนคุยกับคน แทบจะไม่รู้สึกเหมือนกับที่คุยกับ Google Assistant หรือ Siri เลย หลังจากนั้นมาก็ Subscribe plus plan + เล่นอย่างอื่นตามมาเยอะมาก

หลังจากกลับมาจาก Slovenia ก็ขุดเพิ่มอีกพอสมควร เริ่มจาก Speech Recognition ที่ ChatGPT ใช้แล้วไปเจอ [Whisper](https://github.com/openai/whisper) ที่แปลงเสียงเป็น Text ด้วยความสามารถทั้งหมดของ ChatGPT รู้สึกว่า Speech Recognition นี่แหละที่ทำให้ Subscribe แล้วก็สงสัยว่า Google/Apple/Amazon ทำอะไรอยู่ แต่เรื่องคำถามและคำตอบที่แต่ละ Agent ตอบมาส่วนตัวรู้สึกว่ามันพอๆ กัน Google อาจจะ powerful กว่าส่วนที่ integrate กับ Google services ต่างๆ แต่ ChatGPT ส่วนค้นหาก็เรียกว่าไม่แย่เลย

หลังจากนั้นพอ Deepseek ออกก็ได้ลองเล่น LocalLLM ต่างๆ ทำให้รู้ว่าสิ่งที่จำเป็นสำหรับ LLM มาเล่นในเครื่องคือ VRAM (กับ GPU แต่ GPU ใน laptop ที่ใช้อยู่เล่น Deepseek ไม่แย่เท่าไหร่ หรือ M1 หลาย model ก็ตอบได้ไม่ช้ามาก) แต่จะหา GPU ที่มี VRAM มาใช้กับ model ใหญ่ๆ นี่แพงมาก (+ ค่าไฟที่ต้องจ่ายอีก) สุดท้ายดูคุ้มสุดกลายเป็น Mac Mini/Macbook Pro ที่เอา system memory มา shared กับ GPU ได้เยอะ อัพเกรด Macbook รอบต่อไปก็คงได้อัด Memory เต็มอีกรอบหลังจากรอบนี้คิดว่าไม่ค่อยได้ใช้ Memory เท่าไหร่ (ตอนนี้ไม่พอเล่น 70b model)

สิ่งที่ทำให้ว้าวล่าสุดกับ LLM คงเป็น [Cursor editor](cursor.com) ส่วนตัวบริษัทจ่าย Github Copilot ให้ทุกคนใช้อยู่แล้ว เลยได้อานิสงส์มาใช้ส่วนตัวด้วย ก็ได้ลองเล่น model ต่างๆ กับ VSCode ที่บริษัทเปิดให้ (ล่าสุดก็เปิด Copilot review ให้ด้วยแต่ต้องรอ waitlist) ก็รู้สึกว่า editor มาฉลาดขึ้นให้แก้ code ในไฟล์ได้ แต่ถ้าให้แก้ข้ามไฟล์แบบต้องรู้ context ของทั้ง project รู้สึกว่า VSCode มันยังไม่ช่วยเท่าไหร่ แม้มี Agent mode ตาม Cursor แล้วก็ตาม

สิ่งที่ทำให้ยอมจ่าย Cursor เลยคือ tab กับ generate code หรือ refactor ที่ Cursor context ดูฉลาดกว่า VSCode มาก (เปรียบเทียบกับ model เดียวกัน Sonnet 3.7) ก็หวังว่า VSCode จะไล่ตามมาเรื่อยๆ จนไม่ต้องจ่ายให้ Cursor (ค่าสมาชิกรายปีแพงกว่า Jetbrain อีก!)

จากตรงนี้ก็สงสัยว่าแล้วอนาคตจะเหลืองานอะไรให้ทำบ้างถ้า AI มันฉลาดจนทำงานแทนได้ แม้ตอนนี้ที่ใช้อยู่รู้แหละว่ามันยังแทน Developer ไม่ได้แต่ถ้าถาม หลายอย่างต้องรู้ context อยู่ + ยังต้องคอยยืนยันว่าสิ่งที่ Generate ออกมาไม่มั่ว แต่ถ้าต่อไปพวกนี้มันแม่นแล้ว ก็สงสัยว่าจะได้นอนอยู่เฉยๆ อยู่บ้านหรือป่าว
