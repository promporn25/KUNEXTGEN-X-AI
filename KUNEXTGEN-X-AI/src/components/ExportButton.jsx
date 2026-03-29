import { useState } from "react";

const TH_SUMMARY = "\u0e1a\u0e17\u0e2a\u0e23\u0e38\u0e1b";
const TH_KEYWORDS = "\u0e04\u0e33\u0e2a\u0e33\u0e04\u0e31\u0e0d";
const TH_QUIZ = "\u0e02\u0e49\u0e2d\u0e2a\u0e2d\u0e1a";
const TH_CARD = "\u0e01\u0e32\u0e23\u0e4c\u0e14\u0e17\u0e35\u0e48";
const TH_QUESTION = "\u0e02\u0e49\u0e2d";
const TH_ANSWER = "\u0e40\u0e09\u0e25\u0e22";
const TH_EXPLAIN = "\u0e2d\u0e18\u0e34\u0e1a\u0e32\u0e22";
const TH_ASK = "\u0e04\u0e33\u0e16\u0e32\u0e21";
const TH_REPLY = "\u0e04\u0e33\u0e15\u0e2d\u0e1a";
const TH_COPY = "\u0e04\u0e31\u0e14\u0e25\u0e2d\u0e01";
const TH_COPIED = "\u0e04\u0e31\u0e14\u0e25\u0e2d\u0e01\u0e41\u0e25\u0e49\u0e27";

function cleanMarkdown(text = "") {
  return String(text)
    .replace(/\uFFFD+/g, "")
    .replace(/^\s*#{1,6}\s*/gm, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*/g, "")
    .trim();
}

function toText(result) {
  if (!result) return "";

  if (result.type === "text") {
    return cleanMarkdown(result.raw || "");
  }

  if (result.type === "quiz") {
    return (result.data?.questions || [])
      .map(
        (q, i) =>
          `${TH_QUESTION} ${i + 1}: ${q.question}\n${q.choices.join("\n")}\n${TH_ANSWER}: ${[
            "A",
            "B",
            "C",
            "D",
          ][q.answer]}. ${q.choices[q.answer]}\n${TH_EXPLAIN}: ${q.explanation}`
      )
      .join("\n\n");
  }

  if (result.type === "flashcard") {
    return (result.data?.cards || [])
      .map((c, i) => `${TH_CARD} ${i + 1}\n${TH_ASK}: ${c.question}\n${TH_REPLY}: ${c.answer}`)
      .join("\n\n");
  }

  return "";
}

export default function ExportButton({ result, mode, fileName, lang = "th" }) {
  const [copied, setCopied] = useState(false);
  const isEnglish = lang === "en";

  const copy = async () => {
    await navigator.clipboard.writeText(toText(result));
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const print = () => {
    const text = toText(result);
    const modeLabel =
      {
        summary: isEnglish ? "Summary" : TH_SUMMARY,
        keypoints: "Key Points",
        keywords: isEnglish ? "Keywords" : TH_KEYWORDS,
        quiz: isEnglish ? "Quiz" : TH_QUIZ,
        flashcard: "Flashcard",
      }[mode] || mode;

    const date = new Date().toLocaleDateString(isEnglish ? "en-US" : "th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const lines = text
      .split("\n")
      .map((line) => cleanMarkdown(line))
      .map((line) => {
        if (!line.trim()) return "<br />";
        if (new RegExp(`^${TH_QUESTION} \\d+`).test(line) || new RegExp(`^${TH_CARD} \\d+`).test(line)) {
          return `<h3>${line}</h3>`;
        }
        if (line.startsWith(`${TH_ANSWER}:`)) return `<p class="ans">${line}</p>`;
        if (line.startsWith(`${TH_EXPLAIN}:`) || line.startsWith(`${TH_REPLY}:`)) {
          return `<p class="exp">${line}</p>`;
        }
        if (/^[-\u2022*]/.test(line) || /^\d+\./.test(line)) {
          return `<li>${line.replace(/^[-\u2022*]\s*/, "").replace(/^\d+\.\s*/, "")}</li>`;
        }
        return `<p>${line}</p>`;
      })
      .join("");

    const win = window.open("", "_blank");
    if (!win) return;

    win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"/><title>KUNextGen x AI</title>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Sarabun:wght@400;500;700&display=swap" rel="stylesheet"/>
      <style>
        body{font-family:'Sarabun',sans-serif;max-width:760px;margin:0 auto;padding:40px 32px;color:#06141B;background:#fff}
        h1{font-family:'Playfair Display',serif;color:#06141B;font-size:28px;margin:0 0 6px}
        .meta{color:#4A5C6A;font-size:13px;margin-bottom:28px;padding-bottom:16px;border-bottom:1px solid #dfe5e8}
        .badge{background:#eff3f4;color:#06141B;border-radius:999px;padding:4px 10px;font-size:12px;font-weight:700;margin-right:8px}
        h2{font-size:22px;margin:28px 0 10px}
        h3{font-size:18px;margin:22px 0 8px}
        p{margin:6px 0;line-height:1.8}
        .ans{font-weight:700;color:#11212D}
        .exp{color:#4A5C6A}
        li{margin:6px 0;line-height:1.8}
      </style>
    </head><body>
      <h1>KUNextGen x AI</h1>
      <div class="meta"><span class="badge">${modeLabel}</span>${fileName || ""} - ${date}</div>
      ${lines}
    </body></html>`);

    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 400);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
      <button className={`export-btn${copied ? " accent" : ""}`} onClick={copy} type="button">
        {copied ? (isEnglish ? "Copied" : TH_COPIED) : isEnglish ? "Copy" : TH_COPY}
      </button>
      <button className="export-btn" onClick={print} type="button">
        Export PDF
      </button>
    </div>
  );
}
