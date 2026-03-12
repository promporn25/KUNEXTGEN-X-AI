import { useState } from "react";
import { styles } from "../components/styles";
import Header from "../components/Header";
import UploadTab from "../components/UploadTab";
import ModeSelector from "../components/ModeSelector";
import SummaryResult from "../components/SummaryResult";
import QuizResult from "../components/QuizResult";

const API = "http://localhost:3001/api/summarize";

export default function Home() {
  const [activeTab, setActiveTab] = useState("upload");
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");
  const [pastedText, setPastedText] = useState("");
  const [mode, setMode] = useState("summary");
  const [difficulty, setDifficulty] = useState("medium");
  const [qCount, setQCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  const canSubmit =
    (activeTab === "upload" && file) ||
    (activeTab === "url" && url.trim().length > 5) ||
    (activeTab === "text" && pastedText.trim().length > 10);

  const handleFile = (f) => { setFile(f); setResult(null); setError(""); };
  const handleRemove = () => { setFile(null); setResult(null); };
  const handleTabChange = (id) => { setActiveTab(id); setResult(null); setError(""); };

  const handleSubmit = async () => {
    setLoading(true); setResult(null); setError("");
    try {
      const fd = new FormData();
      fd.append("mode", mode);
      fd.append("difficulty", difficulty);
      fd.append("qCount", String(qCount));

      if (activeTab === "upload" && file) fd.append("file", file);
      else if (activeTab === "url") fd.append("url", url);
      else if (activeTab === "text") fd.append("text", pastedText);

      const res = await fetch(API, { method: "POST", body: fd });
      const data = await res.json();

      if (data.error) { setError(data.error); setLoading(false); return; }

      if (mode === "quiz") {
        try {
          const clean = data.result.replace(/```json|```/g, "").trim();
          const parsed = JSON.parse(clean);
          setResult({ type: "quiz", data: parsed });
        } catch {
          setError("ไม่สามารถสร้างข้อสอบได้ กรุณาลองใหม่อีกครั้ง");
        }
      } else {
        setResult({ type: "text", raw: data.result });
      }
    } catch {
      setError("ไม่สามารถเชื่อมต่อ backend ได้ — กรุณาตรวจสอบว่ารัน server.mjs อยู่");
    }
    setLoading(false);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="app">

        <Header />

        {/* TABS */}
        <div className="tabs">
          {[
            { id: "upload", icon: "📁", label: "อัปโหลดไฟล์" },
            { id: "url",    icon: "🔗", label: "ลิงก์เว็บ" },
            { id: "text",   icon: "✏️", label: "วางข้อความ" },
          ].map(t => (
            <button
              key={t.id}
              className={`tab-btn${activeTab === t.id ? " active" : ""}`}
              onClick={() => handleTabChange(t.id)}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* INPUT AREA */}
        {activeTab === "upload" && (
          <UploadTab
            file={file}
            dragging={dragging}
            setDragging={setDragging}
            onFile={handleFile}
            onRemove={handleRemove}
          />
        )}

        {activeTab === "url" && (
          <div className="url-section">
            <label>🔗 ลิงก์เว็บที่ต้องการสรุป</label>
            <input
              className="url-input"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://example.com/article..."
            />
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 8 }}>
              * AI จะสรุปเนื้อหาจากลิงก์ที่ระบุ
            </p>
          </div>
        )}

        {activeTab === "text" && (
          <div>
            <div className="section-label">✏️ วางหรือพิมพ์เนื้อหาที่ต้องการสรุป</div>
            <textarea
              className="text-input-area"
              value={pastedText}
              onChange={e => setPastedText(e.target.value)}
              placeholder="วางข้อความ เนื้อหาสไลด์ หรือโน้ตของคุณที่นี่..."
            />
          </div>
        )}

        {/* MODE SELECTOR */}
        <ModeSelector
          mode={mode} setMode={setMode}
          difficulty={difficulty} setDifficulty={setDifficulty}
          qCount={qCount} setQCount={setQCount}
        />

        {/* SUBMIT */}
        <button className="action-btn" disabled={!canSubmit || loading} onClick={handleSubmit}>
          {loading ? "⏳ กำลังประมวลผล..." : mode === "quiz" ? "📝 สร้างข้อสอบ" : "✨ สรุปเนื้อหา"}
        </button>

        {/* ERROR */}
        {error && <div className="error-box">⚠️ {error}</div>}

        {/* LOADING */}
        {loading && (
          <div className="loading-state">
            <div className="spinner" />
            <p>AI กำลังวิเคราะห์เนื้อหา...</p>
          </div>
        )}

        {/* RESULTS */}
        {!loading && result?.type === "text" && (
          <SummaryResult result={result} mode={mode} />
        )}

        {!loading && result?.type === "quiz" && (
          <QuizResult
            result={result}
            difficulty={difficulty}
            onReset={() => setResult(null)}
          />
        )}

      </div>
    </>
  );
}
