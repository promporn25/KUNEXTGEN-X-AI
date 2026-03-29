# KUNextGen X AI

เว็บสรุปเนื้อหา/สร้าง Quiz/Flashcard ด้วย React + Vite และ Node.js + OpenAI

## Local Development

1. ติดตั้งแพ็กเกจ
```bash
npm install
```

2. ตั้งค่า environment
```bash
cp .env.example .env.local
```

3. ใส่ `OPENAI_API_KEY` ใน `.env.local`

4. เปิด backend
```bash
npm run server
```

5. เปิด frontend
```bash
npm run dev
```

## Deploy on Render

โปรเจกต์นี้ถูกเตรียมให้ deploy แบบ service เดียวได้แล้ว:
- frontend จะถูก build เป็น `dist`
- backend ใน [server.mjs](/c:/Users/siray/Desktop/kunextgen%20X%20Ai/KUNEXTGEN-X-AI/server.mjs) จะ serve ไฟล์ `dist` และ API `/api/*`

### วิธี deploy

1. push โปรเจกต์ขึ้น GitHub
2. ไปที่ Render แล้วสร้าง `New Web Service`
3. เชื่อม repo นี้
4. ใช้ค่าตามนี้
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start`
5. ตั้ง Environment Variable
   - `OPENAI_API_KEY`
6. กด deploy

หรือใช้ไฟล์ [render.yaml](/c:/Users/siray/Desktop/kunextgen%20X%20Ai/KUNEXTGEN-X-AI/render.yaml) ที่ใส่ไว้แล้ว

## Environment Variables

- `OPENAI_API_KEY` สำหรับ backend
- `VITE_PUBLIC_APP_URL` สำหรับลิงก์ reset password
- `VITE_API_BASE_URL` ปล่อยว่างได้ถ้า deploy เว็บกับ API จากโดเมนเดียวกัน

## Notes

- ถ้า deploy แยก frontend/backend ให้ตั้ง `VITE_API_BASE_URL=https://your-api-domain.com`
- หลังแก้ [server.mjs](/c:/Users/siray/Desktop/kunextgen%20X%20Ai/KUNEXTGEN-X-AI/server.mjs) ต้องรีสตาร์ต server ใหม่
