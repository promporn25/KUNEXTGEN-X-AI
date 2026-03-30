import express from 'express';
import cors from 'cors';
import { existsSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import OpenAI from "openai";

const MIN_TEXT_LENGTH = 3;

function buildParagraphSections(text, labelPrefix = 'ย่อหน้า') {
  const parts = String(text)
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 20);

  return parts.map((content, index) => ({
    id: `${labelPrefix}-${index + 1}`,
    label: `${labelPrefix} ${index + 1}`,
    title: content.split('\n')[0].slice(0, 90) || `${labelPrefix} ${index + 1}`,
    excerpt: content.slice(0, 260),
    content,
  }));
}

function extractPagesFromMarkedText(markedText = '') {
  const matches = [...String(markedText).matchAll(/\[\[\[PAGE:(\d+)\]\]\]\s*([\s\S]*?)(?=\[\[\[PAGE:\d+\]\]\]|$)/g)];
  const sourceSections = matches.map((match) => {
    const page = Number(match[1]);
    const content = match[2].trim();
    return {
      id: `page-${page}`,
      label: `หน้า ${page}`,
      title: content.split('\n')[0].slice(0, 90) || `หน้า ${page}`,
      excerpt: content.slice(0, 260),
      content,
    };
  }).filter((section) => section.content);

  return {
    content: sourceSections.map((section) => section.content).join('\n\n').slice(0, 12000),
    sourceSections,
  };
}

// URL text extractor
async function fetchTextFromUrl(url) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; KUNextGen/1.0)' },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();

    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<\/p>|<\/div>|<br\s*\/?>/gi, '\n\n')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/[ \t]{2,}/g, ' ')
      .trim();

    const content = text.slice(0, 12000);
    return {
      content,
      sourceSections: buildParagraphSections(content, 'ย่อหน้า'),
    };
  } catch (e) {
    throw new Error(`ดึงข้อมูลจาก URL ไม่ได้: ${e.message}`);
  }
}

// Init app
const app = express();
app.use(cors());
app.use(express.json({ limit: '15mb' }));

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load env
try {
  const envPath = join(__dirname, '.env.local');
  const envContent = readFileSync(envPath, 'utf8').replace(/^\uFEFF/, '');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim().replace(/\r/g, '');
    if (key) process.env[key] = val;
  }
} catch {}

// OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Chat API
app.post("/api/chat", async (req, res) => {
  try {
    const { message, context, history } = req.body;
    const trimmedMessage = String(message || "").trim();
    const compactContext = String(context || "").trim().slice(0, 3500);
    const compactHistory = Array.isArray(history)
      ? history
          .slice(-6)
          .map((item) => ({
            role: item?.role === "assistant" ? "assistant" : "user",
            content: String(item?.content || "").trim().slice(0, 500),
          }))
          .filter((item) => item.content)
      : [];

    if (!trimmedMessage) {
      return res.status(400).json({ error: "missing message" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `คุณเป็น AI ผู้ช่วยสอน
อธิบายเนื้อหาให้เข้าใจง่าย กระชับ ตรงคำถาม และตอบเป็นภาษาไทย
ถ้าคำตอบยาวเกินจำเป็นให้สรุปเป็นหัวข้อสั้น ๆ ก่อน

เนื้อหา:
${compactContext}`
        },
        ...compactHistory,
        { role: "user", content: trimmedMessage }
      ],
      temperature: 0.3,
      max_tokens: 450,
    });

    res.json({
      reply: completion.choices[0].message.content,
    });

  } catch (err) {
    console.error("CHAT ERROR:", err);
    res.status(500).json({ error: "chat failed" });
  }
});

