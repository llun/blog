---
title: chai.js deep equal
lang: th
description: note about chai.js and how to do deep equal
date: 2014-01-17
tags:
  - chai.js
  - javascript
  - testing framework
---

เห็น [tweet @visibletrap](https://twitter.com/visibletrap/status/424001874178473986) เลยกระตุ้นให้อยากเขียนเรื่องนี้ขึ้นมาเสียหน่อย เพราะเป็นอะไรที่คล้ายกันมากในโลก Javascript

Spec framework ที่ผมใช้ตลอดช่วงหลังคือ Mocha แต่มันก็เป็นแค่ตัวรันครอบเท่านั้น Assertion framework ภายในกลับไม่ได้ใช้อะไรของ Mocha เลยแต่เป็น Chai.js ซึ่งมีอะไรให้เล่นเยอะแยะมากมายกว่า แต่วันนี้ขอเขียนถึงแค่ Feature เดียวคือ deep equal เพราะใช้บ่อย

เวลาทำอะไรใน Javascript สิ่งที่ได้ออกมาส่วนใหญ่ก็จะออกมาเป็น Object หรือ JSON ซึ่งเวลาจะเทียบกันด้วย Assertion framework ปกติคือ เทียบทีละ property

```js
describe('Target', function () {
  describe('#doSomething', function () {
    var result = target.doSomething()
    assertEqual(result.property1, 'expect value1')
    assertEqual(result.property2, 'expect value2')
  })
})
```

ซึ่งถ้ามี property น้อยๆ หรือ object ไม่ซับซ้อนก็พอไหว แต่ถ้ามี array ซ้อนภายในก็เริ่มจะยุ่งยากหละ Chai.js มีตัวช่วยเรียกว่า deep เพื่อเทียบสิ่งที่อยู่ภายในให้ทั้งหมด จากด้านบนถ้าเทียบด้วย deep ก็จะกลายเป็น

```js
describe('Target', function () {
  describe('#doSomething', function () {
    var result = target.doSomething()
    expect(result).to.deep.equal({
      property1: 'expect value1',
      property2: 'expect value2'
    })
  })
})
```

เขียนเทียบน้อยลงและเห็นหน้าตา output ที่ spec เลย! ดีกว่าเยอะ
