---
title: Next.JS 13
lang: th
description: Latest Next.JS, new features and experiment on my blog and app that I'm maintaining.
date: 2022-10-26T18:57:01+02:00
image: card.png
tags:
  - Next.JS
---

Next.JS Conference วันอังคารที่ผ่านมาสิ่งที่ออกมาด้วยคือ [Next.JS 13](https://nextjs.org/blog/next-13) มีสองอย่างที่ออกมาน่าสนใจคือ [Layout RFC](https://nextjs.org/blog/layouts-rfc) ที่มาเป็น beta ให้สร้าง app directory ได้แล้ว และ bundle ตัวใหม่ที่ชื่อว่า [Turbopack](https://vercel.com/blog/turbopack)

## Layout RFC

Layout นี่เป็นสิ่งที่ Next.JS ออกมาเพื่อแก้ปัญหาเรื่อง share page structure ที่ปัจจุบัน ท่าที่ทำกันคือเอา structure พวกนั้นไปใส่ไว้ใน file พิเศษที่ชื่อว่า `_app.tsx` หรือ `_document.tsx` ซึ่งก็ทำได้ไม่หมดด้วย เพราะมันรองรับแค่ root page

แต่ Layout ใหม่คือหน้า page ทุกหน้าจะเป็น directory ทั้งหมดและมี Layout file ของตัวเองที่ซ้อนกันได้ ไม่ต้องทำถ้าที่แยกส่วน Layout เป็น component ที่ครอบ page component อีกทีแล้ว

## App Directory

แต่นอกจาก Layout RFC แล้ว App directory ยังทำอีกอย่างคือแยกระหว่าง server component และ client component ที่แต่ก่อนอยู่รวมกัน แล้วแยกแค่ส่วน load data ไว้ที่ method พิเศษที่ชื่อว่า `getStaticProps` หรือ `getServerSideProps` และ effect ทั้งหลายที่ทำงานเฉพาะฝั่ง browser เท่านั้น

Server component คือแยกไปเลยว่า structure ทั้งหมด render จาก server และทำงานเกี่ยวกับ render และดึงข้อมูลเอามาใส่ structure เท่านั้น ไม่มีส่วน client behaviour ที่อยู่ใน `useEffect` อีกต่อไป แต่ถ้าจะเอา component บางส่วนมาใช้ฝั่ง client ใน browser ด้วยก็ประกาศไปบนหัวไฟล์ว่า `'use client'` ข้อดีที่ Next.JS โม้มาคือ JS ไฟล์จะเล็กลง แล้วหน้า page น่าจะโหลดเร็วขึ้น

นอกจากแยก server component แล้วอีกอย่างที่เปลี่ยนไปคือ server component จะไม่มี `getStaticProps` หรือ `getServerSideProps` แล้ว ให้ใช้ `fetch` [ที่มี parameter พิเศษไปให้หมด](https://beta.nextjs.org/docs/data-fetching/fetching)

แต่ถ้าอยากดึงข้อมูลใน client component, React ก็มี hook ใหม่ให้ใช้! เรียกว่า `use` [แบบไม่มีอะไรต่อท้าย](https://beta.nextjs.org/docs/data-fetching/fetching#example-fetch-and-use-in-client-components) ข้อดีที่เห็นคือต่อไปไม่ต้องทำท่า `useState` แล้วใช้ `useEffect` เพื่อดึงข้อมูลแล้วจัดใส่ state แล้ว use fetch แล้วเอาตัวแปรมาใช้ตรงๆ ได้เลย

## Upgrade

หลังจาก Conference เมื่อคืน ก็ลองกับ blog ตัวเองก่อนเลย พบว่าไม่มีอะไรพัง ต้อง run codemod แก้ [link](https://beta.nextjs.org/docs/upgrade-guide/codemods#remove-a-tags-from-link-components-next-link) นิดหน่อย แต่ก็ไม่เจอปัญหาอะไร (แต่ถ้าใช้ [next/image](https://beta.nextjs.org/docs/upgrade-guide/codemods#rename-nextimage-imports-next-image-to-legacy-image) อาจปวดหัวหน่อย)

ตอนเช้าเลยมาลองกับ Project ที่ตัวเองดูแลอยู่ ก็ไม่มีอะไรพังอีก ทุกอย่างทำงานได้ปกติดีมาก จนกระทั่งไปดูว่า load เป็นยังไง พบว่า response time เพิ่มขึ้นมาก แถม ram ใช้เยอะเกินกว่าเท่าตัว เรียกว่าพัง แถมพังแบบเงียบๆ ด้วยเพราะไม่มีอะไร error ขึ้นมาเลยแต่ resource ใช้เพิ่มเยอะจนต้อง scale cluster เพิ่ม

สุดท้ายก็เลย rollback กลับ 12.3 ก่อนแล้วรอ 13 mature กว่านี้ก่อน (อาจจะรอจน app directory หลุด beta) ค่อยลองอีกที
