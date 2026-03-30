import { useCallback, useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

const LOCAL_KEY = "ku_ai_history";
const MAX_ITEMS = 20;
const HISTORY_EVENT = "ku-history-updated";

function readLocalHistory() {
  try {
    const items = JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

function writeLocalHistory(items) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(items.slice(0, MAX_ITEMS)));
}

function notifyHistoryUpdated(items) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(HISTORY_EVENT, { detail: items }));
}

function getEntrySignature(item = {}) {
  return [
    item.fileName || "",
    item.mode || "",
    item.type || "",
    item.preview || "",
    item.dateLabel || "",
  ].join("|");
}

function mergeHistoryItems(primary = [], secondary = []) {
  const seen = new Set();
  return [...primary, ...secondary]
    .filter(Boolean)
    .filter((item) => {
      const signature = getEntrySignature(item);
      if (seen.has(signature)) return false;
      seen.add(signature);
      return true;
    })
    .slice(0, MAX_ITEMS);
}

async function withTimeout(promise, timeoutMs = 7000) {
  let timer;
  return Promise.race([
    promise.finally(() => clearTimeout(timer)),
    new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error("history timeout")), timeoutMs);
    }),
  ]);
}

async function mirrorLocalHistoryToCloud(uid) {
  if (!uid || !db) return;

  const localItems = readLocalHistory();
  if (!localItems.length) return;

  try {
    await Promise.all(
      localItems.map((item) =>
        addDoc(collection(db, "users", uid, "history"), {
          fileName: item.fileName || "ข้อความ",
          mode: item.mode || "summary",
          type: item.type || "text",
          result: item.result || "",
          data: item.data || null,
          sourceText: item.sourceText || "",
          sourceSections: item.sourceSections || [],
          preview: item.preview || "",
          dateLabel: item.dateLabel || "",
          createdAt: serverTimestamp(),
        })
      )
    );

    localStorage.removeItem(LOCAL_KEY);
    notifyHistoryUpdated([]);
  } catch (error) {
    console.warn("Local history sync failed", error);
  }
}

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
    id: Date.now(),
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

  const localNext = [entry, ...readLocalHistory()].slice(0, MAX_ITEMS);
  writeLocalHistory(localNext);
  notifyHistoryUpdated(localNext);

  if (!uid || !db) return;

  try {
    await addDoc(collection(db, "users", uid, "history"), {
      ...entry,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.warn("Firestore save failed", error);
  }
}

const MODE_LABEL = {
  summary: "📋 สรุปย่อ",
  keypoints: "🎯 Key Points",
  keywords: "🔑 คำสำคัญ",
  quiz: "📝 ข้อสอบ",
  flashcard: "🃏 Flashcard",
};

export default function HistoryPanel({ uid, onRestore }) {
  const [items, setItems] = useState(readLocalHistory());
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    const localItems = readLocalHistory();
    setItems(localItems);
    setLoading(Boolean(uid));

    if (!uid || !db) {
      setLoading(false);
      return;
    }

    try {
      await mirrorLocalHistoryToCloud(uid);
      const historyQuery = query(
        collection(db, "users", uid, "history"),
        orderBy("createdAt", "desc"),
        limit(MAX_ITEMS)
      );
      const snap = await withTimeout(getDocs(historyQuery));
      const cloudItems = snap.docs.map((item) => ({ id: item.id, ...item.data() }));
      setItems(mergeHistoryItems(cloudItems, readLocalHistory()));
    } catch (error) {
      console.warn("Firestore load failed", error);
      setItems(readLocalHistory());
    } finally {
      setLoading(false);
    }
  }, [uid]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const handleHistoryUpdated = (event) => {
      const nextItems = Array.isArray(event.detail) ? event.detail : readLocalHistory();
      setItems(nextItems);
    };

    window.addEventListener(HISTORY_EVENT, handleHistoryUpdated);
    return () => window.removeEventListener(HISTORY_EVENT, handleHistoryUpdated);
  }, []);

  const clearAll = async () => {
    writeLocalHistory([]);
    notifyHistoryUpdated([]);

    if (!uid || !db) {
      setItems([]);
      return;
    }

    try {
      const snap = await getDocs(collection(db, "users", uid, "history"));
      await Promise.all(
        snap.docs.map((item) => deleteDoc(doc(db, "users", uid, "history", item.id)))
      );
      setItems([]);
    } catch (error) {
      console.warn("Firestore clear failed", error);
    }
  };

  if (items.length === 0 && !loading) return null;

  return (
    <div className="history-wrap">
      <button
        className="history-toggle"
        onClick={() => {
          setOpen((prev) => !prev);
          if (!open) load();
        }}
      >
        🕐 ประวัติ ({items.length})
        <span className="history-chevron">{open ? "▴" : "▾"}</span>
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
                  <div className="history-file">📄 {item.fileName || "ข้อความ"}</div>
                  <div className="history-preview">{item.preview || "ไม่มีตัวอย่างผลลัพธ์"}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
