import { useEffect, useMemo, useState } from "react";

const TH = {
  readFile: "\u0e2d\u0e48\u0e32\u0e19\u0e41\u0e25\u0e30\u0e41\u0e1b\u0e25\u0e07\u0e44\u0e1f\u0e25\u0e4c",
  analyze: "\u0e27\u0e34\u0e40\u0e04\u0e23\u0e32\u0e30\u0e2b\u0e4c\u0e40\u0e19\u0e37\u0e49\u0e2d\u0e2b\u0e32",
  ai: "\u0e1b\u0e23\u0e30\u0e21\u0e27\u0e25\u0e1c\u0e25\u0e14\u0e49\u0e27\u0e22 AI",
  format: "\u0e2a\u0e23\u0e38\u0e1b\u0e41\u0e25\u0e30\u0e08\u0e31\u0e14\u0e23\u0e39\u0e1b\u0e41\u0e1a\u0e1a",
  createQuiz: "\u0e2a\u0e23\u0e49\u0e32\u0e07\u0e02\u0e49\u0e2d\u0e2a\u0e2d\u0e1a",
  createFlashcard: "\u0e2a\u0e23\u0e49\u0e32\u0e07 Flashcard",
  summarize: "\u0e2a\u0e23\u0e38\u0e1b\u0e40\u0e19\u0e37\u0e49\u0e2d\u0e2b\u0e32",
  wait: "\u0e42\u0e1b\u0e23\u0e14\u0e23\u0e2d\u0e2a\u0e31\u0e01\u0e04\u0e23\u0e39\u0e48 \u0e23\u0e30\u0e1a\u0e1a\u0e01\u0e33\u0e25\u0e31\u0e07\u0e1b\u0e23\u0e30\u0e21\u0e27\u0e25\u0e1c\u0e25\u0e02\u0e49\u0e2d\u0e21\u0e39\u0e25",
  working: "\u0e01\u0e33\u0e25\u0e31\u0e07",
};

const EN = {
  readFile: "Reading and parsing file",
  analyze: "Analyzing content",
  ai: "Processing with AI",
  format: "Formatting final output",
  createQuiz: "Creating quiz",
  createFlashcard: "Creating flashcards",
  summarize: "Summarizing content",
  wait: "Please wait a moment while the system processes your content.",
  working: "",
};

export default function ProgressLoader({ mode, lang = "th" }) {
  const [step, setStep] = useState(0);
  const [pct, setPct] = useState(0);

  const t = lang === "en" ? EN : TH;

  const steps = useMemo(
    () => [
      { icon: "\uD83D\uDCC2", label: t.readFile },
      { icon: "\uD83D\uDD0D", label: t.analyze },
      { icon: "\u2726", label: t.ai },
      { icon: "\u270E", label: t.format },
    ],
    [t]
  );

  const modeLabel =
    mode === "quiz"
      ? t.createQuiz
      : mode === "flashcard"
        ? t.createFlashcard
        : t.summarize;

  useEffect(() => {
    let s = 0;
    let p = 0;

    const id = setInterval(() => {
      p = Math.min(p + 1.3, 95);
      setPct(Math.round(p));

      const threshold = ((s + 1) / steps.length) * 85;
      if (p >= threshold && s < steps.length - 1) {
        s += 1;
        setStep(s);
      }
    }, 80);

    return () => clearInterval(id);
  }, [steps.length]);

  return (
    <div className="loader-card progress-loader-card">
      <div className="progress-loader-inner">
        <div className="loading-box">
          <img src="/download.gif" alt={t.wait} />
        </div>

        <div className="loader-title">
          {lang === "en" ? `${modeLabel}...` : `${t.working}${modeLabel}...`}
        </div>
        <div className="loader-sub">{t.wait}</div>

        <div className="progress-bar-wrap loader-progress-wrap" aria-label={`progress ${pct}%`}>
          <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
        </div>

        <div className="loader-progress-number">{pct}%</div>

        <div className="step-list">
          {steps.map((item, i) => {
            const state = i < step ? "done" : i === step ? "active" : "pending";

            return (
              <div
                key={i}
                className={`step-row ${state}`}
                aria-current={state === "active" ? "step" : undefined}
              >
                <div className={`step-dot ${state}`}>
                  {state === "done" ? "\u2713" : item.icon}
                </div>

                <span className={`step-text ${state}`}>{item.label}</span>

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
