import { useState, useEffect, useRef } from "react";
import { getAuth, confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";

// ── ดึง oobCode จาก URL โดยตรง ──
const oobCode = new URLSearchParams(window.location.search).get("oobCode");

/* ─── Particle Canvas ─── */
function ParticleCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const pts = Array.from({ length: 55 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.3,
      vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28,
      a: Math.random(), gold: Math.random() > 0.5,
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.gold ? "#c9a96e" : "#2d9e8a";
        ctx.globalAlpha = p.a * 0.32; ctx.fill();
      });
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 100) {
          ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = "#2d9e8a"; ctx.globalAlpha = (1 - d / 100) * 0.07;
          ctx.lineWidth = 0.5; ctx.stroke();
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }} />;
}

/* ─── Cursor Glow ─── */
function CursorGlow() {
  const ref = useRef(null);
  useEffect(() => {
    let px = 0, py = 0, mx = 0, my = 0, raf;
    const onMove = e => { mx = e.clientX; my = e.clientY; };
    window.addEventListener("mousemove", onMove);
    const animate = () => {
      px += (mx - px) * 0.12; py += (my - py) * 0.12;
      if (ref.current) ref.current.style.transform = `translate(${px - 150}px,${py - 150}px)`;
      raf = requestAnimationFrame(animate);
    };
    animate();
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);
  return (
    <div ref={ref} style={{
      position: "fixed", width: 300, height: 300, borderRadius: "50%",
      pointerEvents: "none", zIndex: 1,
      background: "radial-gradient(circle, rgba(201,169,110,0.12) 0%, transparent 70%)",
      filter: "blur(20px)",
    }} />
  );
}

/* ═══════════════════════════════════════
   MAIN
═══════════════════════════════════════ */
export default function ResetPasswordPage() {
  const [phase, setPhase]             = useState("verifying");
  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showPass, setShowPass]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");

  /* ── Verify oobCode on mount ── */
  useEffect(() => {
    if (!oobCode) { setPhase("invalid"); return; }
    const auth = getAuth();
    verifyPasswordResetCode(auth, oobCode)
      .then(em => { setEmail(em); setPhase("form"); })
      .catch(() => setPhase("invalid"));
  }, []);

  /* ── Submit new password ── */
  const handleReset = async () => {
    if (!password) { setError("กรุณากรอกรหัสผ่านใหม่"); return; }
    if (password.length < 6) { setError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"); return; }
    if (password !== confirmPass) { setError("รหัสผ่านไม่ตรงกัน"); return; }
    setError(""); setLoading(true);
    try {
      const auth = getAuth();
      await confirmPasswordReset(auth, oobCode, password);
      setPhase("success");
      setTimeout(() => { window.location.href = "/"; }, 3000);
    } catch (e) {
      const msg = {
        "auth/expired-action-code": "ลิงก์หมดอายุแล้ว กรุณาขอใหม่",
        "auth/invalid-action-code": "ลิงก์ไม่ถูกต้องหรือถูกใช้ไปแล้ว",
        "auth/weak-password":       "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร",
      }[e.code] || "เกิดข้อผิดพลาด กรุณาลองใหม่";
      setError(msg);
    } finally { setLoading(false); }
  };

  /* ── Password strength ── */
  const strength = (() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 6) s++;
    if (password.length >= 10) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  })();
  const strengthLabel = ["", "อ่อนมาก", "อ่อน", "ปานกลาง", "แข็งแรง", "แข็งแรงมาก"][strength];
  const strengthColor = ["", "#e06b6b", "#e09b6b", "#e0c96b", "#6bc9a9", "#2d9e8a"][strength];

  const goLogin = () => { window.location.href = "/"; };

  const inputStyle = {
    width: "100%", height: 46,
    background: "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(232,236,237,0.9))",
    border: "1px solid rgba(6,20,27,0.1)",
    borderRadius: 12, padding: "0 44px 0 16px",
    color: "#06141B", fontFamily: "'Sarabun',sans-serif",
    fontSize: 14, outline: "none", transition: "all 0.2s",
    boxShadow: "0 12px 24px rgba(6,20,27,0.06), inset 0 1px 0 rgba(255,255,255,0.72)",
  };
  const labelStyle = {
    fontSize: 11, fontWeight: 700, color: "#253745",
    textTransform: "uppercase", letterSpacing: 0.8,
    display: "block", marginBottom: 6,
  };

  const cardStyle = {
    background: "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(233,237,237,0.9))",
    border: "1px solid rgba(6,20,27,0.08)",
    boxShadow: "0 24px 56px rgba(6,20,27,0.14), inset 0 1px 0 rgba(255,255,255,0.8)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
  };

  const titleStyle = {
    fontFamily: "'Cormorant Garamond',serif",
    fontSize: 26,
    fontWeight: 700,
    color: "#06141B",
    marginBottom: 6,
  };

  const subTextStyle = {
    fontSize: 13,
    color: "#4A5C6A",
    lineHeight: 1.6,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,700;1,600&family=Sarabun:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          background:
            radial-gradient(circle at 15% 12%, rgba(255,255,255,0.55), transparent 20%),
            radial-gradient(circle at 80% 18%, rgba(204,208,207,0.42), transparent 24%),
            linear-gradient(180deg, #CCD0CF 0%, #9BA8AB 44%, #11212D 100%);
          overflow-x: hidden;
          overflow-y: auto;
        }
        @keyframes cardIn   { from{opacity:0;transform:translateY(24px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin     { to{transform:rotate(360deg)} }
        @keyframes gradMove { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes breathe  { 0%,100%{transform:scale(1);opacity:.6} 50%{transform:scale(1.15);opacity:1} }
        @keyframes popIn    { from{opacity:0;transform:scale(0.6)} to{opacity:1;transform:scale(1)} }
        .ku-input:focus { border-color:rgba(255,255,255,0.92) !important; background:linear-gradient(180deg,#FFFFFF,#F2F5F5) !important; box-shadow:0 0 0 4px rgba(255,255,255,0.55), 0 0 22px rgba(255,255,255,0.18), 0 12px 26px rgba(6,20,27,0.08) !important; }
        .ku-submit:hover:not(:disabled) { transform:translateY(-2px) !important; box-shadow:0 18px 40px rgba(255,255,255,0.14), 0 12px 28px rgba(0,0,0,0.22), 0 0 24px rgba(255,255,255,0.1) !important; }
        .ku-submit:disabled { opacity:0.6 !important; cursor:not-allowed !important; }
      `}</style>

      <ParticleCanvas />
      <CursorGlow />

      <div style={{
        position: "relative", zIndex: 2,
        width: "100%",
        minHeight: "100vh",
        minHeight: "100dvh",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px 14px",
        background: "radial-gradient(circle at 78% 12%, rgba(255,255,255,0.46), transparent 22%), linear-gradient(180deg, #F6F8F8 0%, #CCD0CF 100%)",
      }}>

        {/* ── VERIFYING ── */}
        {phase === "verifying" && (
          <div style={{ textAlign: "center", color: "#31414d", fontFamily: "'Sarabun',sans-serif" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", border: "2px solid rgba(6,20,27,0.12)", borderTopColor: "#06141B", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
            กำลังตรวจสอบลิงก์...
          </div>
        )}

        {/* ── INVALID ── */}
        {phase === "invalid" && (
          <div style={{
            width: "min(400px,92vw)",
            ...cardStyle,
            borderRadius: 20, padding: "32px 22px", textAlign: "center",
            animation: "cardIn 0.4s cubic-bezier(0.22,1,0.36,1) both",
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, color: "#e06b6b", marginBottom: 10 }}>ลิงก์ไม่ถูกต้อง</h2>
            <p style={{ ...subTextStyle, marginBottom: 24 }}>
              ลิงก์หมดอายุหรือถูกใช้ไปแล้ว<br />กรุณาขอรีเซ็ตรหัสผ่านใหม่อีกครั้ง
            </p>
            <button onClick={goLogin} style={{
              width: "100%", height: 44, border: "none", borderRadius: 12,
              background: "linear-gradient(180deg, #F6F8F8 0%, #CCD0CF 100%)",
              color: "#06141B", fontFamily: "'Sarabun',sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer",
              boxShadow: "0 14px 32px rgba(255,255,255,0.12), 0 10px 24px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.8)",
            }}>กลับหน้าเข้าสู่ระบบ</button>
          </div>
        )}

        {/* ── FORM ── */}
        {phase === "form" && (
          <div style={{
            width: "min(420px,92vw)",
            ...cardStyle,
            borderRadius: 24, padding: "32px 22px",
            position: "relative", overflow: "hidden",
            animation: "cardIn 0.5s cubic-bezier(0.22,1,0.36,1) both",
          }}>
            <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"linear-gradient(90deg,transparent,#CCD0CF,#9BA8AB,transparent)", opacity:0.9 }}/>
            <div style={{ position:"absolute", width:280, height:280, borderRadius:"50%", background:"radial-gradient(circle,rgba(255,255,255,0.36) 0%,transparent 72%)", top:-80, right:-80, animation:"breathe 7s ease-in-out infinite", pointerEvents:"none" }}/>

            {/* Logo */}
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:28, animation:"fadeUp 0.6s 0.1s ease both" }}>
              <div style={{ width:30, height:30, borderRadius:8, background:"linear-gradient(180deg, #CCD0CF, #9BA8AB)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Cormorant Garamond',serif", fontSize:13, fontWeight:700, color:"#06141B", boxShadow:"inset 0 1px 0 rgba(255,255,255,0.55)" }}>K</div>
              <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:17, fontWeight:700, color:"#06141B" }}>
                KUNextGen<span style={{ color:"#4A5C6A", margin:"0 4px", fontSize:11 }}>?</span>AI
              </span>
            </div>

            {/* Title */}
            <div style={{ marginBottom:24, animation:"fadeUp 0.6s 0.18s ease both" }}>
              <div style={{ width:48, height:48, borderRadius:14, background:"linear-gradient(180deg, rgba(255,255,255,0.94), rgba(212,216,215,0.88))", border:"1px solid rgba(6,20,27,0.08)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, marginBottom:14, boxShadow:"0 10px 24px rgba(6,20,27,0.08), inset 0 1px 0 rgba(255,255,255,0.82)" }}>🔐</div>
              <h2 style={{ ...titleStyle }}>
                ตั้งรหัสผ่านใหม่
              </h2>
              <p style={{ ...subTextStyle }}>
                สำหรับ <span style={{ color:"#253745", fontWeight: 600 }}>{email}</span>
              </p>
            </div>

            {/* New Password */}
            <div style={{ marginBottom:11, animation:"fadeUp 0.6s 0.26s ease both" }}>
              <label style={labelStyle}>รหัสผ่านใหม่</label>
              <div style={{ position:"relative" }}>
                <input className="ku-input" style={inputStyle}
                  type={showPass ? "text" : "password"} placeholder="••••••••"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(""); }}
                  onKeyDown={e => e.key === "Enter" && handleReset()}
                  autoFocus
                />
                <span onClick={() => setShowPass(v => !v)} style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", color:"rgba(74,92,106,0.88)", cursor:"pointer", userSelect:"none" }}>
                  {showPass ? "🙈" : "👁"}
                </span>
              </div>
              {password && (
                <div style={{ marginTop:8 }}>
                  <div style={{ display:"flex", gap:4, marginBottom:4 }}>
                    {[1,2,3,4,5].map(i => (
                      <div key={i} style={{ flex:1, height:3, borderRadius:99, background: i <= strength ? strengthColor : "rgba(74,92,106,0.12)", transition:"all 0.3s" }}/>
                    ))}
                  </div>
                  <span style={{ fontSize:11, color:strengthColor }}>{strengthLabel}</span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom:16, animation:"fadeUp 0.6s 0.33s ease both" }}>
              <label style={labelStyle}>ยืนยันรหัสผ่าน</label>
              <div style={{ position:"relative" }}>
                <input className="ku-input" style={{ ...inputStyle, borderColor: confirmPass && confirmPass !== password ? "rgba(224,107,107,0.5)" : undefined }}
                  type={showConfirm ? "text" : "password"} placeholder="••••••••"
                  value={confirmPass}
                  onChange={e => { setConfirmPass(e.target.value); setError(""); }}
                  onKeyDown={e => e.key === "Enter" && handleReset()}
                />
                <span onClick={() => setShowConfirm(v => !v)} style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", color:"rgba(74,92,106,0.88)", cursor:"pointer", userSelect:"none" }}>
                  {showConfirm ? "🙈" : "👁"}
                </span>
              </div>
              {confirmPass && confirmPass !== password && (
                <p style={{ fontSize:12, color:"#e06b6b", marginTop:5 }}>รหัสผ่านไม่ตรงกัน</p>
              )}
            </div>

            {/* Error */}
            {error && (
              <div style={{ background:"rgba(255,255,255,0.76)", border:"1px solid rgba(224,107,107,0.28)", borderRadius:10, padding:"9px 14px", marginBottom:12, fontSize:13, color:"#b34f4f", fontWeight: 600 }}>
                ⚠ {error}
              </div>
            )}

            {/* Submit */}
            <button className="ku-submit" onClick={handleReset} disabled={loading} style={{
              width:"100%", height:46, border:"none", borderRadius:13,
              background:"linear-gradient(180deg, #F6F8F8 0%, #CCD0CF 100%)",
              color:"#06141B",
              fontFamily:"'Sarabun',sans-serif", fontSize:14, fontWeight:700,
              cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8,
              transition:"all 0.25s ease", boxShadow:"0 14px 32px rgba(255,255,255,0.12), 0 10px 24px rgba(0,0,0,0.16), inset 0 1px 0 rgba(255,255,255,0.8)",
            }}>
              {loading
                ? <div style={{ width:18, height:18, borderRadius:"50%", border:"2px solid rgba(6,20,27,0.16)", borderTopColor:"#06141B", animation:"spin 0.7s linear infinite" }}/>
                : "บันทึกรหัสผ่านใหม่"
              }
            </button>

            <button onClick={goLogin} style={{
              width:"100%", marginTop:12, background:"none", border:"none",
              color:"#31414d", fontFamily:"'Sarabun',sans-serif", fontSize:13, fontWeight: 600, cursor:"pointer", transition:"color 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.color = "#06141B"}
              onMouseLeave={e => e.currentTarget.style.color = "#31414d"}
            >← กลับหน้าเข้าสู่ระบบ</button>
          </div>
        )}

        {/* ── SUCCESS ── */}
        {phase === "success" && (
          <div style={{
            width: "min(380px,92vw)",
            ...cardStyle,
            borderRadius: 24, padding: "36px 22px", textAlign: "center",
            animation: "cardIn 0.5s cubic-bezier(0.22,1,0.36,1) both",
          }}>
            <div style={{ fontSize: 56, marginBottom: 20, animation: "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both" }}>🎉</div>
            <h2 style={{ ...titleStyle, marginBottom: 10 }}>
              เปลี่ยนรหัสผ่านสำเร็จ!
            </h2>
            <p style={{ ...subTextStyle, lineHeight:1.8 }}>
              กำลังพาคุณไปหน้าเข้าสู่ระบบ<br/>
              <span style={{ color:"#5f707c", fontSize:12 }}>ในอีกไม่กี่วินาที...</span>
            </p>
            <div style={{ marginTop:24 }}>
              <div style={{ height:3, borderRadius:99, background:"rgba(74,92,106,0.1)", overflow:"hidden" }}>
                <div style={{ height:"100%", borderRadius:99, background:"linear-gradient(90deg,#CCD0CF,#9BA8AB,#4A5C6A)", animation:"gradMove 3s linear forwards", backgroundSize:"200% 100%" }}/>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}



