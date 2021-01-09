---
title: OpenVPN + DD-WRT
lang: th
description: Setup openVPN on dd-wrt router
date: 2014-06-22
tags:
  - openwrt
  - openvpn
  - dd-wrt
---

เนื่องด้วย Internet ที่นี่ไม่ได้ดีอย่างที่คิด ปัญหาคล้ายๆ กับ ISP ในไทยคือมันผ่าน Proxy! เวลาจะดาวโหลดอะไรบางอย่างเช่น Xcode หรือ OSX จาก Apple Developer ก็มักจะเจออาการอะไรแปลกๆ เสมอจนไม่นานมานี้ถอย Router มาใหม่และมัน Supported DD-WRT มาตั้งแต่โรงงาน ([Buffalo WZR-HP-G300NH2](http://www.buffalo-technology.com/en/products/network-devices/300mbps-wireless-n/routers/airstation-trade-nfiniti-trade-wireless-n-high-power-router/)) หลังจาก update firmware ทุกอย่างเสร็จก็ลองกับ [VPN](http://www.cyberghostvpn.com) ที่สมัครไว้อยู่แล้วก็ใช้ได้ดีจนพบว่า ด้วยสาเหตุอะไรบางอย่าง [Cyberghost VPN](http://www.cyberghostvpn.com) ชอบตัด Connection ทิ้งเมื่อต่อไปนานๆ หรือ unresponse ไปเสียดื้อๆ โดยที่ router ก็ไม่ reconnect ต่อให้ด้วย วันนี้คิดว่าว่างๆ เลยหาทางตั้ง OpenVPN server เองซะเลย ยังไงก็มี server ให้เล่นเยอะอยู่แล้ว

### ฝั่ง Server

Server ที่ใช้เป็น Debian7 ~~แต่ถ้าใช้ CentOS ก็คิดว่าไม่ต่างกันมาก ไว้ลองกับ Server ที่ไทยแล้วจะมา Update เพิ่ม~~ (เพิ่มเติมส่วน CentOS ไว้แล้วด้านล่าง)

เริ่มจากติด OpenVPN package ด้วย apt-get

```bash
apt-get install openvpn
```

ติดเสร็จก็ generate key ของฝั่ง server ให้พร้อม

```bash
cp -r /usr/share/doc/openvpn/examples/easy-rsa /etc/openvpn
cd /etc/openvpn/easy-rsa/2.0
source vars
./clean-all
./build-ca
./build-key-server server
./build-dh
```

บรรทัดแรกเริ่มจาก copy เครื่องมือสำหรับสร้าง key/cert ต่างๆที่ openvpn เตรียมไว้ให้แล้วมาไว้ที่เดียวกับ config ของ openvpn จะได้ใช้สะดวกในอนาคต จากนั้นก็ล้างแล้วสร้าง key/cert ต่างๆของฝั่ง server

ได้ไฟล์ key มาครบแล้วก็ copy กลับมาที่ directory config ของ openvpn

```bash
cp /etc/openvpn/easy-rsa/2.0/keys/ca.crt /etc/openvpn
cp /etc/openvpn/easy-rsa/2.0/keys/ca.key /etc/openvpn
cp /etc/openvpn/easy-rsa/2.0/keys/server.crt /etc/openvpn
cp /etc/openvpn/easy-rsa/2.0/keys/server.key /etc/openvpn
cp /etc/openvpn/easy-rsa/2.0/keys/dh1024.pem /etc/openvpn
```

จากนั้นก็สร้าง client key/cert ต่อ

```bash
cd /etc/openvpn/easy-rsa/2.0
./build-key client
```

client จะเป็นชื่ออื่นก็ได้เช่น ชื่อเครื่องที่จะต่อเข้ามา สร้างเสร็จก็ดาวโหลด `client.crt` `client.key` `ca.crt` ลงมาที่ client เตรียมเอาไว้ต่อกับ server
หลังจาก cert ทุกอย่างพร้อมแล้วก็สร้าง openvpn config ขึ้นมา จะ copy จาก example ก็ได้แต่ด้านล่างนี้คือไฟล์ config ปัจจุบันที่ใช้ สร้างไว้ใน `/etc/openvpn/server.conf`

```
port 1194
proto udp

dev tun

ca ca.crt
cert server.crt
key server.key
;openvpn --genkey --secret ta.key //optional
tls-auth ta.key 0

dh dh1024.pem
server 192.168.50.0 255.255.255.0
ifconfig-pool-persist ipp.txt

push "redirect-gateway def1 bypass-dhcp"
push "dhcp-option DNS 8.8.8.8"
push "dhcp-option DNS 8.8.4.4"

keepalive 10 120
cipher AES-256-CBC
auth SHA1
comp-lzo

persist-key
persist-tun

status /var/log/openvpn-status.log
log-append  /var/log/openvpn.log

verb 4
mute 10
```

จากนั้นก็ restart openvpn `/etc/init.d/openvpn restart` เป็นอันเรียบร้อย

แต่ แต่ แต่ แค่นี้ทำให้ต่อเข้ามาได้แต่ออกไปไหนไม่ได้ ต้องทำเพิ่มอีกนิดหน่อยด้วยการบอกให้ iptables สร้าง route ให้ด้วย

เริ่มจากอนุญาติให้ forward traffic ได้ก่อน

```bash
# แบบชั่วคราว
echo 1 > /proc/sys/net/ipv4/ip_forward

# แบบถาวร
vim /etc/sysctl.conf
# uncomment net.ipv4.ip_forward = 1
```

จากนั้นก็เพิ่ม route ตามนี้ (ถ้า ip ต่างจากด้านบนก็แก้ตามที่เปลี่ยน)

```bash
iptables -A INPUT -p udp --dport 1194 -j ACCEPT
iptables -A INPUT -i tun+ -j ACCEPT
iptables -A FORWARD -i tun+ -j ACCEPT
iptables -t nat -A POSTROUTING -s 192.168.0.0/16 -o eth0 -j MASQUERADE
iptables-save > /etc/network/iptables
```

เรียบร้อย

**เพิ่มเติมสำหรับ CentOS**

วิธีการก็คล้ายๆ กับ Debian เริ่มจากติด OpenVPN จาก yum

```bash
yum install openvpn
```

แต่ที่ต่างออกไปคือใน CentOS ไม่มี easy-vpn แถมมาให้ด้วยต้องดาวโหลดมาเพิ่มเอง

```bash
git clone https://github.com/OpenVPN/easy-rsa.git
cd easy-rsa
git checkout v2.2.1
mkdir -p /etc/openvpn/easy-rsa
cp -r easy-rsa/2.0 /etc/openvpn/easy-rsa
```

ที่เหลือก็ทำแบบเดียวกับ Debian ทุกประการ

### ฝั่ง Client (DD-WRT)

OpenVPN Client ใน DD-WRT อยู่ใต้ tab Services > VPN เมนูล่างสุด (ไม่แน่ใจว่าต่างไปในแต่ firmware หรือไม่แต่ที่ใช้อยู่ อยู่ใต้นี้) พอเลือก Enable ปุ๊บจะมี Option มาให้เลือกยุบยับเลยแต่ก็ใส่ไปตามนี้

- **Server IP/Name** ก็ตามชื่อจะเป็น IP หรือ Domain name ก็ว่าไป
- **Port** ถ้าใช้ config ด้านบนก็ไม่ต้องใส่อะไร
- **Tunnel Device** tun
- **Tunnel Protocol** udp (ถ้า config ด้านบนเป็น tcp ก็แก้เป็น tcp ซะ)
- **Encryption Cipher** AES-256 CBC
- **Hash Algorithm** SHA1
- **Advanced Options** Enable
- **LZO Compression** Adaptive
- **Additional Config**

  resolv-retry infinite
  nobind
  persist-key
  persist-tun
  ping 10
  ping-exit 120
  ping-timer-rem
  verb 4
  comp-lzo

- **CA Cert** อันนี้ `cat ca.crt` ที่ได้จากด้านบนมาแล้วเอามาใส่
- **Public Client Cert** `cat client.crt`
- **Private Client Key** `cat client.key`

จากนั้น Apply Settings แล้วก็รอซักแป๊บ เนทที่บ้านท่านก็จะต่อ VPN อัตโนมัติ

ถ้าอยากให้ต่อได้มากกว่า 1 เครื่องก็ generate client key มาเพิ่ม `/etc/openvpn/easy-rsa/2.0/build-key another-client` ก็เรียบร้อย

### อ้างอิง

- [Debian OpenVPN guide](https://wiki.debian.org/OpenVPN)
- [Mixpanel Engineer: Secure your codebase: OpenVPN in the (Rackspace) Cloud](http://code.mixpanel.com/2010/09/08/openvpn-in-the-rackspace-cloud/)
- [Digital Ocean: How to Setup and Configure an OpenVPN Server on Debian 6](https://www.digitalocean.com/community/tutorials/how-to-setup-and-configure-an-openvpn-server-on-debian-6)
- [CyberGhost with OpenVPN on flashed DD-WRT routers](https://support.cyberghostvpn.com/index.php?/Knowledgebase/Article/View/667/184/cyberghost-with-openvpn-on-flashed-dd-wrt-routers)
- [Install help needed on centOS 6](https://forums.openvpn.net/topic10290.html)
- [Easy-VPN github](https://github.com/OpenVPN/easy-rsa)
