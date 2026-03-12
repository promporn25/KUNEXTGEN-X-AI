import { useState } from "react";

export default function QuizResult({ result, difficulty, onReset }) {
  const [quizState, setQuizState] = useState({});

  const qs = result?.data?.questions || [];
  const answered = Object.keys(quizState).length;
  const score = qs.filter((q, i) => quizState[i] === q.answer).length;

  const answerQuiz = (qi, ci) => {
    if (quizState[qi] !== undefined) return;
    setQuizState(prev => ({ ...prev, [qi]: ci }));
  };

  const diffLabel = difficulty === "easy" ? "ง่าย" : difficulty === "medium" ? "ปานกลาง" : "ยาก";

  return (
    <div className="result-container">
      <div className="result-header">
        <span className="result-title">📝 ข้อสอบ {qs.length} ข้อ · ระดับ{diffLabel}</span>
        <span className="result-badge">{answered}/{qs.length} ตอบแล้ว</span>
      </div>
      <div className="result-body">

        {/* SCORE */}
        {answered === qs.length && qs.length > 0 && (
          <div className="score-bar">
            <div className="score-circle">{score}/{qs.length}</div>
            <div className="score-text">
              <h3>{score === qs.length ? "🎉 เยี่ยมมาก!" : score >= qs.length * 0.7 ? "👍 ทำได้ดี!" : "📚 ลองทบทวนอีกครั้ง"}</h3>
              <p>คะแนน {Math.round(score / qs.length * 100)}% · ถูก {score} ข้อ ผิด {qs.length - score} ข้อ</p>
            </div>
          </div>
        )}

        {/* QUESTIONS */}
        {qs.map((q, qi) => {
          const isAnswered = quizState[qi] !== undefined;
          return (
            <div key={qi} className="quiz-question">
              <div className="q-num">ข้อที่ {qi + 1}</div>
              <div className="q-text">{q.question}</div>
              <div className="q-choices">
                {q.choices.map((c, ci) => {
                  let cls = "q-choice" + (isAnswered ? " answered" : "");
                  if (isAnswered) {
                    if (ci === q.answer) cls += " show-correct correct";
                    else if (ci === quizState[qi]) cls += " wrong";
                  }
                  return (
                    <div key={ci} className={cls} onClick={() => answerQuiz(qi, ci)}>
                      <span style={{ opacity: 0.5, minWidth: 20 }}>{["A", "B", "C", "D"][ci]}.</span>
                      {c.replace(/^[A-D]\.\s*/, "")}
                    </div>
                  );
                })}
              </div>
              {isAnswered && (
                <div className="explain-box">
                  <strong>💡 คำอธิบาย</strong>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}

        <button className="reset-btn" onClick={onReset}>🔄 สร้างข้อสอบใหม่</button>
      </div>
    </div>
  );
}
