import { useEffect, useState } from "react";

const STEPS = [
  { icon: "📂", label: "อ่านและแปลงไฟล์" },
  { icon: "🔍", label: "วิเคราะห์เนื้อหา" },
  { icon: "✦", label: "ประมวลผลด้วย AI" },
  { icon: "✎", label: "สรุปและจัดรูปแบบ" },
];

export default function ProgressLoader({ mode }) {
  const [step, setStep] = useState(0);
  const [pct, setPct] = useState(0);

  const modeLabel =
    mode === "quiz"
      ? "สร้างข้อสอบ"
      : mode === "flashcard"
      ? "สร้าง Flashcard"
      : "สรุปเนื้อหา";

  useEffect(() => {
    let s = 0;
    let p = 0;

    const id = setInterval(() => {
      p = Math.min(p + 1.3, 95);
      setPct(Math.round(p));

      const threshold = ((s + 1) / STEPS.length) * 85;
      if (p >= threshold && s < STEPS.length - 1) {
        s += 1;
        setStep(s);
      }
    }, 80);

    return () => clearInterval(id);
  }, []);

  return (
    <div className="loader-card progress-loader-card">
      <div className="progress-loader-inner">
        <div className="loading-box">
          <img src="/download.gif" alt="กำลังประมวลผล" />
        </div>

        <div className="loader-title">กำลัง{modeLabel}...</div>
        <div className="loader-sub">โปรดรอสักครู่ ระบบกำลังประมวลผลข้อมูล</div>

        <div className="progress-bar-wrap loader-progress-wrap" aria-label={`progress ${pct}%`}>
          <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
        </div>

        <div className="loader-progress-number">{pct}%</div>

        <div className="step-list">
          {STEPS.map((s, i) => {
            const state = i < step ? "done" : i === step ? "active" : "pending";

            return (
              <div
                key={i}
                className={`step-row ${state}`}
                aria-current={state === "active" ? "step" : undefined}
              >
                <div className={`step-dot ${state}`}>
                  {state === "done" ? "✓" : s.icon}
                </div>

                <span className={`step-text ${state}`}>{s.label}</span>

                {state === "active" && (
                  <div className="dot-anim" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}