app.post("/api/translate-result", async (req, res) => {
  try {
    const { text, targetLang = "th" } = req.body || {};

    if (!text || String(text).trim().length < MIN_TEXT_LENGTH) {
      return res.status(400).json({ error: "No text to translate" });
    }

    const targetLabel = targetLang === "en" ? "English" : "Thai";

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Translate the provided summary into ${targetLabel}. Preserve the original structure, headings, numbering, bullets, and paragraph breaks. Return only the translated text.`,
        },
        {
          role: "user",
          content: String(text).slice(0, 12000),
        },
      ],
    });

    res.json({
      result: completion.choices[0].message.content || "",
      lang: targetLang,
    });
  } catch (err) {
    console.error("TRANSLATE ERROR:", err);
    res.status(500).json({ error: "translate failed" });
  }
});

// Multipart parser
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

        if (filenameMatch) {
          fileName = filenameMatch[1];
          fileBuffer = Buffer.from(body, 'binary');
        } else {
          fields[nameMatch[1]] = body;
        }
      }

      resolve({ fields, fileBuffer, fileName });
    });
    req.on('error', reject);
  });
}

// File extract
async function extractText(buffer, fileName) {
  const ext = fileName.split('.').pop().toLowerCase();

  try {
    if (ext === 'pdf') {
      const { createRequire } = await import('module');
      const require = createRequire(import.meta.url);
      const pdfParse = require('pdf-parse');
      let pageIndex = 0;
      const data = await pdfParse(buffer, {
        pagerender: (pageData) => {
          const renderOptions = {
            normalizeWhitespace: false,
            disableCombineTextItems: false,
          };

          return pageData.getTextContent(renderOptions).then((textContent) => {
            let lastY;
            let text = '';
            for (const item of textContent.items) {
              if (lastY === item.transform[5] || !lastY) text += item.str;
              else text += '\n' + item.str;
              lastY = item.transform[5];
            }
            pageIndex += 1;
            return `[[[PAGE:${pageIndex}]]]\n${text}`;
          });
        },
      });
      return extractPagesFromMarkedText(data.text);
    }

    if (ext === 'docx' || ext === 'doc') {
      const mammoth = (await import('mammoth')).default;
      const result = await mammoth.extractRawText({ buffer });
      const content = result.value.slice(0, 12000);
      return {
        content,
        sourceSections: buildParagraphSections(content, 'ย่อหน้า'),
      };
    }

    if (ext === 'txt') {
      const content = buffer.toString('utf8').slice(0, 12000);
      return {
        content,
        sourceSections: buildParagraphSections(content, 'ย่อหน้า'),
      };
    }

    return { content: `[ไม่รองรับไฟล์ ${fileName}]`, sourceSections: [] };
  } catch (e) {
    return { content: `[อ่านไฟล์ไม่ได้: ${e.message}]`, sourceSections: [] };
  }
}


function getSystemPrompt(lang) {
  return lang === 'en'
    ? 'You are a helpful academic assistant. Respond in English only.'
    : 'คุณเป็นผู้ช่วยสรุปเนื้อหา ตอบเป็นภาษาไทย อ่านง่าย กระชับ และมีโครงสร้างชัดเจน';
}

function buildPrompt(content, mode, difficulty = 'medium', qCount = 5, lang = 'th') {
  const diffLabel = { easy: 'ง่าย', medium: 'ปานกลาง', hard: 'ยาก' }[difficulty] || 'ปานกลาง';
  const diffLabelEn = { easy: 'easy', medium: 'medium', hard: 'hard' }[difficulty] || 'medium';

  if (lang === 'en') {
    if (mode === 'summary') {
      return `Summarize the main ideas clearly and concisely. Organize the output into readable sections and use simple academic English.\n\nContent:\n${content}`;
    }
    if (mode === 'keypoints') {
      return `Extract 5-10 key points from the content. Each point should be short, clear, and easy to understand immediately.\n\nContent:\n${content}`;
    }
    if (mode === 'keywords') {
      return `Extract important keywords or concepts and provide a short explanation for each one. Format the output as an easy-to-read list.\n\nContent:\n${content}`;
    }
    if (mode === 'quiz') {
      return `Create ${qCount} multiple-choice questions in English. Difficulty level: ${diffLabelEn}.\n\nFrom this content:\n${content}\n\nReturn JSON only. Do not add any extra text. Format:\n{\n  "questions": [\n    {\n      "question": "Question text",\n      "choices": ["A. Choice 1", "B. Choice 2", "C. Choice 3", "D. Choice 4"],\n      "answer": 0,\n      "explanation": "Why this answer is correct"\n    }\n  ]\n}\nNote: "answer" must be the index of the correct choice (0=A, 1=B, 2=C, 3=D).`;
    }
    if (mode === 'flashcard') {
      return `Create ${qCount} flashcards in English from the content below.\nMake the question and answer short, clear, and useful for review.\n\nContent:\n${content}\n\nReturn JSON only. Do not add any extra text. Format:\n{\n  "cards": [\n    {\n      "question": "Question or concept",\n      "answer": "Answer or explanation"\n    }\n  ]\n}`;
    }
    return content;
  }

  if (mode === 'summary') {
    return `สรุปเนื้อหาหลักอย่างกระชับ ครอบคลุมประเด็นสำคัญ แบ่งเป็นหัวข้อย่อย และใช้ภาษาที่เข้าใจง่าย\n\nเนื้อหา:\n${content}`;
  }
  if (mode === 'keypoints') {
    return `สกัด Key Points สำคัญ 5-10 ข้อ แต่ละข้อควรสั้น ชัด และอ่านแล้วเข้าใจทันที\n\nเนื้อหา:\n${content}`;
  }
  if (mode === 'keywords') {
    return `สกัดคำศัพท์หรือแนวคิดสำคัญ พร้อมคำอธิบายสั้น ๆ จัดเป็นรายการที่อ่านง่าย\n\nเนื้อหา:\n${content}`;
  }
  if (mode === 'quiz') {
    return `สร้างข้อสอบแบบ Multiple Choice จำนวน ${qCount} ข้อ ระดับความยาก: ${diffLabel}\n\nจากเนื้อหา:\n${content}\n\nตอบเป็น JSON เท่านั้น ห้ามมีข้อความอื่น รูปแบบ:\n{\n  "questions": [\n    {\n      "question": "คำถาม",\n      "choices": ["A. ตัวเลือก 1", "B. ตัวเลือก 2", "C. ตัวเลือก 3", "D. ตัวเลือก 4"],\n      "answer": 0,\n      "explanation": "คำอธิบายเฉลย"\n    }\n  ]\n}\nหมายเหตุ: "answer" คือ index ของตัวเลือกที่ถูกต้อง (0=A, 1=B, 2=C, 3=D)`;
  }
  if (mode === 'flashcard') {
    return `สร้าง Flashcard จำนวน ${qCount} ใบ จากเนื้อหาต่อไปนี้\nให้คำถามและคำตอบกระชับ เข้าใจง่าย และเหมาะสำหรับทบทวน\n\nเนื้อหา:\n${content}\n\nตอบเป็น JSON เท่านั้น ห้ามมีข้อความอื่น รูปแบบ:\n{\n  "cards": [\n    {\n      "question": "คำถามหรือแนวคิด",\n      "answer": "คำตอบหรือคำอธิบาย"\n    }\n  ]\n}`;
  }
  return content;
}


app.post('/api/summarize', async (req, res) => {
  try {
    let content = '', sourceSections = [], mode = 'summary', lang = 'th', difficulty = 'medium', qCount = 5;

    const ct = req.headers['content-type'] || '';

    if (ct.includes('multipart/form-data')) {
      const { fields, fileBuffer, fileName } = await parseMultipart(req);
      mode = fields.mode || 'summary';
      lang = fields.lang || 'th';
      difficulty = fields.difficulty || 'medium';
      qCount = parseInt(fields.qCount || fields.count || '5', 10);

      if (fileBuffer) { const extracted = await extractText(fileBuffer, fileName); content = extracted.content; sourceSections = extracted.sourceSections || []; } else if (fields.url && fields.url.trim()) { const extracted = await fetchTextFromUrl(fields.url.trim()); content = extracted.content; sourceSections = extracted.sourceSections || []; } else { content = fields.text || ''; sourceSections = buildParagraphSections(content, 'ย่อหน้า'); }
    } else {
      mode = req.body.mode || 'summary';
      lang = req.body.lang || 'th';
      difficulty = req.body.difficulty || 'medium';
      qCount = parseInt(req.body.qCount || req.body.count || '5', 10);

      if (req.body.url && req.body.url.trim()) { const extracted = await fetchTextFromUrl(req.body.url.trim()); content = extracted.content; sourceSections = extracted.sourceSections || []; } else { content = req.body.text || ''; sourceSections = buildParagraphSections(content, 'ย่อหน้า'); }
    }

    if (!content || content.trim().length < MIN_TEXT_LENGTH) {
      return res.status(400).json({ error: 'กรุณาใส่ข้อความอย่างน้อย 3 ตัวอักษร หรือเลือกไฟล์/ลิงก์ที่มีเนื้อหา' });
    }

    const isJson = mode === 'quiz' || mode === 'flashcard';

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: isJson
            ? `คุณเป็นผู้เชี่ยวชาญด้านการออกข้อสอบและสร้าง Flashcard ตอบ${lang === 'th' ? 'ภาษาไทย' : 'ภาษาอังกฤษ'} และต้องตอบเป็น JSON เท่านั้น ห้ามมีข้อความอื่น`
            : getSystemPrompt(lang)
        },
        { role: "user", content: buildPrompt(content, mode, difficulty, qCount, lang) }
      ],
      ...(isJson ? { response_format: { type: "json_object" } } : {}),
    });

    const raw = completion.choices[0].message.content;

    if (isJson) {
      try {
        const clean = raw.replace(/```json|```/g, '').trim();
        const data = JSON.parse(clean);
        return res.json({ type: mode, data, mode, sourceText: content, sourceSections });
      } catch (parseErr) {
        console.error("JSON PARSE ERROR:", parseErr, "\nRaw:", raw);
        return res.status(500).json({ error: 'ไม่สามารถแปลงผลลัพธ์ได้ กรุณาลองใหม่อีกครั้ง' });
      }
    }

    res.json({ result: raw, type: 'text', mode, sourceText: content, sourceSections });

  } catch (e) {
    console.error("SUM ERROR:", e);
    res.status(500).json({ error: e.message });
  }
});


const distPath = join(__dirname, 'dist');
if (existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(join(distPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`OpenAI Key: ${process.env.OPENAI_API_KEY ? "OK" : "MISSING"}`);
});






