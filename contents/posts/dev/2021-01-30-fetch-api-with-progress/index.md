---
title: Fetch API with progress
lang: th
description: Showing progress bar from fetch ReadableStream body
date: 2021-01-30T19:25:47+08:00
tags:
  - fetch
  - javascript
---

วันนี้มานั่งทำ [project feeds](https://github.com/llun/feeds) ตัวเองต่อแล้วก็มี feature ที่แสดง progress เวลา load page หรือ categories เพราะบางที internet ช้ามันจะรู้สึกเหมือนว่าโปรแกรมมันค้าง ตอนเริ่มแรกสุดไม่มีปัญหานี้เพราะ generate feed entry ทุกหน้าเป็น static page แล้ว browser ทำเรื่อง loading ให้แต่พอเปลี่ยนมาเป็น single page app ที่โหลด feed entry ผ่าน fetch เรื่องนี้เลยกลายเป็นปัญหา

Loading bar ตอนนี้ก็ทำง่ายๆ เป็นแถบอยู่บนสุดของหน้า ปัญหาคือจะแสดงว่าโหลดถึงไหนแล้วยังไง ตอนแรกที่คิดก็กะว่าจะทำ random progress แบบ Github เพราะไม่มีอะไรยุ่งยาก random เลขเอาแล้วเอา sequence function มาใส่ให้มันดูเหมือน load จริงแต่ดันไปเจอว่า [fetch api มีวิธีอ่าน bytes ที่ดาวโหลดมาแล้วเท่าไหร่กับ content length](https://javascript.info/fetch-progress) เลยเปลี่ยนมาแสดง progress ตามที่โหลดจริงแทน

## Fetch readable stream

ReadableStream เป็น stream interface ใน Javascript บน Browser ที่พึ่งรู้ว่ามี ลองไปดูใน [caniuse.com](https://caniuse.com/?search=readablestream) แล้วพึ่งเห็นว่ามันมีตั้งแต่ Chrome 43 และ Safari 10 แล้ว! ตั้งแต่สมัย iPhone8 แล้ว fetch แปะ readable stream มากับ `response.body` ที่ return มาจาก `await fetch(url)` วิธีหาว่า fetch ดึงข้อมูลจาก url ที่ใส่ไปมาเท่าไหร่แล้วก็ง่ายๆ เอา ReadableStream ด้วย `response.body.getReader()` แล้ว loop เรียก read วนไป

```
async function loadData(url) {
  const response = await fetch(url)
  // ดึงมาว่าขนาดทั้งหมดของข้อมูลเท่าไหร่ ไว้คำนวน percentage
  const contentLength = parseInt(
    response.headers.get('Content-Length') || '0',
    10
  )

	const reader = response.body.getReader()
	// Uint8Array spread ไม่ได้แล้วจะเอามาต่อกันก็ต้องรู้ขนาดทั้งหมดก่อน เลยต้องเอา chunk มาเก็บไว้ก่อนพร้อมกับหาขนาดทั้งหมดระหว่างอ่านมา
	let totalRead = 0
	let chunks = []
	while (true) {
	  const { done, value } = await reader.read()
	  if (done) break
	  totalRead += value.length
	  chunks(value)
	  // ระหว่างอ่านมาก็ update progress bar ไปด้วย
	  updateProgress(totalRead, contentLength)
	}

	// อ่านมาครบแล้วก็เอาข้อมูลมาต่อ แต่ Uint8Array ไม่มี concat/push ตรงๆ เลยต้องสร้าง Uint8Array มาอีกอันกับขนาดทั้งหมดของข้อมูล
	const flatten = new Uint8Array(totalRead)
	// ตอนแรกคิดว่าจะใช้ flatten.length แต่ length ที่คือมาคือ totalBytes เลยต้อกำหนด position เพิ่มขึ้นมาให้ต่อข้อมูลถูกจุด
	let position = 0
	for (const array in data) {
		flatten.set(array, position)
		position += array.length
	}
	// ปิดท้ายด้วยเอา text decoder  มาอ่าน array พร้อมบอกว่าเป็นข้อมูลประเภทไหนจะได้แปลงถูก
	const text = new TextDecoder('utf-8').decode(chunksAll)
	return text
}
```

บนนี้คือเอามาจาก [https://javascript.info/fetch-progress](https://javascript.info/fetch-progress) ตรงๆ เลย

Feature อีกอย่างที่ readable stream มีคือมัน cancel ได้! แต่ยังไม่ได้ลองเล่นว่ามันหยุดดาวโหลด content เมื่อสั่ง cancel หรือป่าว ตอนแรกที่หาไว้คือใช้ [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) แต่ถ้าสามารถ cancel ที่ request ได้เลยจะง่ายกว่าสั่งยกเลิกทั้ง page ไว้รอบหน้าลองแล้วได้ผลยังไงมาเขียนอีกที
