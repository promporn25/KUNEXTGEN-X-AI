import { useEffect, useMemo, useState } from "react";
import { styles } from "../components/styles";
import UploadTab from "../components/UploadTab";
import ModeSelector from "../components/ModeSelector";
import SummaryResult from "../components/SummaryResult";
import QuizResult from "../components/QuizResult";
import FlashcardResult from "../components/FlashcardResult";
import ProgressLoader from "../components/ProgressLoader";
import StatsBar from "../components/StatsBar";
import HistoryPanel, { saveHistory } from "../components/HistoryPanel";
import AIChatPanel from "../components/AIChatPanel";
import { apiUrl } from "../lib/api-base";

const API = apiUrl("/api/summarize");
const MIN_TEXT_LENGTH = 3;

export default function Home({
  currentUser,
  onLogout,
  firebaseReady,
  theme: controlledTheme,
  setTheme: controlledSetTheme,
  lang: controlledLang,
  setLang: controlledSetLang,
}) {
  const [tab, setTab] = useState("upload");
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [mode, setMode] = useState("summary");
  const [diff, setDiff] = useState("medium");
  const [qCount, setQCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [themeState, setThemeState] = useState(controlledTheme || "light");
  const [langState, setLangState] = useState(controlledLang || "th");
  const [inputSnapshot, setInputSnapshot] = useState("");
  const [sourceSnapshot, setSourceSnapshot] = useState("");
  const [sourceSectionsSnapshot, setSourceSectionsSnapshot] = useState([]);
  const [resultFileName, setResultFileName] = useState("");

  const theme = controlledTheme ?? themeState;
  const setTheme = controlledSetTheme ?? setThemeState;
  const lang = controlledLang ?? langState;
  const setLang = controlledSetLang ?? setLangState;
  const isEnglish = lang === "en";

  useEffect(() => {
    document.body.classList.toggle("dark", theme === "dark");
    document.title = "KUNextGen x AI";
  }, [theme]);

  const canSubmit =
    (tab === "upload" && file) ||
    (tab === "url" && url.trim().length > 5) ||
    (tab === "text" && text.trim().length >= MIN_TEXT_LENGTH);

  const reset = () => {
    setResult(null);
    setError("");
    setResultFileName("");
  };

  const changeTab = (id) => {
    setTab(id);
    reset();
  };

  const goHome = () => {
    setLoading(false);
    setResult(null);
    setError("");
    setResultFileName("");
    setSourceSnapshot("");
    setSourceSectionsSnapshot([]);
  };

  const loadDemo = (sample) => {
    setText(sample);
    setTab("text");
    reset();
  };

  const handleRestore = (item) => {
    setResultFileName(item.fileName || "");
    if (item.type === "text") {
      setResult({ type: "text", raw: item.result });
    } else if (item.type === "quiz") {
      setResult({ type: "quiz", data: item.data });
    } else {
      setResult({ type: "flashcard", data: item.data });
    }
    setMode(item.mode);
    setSourceSnapshot(item.sourceText || "");
    setSourceSectionsSnapshot(item.sourceSections || []);
    setError("");
  };

  const submit = async () => {
    setLoading(true);
    reset();

    const submittedFileName = tab === "upload" ? file?.name || "" : "";
    const submittedInputSnapshot =
      tab === "text" ? text : tab === "url" ? url : submittedFileName;

    setInputSnapshot(submittedInputSnapshot);

    try {
      const fd = new FormData();
      fd.append("mode", mode);
      fd.append("difficulty", diff);
      fd.append("qCount", String(qCount));
      fd.append("lang", lang);

      if (tab === "upload" && file) {
        fd.append("file", file);
      } else if (tab === "url") {
        fd.append("url", url);
      } else {
        fd.append("text", text);
      }

      const res = await fetch(API, { method: "POST", body: fd });
      const data = await res.json();

      if (data.error) {
        setError(data.error);
        setLoading(false);
        return;
      }

      if (mode === "quiz") {
        if (!data.data?.questions) {
        setError("สร้างข้อสอบไม่ได้ กรุณาลองใหม่");
        } else {
          setResultFileName(submittedFileName);
          setSourceSnapshot(data.sourceText || "");
          setSourceSectionsSnapshot(data.sourceSections || []);
          setResult({ type: "quiz", data: data.data });
          saveHistory({
            fileName: submittedFileName,
            mode,
            type: "quiz",
            result: "",
            data: data.data,
            sourceText: data.sourceText || "",
            sourceSections: data.sourceSections || [],
          });
        }
      } else if (mode === "flashcard") {
        if (!data.data?.cards) {
        setError("สร้าง Flashcard ไม่ได้ กรุณาลองใหม่");
        } else {
          setResultFileName(submittedFileName);
          setSourceSnapshot(data.sourceText || "");
          setSourceSectionsSnapshot(data.sourceSections || []);
          setResult({ type: "flashcard", data: data.data });
          saveHistory({
            fileName: submittedFileName,
            mode,
            type: "flashcard",
            result: "",
            data: data.data,
            sourceText: data.sourceText || "",
            sourceSections: data.sourceSections || [],
          });
        }
      } else {
        setResultFileName(submittedFileName);
        setSourceSnapshot(data.sourceText || "");
        setSourceSectionsSnapshot(data.sourceSections || []);
        setResult({ type: "text", raw: data.result });
        saveHistory({
          fileName: submittedFileName,
          mode,
          type: "text",
          result: data.result,
          sourceText: data.sourceText || "",
          sourceSections: data.sourceSections || [],
        });
      }
    } catch (e) {
      setError("เชื่อมต่อ backend ไม่ได้ - ตรวจสอบว่า server.mjs ยังรันอยู่");
    }

    setLoading(false);
  };

  const btnLabel = loading
    ? isEnglish
      ? "Processing..."
      : "\u0e01\u0e33\u0e25\u0e31\u0e07\u0e1b\u0e23\u0e30\u0e21\u0e27\u0e25\u0e1c\u0e25..."
    : mode === "quiz"
    ? isEnglish
      ? "Create Quiz"
      : "\u0e2a\u0e23\u0e49\u0e32\u0e07\u0e02\u0e49\u0e2d\u0e2a\u0e2d\u0e1a"
    : mode === "flashcard"
    ? isEnglish
      ? "Create Flashcards"
      : "\u0e2a\u0e23\u0e49\u0e32\u0e07 Flashcard"
    : isEnglish
    ? "Summarize"
    : "\u0e2a\u0e23\u0e38\u0e1b\u0e40\u0e19\u0e37\u0e49\u0e2d\u0e2b\u0e32";

  const rawResult = result?.type === "text" ? result.raw : null;

  const chatContent =
    result?.type === "text"
      ? result.raw
      : result?.type === "quiz"
      ? (result.data?.questions || [])
          .map(
            (q, i) =>
              `\u0e02\u0e49\u0e2d ${i + 1}: ${q.question}\n\u0e40\u0e09\u0e25\u0e22: ${q.choices[q.answer]}\n\u0e2d\u0e18\u0e34\u0e1a\u0e32\u0e22: ${q.explanation}`
          )
          .join("\n\n")
      : result?.type === "flashcard"
      ? (result.data?.cards || [])
          .map((c, i) => `\u0e01\u0e32\u0e23\u0e4c\u0e14 ${i + 1}: ${c.question} \u2192 ${c.answer}`)
          .join("\n\n")
      : "";

  const hasResult = !loading && result;

  const userLabel = useMemo(() => {
    if (!currentUser) return "\u0e1c\u0e39\u0e49\u0e40\u0e22\u0e35\u0e48\u0e22\u0e21\u0e0a\u0e21";
    return currentUser.displayName || currentUser.email || "\u0e1c\u0e39\u0e49\u0e43\u0e0a\u0e49";
  }, [currentUser]);

  const avatarLetter = useMemo(() => {
    const value = currentUser?.displayName || currentUser?.email || "U";
    return value.charAt(0).toUpperCase();
  }, [currentUser]);

  return (
    <>
      <style>{styles(theme)}</style>

      <nav className="topnav">
        <button
          className="topnav-left"
          type="button"
          onClick={goHome}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
          }}
          aria-label={isEnglish ? "Go to home" : "กลับหน้าหลัก"}
        >
          <div className="topnav-badge">KU</div>

          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
            <span className="topnav-title">
              <span className="topnav-ku">KUNextGen</span>
              <span className="topnav-x"> {"x"} </span>
              <span className="topnav-ai">AI</span>
            </span>
          </div>
        </button>

        <div className="topnav-right">
          <HistoryPanel onRestore={handleRestore} />

          <button
            className="topnav-btn"
            onClick={() => setLang((v) => (v === "th" ? "en" : "th"))}
            type="button"
          >
            {lang === "th" ? "TH" : "EN"}
          </button>

          <button
            className="topnav-btn"
            onClick={() => setTheme((v) => (v === "dark" ? "light" : "dark"))}
            type="button"
          >
            {theme === "dark" ? "\u2600\uFE0F" : "\uD83C\uDF19"}
          </button>

          <div
            className="topnav-user"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "6px 8px 6px 6px",
              borderRadius: 999,
              border:
                theme === "dark"
                  ? "1px solid rgba(255,255,255,0.08)"
                  : "1px solid rgba(6,20,27,0.12)",
              background:
                theme === "dark"
                  ? "rgba(6,20,27,0.94)"
                  : "rgba(255,255,255,0.96)",
              boxShadow:
                theme === "dark"
                  ? "0 10px 24px rgba(0,0,0,0.24)"
                  : "0 10px 24px rgba(6,20,27,0.08)",
            }}
          >
            <div
              className="topnav-user-avatar"
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
                color: "#06141B",
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {avatarLetter}
            </div>

            <div
              className="topnav-user-meta"
              style={{
                display: "flex",
                flexDirection: "column",
                lineHeight: 1.1,
                minWidth: 0,
              }}
            >
              <strong
                className="topnav-user-name"
                style={{
                  fontSize: 12,
                  color: theme === "dark" ? "#F3F6F6" : "#06141B",
                }}
              >
                {userLabel}
              </strong>
              <span className="topnav-user-status" style={{ fontSize: 11, color: theme === "dark" ? "#9BA8AB" : "#4A5C6A" }}>
                {firebaseReady ? "Firebase \u2713" : ""}
              </span>
            </div>

            <button
              className="topnav-btn topnav-logout"
              onClick={onLogout}
              type="button"
              style={{ height: 30, padding: "0 12px" }}
            >
              {isEnglish ? "Log out" : "ออก"}
            </button>
          </div>
        </div>
      </nav>

      <div className="layout">
        <aside className="sidebar">
          <div className="sidebar-inner">
            <section className="flow-section">
              <div className="flow-title">{isEnglish ? "1. Choose input type" : "1. เลือกประเภทข้อมูล"}</div>
              <div className="tabs">
                {[
                  { id: "upload", icon: "\uD83D\uDCC1", label: isEnglish ? "Files" : "\u0e44\u0e1f\u0e25\u0e4c" },
                  { id: "url", icon: "\uD83D\uDD17", label: isEnglish ? "Link" : "\u0e25\u0e34\u0e07\u0e01\u0e4c" },
                  { id: "text", icon: "\u270E", label: isEnglish ? "Text" : "\u0e02\u0e49\u0e2d\u0e04\u0e27\u0e32\u0e21" },
                ].map((item) => (
                  <button
                    key={item.id}
                    className={`tab-btn${tab === item.id ? " active" : ""}`}
                    onClick={() => changeTab(item.id)}
                    type="button"
                  >
                    {item.icon} {item.label}
                  </button>
                ))}
              </div>
            </section>

            <section className="flow-section">
              <div className="flow-title">
                {tab === "upload"
                  ? isEnglish ? "2. Add your file" : "2. เพิ่มไฟล์ของคุณ"
                  : tab === "url"
                    ? isEnglish ? "2. Paste a link" : "2. วางลิงก์"
                    : isEnglish ? "2. Paste your text" : "2. วางข้อความ"}
              </div>
              <div className="flow-hint">
                {tab === "upload"
                  ? isEnglish ? "PDF, DOCX, PPTX or TXT" : "รองรับ PDF, DOCX, PPTX และ TXT"
                  : tab === "url"
                    ? isEnglish ? "Paste an article or page URL" : "วางลิงก์บทความหรือหน้าเว็บ"
                    : isEnglish ? "Short text also works on mobile" : "ข้อความสั้นก็สรุปได้บนมือถือ"}
              </div>

              {tab === "upload" && (
                <UploadTab
                  file={file}
                  dragging={dragging}
                  setDragging={setDragging}
                  lang={lang}
                  onFile={(f) => {
                    setFile(f);
                    reset();
                  }}
                  onRemove={() => {
                    setFile(null);
                    reset();
                  }}
                />
              )}

              {tab === "url" && (
                <input
                  className="url-input"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder={
                    isEnglish
                      ? "https://example.com/article..."
                      : "https://example.com/article..."
                  }
                />
              )}

              {tab === "text" && (
                <textarea
                  className="text-input-area"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={
                    isEnglish
                      ? "Paste article text, slide notes, or content here..."
                      : "\u0e27\u0e32\u0e07\u0e02\u0e49\u0e2d\u0e04\u0e27\u0e32\u0e21 \u0e40\u0e19\u0e37\u0e49\u0e2d\u0e2b\u0e32\u0e2a\u0e44\u0e25\u0e14\u0e4c \u0e2b\u0e23\u0e37\u0e2d\u0e42\u0e19\u0e49\u0e15\u0e17\u0e35\u0e48\u0e19\u0e35\u0e48..."
                  }
                />
              )}
            </section>

            <section className="flow-section">
              <div className="flow-title">{isEnglish ? "3. Choose summary format" : "3. เลือกรูปแบบสรุป"}</div>
              <ModeSelector
                mode={mode}
                setMode={setMode}
                difficulty={diff}
                setDifficulty={setDiff}
                qCount={qCount}
                setQCount={setQCount}
                lang={lang}
              />
            </section>

            {error && (
              <div
                style={{
                  padding: "12px 14px",
                  borderRadius: 14,
                  background: "var(--red-dim)",
                  border: "1px solid rgba(184,66,66,0.18)",
                  color: "var(--red)",
                  fontSize: 13,
                }}
              >
                {isEnglish ? "Error:" : "ข้อผิดพลาด:"} {error}
              </div>
            )}
          </div>

          <div className="sidebar-footer">
            <button
              className="action-btn"
              disabled={!canSubmit || loading}
              onClick={submit}
              type="button"
            >
              {btnLabel}
            </button>
          </div>
        </aside>

        <main className="main-panel">
          {!hasResult && !loading && (
            <div className="empty-state">
              <div className="empty-main">
                <h2 className="empty-title">
                  {isEnglish ? "Ready to Summarize" : "พร้อมสรุปเนื้อหา"}
                </h2>

                <p className="empty-sub">
                  {isEnglish ? (
                    <>
                      Upload a file or paste text on the left
                      <br />
                      Then choose the summary format you want
                    </>
                  ) : (
                    <>
                      อัปโหลดไฟล์หรือวางข้อความทางด้านซ้าย
                      <br />
                      แล้วเลือกรูปแบบการสรุปที่ต้องการ
                    </>
                  )}
                </p>

                <div className="empty-steps">
                  {(
                    isEnglish
                      ? [
                          "Choose a PDF, DOCX, or PPTX file, or paste text",
                          "Choose a format: Summary, Key Points, Quiz, or Flashcard",
                          "Click Summarize, then ask AI follow-up questions",
                        ]
                      : [
                          "เลือกไฟล์ PDF, DOCX, หรือ PPTX หรือวางข้อความ",
                          "เลือกรูปแบบการสรุป: สรุปย่อ, Key Points, ข้อสอบ หรือ Flashcard",
                          "กดสรุปเนื้อหา แล้วถาม AI เพิ่มเติมได้ทันที",
                        ]
                  ).map((textValue, i) => (
                    <div
                      key={i}
                      className="empty-step"
                      style={{ animationDelay: `${i * 0.08}s` }}
                    >
                      <div className="empty-step-num">{i + 1}</div>
                      <div>{textValue}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {loading && <ProgressLoader mode={mode} lang={lang} />}

          {hasResult && (
            <div className="result-wrap">
              <StatsBar
                inputText={inputSnapshot}
                resultText={rawResult}
                fileName={resultFileName}
                mode={mode}
                lang={lang}
              />

              {result.type === "text" && (
                <SummaryResult
                  result={result}
                  mode={mode}
                  fileName={resultFileName}
                  sourceText={sourceSnapshot}
                  sourceSections={sourceSectionsSnapshot}
                  initialLang={lang}
                />
              )}
              {result.type === "quiz" && (
                <QuizResult
                  result={result}
                  difficulty={diff}
                  onReset={reset}
                  fileName={resultFileName}
                />
              )}
              {result.type === "flashcard" && (
                <FlashcardResult result={result} onReset={reset} fileName={resultFileName} />
              )}

              <AIChatPanel contentText={chatContent} mode={mode} />
            </div>
          )}
        </main>
      </div>
    </>
  );
}






