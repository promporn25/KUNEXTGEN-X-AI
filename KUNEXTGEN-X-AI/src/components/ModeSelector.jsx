import { useEffect, useState } from "react";

const MODE_COPY = {
  th: {
    title: "รูปแบบการสรุป",
    difficulty: "ระดับความยาก",
    questionCount: "จำนวนข้อ",
    cardCount: "จำนวนการ์ด",
    levels: {
      easy: "ง่าย",
      medium: "กลาง",
      hard: "ยาก",
    },
    modes: [
      { id: "summary", icon: "📋", label: "สรุปย่อ", desc: "เนื้อหาหลัก" },
      { id: "keypoints", icon: "🎯", label: "Key Points", desc: "จุดสำคัญ" },
      { id: "keywords", icon: "🔑", label: "คำสำคัญ", desc: "ไฮไลต์คำ" },
      { id: "quiz", icon: "📝", label: "ข้อสอบ", desc: "MCQ" },
      { id: "flashcard", icon: "🃏", label: "Flashcard", desc: "ถาม-ตอบ" },
    ],
  },
  en: {
    title: "Summary Format",
    difficulty: "Difficulty",
    questionCount: "Question Count",
    cardCount: "Card Count",
    levels: {
      easy: "Easy",
      medium: "Medium",
      hard: "Hard",
    },
    modes: [
      { id: "summary", icon: "📋", label: "Summary", desc: "Core ideas" },
      { id: "keypoints", icon: "🎯", label: "Key Points", desc: "Main takeaways" },
      { id: "keywords", icon: "🔑", label: "Keywords", desc: "Highlighted terms" },
      { id: "quiz", icon: "📝", label: "Quiz", desc: "MCQ" },
      { id: "flashcard", icon: "🃏", label: "Flashcard", desc: "Q&A cards" },
    ],
  },
};

export default function ModeSelector({
  mode,
  setMode,
  difficulty,
  setDifficulty,
  qCount,
  setQCount,
  lang = "th",
}) {
  const copy = MODE_COPY[lang] || MODE_COPY.th;
  const [countInput, setCountInput] = useState(String(qCount ?? 1));

  useEffect(() => {
    setCountInput(String(qCount ?? 1));
  }, [qCount, mode]);

  const handleCountChange = (event) => {
    const digitsOnly = event.target.value.replace(/\D/g, "").slice(0, 3);
    setCountInput(digitsOnly);
  };

  const commitCountInput = () => {
    if (!countInput) {
      setQCount(1);
      setCountInput("1");
      return;
    }

    const normalized = Math.min(100, Math.max(1, Number.parseInt(countInput, 10)));
    setQCount(normalized);
    setCountInput(String(normalized));
  };

  return (
    <div className="options-panel">
      <div className="panel-title">{copy.title}</div>

      <div className="options-grid">
        {copy.modes.map((item) => (
          <div
            key={item.id}
            className={`option-card${mode === item.id ? " selected" : ""}`}
            onClick={() => setMode(item.id)}
          >
            <span className="option-icon">{item.icon}</span>
            <div>
              <div className="option-label">{item.label}</div>
              <div className="option-desc">{item.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {(mode === "quiz" || mode === "flashcard") && (
        <div className="quiz-options">
          {mode === "quiz" && (
            <>
              <div className="section-label">{copy.difficulty}</div>

              <div className="difficulty-row">
                {[
                  ["easy", copy.levels.easy],
                  ["medium", copy.levels.medium],
                  ["hard", copy.levels.hard],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    className={`diff-btn ${value}${difficulty === value ? " sel" : ""}`}
                    onClick={() => setDifficulty(value)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </>
          )}

          <div className="count-row">
            <label className="count-label">
              {mode === "flashcard" ? copy.cardCount : copy.questionCount}
            </label>
            <input
              className="count-input"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              min={1}
              max={100}
              value={countInput}
              onChange={handleCountChange}
              onBlur={commitCountInput}
            />
          </div>
        </div>
      )}
    </div>
  );
}
