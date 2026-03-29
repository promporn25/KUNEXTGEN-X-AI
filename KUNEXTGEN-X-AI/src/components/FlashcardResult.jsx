import { useState } from "react";
import ExportButton from "./ExportButton";

const TH_CARD = "Flashcard";
const TH_CARDS = "\u0e43\u0e1a";
const TH_GREAT = "\u0e40\u0e22\u0e35\u0e48\u0e22\u0e21\u0e21\u0e32\u0e01";
const TH_GOOD = "\u0e17\u0e33\u0e44\u0e14\u0e49\u0e14\u0e35";
const TH_REVIEW = "\u0e17\u0e1a\u0e17\u0e27\u0e19\u0e2d\u0e35\u0e01\u0e04\u0e23\u0e31\u0e49\u0e07";
const TH_REMEMBERED = "\u0e08\u0e33\u0e44\u0e14\u0e49";
const TH_NOT_SURE = "\u0e22\u0e31\u0e07\u0e44\u0e21\u0e48\u0e41\u0e21\u0e48\u0e19";
const TH_PLAY_AGAIN = "\u0e40\u0e25\u0e48\u0e19\u0e43\u0e2b\u0e21\u0e48";
const TH_CREATE_AGAIN = "\u0e2a\u0e23\u0e49\u0e32\u0e07\u0e43\u0e2b\u0e21\u0e48";
const TH_SHOW_QUESTION = "\u0e41\u0e2a\u0e14\u0e07\u0e14\u0e49\u0e32\u0e19\u0e04\u0e33\u0e16\u0e32\u0e21";
const TH_SHOW_ANSWER = "\u0e41\u0e2a\u0e14\u0e07\u0e14\u0e49\u0e32\u0e19\u0e04\u0e33\u0e15\u0e2d\u0e1a";
const TH_HINT_ANSWER = "\u0e04\u0e33\u0e15\u0e2d\u0e1a";
const TH_HINT_QUESTION = "\u0e04\u0e33\u0e16\u0e32\u0e21";
const TH_TAP = "\u0e41\u0e15\u0e30\u0e2b\u0e23\u0e37\u0e2d\u0e04\u0e25\u0e34\u0e01\u0e40\u0e1e\u0e37\u0e48\u0e2d\u0e14\u0e39\u0e04\u0e33\u0e15\u0e2d\u0e1a";
const TH_CLICK_CARD = "\u0e04\u0e25\u0e34\u0e01\u0e17\u0e35\u0e48\u0e01\u0e32\u0e23\u0e4c\u0e14\u0e40\u0e1e\u0e37\u0e48\u0e2d\u0e14\u0e39\u0e04\u0e33\u0e15\u0e2d\u0e1a";

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
          <span className="result-title">{TH_CARD}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <ExportButton result={result} mode="flashcard" fileName={fileName} />
            <span className="result-badge">
              {cards.length} {TH_CARDS}
            </span>
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
                  ? TH_GREAT
                  : known.length >= cards.length * 0.4
                    ? TH_GOOD
                    : TH_REVIEW}
              </h3>
              <p>
                {TH_REMEMBERED} {known.length} - {TH_NOT_SURE} {unknown.length}
              </p>
            </div>
          </div>

          <div className="flashcard-finish-actions">
            <button className="reset-btn" onClick={restart} type="button">
              {TH_PLAY_AGAIN}
            </button>
            <button className="reset-btn" onClick={onReset} type="button">
              {TH_CREATE_AGAIN}
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
        <span className="result-title">{TH_CARD}</span>
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
          aria-label={flipped ? TH_SHOW_QUESTION : TH_SHOW_ANSWER}
        >
          <div className={`flashcard-inner${flipped ? " flipped" : ""}`}>
            <div className="card-hint">{flipped ? TH_HINT_ANSWER : TH_HINT_QUESTION}</div>

            <div className="card-content">{flipped ? card.answer : card.question}</div>

            {!flipped && <div className="card-tap">{TH_TAP}</div>}
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
              {TH_NOT_SURE}
            </button>

            <button
              className="card-btn know"
              onClick={(e) => {
                e.stopPropagation();
                next(true);
              }}
              type="button"
            >
              {TH_REMEMBERED}
            </button>
          </div>
        ) : (
          <div className="flashcard-helper-text">{TH_CLICK_CARD}</div>
        )}
      </div>
    </div>
  );
}
