---
title: Debian 10 arm64 with qemu
lang: th
image: qemu.png
description: How to run debian 10 arm64 with qemu
date: 2021-02-16T21:27:31+08:00
tags:
  - qemu
  - arm64
  - debian10
---

วันนี้จะลองแก้ปัญหา docker image ให้เพื่อนบน M1 ก็เลยหาทางเอา docker มารันบน Arm64 แต่ไม่คิดว่าขั้นตอนมันจะเยอะกว่าที่คิด
เพราะ VMWare Fusion ที่มีอยู่ไม่พอ ต้องหา emulator มาแปลงอีกที จดที่ตัวเองทำไว้ก่อน เพราะมี step เยอะกว่าที่คิดมาก

1. Install qemu, `sudo apt-get install qemu-system-arm`
2. Download debian qemu image จาก https://cdimage.debian.org/cdimage/openstack/current/ เลือก image ที่เป็น arm64, qcow2
3. Resize image, `qemu-img resize debian-10-openstack-arm64.qcow2 +18G`
4. เพิ่ม ssh key เพื่อให้ ssh เข้าไปเล่นได้

```
sudo modprobe nbd
sudo qemu-nbd -c /dev/nbd0 debian-10-openstack-arm64.qcow2
sudo mount /dev/nbd0p2 /mnt
sudo mkdir -p /mnt/home/debian/.ssh
sudo chown -R 1000:1000 /mnt/home/debian
cat ~/.ssh/id_rsa.pub > /mnt/home/debian/.ssh/authorized_keys
chmod 600 /mnt/home/debian/.ssh/authorized_keys
sudo umount /mnt
sudo qemu-nbd -d /dev/nbd0
```

5. สุดท้ายเรียก qemu รัน image ขึ้นมา

```
qemu-system-aarch64 -m 8G -M virt -cpu max \
  -bios /usr/share/qemu-efi-aarch64/QEMU_EFI.fd \
  -drive if=none,file=debian-10-openstack-arm64.qcow2,id=hd0 -device virtio-blk-device,drive=hd0 \
  -device e1000,netdev=net0 -netdev user,id=net0,hostfwd=tcp:127.0.0.1:5555-:22 \
  -nographic
```
