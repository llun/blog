---
title: function.bind()
lang: th
description: function.bind() personal note
date: 2014-04-01
tags:
  - function
  - bind
  - javascript
---

ใน Javascript arguments สามารถส่ง function เข้าไปได้ซึ่งก็เป็นที่นิยมในการใช้งานโดยเฉพาะใน Node.js ตัวอย่างแบบง่ายสุดก็คงเป็น setTimeout

```js
setTimeout(function () {
  doSomething()
}, 1000)
```

function ที่ส่งเข้าไปก็จะถูกเรียกโดย function อื่นอีกทีนึง อาจมี arguments จาก function หลักหรือข้อมูลจากภายนอกเข้าไปก็ได้ การส่งข้อมูลจากนอก function หลักทางนึงที่ทำกันคือสร้าง global variable นอก function นั้นแล้วเรียกใช้ใน function ที่ส่งเข้าไปอีกที

```js
var data = 0
setTimeout(function () {
  doSomethingWith(data)
}, 1000)
```

ปัญหาคือ variable นี้สามารถเปลี่ยนแปลงได้แล้วจะรู้ได้ยังไงว่า function นั้นใช้ค่าที่ถูกต้อง แม้ว่า node.js จะเป็น single thread ก็ตามแต่ถ้าเป็นงานที่เรียกใช้ตัวแปรเดียวกันนี้ตลอด บางครั้งก็อาจได้ค่าที่ผิด javascript ในรุ่นหลังๆ เลยเพิ่ม function เข้ามาใหม่ชื่อว่า bind ที่สามารถกำหนด parameters ให้กับฟังก์ชั่นพร้อมตัวแปร this ซึ่งก็คล้ายๆ กับ call และ apply แต่ bind ไม่ได้เรียก function เพียงแต่สร้าง function มาครอบทับอีกที arguments ทั้งหลายเหมือน call เช่น

```js
setTimeout(
  function (data) {
    doSomething(data)
  }.bind(caller, 'sample'),
  1000
)
```

parameters ที่ส่งผ่าน bind เข้าไปจะถูกแนบไปด้านหน้าเสมอ เพราะงั้น ถ้า callback มีการรับอะไรเพิ่มเติมก็จะตามหลังจากที่กำหนดใน bind ตัวอย่างเวลาใช้กับ jQuery บ้าง

```js
jQuery.getJSON(
  'http://api.service.io/data.json',
  function (count, data, status) {
    if (count > 10) {
      doSomethingWith(data)
    } else {
      doSomethingElseWith(data)
    }
  }.bind(count)
)
```

ใน Node.js ที่ใช้บ่อยสุดก็คงเป็น Q.js เพราะมีการส่ง function เพื่อเรียกต่อๆ กันเยอะมาก แทบจะขาดไม่ได้เลย แต่ไม่ได้สนใจอะไรพิเศษจนต้องมาเขียนบางอย่างที่เอามาใช้คู่กับ apply/call แล้วรู้สึกมันเจ๋งมาก เลยเขียนขึ้นมาเป็น post นี้
