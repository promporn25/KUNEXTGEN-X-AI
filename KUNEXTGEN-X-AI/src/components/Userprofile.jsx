import { useState, useEffect, useRef } from "react";
import { auth, db } from "../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import {
  collection, addDoc, getDocs, query, where,
  orderBy, limit, serverTimestamp, deleteDoc, doc
} from "firebase/firestore";

// ══ Save history to Firestore (cloud) ══
export async function saveCloudHistory(entry) {
  const user = auth.currentUser;
  if (!user) return;
  try {
    await addDoc(collection(db, "history"), {
      uid:      user.uid,
      mode:     entry.mode,
      type:     entry.type,
      fileName: entry.fileName || "ข้อความ",
      preview:  (entry.result || "").slice(0, 150),
      result:   entry.result || "",
      data:     entry.data ? JSON.stringify(entry.data) : null,
      createdAt: serverTimestamp(),
    });
  } catch (e) {
    console.warn("Firestore save failed:", e);
  }
}

// ══ Load cloud history ══
export async function loadCloudHistory(uid, maxItems = 20) {
  try {
    const q = query(
      collection(db, "history"),
      where("uid", "==", uid),
      orderBy("createdAt", "desc"),
      limit(maxItems)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({
      id: d.id,
      ...d.data(),
      data: d.data().data ? JSON.parse(d.data().data) : null,
      date: d.data().createdAt?.toDate()?.toLocaleDateString("th-TH", {
        day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
      }) || "เมื่อกี้",
    }));
  } catch (e) {
    console.warn("Firestore load failed:", e);
    return [];
  }
}

// ══ User Avatar ══
function Avatar({ user, size = 36 }) {
  if (user?.photoURL) {
    return (
      <img src={user.photoURL} alt="avatar"
        style={{ width:size, height:size, borderRadius:"50%", objectFit:"cover",
          border:"2px solid rgba(201,169,110,0.4)", flexShrink:0 }} />
    );
  }
  const initials = (user?.displayName || user?.email || "U")
    .split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase();
  return (
    <div style={{
      width:size, height:size, borderRadius:"50%", flexShrink:0,
      background:"linear-gradient(135deg,#c9a96e,#2d9e8a)",
      display:"flex", alignItems:"center", justifyContent:"center",
      fontFamily:"'Noto Serif Display',serif", fontWeight:700,
      fontSize:size*0.38+"px", color:"#fff",
    }}>{initials}</div>
  );
}

