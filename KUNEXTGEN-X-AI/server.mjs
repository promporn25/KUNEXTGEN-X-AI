import express from 'express';
import cors from 'cors';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors());
app.use(express.json({ limit: '15mb' }));

// Load .env.local
try {
  const envPath = join(__dirname, '.env.local');
  const envContent = readFileSync(envPath, 'utf8').replace(/^\uFEFF/, '');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim();
    if (key) process.env[key] = val;
  }
} catch {}

async function parseMultipart(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => {
      const buf = Buffer.concat(chunks);
      const ct = req.headers['content-type'] || '';
      const boundary = ct.split('boundary=')[1];
      if (!boundary) return resolve({ fields: {}, fileBuffer: null, fileName: '' });
      const parts = buf.toString('binary').split('--' + boundary);
      const fields = {};
      let fileBuffer = null, fileName = '';
      for (const part of parts) {
        if (!part.includes('Content-Disposition')) continue;
        const [headerRaw, ...bodyParts] = part.split('\r\n\r\n');
        const body = bodyParts.join('\r\n\r\n').replace(/\r\n$/, '');
        const nameMatch = headerRaw.match(/name="([^"]+)"/);
        const filenameMatch = headerRaw.match(/filename="([^"]+)"/);
        if (!nameMatch) continue;
        if (filenameMatch) { fileName = filenameMatch[1]; fileBuffer = Buffer.from(body, 'binary'); }
        else { fields[nameMatch[1]] = body; }
      }
      resolve({ fields, fileBuffer, fileName });
    });
    req.on('error', reject);
  });
}

async function extractText(buffer, fileName) {
  const ext = fileName.split('.').pop().toLowerCase();
  try {
    if (ext === 'pdf') {
      const pdfParse = (await import('pdf-parse/lib/pdf-parse.js')).default;
      const data = await pdfParse(buffer);
      return data.text.slice(0, 12000);
    }
    if (ext === 'docx' || ext === 'doc') {
      const mammoth = (await import('mammoth')).default;
      const result = await mammoth.extractRawText({ buffer });
      return result.value.slice(0, 12000);
    }
    if (ext === 'pptx') {
      const AdmZip = (await import('adm-zip')).default;
      const xml2js = (await import('xml2js')).default;
      const zip = new AdmZip(buffer);
      const entries = zip.getEntries().filter(e => e.entryName.startsWith('ppt/slides/slide') && e.entryName.endsWith('.xml'));
      let text = '';
      const parser = new xml2js.Parser({ explicitArray: false });
      const extract = (obj) => { if (!obj) return ''; if (typeof obj === 'string') return obj + ' '; if (Array.isArray(obj)) return obj.map(extract).join(''); return Object.values(obj).map(extract).join(''); };
      for (const entry of entries.slice(0, 40)) { const xml = entry.getData().toString('utf8'); const result = await parser.parseStringPromise(xml); text += extract(result) + '\n'; }
      return text.replace(/\s+/g, ' ').slice(0, 12000);
    }
    if (ext === 'txt') return buffer.toString('utf8').slice(0, 12000);
    return `[ไม่สามารถอ่านไฟล์ ${fileName} ได้]`;
  } catch (e) { return `[อ่านไฟล์ไม่ได้: ${e.message}]`; }
}

function buildPrompt(content, mode, difficulty, qCount) {
  if (mode === 'summary') return `สรุปเนื้อหาต่อไปนี้เป็นภาษาไทย ให้กระชับชัดเจน แบ่งเป็นหัวข้อย่อย ใช้ภาษาเข้าใจง่าย:\n\n${content}`;
  if (mode === 'keypoints') return `จากเนื้อหาต่อไปนี้ ให้สกัด Key Points สำคัญ 5-10 ข้อ เป็นภาษาไทย:\n\n${content}`;
  if (mode === 'keywords') return `จากเนื้อหาต่อไปนี้ ให้ทำ 2 อย่าง:\n1. สรุปย่อ 3-4 ประโยค\n2. คำสำคัญ 10-15 คำ พร้อมอธิบาย\nตอบเป็นภาษาไทย:\n\n${content}`;
  if (mode === 'quiz') {
    const diffLabel = difficulty === 'easy' ? 'ง่าย' : difficulty === 'medium' ? 'ปานกลาง' : 'ยาก';
    return `สร้างข้อสอบ multiple choice จำนวน ${qCount} ข้อ ระดับ${diffLabel} จากเนื้อหานี้\nตอบเป็น JSON อย่างเดียว:\n{"questions":[{"question":"คำถาม","choices":["A. ตัวเลือก1","B. ตัวเลือก2","C. ตัวเลือก3","D. ตัวเลือก4"],"answer":0,"explanation":"อธิบาย"}]}\nเนื้อหา:\n${content}`;
  }
}

app.post('/api/summarize', async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'กรุณาตั้งค่า GEMINI_API_KEY ใน .env.local ก่อน' });

  try {
    const ct = req.headers['content-type'] || '';
    let content = '', mode = 'summary', difficulty = 'medium', qCount = 5;

    if (ct.includes('multipart/form-data')) {
      const { fields, fileBuffer, fileName } = await parseMultipart(req);
      mode = fields.mode || 'summary'; difficulty = fields.difficulty || 'medium'; qCount = parseInt(fields.qCount) || 5;
      if (fileBuffer && fileName) content = await extractText(fileBuffer, fileName);
      else content = (fields.text || fields.url || '').slice(0, 12000);
    } else {
      const body = req.body;
      content = (body.text || body.url || '').slice(0, 12000);
      mode = body.mode || 'summary'; difficulty = body.difficulty || 'medium'; qCount = body.qCount || 5;
    }

    if (!content || content.length < 5) return res.status(400).json({ error: 'ไม่มีเนื้อหาที่จะสรุป' });

    const fetch = (await import('node-fetch')).default;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: buildPrompt(content, mode, difficulty, qCount) }] }], generationConfig: { maxOutputTokens: 2000, temperature: 0.7 } }),
    });

    const data = await response.json();
    if (data.error) return res.status(500).json({ error: data.error.message });
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    if (!text) return res.status(500).json({ error: 'Gemini ไม่ตอบกลับ กรุณาลองใหม่' });
    res.json({ result: text, mode });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ Backend server รันอยู่ที่ http://localhost:${PORT}`);
  console.log(`🔑 Gemini API Key: ${process.env.GEMINI_API_KEY ? '✓ พบแล้ว' : '✗ ไม่พบ — เช็ค .env.local'}`);
});
