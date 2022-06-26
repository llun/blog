---
title: Logging in PHP
lang: th
description: note about how to log in PHP
date: 2014-03-07
tags:
  - php
  - logging
  - debug
---

ช่วงนี้ต้องทำงานกับ PHP ปัญหาอย่างนึงที่เจอคือต้องการดูผลลัพธ์บางอย่าง ถ้าเป็นแต่ก่อนก็คงให้พิมพ์ออกมาในหน้าเว็บตรงๆ แต่นี่มันปี 2014 ที่ javascript มี console.log แล้ว PHP ก็น่าจะมีเหมือนกันสิ แล้วก็เจอว่า PHP ก็มีอะไรคล้ายๆ กันจริงด้วยชื่อว่า `error_log`

`error_log` รับ arguments 4 ค่าเริ่มจาก ข้อความที่จะพิมพ์ลง log, ประเภทข้อความ, ตำแหน่งของ log, ข้อมูลอื่นๆ นอกจากข้อความใน argument แรกแล้วที่เหลือไม่จำเป็นต้องใส่

- ข้อความที่พิมพ์ลง log อันนี้ตรงไปตรงมาไม่มีอะไร
- ประเภทข้อความ มีด้วยกัน 5 ประเภท
- 0, default option ลง web server log หรือไฟล์แล้วแต่ตั้งค่ากับวิธีการเรียก
- 1, ส่งเข้า email ตามที่กำหนดใน ตำแหน่ง log (argument ที่ 3)
- 2, ไม่ถูกใช้แล้ว
- 3, append เข้าไฟล์ใน argument ที่ 3
- 4, ยิงเข้า SAPI Logging
- ตำแหน่งที่จะเก็บ log เป็นได้ทั้ง email หรือ file
- extra header สำหรับแนบไปกับ email ถูกเอามาใช้เมื่อกำหนดให้ส่งเข้าเมล์เท่านั้น

เวลาใช้ปกติก็ส่งเข้า `error_log` ตรงๆ `error_log('message');` หรือ `error_log($variable);` แต่บางครั้งไม่อยากเห็น debug message ปนกับข้อความอื่นของ server ก็กำหนดหน่อยให้มันลงแยก `error_log('message', 3, '/var/log/debug.php.logs');`

แต่บางครั้ง log แค่ message ไม่พออยาก dump variable ออกมาดูด้วยว่าหน้าตาเป็นยังไงก็มี function ช่วยอีกอัน `print_r` ที่สามารถกำหนดได้ว่าให้ return หน้าตาของตัวแปรออกไป ใช้คู่กับ `error_log` ก็จะได้เห็นหน้าตาของตัวแปรใน log file ที่ต้องการ `error_log(print_r($variable, true));`

แต่ๆ เท่านั้นยังไม่พอ บางทีอยากเห็น stack trace ด้วยเพื่อไล่การทำงานของ function ถูกก็มี function `debug_backtrace` เวลาใช้ส่วนใหญ่จะใช้ในแบบ code ด้านล่าง (จริงๆ มันรับ argument เพื่อกำหนดขอบเขตของ output ด้วยแต่ไปๆ มาพิมพ์เองนี่แหละง่ายกว่า)

```php
$trace = debug_backtrace();
foreach ($trace as $value) {
  $file = $value['file'];
  $line = $value['line'];
  error_log("$file $line");
}
```

**อ้างอิง:**

- [PHP: error_log](http://www.php.net/manual/en/function.error-log.php)
- [PHP: print_r](http://www.php.net/print_r)
- [PHP: debug_backtrace](http://www.php.net/manual/en/function.debug-backtrace.php)
