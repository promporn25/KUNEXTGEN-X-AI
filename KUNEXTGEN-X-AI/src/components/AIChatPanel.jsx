import { useEffect, useMemo, useRef, useState } from "react";
import { apiUrl } from "../lib/api-base";

function getSuggestions(mode) {
  const common = [
    "สรุปให้อีกครั้งแบบสั้นกว่าเดิม",
    "อธิบายแบบเข้าใจง่าย",
    "ยกตัวอย่างประกอบ",
    "สรุปเป็น 5 บรรทัด",
  ];

  if (mode === "quiz") {
    return [...common, "ออกข้อสอบเพิ่มอีก 5 ข้อ", "อธิบายเฉลยแต่ละข้อ"];
  }

  if (mode === "flashcard") {
    return [...common, "สร้าง Flashcard เพิ่มอีก 5 ใบ", "แยกหัวข้อที่ควรจำจริง ๆ"];
  }

  return [...common, "เปรียบเทียบแนวคิดหลัก", "แปลเป็นภาษาอังกฤษ"];
}

function getChatTheme() {
  const isDark =
    typeof document !== "undefined" && document.body.classList.contains("dark");

  return isDark
    ? {
        panel: "rgba(18,33,45,0.96)",
        panelRaised: "rgba(37,55,69,0.92)",
        panelBody: "rgba(17,33,45,0.98)",
        assistantBubble: "rgba(6,20,27,0.92)",
        userBubble: "linear-gradient(180deg, #FFFFFF 0%, #CCD0CF 100%)",
        border: "rgba(255,255,255,0.08)",
        borderStrong: "rgba(255,255,255,0.18)",
        text: "#F3F6F6",
        textSoft: "#CCD0CF",
        textMuted: "#9BA8AB",
        accentText: "#06141B",
        inputBg: "rgba(255,255,255,0.96)",
        chipBg: "rgba(6,20,27,0.88)",
      }
    : {
        panel: "rgba(255,255,255,0.96)",
        panelRaised: "rgba(240,243,243,0.98)",
        panelBody: "rgba(248,249,249,0.99)",
        assistantBubble: "rgba(255,255,255,0.96)",
        userBubble: "linear-gradient(180deg, #FFFFFF 0%, #CCD0CF 100%)",
        border: "rgba(6,20,27,0.09)",
        borderStrong: "rgba(6,20,27,0.16)",
        text: "#06141B",
        textSoft: "#253745",
        textMuted: "#4A5C6A",
        accentText: "#06141B",
        inputBg: "#FFFFFF",
        chipBg: "rgba(255,255,255,0.98)",
      };
}

