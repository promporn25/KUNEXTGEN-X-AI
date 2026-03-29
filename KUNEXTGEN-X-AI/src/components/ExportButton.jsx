import { useState } from "react";

function cleanMarkdown(text = "") {
  return String(text)
    .replace(/^\s*#{1,6}\s*/gm, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*/g, "")
    .trim();
}

function toText(result) {
  if (!result) return "";

  if (result.type === "text") return cleanMarkdown(result.raw || "");

  if (result.type === "quiz") {
    return (result.data?.questions || [])
      .map(
        (q, i) =>
          `ข้อ ${i + 1}: ${q.question}\n${q.choices.join("\n")}\nเฉลย: ${
            ["A", "B", "C", "D"][q.answer]
          }. ${q.choices[q.answer]}\nอธิบาย: ${q.explanation}`
      )
      .join("\n\n");
  }

  if (result.type === "flashcard") {
    return (result.data?.cards || [])
      .map((c, i) => `การ์ดที่ ${i + 1}\nคำถาม: ${c.question}\nคำตอบ: ${c.answer}`)
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
        summary: isEnglish ? "Summary" : "บทสรุป",
        keypoints: "Key Points",
        keywords: isEnglish ? "Keywords" : "คำสำคัญ",
        quiz: isEnglish ? "Quiz" : "ข้อสอบ",
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
        if (/^ข้อ \d+/.test(line) || /^การ์ดที่ \d+/.test(line)) return `<h3>${line}</h3>`;
        if (line.startsWith("เฉลย:")) return `<p class="ans">${line}</p>`;
        if (line.startsWith("อธิบาย:") || line.startsWith("คำตอบ:")) {
          return `<p class="exp">${line}</p>`;
        }
        if (/^[-•*]/.test(line) || /^\d+\./.test(line)) {
          return `<li>${line.replace(/^[-•*]\s*/, "").replace(/^\d+\.\s*/, "")}</li>`;
        }
        return `<p>${line}</p>`;
      })
      .join("");

    const win = window.open("", "_blank");
    if (!win) return;

    win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"/><title>KUNextGen × AI</title>
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
      <h1>KUNextGen × AI</h1>
      <div class="meta"><span class="badge">${modeLabel}</span>${fileName || ""} · ${date}</div>
      ${lines}
    </body></html>`);

    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 400);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
      <button className={`export-btn${copied ? " accent" : ""}`} onClick={copy} type="button">
        {copied ? (isEnglish ? "✓ Copied" : "✓ คัดลอกแล้ว") : isEnglish ? "📋 Copy" : "📋 คัดลอก"}
      </button>
      <button className="export-btn" onClick={print} type="button">
        {isEnglish ? "🖨 Export PDF" : "🖨 Export PDF"}
      </button>
    </div>
  );
}
