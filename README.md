# Tire Stock — Frontend (Next.js)

หน้าเว็บสำหรับระบบสต๊อกยาง ต่อกับ backend (FastAPI) ที่ทำไว้แล้ว

## หน้าเว็บที่มี
- **ภาพรวม** (`/`) — การ์ดสรุป + ตารางของคงเหลือ (กรองยี่ห้อ + ค้นหา)
- **รับเข้า** (`/receive`) — บันทึกยางเข้าคลัง
- **ขายออก** (`/sell`) — ตัดสต๊อก (กันขายเกิน)
- **ย้ายพื้นที่** (`/transfer`) — ย้ายของข้ามพื้นที่
- **จัดการข้อมูล** (`/manage`) — เพิ่ม/ดูสินค้าและพื้นที่เก็บ

---

## วิธีรัน (ต้องมี Node.js 20+ ก่อน)

```bash
# 1. ติดตั้ง
npm install

# 2. ตั้ง URL ของ backend  (คัดลอก .env.local.example เป็น .env.local)
cp .env.local.example .env.local
#    ค่าเริ่มต้นชี้ไป http://localhost:8000 อยู่แล้ว

# 3. รัน
npm run dev
```

เปิด **http://localhost:3000**

> ⚠️ ต้องเปิด **backend ไว้ด้วย** (อีกหน้าต่าง Terminal: `uvicorn app.main:app --reload`)
> ไม่งั้นหน้าเว็บจะโหลดข้อมูลไม่ได้

---

## ตั้งค่า backend URL

แก้ไฟล์ `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

ตอน deploy จริง เปลี่ยนเป็น URL ของ Render เช่น
`NEXT_PUBLIC_API_URL=https://tire-stock-api.onrender.com`

> อย่าลืม: ตอน deploy ต้องไปเพิ่มโดเมนของหน้าเว็บนี้ใน env `ALLOWED_ORIGINS`
> ของ backend ด้วย ไม่งั้น browser จะบล็อก (CORS)

---

## โครงไฟล์

```
app/
  layout.js        โครงหน้า + ฟอนต์ + เมนู
  globals.css      ดีไซน์ทั้งหมด (โทนอู่/ร้านยาง)
  page.js          หน้าภาพรวม
  receive/         รับเข้า
  sell/            ขายออก
  transfer/        ย้ายพื้นที่
  manage/          จัดการสินค้า/พื้นที่
components/
  Nav.js           เมนูด้านบน
  MovementForm.js  ฟอร์มรับเข้า/ขายออก (ใช้ร่วมกัน)
lib/
  api.js           ตัวช่วยเรียก backend
```

## ยังไม่รวม (ทำต่อได้)
- ระบบ login (backend ยังไม่มี auth เช่นกัน)
- แก้ไข/ลบ สินค้า-พื้นที่ (ตอนนี้เพิ่มกับดูได้)
- หน้าประวัติการเคลื่อนไหว (backend มี `GET /movements` รองรับแล้ว)
