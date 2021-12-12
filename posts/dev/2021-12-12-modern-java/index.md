---
title: Modern Java
lang: th
description: Java17 and new Java features after Java6
date: 2021-12-12
tags:
  - java
---

หลังจากห่างหายจาก Java ไปประมาณ 8 ปี ช่วงนี้ก็กลับมาใช้อีกครั้งเพราะงานแล้วก็พบว่า
Java มีของเล่นใหม่เยอะมาก Modern ขึ้น แต่ก็ยังเยิ่นเย้อเหมือนเดิม งานจริงๆ ก็ไม่ได้แตะ
Java ซะทีเดียวแต่ใช้ Kotlin ซึ่งภาษามันค่อนข้างคล้าย Ruby/Swift มากกว่า แต่ก็ทำให้
คิดว่า สุดท้ายแล้ว ภาษาพวกนี้จะวิ่งเข้าหากันจนคล้ายกันหมดหรือป่าว

กลับมาที่ Java จากเมื่อหลายปีก่อน version สุดท้ายที่ใช้คือ Java 6 ซึ่งก็จำไม่ได้แล้วว่า
ตัวภาษามันมีอะไรใหม่บ้างเทียบกับก่อนหน้า แต่ตอนนี้ Java 17 แล้ว เทียบกับ Java 6 ที่เคย
เขียนนี่เยอะมาก เริ่มจาก

## Lambda

หลังจากเขียนภาษาอื่นที่สามารถส่งหรือสร้าง anonymous function ได้มานาน กลับมา Java
ก็พบว่ามีสิ่งที่คล้ายกันแล้วเรียกว่า Lambda แต่เนื่องจาก Java ไม่สามารถส่ง function เป็น
parameter ได้ตรงๆ สิ่งที่เรียกว่า Lambda ใน Java ก็ไม่ค่อยเหมือนในภาษาอื่นนัก เพราะ
จริงๆ แล้วมันคือ Anonymous class ที่ย่อรูปซะมากกว่า เช่น

```
interface CostCalculator {
    int calculate(int n);
}

class CrabSubmarines {
    private final int[] input;

    public CrabSubmarines(int[] input) {
        this.input = Arrays.stream(input).sorted().toArray();
    }

    public int bestMovingCost(CostCalculator calculator) {
        var min = input[0];
        var max = input[input.length - 1];
        var bestCost = Integer.MAX_VALUE;
        for (int i = min; i < max; i++) {
            var cost = 0;
            for (var val : input) {
                cost = cost + calculator.calculate(Math.abs(val - i));
            }
            if (cost < bestCost) bestCost = cost;
        }
        return bestCost;
    }
}
```

จาก `bestMovingCost` ถ้าเป็นภาษาอื่นก็จะรับ function เข้าไปตรงๆ อาจจะบอกหน่อยว่า
function ที่รับเข้าไปมี parameter และ return อะไรบ้าง แต่ไม่จำเป็นต้องประกาศ interface
แบบนี้เพื่อเอามาใช้เป็น parameter

## Stream API

สิ่งที่คิดว่าเปลี่ยนเยอะสุด ระดับเดียวกับ Collections คงเป็น Stream API เพราะทำให้ Java
ดู Modern ขึ้น แม้จะไม่เท่ากับภาษาที่เกิดขึ้นมาหลังอย่าง Kotlin แต่ก็ทำให้กลับมาเขียนง่ายขึ้นเยอะ

Stream API เป็นชุด function ที่ใส่มากับ Collections ทั้งหลายที่ทำให้ใช้ modern list functions ได้
เช่น map, reduce, range จากแต่ก่อนพวกนี้ต้องเขียนเอง ทำให้การแปลงข้อมูลง่ายขึ้นมาใช้ utility
พวกนี้ได้เลย ข้อเสียอย่างเดียวคือ เพราะ Java เป็น strong type language เวลาใช้พวกนี้บางทีก็
ปวดหัวว่าจะแปลง type ยังไง โดยเฉพาะ reduce ที่หลายครั้งจะใช้เพื่อแปลงเอาเข้า Map ไม่ใช่แค่
concat input หรือ sum

```
class Index {
    public static IntFunction<List<Integer>> windowed(List<Integer> integers, int size) {
        return (i -> integers.subList(i, i + size));
    }

    public static Integer count(Integer total, List<Integer> element) {
        return (element.get(1) > element.get(0)) ? total + 1 : total;
    }

    public static void main(String[] args) throws IOException {
        var lines = Files.lines(Paths.get("day1/input.txt")).map(Integer::parseInt).collect(Collectors.toList());
        System.out.println(IntStream
                .range(0, lines.size() - 1)
                .mapToObj(windowed(lines, 2))
                .reduce(0, Index::count, Integer::sum));
        var triples = IntStream
                .range(0, lines.size() - 2)
                .mapToObj(windowed(lines, 3))
                .map(triple -> triple.stream().reduce(0, Integer::sum))
                .collect(Collectors.toList());
        System.out.println(IntStream.range(0, triples.size() - 1)
                .mapToObj(windowed(triples, 2))
                .reduce(0, Index::count, Integer::sum));
    }
}
```

## อื่นๆ

อย่างอื่นนอกจาก [Sealed class](https://openjdk.java.net/jeps/409) และ [Fork/Join](https://docs.oracle.com/javase/tutorial/essential/concurrency/forkjoin.html)
ที่ยังไม่ได้เล่น ก็รู้สึกว่าเปลี่ยนไปพอสมควรเหมือนกัน แต่ไม่ impact เท่าสองอย่างบน ที่ใช้ไปบ้างแล้วก็มี

- foreach syntax `for (var value : iterator)`
- method reference syntax ไว้ใช้กับ Lambda ได้เช่น `Index::count` ด้านบน
- `var` แทนที่จะต้องประกาศประเภทตัวแปรทุกครั้ง
- Switch case advance ขึ้น match string ได้แล้วแถม return value ได้ด้วย `switch (variable) { case A -> val; }`
- Record class ทำให้เขียน class สั้นลงนิดนึง และ generate setter/getter ให้เลย ส่่วนตัวชอบมากกว่า constructor สองระดับใน Kotlin นิดนึง
- Interface ใส่ static method implementation ได้

จาก features ด้านบน Java มีอะไรมาใหม่เยอะมาก แต่ให้กลับมาใช้เป็นภาษาหลักมั้ยก็คงไม่เพราะชินกับการเขียน
อะไรสั้นๆ ด้วย JavaScript แบบไม่ต้องใช้ IDE และไม่ต้อง compile ไปแล้ว ยกเว้นว่า Java จะมีวิธีที่ให้เขียน
ได้สั้นและเรียกใช้งานได้เร็วกว่านี้ อีกเรื่องที่ชินใน NodeJS environment ไปแล้วก็คงเป็น dependencies file
ที่ใน node เขียนน้อยกว่า Java เยอะ อีกอย่าง tooling javascript modern และเร็วกว่า​ (เช่น swc) มาก
