import { useMemo, useState } from "react";
import ExportButton from "./ExportButton";

const TH_EASY = "\u0e07\u0e48\u0e32\u0e22";
const TH_MEDIUM = "\u0e01\u0e25\u0e32\u0e07";
const TH_HARD = "\u0e22\u0e32\u0e01";
const TH_GENERAL = "\u0e17\u0e31\u0e48\u0e27\u0e44\u0e1b";
const TH_LEVEL = "\u0e23\u0e30\u0e14\u0e31\u0e1a";
const TH_ANSWERED = "\u0e15\u0e2d\u0e1a\u0e41\u0e25\u0e49\u0e27";
const TH_GREAT = "\u0e40\u0e22\u0e35\u0e48\u0e22\u0e21\u0e21\u0e32\u0e01";
const TH_GOOD = "\u0e17\u0e33\u0e44\u0e14\u0e49\u0e14\u0e35";
const TH_REVIEW = "\u0e17\u0e1a\u0e17\u0e27\u0e19\u0e2d\u0e35\u0e01\u0e04\u0e23\u0e31\u0e49\u0e07";
const TH_CORRECT = "\u0e16\u0e39\u0e01";
const TH_WRONG = "\u0e1c\u0e34\u0e14";
const TH_QUESTION = "\u0e02\u0e49\u0e2d\u0e17\u0e35\u0e48";
const TH_EXPLAIN = "\u0e04\u0e33\u0e2d\u0e18\u0e34\u0e1a\u0e32\u0e22";
const TH_CREATE_AGAIN = "\u0e2a\u0e23\u0e49\u0e32\u0e07\u0e43\u0e2b\u0e21\u0e48";

export default function QuizResult({ result, difficulty, onReset, fileName }) {
  const [state, setState] = useState({});
  const qs = result?.data?.questions || [];
  const answered = Object.keys(state).length;

  const score = useMemo(
    () => qs.filter((q, i) => state[i] === q.answer).length,
    [qs, state]
  );

  const difficultyLabel =
    difficulty === "easy"
      ? TH_EASY
      : difficulty === "medium"
        ? TH_MEDIUM
        : difficulty === "hard"
          ? TH_HARD
          : TH_GENERAL;

  if (!qs.length) return null;

  return (
    <div className="result-container quiz-result">
      <div className="result-header quiz-result-header">
        <div className="quiz-result-title-wrap">
          <span className="result-title">{`\u0e02\u0e49\u0e2d\u0e2a\u0e2d\u0e1a ${qs.length} \u0e02\u0e49\u0e2d`}</span>
          <span className="quiz-difficulty-badge">{`${TH_LEVEL} ${difficultyLabel}`}</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <ExportButton result={result} mode="quiz" fileName={fileName} />
          <span className="result-badge">
            {answered}/{qs.length} {TH_ANSWERED}
          </span>
        </div>
      </div>

      <div className="result-body">
        {answered === qs.length && (
          <div className="score-bar quiz-score-bar">
            <div className="score-circle">
              {score}/{qs.length}
            </div>

            <div className="score-text">
              <h3>
                {score === qs.length
                  ? TH_GREAT
                  : score >= qs.length * 0.7
                    ? TH_GOOD
                    : TH_REVIEW}
              </h3>
              <p>
                {Math.round((score / qs.length) * 100)}% - {TH_CORRECT} {score} - {TH_WRONG}{" "}
                {qs.length - score}
              </p>
            </div>
          </div>
        )}

        {qs.map((q, qi) => {
          const ans = state[qi];
          const done = ans !== undefined;

          return (
            <div key={qi} className="quiz-question">
              <div className="q-num">{`${TH_QUESTION} ${qi + 1}`}</div>
              <div className="q-text">{q.question}</div>

              <div className="q-choices">
                {q.choices.map((choice, ci) => {
                  let cls = "q-choice";
                  if (done) cls += " answered";
                  if (done) {
                    if (ci === q.answer) cls += " correct";
                    else if (ci === ans) cls += " wrong";
                  }

                  return (
                    <button
                      key={ci}
                      type="button"
                      className={cls}
                      disabled={done}
                      onClick={() => !done && setState((prev) => ({ ...prev, [qi]: ci }))}
                    >
                      <span className="q-choice-letter">
                        {["A", "B", "C", "D"][ci] || ci + 1}
                      </span>
                      <span className="q-choice-text">
                        {choice.replace(/^[A-D]\.\s*/, "")}
                      </span>
                    </button>
                  );
                })}
              </div>

              {done && (
                <div className="explain-box">
                  <div className="explain-title">{TH_EXPLAIN}</div>
                  <div className="explain-text">{q.explanation}</div>
                </div>
              )}
            </div>
          );
        })}

        <div className="quiz-reset-wrap">
          <button className="reset-btn" onClick={onReset} type="button">
            {TH_CREATE_AGAIN}
          </button>
        </div>
      </div>
    </div>
  );
}
