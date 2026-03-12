const MODES = [
  { id: "summary",   icon: "📋", label: "สรุปย่อ",   desc: "สรุปเนื้อหาหลัก" },
  { id: "keypoints", icon: "🎯", label: "Key Points", desc: "จุดสำคัญ" },
  { id: "keywords",  icon: "🔑", label: "คำสำคัญ",   desc: "ไฮไลต์คำสำคัญ" },
  { id: "quiz",      icon: "📝", label: "ข้อสอบ",     desc: "สร้างข้อสอบ" },
];

export default function ModeSelector({ mode, setMode, difficulty, setDifficulty, qCount, setQCount }) {
  return (
    <div className="options-panel">
      <h4>เลือกรูปแบบการสรุป</h4>
      <div className="options-grid">
        {MODES.map(m => (
          <div
            key={m.id}
            className={`option-card${mode === m.id ? " selected" : ""}`}
            onClick={() => setMode(m.id)}
          >
            <span className="option-icon">{m.icon}</span>
            <div>
              <div className="option-label">{m.label}</div>
              <div className="option-desc">{m.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {mode === "quiz" && (
        <div className="quiz-options">
          <div className="section-label" style={{ marginTop: 16 }}>ระดับความยาก</div>
          <div className="difficulty-row">
            {[["easy", "ง่าย"], ["medium", "ปานกลาง"], ["hard", "ยาก"]].map(([d, l]) => (
              <button
                key={d}
                className={`diff-btn ${d}${difficulty === d ? " sel" : ""}`}
                onClick={() => setDifficulty(d)}
              >
                {l}
              </button>
            ))}
          </div>
          <div className="count-row">
            <label>จำนวนข้อ:</label>
            <input
              className="count-input"
              type="number"
              min={3}
              max={15}
              value={qCount}
              onChange={e => setQCount(Number(e.target.value))}
            />
          </div>
        </div>
      )}
    </div>
  );
}
