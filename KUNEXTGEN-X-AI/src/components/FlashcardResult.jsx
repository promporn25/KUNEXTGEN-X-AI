import { useState } from "react";
import ExportButton from "./ExportButton";

export default function FlashcardResult({ result, onReset, fileName }) {
  const cards = result?.data?.cards || [];
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState([]);
  const [unknown, setUnknown] = useState([]);
  const [done, setDone] = useState(false);

  const handleFlip = () => setFlipped((f) => !f);

  const next = (know) => {
    if (know) setKnown((prev) => [...prev, idx]);
    else setUnknown((prev) => [...prev, idx]);

    setFlipped(false);

    setTimeout(() => {
      if (idx + 1 >= cards.length) {
        setDone(true);
      } else {
        setIdx((prev) => prev + 1);
      }
    }, 180);
  };

  const restart = () => {
    setIdx(0);
    setFlipped(false);
    setKnown([]);
    setUnknown([]);
    setDone(false);
  };

  if (!cards.length) return null;

  if (done) {
    return (
      <div className="result-container flashcard-result">
        <div className="result-header">
          <span className="result-title">🃏 Flashcard</span>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <ExportButton result={result} mode="flashcard" fileName={fileName} />
            <span className="result-badge">{cards.length} ใบ</span>
          </div>
        </div>

        <div className="result-body flashcard-finish">
          <div className="score-bar flashcard-score-bar">
            <div className="score-circle">
              {known.length}/{cards.length}
            </div>

            <div className="score-text">
              <h3>
                {known.length >= cards.length * 0.7
                  ? "เยี่ยมมาก 🎉"
                  : known.length >= cards.length * 0.4
                  ? "ทำได้ดี 👍"
                  : "ทบทวนอีกครั้ง 📚"}
              </h3>
              <p>
                จำได้ {known.length} · ยังไม่แม่น {unknown.length}
              </p>
            </div>
          </div>

          <div className="flashcard-finish-actions">
            <button className="reset-btn" onClick={restart} type="button">
              ↻ เล่นใหม่
            </button>
            <button className="reset-btn" onClick={onReset} type="button">
              + สร้างใหม่
            </button>
          </div>
        </div>
      </div>
    );
  }

  const card = cards[idx];
  const pct = ((idx + 1) / cards.length) * 100;

  return (
    <div className="result-container flashcard-result">
      <div className="result-header">
        <span className="result-title">🃏 Flashcard</span>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <ExportButton result={result} mode="flashcard" fileName={fileName} />
          <span className="result-badge">
            {idx + 1}/{cards.length}
          </span>
        </div>
      </div>

      <div className="result-body">
        <div className="progress-bar-wrap flashcard-progress-wrap">
          <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
        </div>

        <button
          type="button"
          className="flashcard-wrap"
          onClick={handleFlip}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleFlip();
            }
          }}
          aria-label={flipped ? "แสดงด้านคำถาม" : "แสดงด้านคำตอบ"}
        >
          <div className={`flashcard-inner${flipped ? " flipped" : ""}`}>
            <div className="card-hint">{flipped ? "💡 คำตอบ" : "📝 คำถาม"}</div>

            <div className="card-content">{flipped ? card.answer : card.question}</div>

            {!flipped && <div className="card-tap">แตะหรือคลิกเพื่อดูคำตอบ</div>}
          </div>
        </button>

        {flipped ? (
          <div className="card-actions">
            <button
              className="card-btn dunno"
              onClick={(e) => {
                e.stopPropagation();
                next(false);
              }}
              type="button"
            >
              🤔 ยังไม่แม่น
            </button>

            <button
              className="card-btn know"
              onClick={(e) => {
                e.stopPropagation();
                next(true);
              }}
              type="button"
            >
              ✓ จำได้แล้ว
            </button>
          </div>
        ) : (
          <div className="flashcard-helper-text">คลิกที่การ์ดเพื่อดูคำตอบ</div>
        )}
      </div>
    </div>
  );
}
