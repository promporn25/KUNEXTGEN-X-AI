import { useState, useEffect, useCallback } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

const LOCAL_KEY = "ku_ai_history";
const MAX_ITEMS = 20;

export async function saveHistory({
  uid,
  fileName,
  mode,
  type,
  result,
  data,
  sourceText,
  sourceSections,
}) {
  const entry = {
    fileName: fileName || "ข้อความ",
    mode,
    type,
    result: result || "",
    data: data || null,
    sourceText: sourceText || "",
    sourceSections: sourceSections || [],
    preview: result ? `${String(result).slice(0, 120)}...` : "",
    createdAt: new Date().toISOString(),
    dateLabel: new Date().toLocaleDateString("th-TH", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  if (uid) {
    try {
      await addDoc(collection(db, "users", uid, "history"), {
        ...entry,
        createdAt: serverTimestamp(),
      });
      return;
    } catch (e) {
      console.warn("Firestore save failed, falling back to localStorage", e);
    }
  }

  try {
    const prev = JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
    const next = [{ id: Date.now(), ...entry }, ...prev].slice(0, MAX_ITEMS);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(next));
  } catch {}
}

const MODE_LABEL = {
  summary: "📋 สรุปย่อ",
  keypoints: "🎯 Key Points",
  keywords: "🔑 คำสำคัญ",
  quiz: "📝 ข้อสอบ",
  flashcard: "🃏 Flashcard",
};

export default function HistoryPanel({ uid, onRestore }) {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);

    if (uid) {
      try {
        const q = query(
          collection(db, "users", uid, "history"),
          orderBy("createdAt", "desc"),
          limit(MAX_ITEMS)
        );
        const snap = await getDocs(q);
        const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setItems(rows);
        setLoading(false);
        return;
      } catch (e) {
        console.warn("Firestore load failed", e);
      }
    }

    try {
      setItems(JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]"));
    } catch {}
    setLoading(false);
  }, [uid]);

  useEffect(() => {
    load();
  }, [load]);

  const clearAll = async () => {
    if (uid) {
      try {
        const snap = await getDocs(collection(db, "users", uid, "history"));
        await Promise.all(
          snap.docs.map((d) => deleteDoc(doc(db, "users", uid, "history", d.id)))
        );
        setItems([]);
        return;
      } catch (e) {
        console.warn("Firestore clear failed", e);
      }
    }

    localStorage.removeItem(LOCAL_KEY);
    setItems([]);
  };

  if (items.length === 0 && !loading) return null;

  return (
    <div className="history-wrap">
      <button
        className="history-toggle"
        onClick={() => {
          setOpen((o) => !o);
          if (!open) load();
        }}
      >
        🕐 ประวัติ ({items.length})
        <span className="history-chevron">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="history-panel">
          <div className="history-head">
            <span className="history-head-title">ประวัติการสรุป {uid ? "☁️" : "💾"}</span>
            <button className="history-clear" onClick={clearAll}>
              ลบทั้งหมด
            </button>
          </div>

          {loading ? (
            <div
              style={{
                padding: "1rem",
                textAlign: "center",
                color: "var(--text-3)",
                fontSize: "0.8rem",
              }}
            >
              กำลังโหลด...
            </div>
          ) : (
            <div className="history-list">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="history-item"
                  onClick={() => {
                    onRestore(item);
                    setOpen(false);
                  }}
                >
                  <div className="history-item-top">
                    <span className="history-mode">{MODE_LABEL[item.mode] || item.mode}</span>
                    <span className="history-date">{item.dateLabel || item.date}</span>
                  </div>
                  <div className="history-file">📄 {item.fileName}</div>
                  <div className="history-preview">{item.preview}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