function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 4, alignItems: "center", padding: "10px 0 4px" }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "#CCD0CF",
            opacity: 0.7,
            display: "inline-block",
            animation: `chatDot 1s ease-in-out ${i * 0.18}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function cleanMarkdown(text = "") {
  return String(text)
    .replace(/^\s*#{1,6}\s*/gm, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/^\*\s*/gm, "")
    .replace(/\*\*/g, "")
    .replace(/\*/g, "");
}

function Message({ msg, theme }) {
  const isUser = msg.role === "user";
  const content = cleanMarkdown(msg.content);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isUser ? "row-reverse" : "row",
        gap: "0.6rem",
        alignItems: "flex-end",
        animation: "msgIn 0.22s ease",
      }}
    >
      {!isUser && (
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "0.6rem",
            background: "linear-gradient(180deg, #FFFFFF 0%, #CCD0CF 100%)",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.72rem",
            fontWeight: 800,
            color: "#06141B",
            fontFamily: "'Playfair Display', serif",
            marginBottom: 2,
            boxShadow: "0 10px 18px rgba(6,20,27,0.14)",
          }}
        >
          AI
        </div>
      )}

      <div
        style={{
          maxWidth: "80%",
          padding: isUser ? "0.65rem 0.95rem" : "0.8rem 1rem",
          borderRadius: isUser ? "1rem 1rem 0.25rem 1rem" : "1rem 1rem 1rem 0.25rem",
          background: isUser ? theme.userBubble : theme.assistantBubble,
          border: `1px solid ${isUser ? "rgba(255,255,255,0.76)" : theme.border}`,
          color: isUser ? theme.accentText : theme.text,
          fontSize: "0.875rem",
          lineHeight: 1.7,
          fontFamily: "'DM Sans', sans-serif",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          boxShadow: isUser
            ? "0 10px 18px rgba(255,255,255,0.14), 0 8px 18px rgba(6,20,27,0.12)"
            : "0 4px 12px rgba(0,0,0,0.08)",
          textAlign: "left",
        }}
      >
        {content}
        {msg.typing && <TypingDots />}
      </div>
    </div>
  );
}

export default function AIChatPanel({ contentText, mode }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const theme = getChatTheme();
  const suggestions = useMemo(() => getSuggestions(mode), [mode]);

  const compactContext = useMemo(() => String(contentText || "").slice(0, 3500), [contentText]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!open) return;

    setTimeout(() => inputRef.current?.focus(), 100);
    if (messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content:
            "Ask From Summary พร้อมแล้วครับ คุณถามต่อจากบทสรุปได้เลย เช่น ขอให้อธิบายง่ายขึ้น ยกตัวอย่างเพิ่ม หรือช่วยจับประเด็นสำคัญ",
        },
      ]);
    }
  }, [open, messages.length]);

  const sendMessage = async (text) => {
    const q = String(text || "").trim();
    if (!q || loading) return;

    setInput("");
    const userMsg = { role: "user", content: q };
    const typingMsg = { role: "assistant", content: "", typing: true };
    setMessages((prev) => [...prev, userMsg, typingMsg]);
    setLoading(true);

    try {
      const history = messages
        .filter((m) => !m.typing)
        .slice(-6)
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch(apiUrl("/api/chat"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: q,
          context: compactContext,
          history,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || `API error: ${response.status}`);
      }

      const reply = data?.reply || "ขออภัยครับ ตอนนี้ยังตอบไม่ได้ ลองใหม่อีกครั้งได้เลย";

      setMessages((prev) => [
        ...prev.filter((m) => !m.typing),
        { role: "assistant", content: reply },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev.filter((m) => !m.typing),
        {
          role: "assistant",
          content: `เกิดข้อผิดพลาดในการตอบ: ${error?.message || "ไม่ทราบสาเหตุ"} ลองส่งข้อความอีกครั้งได้เลยครับ`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "ล้างแชตแล้วครับ ถามใหม่ได้เลย",
      },
    ]);
  };

  if (!contentText) return null;

  return (
    <>
      <style>{`
        @keyframes chatDot {
          0%, 100% { transform: translateY(0); opacity: 0.45; }
          50% { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes msgIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes panelSlide {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .chat-toggle-btn { transition: all 0.2s ease; }
        .chat-toggle-btn:hover { transform: translateY(-2px); }
        .chat-send-btn { transition: all 0.15s ease; }
        .chat-send-btn:hover:not(:disabled) { opacity: 0.92; transform: scale(0.97); }
      `}</style>

      <div
        style={{
          marginTop: "1.5rem",
          borderRadius: "1.2rem",
          border: `1px solid ${theme.border}`,
          overflow: "hidden",
          background: theme.panel,
          boxShadow:
            "0 20px 44px rgba(6,20,27,0.10)",
          animation: "panelSlide 0.24s ease",
        }}
      >
        <button
          className="chat-toggle-btn"
          type="button"
          onClick={() => setOpen((v) => !v)}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            padding: "0.95rem 1.15rem",
            background: theme.panelRaised,
            color: theme.text,
            border: "none",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: "1rem",
          }}
        >
          <span>AI Ask From Summary</span>
          <span>{open ? "▲" : "▼"}</span>
        </button>

        {open && (
          <div
            style={{
              background: theme.panelBody,
              borderTop: `1px solid ${theme.border}`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                padding: "0.9rem 1rem",
                borderBottom: `1px solid ${theme.border}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 10,
                    display: "grid",
                    placeItems: "center",
                    background: "linear-gradient(180deg, #FFFFFF 0%, #CCD0CF 100%)",
                    color: "#06141B",
                    fontWeight: 800,
                    fontSize: 12,
                  }}
                >
                  AI
                </div>
                <div>
                  <div style={{ color: theme.text, fontWeight: 700, fontSize: 14 }}>
                    KUNextGen Chat
                  </div>
                  <div style={{ color: theme.textMuted, fontSize: 12 }}>
                    ออนไลน์ พร้อมตอบคำถาม
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={clearChat}
                style={{
                  border: `1px solid ${theme.border}`,
                  background: theme.chipBg,
                  color: theme.textSoft,
                  borderRadius: 12,
                  padding: "0.55rem 0.8rem",
                  cursor: "pointer",
                }}
              >
                ล้างแชต
              </button>
            </div>

            <div
              style={{
                padding: "1rem",
                maxHeight: 430,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "0.9rem",
              }}
            >
              {messages.map((msg, index) => (
                <Message key={`${msg.role}-${index}`} msg={msg} theme={theme} />
              ))}
              <div ref={bottomRef} />
            </div>

            <div style={{ padding: "0 1rem 1rem" }}>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  marginBottom: 12,
                }}
              >
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => sendMessage(suggestion)}
                    style={{
                      border: `1px solid ${theme.borderStrong}`,
                      background: theme.chipBg,
                      color: theme.textSoft,
                      borderRadius: 999,
                      padding: "0.6rem 0.9rem",
                      fontSize: 13,
                      cursor: "pointer",
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage(input);
                    }
                  }}
                  placeholder="ถามเกี่ยวกับเนื้อหา... (Enter ส่ง, Shift+Enter ขึ้นบรรทัด)"
                  style={{
                    flex: 1,
                    minWidth: 0,
                    height: 44,
                    borderRadius: 14,
                    border: `1px solid ${theme.borderStrong}`,
                    background: theme.inputBg,
                    color: "#06141B",
                    padding: "0 14px",
                    outline: "none",
                  }}
                />

                <button
                  className="chat-send-btn"
                  type="button"
                  disabled={!input.trim() || loading}
                  onClick={() => sendMessage(input)}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    border: `1px solid ${theme.borderStrong}`,
                    background: theme.userBubble,
                    color: theme.accentText,
                    fontWeight: 800,
                    cursor: !input.trim() || loading ? "not-allowed" : "pointer",
                    opacity: !input.trim() || loading ? 0.45 : 1,
                  }}
                >
                  ↑
                </button>
              </div>

              <div
                style={{
                  color: theme.textMuted,
                  fontSize: 11,
                  textAlign: "center",
                  marginTop: 10,
                }}
              >
                AI จะแนะนำจากเนื้อหาที่สรุปไว้ และตอบกลับเป็นภาษาไทย
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
