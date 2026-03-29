export default function StatsBar({ inputText, resultText, fileName, mode, lang = "th" }) {
  if (!resultText) return null;

  const isEnglish = lang === "en";
  const inputLen = inputText?.length || 0;
  const resultLen = resultText?.length || 0;
  const reduction = inputLen > 0 ? Math.round((1 - resultLen / inputLen) * 100) : 0;
  const wordCount = resultText.trim().split(/\s+/).length;
  const readTime = Math.max(1, Math.round(wordCount / 200));

  const modeLabel =
    {
      summary: isEnglish ? "Summary" : "บทสรุป",
      keypoints: "Key Points",
      keywords: isEnglish ? "Keywords" : "คำสำคัญ",
      quiz: isEnglish ? "Quiz" : "ข้อสอบ",
      flashcard: "Flashcard",
    }[mode] || mode;

  const stats = [
    {
      icon: "⚡",
      value: `${Math.max(0, reduction)}%`,
      label: isEnglish ? "Reduction" : "ลดเนื้อหา",
    },
    {
      icon: "⏱",
      value: isEnglish ? `${readTime} min` : `${readTime} นาที`,
      label: isEnglish ? "Reading time" : "อ่านผลสรุป",
    },
    {
      icon: "📝",
      value: wordCount.toLocaleString(),
      label: isEnglish ? "Words" : "คำในผลลัพธ์",
    },
    {
      icon: "✦",
      value: modeLabel,
      label: isEnglish ? "Mode used" : "โหมดที่ใช้",
    },
  ];

  return (
    <div className="stats-bar">
      <div className="stats-header">
        <span className="stats-title">{isEnglish ? "📈 Analysis Result" : "📈 ผลการวิเคราะห์"}</span>
        {fileName && <span className="stats-file">📄 {fileName}</span>}
      </div>

      <div className="stats-grid">
        {stats.map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