// ══ Main UserProfile Dropdown ══
export default function UserProfile({ onRestore }) {
  const [user, setUser]       = useState(null);
  const [open, setOpen]       = useState(false);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setUser(u));
    return unsub;
  }, []);

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const openPanel = async () => {
    setOpen(o => !o);
    if (!open && user) {
      setLoading(true);
      const h = await loadCloudHistory(user.uid);
      setHistory(h);
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setOpen(false);
  };

  const handleDeleteHistory = async (id) => {
    try {
      await deleteDoc(doc(db, "history", id));
      setHistory(prev => prev.filter(h => h.id !== id));
    } catch (e) { console.warn(e); }
  };

  if (!user) return null;

  const MODE_LABEL = {
    summary:"📋", keypoints:"🎯", keywords:"🔑", quiz:"📝", flashcard:"🃏"
  };

  return (
    <>
      <style>{`
        .profile-wrap { position:relative; }
        .profile-btn {
          display:flex; align-items:center; gap:8px;
          padding:4px 10px 4px 4px; border-radius:99px;
          border:1px solid rgba(255,255,255,0.1); background:rgba(255,255,255,0.05);
          cursor:pointer; transition:all 0.18s;
        }
        .profile-btn:hover { border-color:rgba(201,169,110,0.3); background:rgba(201,169,110,0.08); }
        .profile-name { font-size:12.5px; color:#c8c4be; font-family:'Sarabun',sans-serif; max-width:120px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .profile-panel {
          position:absolute; top:calc(100% + 8px); right:0; width:320px;
          background:rgba(19,21,26,0.97); border:1px solid rgba(255,255,255,0.1);
          border-radius:16px; box-shadow:0 20px 60px rgba(0,0,0,0.5);
          backdrop-filter:blur(20px); overflow:hidden; z-index:200;
          animation:profileIn 0.22s cubic-bezier(0.22,1,0.36,1);
        }
        @keyframes profileIn { from{opacity:0;transform:translateY(-8px) scale(0.97)} to{opacity:1;transform:none} }
        .profile-head { padding:16px; border-bottom:1px solid rgba(255,255,255,0.07); display:flex; gap:12px; align-items:center; }
        .profile-head-info { flex:1; min-width:0; }
        .profile-display-name { font-size:14px; font-weight:600; color:#eeeae3; font-family:'Sarabun',sans-serif; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .profile-email { font-size:11px; color:#4a4744; margin-top:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .profile-badge { font-size:10px; font-weight:600; background:rgba(201,169,110,0.12); color:#c9a96e; border:1px solid rgba(201,169,110,0.2); border-radius:99px; padding:2px 8px; display:inline-block; margin-top:4px; }
        .profile-section-title { font-size:10px; font-weight:600; letter-spacing:1px; color:#3a3835; text-transform:uppercase; padding:10px 16px 6px; }
        .cloud-history-item {
          display:flex; align-items:center; gap:10px; padding:10px 16px;
          cursor:pointer; transition:background 0.15s; border-bottom:1px solid rgba(255,255,255,0.04);
        }
        .cloud-history-item:hover { background:rgba(201,169,110,0.06); }
        .cloud-history-mode { font-size:15px; flex-shrink:0; }
        .cloud-history-info { flex:1; min-width:0; }
        .cloud-history-file { font-size:12px; color:#8a8680; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .cloud-history-preview { font-size:11px; color:#4a4744; margin-top:1px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .cloud-history-date { font-size:10px; color:#3a3835; flex-shrink:0; }
        .cloud-history-del { background:none; border:none; color:#3a3835; cursor:pointer; font-size:13px; padding:2px 4px; opacity:0; transition:opacity 0.15s; }
        .cloud-history-item:hover .cloud-history-del { opacity:1; }
        .cloud-history-del:hover { color:#e06b6b !important; }
        .profile-signout {
          width:100%; padding:11px 16px; border:none; background:none;
          color:#e06b6b; font-family:'Sarabun',sans-serif; font-size:13px;
          cursor:pointer; transition:background 0.15s; text-align:left;
          border-top:1px solid rgba(255,255,255,0.07); display:flex; align-items:center; gap:8px;
        }
        .profile-signout:hover { background:rgba(224,107,107,0.08); }
        .cloud-empty { padding:20px 16px; text-align:center; color:#3a3835; font-size:12px; }
        .spin-sm { display:inline-block; width:14px; height:14px; border:2px solid rgba(201,169,110,0.2); border-top-color:#c9a96e; border-radius:50%; animation:spin 0.7s linear infinite; margin:12px auto; }
        @keyframes spin { to { transform:rotate(360deg); } }
      `}</style>

      <div className="profile-wrap" ref={ref}>
        <button className="profile-btn" onClick={openPanel}>
          <Avatar user={user} size={28} />
          <span className="profile-name">{user.displayName || user.email?.split("@")[0]}</span>
          <span style={{ fontSize:"10px", color:"#4a4744", transition:"transform 0.2s", transform:open?"rotate(180deg)":"none" }}>▾</span>
        </button>

        {open && (
          <div className="profile-panel">
            {/* Header */}
            <div className="profile-head">
              <Avatar user={user} size={40} />
              <div className="profile-head-info">
                <div className="profile-display-name">{user.displayName || "ผู้ใช้งาน"}</div>
                <div className="profile-email">{user.email}</div>
                <div className="profile-badge">✦ KUNextGen Member</div>
              </div>
            </div>

            {/* Cloud history */}
            <div className="profile-section-title">☁️ ประวัติการสรุป (Cloud)</div>
            {loading ? (
              <div className="cloud-empty"><div className="spin-sm" style={{display:"block"}} /></div>
            ) : history.length === 0 ? (
              <div className="cloud-empty">ยังไม่มีประวัติการสรุป</div>
            ) : (
              <div style={{ maxHeight:220, overflowY:"auto" }}>
                {history.map(item => (
                  <div key={item.id} className="cloud-history-item"
                    onClick={() => { onRestore?.(item); setOpen(false); }}>
                    <span className="cloud-history-mode">{MODE_LABEL[item.mode] || "📄"}</span>
                    <div className="cloud-history-info">
                      <div className="cloud-history-file">📄 {item.fileName}</div>
                      <div className="cloud-history-preview">{item.preview}</div>
                    </div>
                    <span className="cloud-history-date">{item.date}</span>
                    <button className="cloud-history-del"
                      onClick={e => { e.stopPropagation(); handleDeleteHistory(item.id); }}>🗑</button>
                  </div>
                ))}
              </div>
            )}

            {/* Sign out */}
            <button className="profile-signout" onClick={handleSignOut}>
              <span>⬡</span> ออกจากระบบ
            </button>
          </div>
        )}
      </div>
    </>
  );
}