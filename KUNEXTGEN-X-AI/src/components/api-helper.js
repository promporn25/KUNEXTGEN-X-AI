/**
 * api-helper.js
 * ตัวช่วย call /api/summarize ผ่าน server (server.mjs ใช้ OpenAI)
 */

const SERVER_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

async function callServer({ text, mode, difficulty = "medium", qCount = 5, lang = "th" }) {
  const response = await fetch(`${SERVER_URL}/api/summarize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, mode, difficulty, qCount, lang }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Server error ${response.status}: ${err}`);
  }

  return response.json();
}

// ─── Summary / KeyPoints / Keywords ──────────────────────────────────────────
export async function generateSummary({ text, mode, lang = "th" }) {
  const data = await callServer({ text, mode, lang });
  return { type: "text", raw: data.result };
}

// ─── Quiz Generation ──────────────────────────────────────────────────────────
export async function generateQuiz({ text, count = 5, difficulty = "medium", lang = "th" }) {
  const data = await callServer({ text, mode: "quiz", difficulty, qCount: count, lang });

  if (!data.data?.questions) {
    throw new Error("ผลลัพธ์ข้อสอบไม่ถูกต้อง กรุณาลองใหม่");
  }

  return { type: "quiz", data: data.data };
}

// ─── Flashcard Generation ─────────────────────────────────────────────────────
export async function generateFlashcard({ text, count = 10, lang = "th" }) {
  const data = await callServer({ text, mode: "flashcard", qCount: count, lang });

  if (!data.data?.cards) {
    throw new Error("ผลลัพธ์ Flashcard ไม่ถูกต้อง กรุณาลองใหม่");
  }

  return { type: "flashcard", data: data.data };
}

// ─── Main dispatcher ──────────────────────────────────────────────────────────
export async function processContent({ text, mode, difficulty, qCount, lang }) {
  switch (mode) {
    case "quiz":
      return generateQuiz({ text, count: qCount, difficulty, lang });
    case "flashcard":
      return generateFlashcard({ text, count: qCount, lang });
    default:
      return generateSummary({ text, mode, lang });
  }
}
