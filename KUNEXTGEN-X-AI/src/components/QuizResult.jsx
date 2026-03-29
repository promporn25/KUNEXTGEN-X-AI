import { useMemo, useState } from "react";
import ExportButton from "./ExportButton";

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
      ? "ง่าย"
      : difficulty === "medium"
      ? "กลาง"
      : difficulty === "hard"
      ? "ยาก"
      : "ทั่วไป";

  if (!qs.length) return null;

  return (
    <div className="result-container quiz-result">
      <div className="result-header quiz-result-header">
        <div className="quiz-result-title-wrap">
          <span className="result-title">📝 ข้อสอบ {qs.length} ข้อ</span>
          <span className="quiz-difficulty-badge">ระดับ {difficultyLabel}</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <ExportButton result={result} mode="quiz" fileName={fileName} />
          <span className="result-badge">
            {answered}/{qs.length} ตอบแล้ว
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
                  ? "เยี่ยมมาก 🎉"
                  : score >= qs.length * 0.7
                  ? "ทำได้ดี 👍"
                  : "ทบทวนอีกครั้ง 📚"}
              </h3>
              <p>
                {Math.round((score / qs.length) * 100)}% · ถูก {score} · ผิด {qs.length - score}
              </p>
            </div>
          </div>
        )}

        {qs.map((q, qi) => {
          const ans = state[qi];
          const done = ans !== undefined;

          return (
            <div key={qi} className="quiz-question">
              <div className="q-num">ข้อที่ {qi + 1}</div>
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
                  <div className="explain-title">คำอธิบาย</div>
                  <div className="explain-text">{q.explanation}</div>
                </div>
              )}
            </div>
          );
        })}

        <div className="quiz-reset-wrap">
          <button className="reset-btn" onClick={onReset} type="button">
            ↻ สร้างใหม่
          </button>
        </div>
      </div>
    </div>
  );
}
