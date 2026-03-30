const TH_SUMMARY = "\u0e1a\u0e17\u0e2a\u0e23\u0e38\u0e1b";
const TH_KEYWORDS = "\u0e04\u0e33\u0e2a\u0e33\u0e04\u0e31\u0e0d";
const TH_QUIZ = "\u0e02\u0e49\u0e2d\u0e2a\u0e2d\u0e1a";
const TH_REDUCTION = "\u0e25\u0e14\u0e40\u0e19\u0e37\u0e49\u0e2d\u0e2b\u0e32";
const TH_MINUTES = "\u0e19\u0e32\u0e17\u0e35";
const TH_READING_TIME = "\u0e2d\u0e48\u0e32\u0e19\u0e1c\u0e25\u0e2a\u0e23\u0e38\u0e1b";
const TH_WORDS = "\u0e04\u0e33\u0e43\u0e19\u0e1c\u0e25\u0e25\u0e31\u0e1e\u0e18\u0e4c";
const TH_MODE = "\u0e42\u0e2b\u0e21\u0e14\u0e17\u0e35\u0e48\u0e43\u0e0a\u0e49";
const TH_ANALYSIS = "\u0e1c\u0e25\u0e01\u0e32\u0e23\u0e27\u0e34\u0e40\u0e04\u0e23\u0e32\u0e30\u0e2b\u0e4c";

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
      summary: isEnglish ? "Summary" : TH_SUMMARY,
      keypoints: "Key Points",
      keywords: isEnglish ? "Keywords" : TH_KEYWORDS,
      quiz: isEnglish ? "Quiz" : TH_QUIZ,
      flashcard: "Flashcard",
    }[mode] || mode;

  const stats = [
    {
      icon: "\u26A1",
      value: `${Math.max(0, reduction)}%`,
      label: isEnglish ? "Reduction" : TH_REDUCTION,
    },
    {
      icon: "\u23F1",
      value: isEnglish ? `${readTime} min` : `${readTime} ${TH_MINUTES}`,
      label: isEnglish ? "Reading time" : TH_READING_TIME,
    },
    {
      icon: "\uD83D\uDCDD",
      value: wordCount.toLocaleString(),
      label: isEnglish ? "Words" : TH_WORDS,
    },
    {
      icon: "\u2726",
      value: modeLabel,
      label: isEnglish ? "Mode used" : TH_MODE,
    },
  ];

  return (
    <div className="stats-bar">
      <div className="stats-header">
        <div className="stats-heading-block">
          <span className="stats-title">{isEnglish ? "Analysis Result" : TH_ANALYSIS}</span>
          {fileName && <span className="stats-file">{fileName}</span>}
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-topline">
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-label">{s.label}</div>
            </div>
            <div className="stat-value">{s.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
