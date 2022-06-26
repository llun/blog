---
title: URI matrix parameter
lang: th
description: Wrong assumption about URI path in Spring framework and hidden feature in URI, URI matrix parameter
date: 2021-11-11
image: title.png
tags:
  - spring framework
  - uri matrix parameter
  - matrix variable
---

สัปดาห์ที่ผ่านมาระบบที่เข้ามาดูแลมี pentester มาทดสอบแล้วเจอ bug นึงที่น่าสนใจ
คือใน web application ทั่วไป ก็จะมีระบบ route ที่ map เข้ากับ function
หรือ method ที่คอยทำงานแล้วส่งผลลัพธ์ออกมาให้ และ framework ทั่วไปก็จะมีสิ่ง
ที่เรียกว่า middleware ให้เขียน filter เพื่อกันหรือแปลง input/output
ระหว่างทาง

วิธีที่ framework อื่นที่รู้จักทำปกติก็จะ map router กันง่ายๆ เช่น express.js

```
app.get('/resource/subresource', middleware1, middleware2, handle)
```

หรือถ้าจะมีพิเศษหน่อยก็อาจจะมี variable capture ใน path หรือ ใช้ regex
เพื่อ match path กับ resource

ระบบที่เข้ามาดูใช้ Spring framework ก็มีโครงสร้างคล้ายกันคือ มี path matcher,
middleware (Filter) และ handle (Servlet)

ปัญหาคือ filter ที่ check path แล้วทำอะไรซักอย่างก่อนจะส่งไป resource ดัน
ทำงานพลาด เรียก handle แบบตรงๆ แทนที่จะทำอะไรบางอย่างก่อนจะเรียก ลอง
ดู code ก็เหมือนจะไม่มีอะไร

```
func filter(req, res, chain) {
  val path = req.path.value()
  if (path.startsWith('/resourceA/subResourceB')) {
    doSomething()
  }

  // Continue
  chain.doFilter(req, res)
}
```

แต่สิ่งที่เกิดขึ้นคือเวลาเรียก url `/resourceA;ver=1/subResourceB` Spring
กลับเรียกไปที่ subResourceB handle แต่ไม่เรียก `doSomething()` ที่ควรจะเรียก
ปัญหาคือจาก url นี้ปกติจะ assume ว่า framework ควรจะ return 404 สิเพราะ

```
/resourceA;ver=1/subResourceB
```

ไม่ควรจะ match กับ

```
/resourceA/subResourceB
```

เลยลองไปถามใน Spring framework github เลยพบว่า Spring framework
รองรับสิ่งที่เรียกว่า [URI matrix parameter](https://www.w3.org/DesignIssues/MatrixURIs.html)
ตาม description ใน [rfc3986 section 3.3](https://datatracker.ietf.org/doc/html/rfc3986#section-3.3) จาก URL ด้านบน

```
/resourceA;ver=1/subResourceB
```

`;ver=1` คือ matrix paramenter หรือ [Matrix Variables](https://docs.spring.io/spring-framework/docs/current/reference/html/web-reactive.html#webflux-ann-matrix-variables)
ใน Spring Framework โดยแต่ละส่วนของ path สามารถใส่ parameter ได้มากกว่าหนึ่งด้วย
เช่น `/api;v=1/parent;ts=1636634868;c=#fff/resource` ซึ่งโดยทั่วไป web framework
อื่นไม่ support ปัญาหาคือ จาก url ด้านบนถ้าใช้ String.startsWith match จะไม่ตรงกับ url
ที่ request เข้ามาแน่นอน วิธีแก้ก็ง่ายๆ แทนที่จะใช้ String.startsWith Spring Framework มี
[PathPattern](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/util/pattern/PathPattern.html) ให้ใช้ แก้จาก String.startsWith
ด้านบนเป็น

```
PathPatternParser().parse("/resourceA/subResourceB").matchStartOfPath(req.path)
```

ก็สามารถตรวจ path ที่ต้องการได้แล้ว แต่ส่วนตัวคิดว่าปัญหานี้น่าจะแก้ได้ดีกว่านี้ถ้าสามารถเอา
Filter ใส่ที่ path เหมือนอย่าง framework อื่นได้อย่าง express.js แต่สิ่งที่หาได้ใกล้เคียง
สุดคือ[ท่านี้](https://www.baeldung.com/spring-boot-add-filter) ซึ่งก็ไม่ดีขึ้นเท่าไหร่
ตอนนี้ก็คงเก็บวิธีนี้ไว้ก่อน
