---
title: q.js and Mocha
lang: th
description: note about q.js and mocha testing framework
date: 2013-11-10
tags:
  - q.js
  - javascript
  - mocha
  - testing framework
---

ปัญหาที่น่าปวดหัวอย่างหนึ่งเวลาเขียน spec คู่กับ [q.js](https://github.com/kriskowal/q) คือ q.js จัดการ exception ให้เวลา expect แล้ว fail, exception ที่ throw จาก spec เลยไม่ถูกส่งออกมาถึง spec กลายเป็นว่า spec นั้นผ่านเพราะไม่มี error อะไร หรือถ้าเป็น async เวลาเรียก done ใน q ก็เหมือนมีตัวแปรชื่อเดียวกันอีก กลายเป็นว่า done ของ spec ไม่ถูกเรียกไปเรียกของ q แทน ตัวอย่าง spec ง่ายๆ เช่น

```js
function authenticate(req, res) {
  q.nfcall(user.authenticate, req.body.username, req.body.password)
    .then(function (result) {
      res.json(result)
    })
    .fail(function (err) {
      res.json(err)
    })
}
```

เวลาเขียน spec อย่างง่ายๆ ที่คาดหวังคือ

```js
describe('#authenticate', function () {
  it('should return error when password is wrong', function (done) {
    authenticate(
      { username: 'username', password: 'wrongpassword' },
      {
        json: function json(status, data) {
          expect(output.status).to.equal(200)
          expect(output.data.message).to.equal('Wrong password')
          done()
        }
      }
    )
  })
})
```

ซึ่งควรจะรันแบบผ่านไปได้ด้วยดี ถ้ามี error ก็แสดงออกมาแต่หลังจากรัน mocha จะ error เพราะ timeout (done ไม่ถูกเรียก) ทางแก้ง่ายสุดคือใช้ flag เข้าช่วยแล้วให้ interval คอยตรวจว่า flag เปลี่ยนไปหรือยังได้ออกมาเป็น specs version 2 (ใน test_it หรือ jasmine ใช้ waitFor ได้)

```js
describe('#authenticate', function () {
  it('should return error when password is wrong', function (done) {
    var flag = false
    var output = {}

    authenticate(
      { username: 'username', password: 'wrongpassword' },
      {
        json: function (status, data) {
          flag = true
          output.status = status
          output.data = data
        }
      }
    )

    var interval = setInterval(function () {
      if (!flag) return

      clearInterval(interval)
      expect(output.status).to.equal(200)
      expect(output.data.message).to.equal('Wrong password')
      done()
    }, 100)
  })
})
```

ซึ่งหน้าตายาวเหยียดและดูไม่น่าเขียนเท่าไหร่ เลยหาทางกำจัด flag กับ setInterval ก่อนออกมาเป็น version 3

```js
describe('#authenticate', function () {
  it('should return error when password is wrong', function (done) {
    var deferred = q.defer()
    var output = null

    deferred.promise.then(function () {
      expect(output.status).to.equal(200)
      expect(output.data.message).to.equal('Wrong password')
      done()
    })

    authenticate(
      { username: 'username', password: 'wrongpassword' },
      {
        json: function (status, data) {
          output.status = status
          output.data = data
          deferred.resolve()
        }
      }
    )
  })
})
```

สิ่งที่ยังกวนใจอยู่คือ output ที่มันควรส่งเข้าไปให้ test ตรงๆ ได้ไม่ต้องมาสร้าง variable รับอีกเลยใช้ spread ช่วย

```js
describe('#authenticate', function () {
  it('should return error when password is wrong', function (done) {
    var deferred = q.defer()

    deferred.promise.spread(function (status, data) {
      expect(status).to.equal(200)
      expect(data.message).to.equal('Wrong password')
      done()
    })

    authenticate(
      { username: 'username', password: 'wrongpassword' },
      {
        json: function (status, data) {
          deferred.resolve([status, data])
        }
      }
    )
  })
})
```

นี่แหละที่ต้องการมี code เพิ่มนิดหน่อยเกือบจะเท่าแบบแรกสุดแถมดูดีอีกต่างหาก ไม่มีตัวแปรอื่นมากวนเท่าไหร่ เขียนมานี่ตอนลองมั่วอยู่นานกว่าจะได้ แต่ก่อนใช้ mocha-as-promise ช่วยแต่พบว่ามันดันให้ผ่านใน test ที่ควรจะ fail เลยเลิกใช้เลย
