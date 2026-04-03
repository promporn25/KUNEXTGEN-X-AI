import { useState, useEffect, useRef } from "react";
import {
finishGoogleRedirectLogin,
loginWithEmail,
loginWithGoogle,
registerWithEmail,
} from "./firebase";
import {
getAuth,
sendPasswordResetEmail,
} from "firebase/auth";
/* ─── Animated particle canvas ─── */
function ParticleCanvas() {
const ref = useRef(null);
useEffect(() => {
const canvas = ref.current;
if (!canvas) return;
const ctx = canvas.getContext("2d");
const resize = () => {
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
};
resize();
window.addEventListener("resize", resize);
const pts = Array.from({ length: 42 }, () => ({
x: Math.random() * window.innerWidth,
y: Math.random() * window.innerHeight,
r: Math.random() * 1.6 + 0.4,
vx: (Math.random() - 0.5) * 0.18,
vy: (Math.random() - 0.5) * 0.18,
a: Math.random() * 0.38 + 0.08,
light: Math.random() > 0.5,
}));
let raf;
const draw = () => {
ctx.clearRect(0, 0, canvas.width, canvas.height);
pts.forEach((p) => {
p.x += p.vx;
p.y += p.vy;
if (p.x < 0) p.x = canvas.width;
if (p.x > canvas.width) p.x = 0;
if (p.y < 0) p.y = canvas.height;
if (p.y > canvas.height) p.y = 0;
ctx.beginPath();
ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
ctx.fillStyle = p.light ? "#CCD0CF" : "#9BA8AB";
ctx.globalAlpha = p.a * 0.3;
ctx.fill();
});
ctx.globalAlpha = 1;
raf = requestAnimationFrame(draw);
};
draw();
return () => {
cancelAnimationFrame(raf);
window.removeEventListener("resize", resize);
};
}, []);
return (
<canvas
ref={ref}
style={{
position: "fixed",
inset: 0,
zIndex: 0,
pointerEvents: "none",
width: "100%",
height: "100%",
}}
/>
);
}
/* ─── Google icon SVG ─── */
function GoogleIcon() {
return (
<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
<path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14
<path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837
<path fill="#FBBC05" d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706
<path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.4
</svg>
);
}
function getErrorMessage(code, fallbackMessage) {
switch (code) {
case "auth/user-not-found": return "ไ"พบ%ญ'(ใ*+";
case "auth/wrong-password":
case "auth/invalid-credential": return ",เมลห1อร4ส6านไ"9ก;อง";
case "auth/email-already-in-use": return ",เมล+9กใ*งานแ>ว";
case "auth/invalid-email": return "@ปแบบ,เมลไ"9ก;อง";
case "auth/weak-password": return "ร4ส6าน;องBอCางDอย 6 FวGกษร";
case "auth/too-many-requests": return "BการลองเIาJระบบหลายคMงเNนไป กOณาลองให"ภายหRง";
case "auth/popup-closed-by-user": return "SณTดหDาVางเIาJระบบ Google WอนXเYนการเสZจ";
default: return fallbackMessage || "เNดIอ\ดพลาด กOณาลองให"";
}
}
function getResetPasswordUrl() {
const configuredBase = import.meta.env.VITE_PUBLIC_APP_URL?.trim();
const baseUrl = configuredBase || window.location.origin;
return `${baseUrl.replace(/\/$/, "")}/reset-password`;
}
export default function LoginPage({ onAuthSuccess }) {
const [mode, setMode] = useState("login");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [name, setName] = useState("");
const [showPw, setShowPw] = useState(false);
const [loading, setLoading] = useState(false);
const [handingOff, setHandingOff] = useState(false);
const [error, setError] = useState("");
const [success, setSuccess] = useState("");
useEffect(() => {
let ignore = false;
async function completeRedirectLogin() {
const credential = await finishGoogleRedirectLogin();
if (!ignore && credential?.user) completeAuthSuccess(credential.user);
}
completeRedirectLogin();
return () => { ignore = true; };
}, [onAuthSuccess]);
const clearMessages = () => { setError(""); setSuccess(""); };
const completeAuthSuccess = (user) => {
if (!user) return;
setHandingOff(true);
setError("");
setSuccess("");
onAuthSuccess?.(user);
};
const switchMode = (next) => {
setMode(next);
setError("");
setSuccess("");
if (next === "reset") setPassword("");
};
const handleEmailAuth = async () => {
clearMessages();
if (!email.trim()) { setError("กOณากรอก,เมล"); return; }
if (mode === "register" && !name.trim()) { setError("กOณากรอก]อ-นามส^ล"); return; }
if (mode !== "reset" && password.length < 6) { setError("ร4ส6านอCางDอย 6 FวGกษร"); return;
setLoading(true);
try {
if (mode === "login") {
const credential = await loginWithEmail({ email, password });
completeAuthSuccess(credential.user);
} else if (mode === "register") {
const cred = await registerWithEmail({ name, email, password });
completeAuthSuccess(cred.user);
} else {
const auth = getAuth();
await sendPasswordResetEmail(auth, email, { url: getResetPasswordUrl(), handleCodeInA
setSuccess("_ง`งabเcตร4ส6านไปeง,เมลของSณแ>ว");
}
} catch (e) {
setHandingOff(false);
setError(getErrorMessage(e?.code, e?.message));
} finally {
setLoading(false);
}
};
const handleGoogle = async () => {
clearMessages();
setLoading(true);
try {
const credential = await loginWithGoogle();
if (credential?.user) completeAuthSuccess(credential.user);
} catch (e) {
setHandingOff(false);
setError(getErrorMessage(e?.code, e?.message || "Google sign-in failed"));
} finally {
setLoading(false);
}
};
const submitLabel = loading ? "gRงXเYนการ..." : mode === "login" ? "เIาJระบบ" : mode === "r
return (
<>
<style>{`
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&
:root {
--bg-main: #06141B;
--bg-1: #11212D;
--bg-2: #253745;
--bg-3: #4A5C6A;
--bg-4: #9BA8AB;
--bg-5: #CCD0CF;
--text-main: #EEF3F4;
--text-soft: #AAB6BA;
--text-dim: #80919A;
--white-soft: #F6F8F8;
--white-pure: #FFFFFF;
--stroke: rgba(255,255,255,0.08);
--stroke-soft: rgba(255,255,255,0.05);
--danger: #ffb7b7;
--danger-bg: rgba(255,120,120,0.10);
--success: #e8f1ee;
--success-bg: rgba(204,208,207,0.12);
--shadow-xl: 0 28px 80px rgba(0,0,0,0.48);
--shadow-lg: 0 20px 50px rgba(0,0,0,0.34);
--shadow-inset: inset 0 1px 0 rgba(255,255,255,0.03);
--radius-2xl: 32px;
--radius-xl: 24px;
--radius-lg: 18px;
--radius-md: 16px;
--radius-sm: 12px;
}
* { box-sizing: border-box; }
html, body, #root { min-height: 100%; margin: 0; }
body {
font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", san
background:
radial-gradient(circle at 15% 12%, rgba(255,255,255,0.55), transparent 20%),
radial-gradient(circle at 80% 18%, rgba(204,208,207,0.42), transparent 24%),
linear-gradient(180deg, #CCD0CF 0%, #9BA8AB 44%, #11212D 100%);
color: #06141B;
}
/* ── BASE LAYOUT ── */
.login-page {
min-height: 100vh;
min-height: 100dvh;
position: relative;
overflow: hidden;
display: grid;
place-items: center;
padding: 28px;
isolation: isolate;
}
.login-orb {
position: fixed;
border-radius: 999px;
filter: blur(90px);
opacity: 0.32;
pointer-events: none;
z-index: 0;
}
.login-orb-1 { width: 320px; height: 320px; left: -70px; top: -40px; background: rgba
.login-orb-2 { width: 280px; height: 280px; right: -50px; top: 22%; background: rgba(
.login-orb-3 { width: 340px; height: 340px; left: 12%; bottom: -120px; background: rg
/* ── CARD ── */
.login-card {
position: relative;
z-index: 2;
width: min(980px, 100%);
min-height: 620px;
display: grid;
grid-template-columns: 1fr 0.94fr;
border-radius: var(--radius-2xl);
overflow: hidden;
border: 1px solid var(--stroke);
background: linear-gradient(90deg, #06141B 0 54%, #F6F8F8 54% 100%);
box-shadow: var(--shadow-xl), inset 0 1px 0 rgba(255,255,255,0.28);
backdrop-filter: blur(10px);
-webkit-backdrop-filter: blur(10px);
}
/* ── LEFT PANEL ── */
.login-left {
position: relative;
padding: 30px;
background:
radial-gradient(circle at 20% 15%, rgba(255,255,255,0.05), transparent 20%),
linear-gradient(180deg, #06141B 0%, #11212D 60%, #06141B 100%);
border-right: 1px solid rgba(255,255,255,0.06);
display: flex;
flex-direction: column;
justify-content: space-between;
overflow: hidden;
}
/* ── RIGHT PANEL ── */
.login-right {
position: relative;
padding: 24px;
display: flex;
align-items: center;
justify-content: center;
background:
radial-gradient(circle at 80% 10%, rgba(255,255,255,0.45), transparent 20%),
linear-gradient(180deg, #F6F8F8 0%, #CCD0CF 100%);
}
.login-right-inner {
width: 100%;
max-width: 378px;
}
.login-ring, .login-illus-ring {
position: absolute;
border-radius: 999px;
border: 1px solid rgba(255,255,255,0.08);
}
.login-ring-1 { width: 340px; height: 340px; top: -140px; right: -100px; }
.login-ring-2 { width: 460px; height: 460px; bottom: -240px; left: -160px; }
.login-ring-3 { width: 180px; height: 180px; top: 120px; left: 56%; }
/* ── BRAND ── */
.login-brand {
display: flex;
align-items: center;
gap: 14px;
position: relative;
z-index: 2;
}
.login-brand-badge {
width: 50px; height: 50px;
border-radius: 16px;
display: grid;
place-items: center;
background: linear-gradient(180deg, #CCD0CF, #9BA8AB);
color: #06141B;
font-weight: 800;
font-size: 20px;
box-shadow: 0 10px 24px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.55);
}
.login-brand-name { font-size: 22px; font-weight: 800; letter-spacing: -0.03em; color
.login-brand-x { color: rgba(255,255,255,0.45); }
.login-brand-ai { color: var(--bg-5); }
/* ── HERO ── */
.login-hero { position: relative; z-index: 2; max-width: 500px; margin-top: 14px; }
.login-illus {
width: 156px; height: 156px;
margin-bottom: 20px;
position: relative;
display: grid;
place-items: center;
}
.login-illus-ring { inset: 0; opacity: 0.92; }
.login-illus .login-illus-ring:nth-child(2) { inset: 16px; border-color: rgba(155,168
.login-illus .login-illus-ring:nth-child(3) { inset: 32px; border-color: rgba(204,208
.login-illus-core {
width: 70px; height: 70px;
border-radius: 50%;
display: grid;
place-items: center;
font-size: 30px;
background: linear-gradient(180deg, #CCD0CF, #9BA8AB);
color: #06141B;
border: 1px solid rgba(255,255,255,0.18);
box-shadow: 0 18px 40px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.48);
}
.login-tagline {
font-size: clamp(32px, 4.1vw, 46px);
line-height: 1.02;
font-weight: 800;
letter-spacing: -0.05em;
margin-bottom: 12px;
color: #F5F8F8;
}
.login-tagline em { font-style: normal; color: #8EB69B; text-shadow: 0 0 18px rgba(25
.login-sub { color: var(--text-soft); font-size: 15px; line-height: 1.72; margin: 0 0
.login-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.login-chip {
display: inline-flex;
align-items: center;
gap: 8px;
padding: 8px 12px;
border-radius: 999px;
background: rgba(255,255,255,0.05);
border: 1px solid rgba(255,255,255,0.08);
color: #EEF3F4;
font-size: 12px;
font-weight: 600;
box-shadow: inset 0 1px 0 rgba(255,255,255,0.03);
}
/* ── STATS ── */
.login-stats {
position: relative;
z-index: 2;
display: grid;
grid-template-columns: repeat(2, minmax(0, 1fr));
gap: 12px;
margin-top: 22px;
max-width: 390px;
}
.login-stat {
background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.035)
border: 1px solid rgba(255,255,255,0.08);
border-radius: 20px;
padding: 16px;
box-shadow: inset 0 1px 0 rgba(255,255,255,0.03);
}
.login-stat-val { font-size: 24px; font-weight: 800; color: #CCD0CF; margin-bottom: 4
.login-stat-lbl { color: var(--text-soft); font-size: 12px; }
/* ── FORM ELEMENTS ── */
.login-tab-switch {
width: 100%;
display: grid;
grid-template-columns: 1fr 1fr;
gap: 8px;
padding: 6px;
border-radius: 20px;
background: linear-gradient(180deg, rgba(255,255,255,0.62), rgba(255,255,255,0.40))
border: 1px solid rgba(6,20,27,0.08);
box-shadow: 0 14px 28px rgba(6,20,27,0.08), inset 0 1px 0 rgba(255,255,255,0.6);
margin-bottom: 26px;
}
.login-switch-btn {
border: 0; outline: 0;
background: transparent;
color: #4A5C6A;
min-height: 54px;
padding: 0 18px;
border-radius: 16px;
font-weight: 700;
font-size: 14px;
cursor: pointer;
transition: all 0.22s ease;
display: flex;
align-items: center;
justify-content: center;
gap: 8px;
}
.login-switch-btn:hover { color: #06141B; background: rgba(255,255,255,0.72); }
.login-switch-btn.active {
background: linear-gradient(180deg, #CCD0CF, #BFC5C4);
color: #06141B;
box-shadow: 0 10px 24px rgba(255,255,255,0.12), inset 0 1px 0 rgba(255,255,255,0.6)
transform: translateY(-1px);
}
.login-form-heading { font-size: 30px; font-weight: 800; letter-spacing: -0.03em; mar
.login-form-sub { color: #31414d; font-size: 14px; line-height: 1.7; margin-bottom: 2
.error-box {
padding: 12px 14px;
background: rgba(255,241,241,0.92);
border: 1px solid rgba(224,107,107,0.24);
border-radius: var(--radius-sm);
color: #b34f4f;
font-size: 13px;
font-weight: 600;
line-height: 1.6;
margin-bottom: 2px;
}
.success-box {
padding: 12px 14px;
background: rgba(255,255,255,0.76);
border: 1px solid rgba(74,92,106,0.16);
border-radius: var(--radius-sm);
color: #31414d;
font-size: 13px;
font-weight: 600;
line-height: 1.6;
margin-bottom: 2px;
}
.field { margin-bottom: 16px; }
.field-label { display: block; margin-bottom: 8px; font-size: 13px; color: #1d2c37; f
.field-wrap { position: relative; }
.field-input {
width: 100%;
height: 56px;
border-radius: 18px;
border: 1px solid rgba(6,20,27,0.1);
background: linear-gradient(180deg, rgba(255,255,255,0.96), rgba(204,208,207,0.86))
color: #06141B;
padding: 0 50px 0 16px;
outline: none;
font-size: 15px;
transition: all 0.22s ease;
box-shadow: 0 12px 24px rgba(6,20,27,0.06), inset 0 1px 0 rgba(255,255,255,0.7);
}
.field-input::placeholder { color: rgba(74,92,106,0.7); }
.field-input:focus {
border-color: rgba(255,255,255,0.92);
background: linear-gradient(180deg, #FFFFFF, #F2F5F5);
box-shadow: 0 0 0 4px rgba(255,255,255,0.55), 0 0 22px rgba(255,255,255,0.18), 0 12
}
.field-icon, .field-eye {
position: absolute;
top: 50%;
right: 14px;
transform: translateY(-50%);
color: rgba(74,92,106,0.9);
}
.field-eye { border: 0; background: transparent; cursor: pointer; font-size: 18px; pa
.forgot-row { display: flex; justify-content: flex-end; margin-top: -4px; margin-bott
.forgot-link, .login-footer a { color: #1c2b36; text-decoration: none; font-weight: 6
.forgot-link:hover, .login-footer a:hover { opacity: 0.85; text-decoration: underline
.submit-btn {
width: 100%;
height: 56px;
border: 0;
border-radius: 18px;
cursor: pointer;
font-weight: 800;
font-size: 15px;
color: #06141B;
background: linear-gradient(180deg, #F6F8F8 0%, #CCD0CF 100%);
box-shadow: 0 14px 32px rgba(255,255,255,0.10), 0 8px 24px rgba(0,0,0,0.24), transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease, opacity
inset
}
.submit-btn:hover:not(:disabled) {
transform: translateY(-2px);
filter: brightness(1.02);
box-shadow: 0 18px 40px rgba(255,255,255,0.14), 0 12px 28px rgba(0,0,0,0.28), 0 0 2
}
.submit-btn:active:not(:disabled) { transform: translateY(0); }
.submit-btn:disabled { opacity: 0.72; cursor: not-allowed; }
.login-divider {
display: flex;
align-items: center;
gap: 12px;
color: var(--text-dim);
font-size: 12px;
text-transform: uppercase;
letter-spacing: 0.12em;
margin: 20px 0;
}
.login-divider::before, .login-divider::after { content: ""; flex: 1; height: 1px; ba
.google-btn {
width: 100%;
height: 56px;
border-radius: 18px;
border: 1px solid rgba(255,255,255,0.08);
background: linear-gradient(180deg, #DCE1E1 0%, #B8C0C1 100%);
color: #06141B;
display: inline-flex;
align-items: center;
justify-content: center;
gap: 10px;
font-size: 15px;
font-weight: 800;
cursor: pointer;
transition: all 0.22s ease;
box-shadow: 0 10px 24px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.75);
}
.google-btn:hover:not(:disabled) {
transform: translateY(-2px);
background: linear-gradient(180deg, #F6F8F8 0%, #CCD0CF 100%);
box-shadow: 0 16px 34px rgba(255,255,255,0.10), 0 12px 28px rgba(0,0,0,0.24), 0 0 1
}
.google-btn:disabled { opacity: 0.72; cursor: not-allowed; }
.ku-note {
margin-top: 16px;
padding: 13px 14px;
border-radius: 16px;
background: rgba(255,255,255,0.72);
border: 1px solid rgba(6,20,27,0.08);
color: #253745;
font-size: 13px;
line-height: 1.6;
box-shadow: inset 0 1px 0 rgba(255,255,255,0.03);
}
.login-footer { margin-top: 18px; text-align: center; font-size: 14px; color: #31414d
.back-btn {
display: inline-flex;
align-items: center;
gap: 8px;
margin-bottom: 18px;
border: 0;
background: transparent;
color: #14232d;
cursor: pointer;
padding: 0;
font-size: 13px;
font-weight: 600;
}
.back-btn:hover { color: #06141B; }
/* ════════════════════════════════════════
RESPONSIVE BREAKPOINTS
════════════════════════════════════════ */
/* ── LARGE DESKTOP 1281px+ ── */
/* (base styles apply) */
/* ── DESKTOP 1025-1280px ── */
@media (min-width: 1025px) and (max-width: 1280px) {
.login-page { padding: 16px; }
.login-card { width: min(920px, 100%); min-height: 580px; grid-template-columns: 0.
.login-left { padding: 24px 22px; }
.login-right { padding: 20px 22px; }
.login-right-inner { max-width: 360px; }
.login-brand-badge { width: 44px; height: 44px; font-size: 18px; }
.login-brand-name { font-size: 19px; }
.login-illus { width: 148px; height: 148px; margin-bottom: 18px; }
.login-illus-core { width: 64px; height: 64px; font-size: 28px; }
.login-tagline { font-size: 36px; max-width: 8.2ch; margin-bottom: 10px; }
.login-sub { font-size: 13px; line-height: 1.58; margin-bottom: 14px; }
.login-chips { gap: 7px; }
.login-chip { padding: 7px 10px; font-size: 11px; }
.login-stats { gap: 8px; max-width: 330px; }
.login-stat { padding: 12px; }
.login-stat-val { font-size: 22px; }
.login-tab-switch { margin-bottom: 20px; }
.login-switch-btn { min-height: 50px; font-size: 13px; }
.field-input, .submit-btn, .google-btn { height: 50px; }
}
/* ── TABLET / iPad 768-1024px ── */
@media (min-width: 768px) and (max-width: 1024px) {
.login-page {
padding: 20px 16px;
display: flex;
align-items: center;
justify-content: center;
min-height: 100dvh;
}
.login-card {
width: 100%;
max-width: 760px;
min-height: auto;
grid-template-columns: 1fr 1.1fr;
border-radius: 26px;
}
.login-left {
padding: 26px 22px;
border-right: 1px solid rgba(255,255,255,0.06);
border-bottom: none;
justify-content: flex-start;
gap: 18px;
}
.login-right { padding: 20px 18px; }
.login-right-inner { max-width: 310px; }
.login-brand-badge { width: 40px; height: 40px; font-size: 16px; border-radius: 12p
.login-brand-name { font-size: 17px; }
.login-illus { width: 100px; height: 100px; margin-bottom: 12px; }
.login-illus .login-illus-ring:nth-child(2) { inset: 12px; }
.login-illus .login-illus-ring:nth-child(3) { inset: 24px; }
.login-illus-core { width: 48px; height: 48px; font-size: 22px; }
.login-tagline { font-size: clamp(20px, 2.8vw, 27px); line-height: 1.08; margin-bot
.login-sub { font-size: 12.5px; line-height: 1.56; margin-bottom: 10px; }
.login-chips { gap: 6px; }
.login-chip { padding: 5px 9px; font-size: 10.5px; gap: 6px; }
.login-stats { gap: 8px; margin-top: 12px; max-width: 100%; }
.login-stat { padding: 11px 13px; border-radius: 15px; }
.login-stat-val { font-size: 19px; margin-bottom: 2px; }
.login-stat-lbl { font-size: 10.5px; }
.login-hero { margin-top: 0; }
.login-tab-switch { margin-bottom: 16px; padding: 5px; border-radius: 17px; }
.login-switch-btn { min-height: 44px; font-size: 12.5px; border-radius: 13px; paddi
.login-form-heading { font-size: 22px; margin-bottom: 5px; }
.login-form-sub { font-size: 12.5px; margin-bottom: 16px; }
.field { margin-bottom: 11px; }
.field-label { font-size: 12px; margin-bottom: 6px; }
.field-input { height: 48px; font-size: 14px; border-radius: 14px; }
.submit-btn { height: 48px; font-size: 14px; border-radius: 14px; }
.google-btn { height: 48px; font-size: 14px; border-radius: 14px; }
.login-divider { margin: 12px 0; font-size: 11px; }
.forgot-row { margin-bottom: 12px; }
.login-footer { margin-top: 12px; font-size: 12.5px; }
}
/* ── SMALL TABLET / Large phone landscape 641-767px ── */
@media (min-width: 641px) and (max-width: 767px) {
.login-page {
padding: 16px 14px;
display: flex;
align-items: center;
justify-content: center;
}
.login-card {
width: 100%;
max-width: 680px;
min-height: auto;
grid-template-columns: 1fr 1.1fr;
border-radius: 22px;
}
.login-left {
padding: 22px 18px;
border-right: 1px solid rgba(255,255,255,0.06);
border-bottom: none;
justify-content: flex-start;
gap: 14px;
}
.login-right { padding: 18px 16px; }
.login-right-inner { max-width: 280px; }
.login-brand-badge { width: 38px; height: 38px; font-size: 15px; border-radius: 11p
.login-brand-name { font-size: 16px; }
.login-illus { width: 86px; height: 86px; margin-bottom: 10px; }
.login-illus .login-illus-ring:nth-child(2) { inset: 10px; }
.login-illus .login-illus-ring:nth-child(3) { inset: 20px; }
.login-illus-core { width: 42px; height: 42px; font-size: 19px; }
.login-tagline { font-size: clamp(18px, 3vw, 24px); line-height: 1.1; margin-bottom
.login-sub { font-size: 12px; line-height: 1.55; margin-bottom: 10px; }
.login-chips { gap: 5px; }
.login-chip { padding: 5px 8px; font-size: 10px; gap: 5px; }
.login-chip:nth-child(n+6) { display: none; }
.login-stats { gap: 7px; margin-top: 10px; }
.login-stat { padding: 10px 11px; border-radius: 14px; }
.login-stat-val { font-size: 18px; }
.login-stat-lbl { font-size: 10px; }
.login-hero { margin-top: 0; }
.login-tab-switch { margin-bottom: 14px; padding: 4px; border-radius: 15px; }
.login-switch-btn { min-height: 40px; font-size: 12px; border-radius: 12px; padding
.login-form-heading { font-size: 20px; margin-bottom: 4px; }
.login-form-sub { font-size: 12px; margin-bottom: 14px; }
.field { margin-bottom: 10px; }
.field-label { font-size: 11.5px; margin-bottom: 5px; }
.field-input { height: 46px; font-size: 13px; border-radius: 13px; }
.submit-btn { height: 46px; font-size: 13px; border-radius: 13px; }
.google-btn { height: 46px; font-size: 13px; border-radius: 13px; }
.login-divider { margin: 11px 0; font-size: 10.5px; }
.forgot-row { margin-bottom: 10px; }
.login-footer { margin-top: 11px; font-size: 12px; }
}
/* ── MOBILE < 640px ── */
@media (max-width: 640px) {
.login-page {
padding: 14px;
min-height: 100dvh;
display: block;
}
.login-card {
border-radius: 0;
width: 100%;
background: transparent;
box-shadow: none;
border: none;
overflow: visible;
grid-template-columns: 1fr;
min-height: auto;
}
.login-left {
padding: 18px 18px 82px;
border-radius: 28px;
border-right: 0;
min-height: 0;
justify-content: flex-start;
gap: 18px;
box-shadow: 0 24px 44px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.05);
}
.login-right {
margin: -54px 10px 0;
padding: 24px;
border-radius: 24px;
background:
radial-gradient(circle at top right, rgba(255,255,255,0.7), transparent 28%),
linear-gradient(180deg, #f9fbfb 0%, #e2e8e8 100%);
box-shadow: 0 18px 42px rgba(6,20,27,0.16), inset 0 1px 0 rgba(255,255,255,0.88);
display: flex;
align-items: flex-start;
justify-content: center;
}
.login-right-inner, .login-hero, .login-stats { max-width: none; }
.login-brand { gap: 12px; }
.login-brand-badge { width: 44px; height: 44px; border-radius: 14px; font-size: 18p
.login-brand-name { font-size: 18px; }
.login-hero {
margin-top: 0;
min-height: 360px;
padding-right: 150px;
position: relative;
}
.login-illus {
position: absolute;
top: 16px;
right: 14px;
width: 86px;
height: 86px;
margin: 0;
opacity: 0.82;
}
.login-illus .login-illus-ring:nth-child(2) { inset: 10px; }
.login-illus .login-illus-ring:nth-child(3) { inset: 20px; }
.login-illus-core { width: 42px; height: 42px; font-size: 20px; }
.login-tagline { font-size: 42px; line-height: 0.96; max-width: 8ch; margin-bottom:
.login-sub { max-width: 26ch; font-size: 14px; line-height: 1.6; margin-bottom: 18p
.login-chips {
position: absolute;
top: 132px;
right: 2px;
width: 132px;
display: grid;
grid-template-columns: 1fr;
gap: 8px;
}
.login-chip {
width: 100%;
justify-content: center;
min-height: 42px;
padding: 8px 10px;
font-size: 11px;
text-align: center;
border-radius: 14px;
background: rgba(255,255,255,0.05);
}
.login-chip:nth-child(n+5) { display: none; }
.login-stats {
grid-template-columns: 1fr 1fr;
gap: 10px;
margin-top: 0;
}
.login-stat {
padding: 14px;
border-radius: 18px;
background: rgba(255,255,255,0.07);
}
.login-stat-val { font-size: 22px; margin-bottom: 4px; }
.login-stat-lbl { font-size: 11px; }
.login-form-heading { font-size: 26px; }
.login-tab-switch {
gap: 8px;
margin-bottom: 18px;
border-radius: 18px;
padding: 6px;
}
.login-switch-btn {
font-size: 13px;
min-height: 50px;
padding: 0 12px;
border-radius: 14px;
}
.field-input, .submit-btn, .google-btn { height: 54px; }
}
/* ── SMALL MOBILE < 420px ── */
@media (max-width: 420px) {
.login-page { padding: 10px; }
.login-left { padding: 16px 16px 72px; }
.login-right { margin: -46px 6px 0; border-radius: 22px; padding: 20px 16px; }
.login-illus { width: 72px; height: 72px; top: 14px; right: 10px; }
.login-tagline { font-size: 34px; max-width: 7ch; }
.login-sub { font-size: 13px; max-width: 23ch; margin-bottom: 10px; }
.login-hero { min-height: 320px; padding-right: 132px; }
.login-chips { top: 118px; right: 0; width: 118px; }
.login-stats { grid-template-columns: 1fr 1fr; }
.login-tab-switch { grid-template-columns: 1fr 1fr; gap: 8px; padding: 5px; border-
}
`}</style>
<div className="login-page">
{handingOff && (
<div style={{
position: "fixed", inset: 0, zIndex: 40,
background: "rgba(246,248,248,0.62)",
backdropFilter: "blur(6px)",
WebkitBackdropFilter: "blur(6px)",
display: "grid",
placeItems: "center",
}}>
<div style={{
padding: "14px 18px",
borderRadius: 18,
background: "rgba(255,255,255,0.92)",
border: "1px solid rgba(6,20,27,0.08)",
boxShadow: "0 20px 40px rgba(6,20,27,0.12)",
fontSize: 14,
fontWeight: 700,
color: "#06141B",
}}>
gRงเIาJระบบ...
</div>
</div>
)}
<ParticleCanvas />
<div className="login-orb login-orb-1" />
<div className="login-orb login-orb-2" />
<div className="login-orb login-orb-3" />
<div className="login-card">
<div className="login-left">
<div className="login-ring login-ring-1" />
<div className="login-ring login-ring-2" />
<div className="login-ring login-ring-3" />
<div className="login-brand">
<div className="login-brand-badge">K</div>
<div className="login-brand-name">
KU NextGen
<span className="login-brand-x"> × </span>
<span className="login-brand-ai">AI</span>
</div>
</div>
<div className="login-hero">
<div className="login-illus">
<div className="login-illus-ring" />
<div className="login-illus-ring" />
<div className="login-illus-ring" />
<div className="login-illus-core"> </div>
</div>
<div className="login-tagline">
Simplifying knowledge for
<br />
<em> smarter learning </em>
</div>
<p className="login-sub">
ระบบ(iวยการเbยนjkออกแบบใlmสะอาดnน ใ*งานoายnน
และSมโทนเIมแบบพbเBยมrวยsมสtางตามuดvให"
</p>
<div className="login-chips">
<span className="login-chip"> Gปโหลดไฟx</span>
<span className="login-chip"> `งa</span>
<span className="login-chip">✎ Iอความ</span>
<span className="login-chip"> สOปCอ</span>
<span className="login-chip"> Key Points</span>
<span className="login-chip"> Iอสอบ</span>
<span className="login-chip"> Flashcard</span>
<span className="login-chip"> ถาม AI</span>
</div>
</div>
<div className="login-stats">
<div className="login-stat">
<div className="login-stat-val">5</div>
<div className="login-stat-lbl">Summary Modes</div>
</div>
<div className="login-stat">
<div className="login-stat-val">∞</div>
<div className="login-stat-lbl">Documents</div>
</div>
</div>
</div>
""}`}
<div className="login-right">
<div className="login-right-inner">
{mode !== "reset" && (
<div className="login-tab-switch">
<button className={`login-switch-btn ${mode === "login" ? "active" : เIาJระบบ
</button>
<button className={`login-switch-btn ${mode === "register" ? "active" : ""}
สzครสมา{ก
</button>
</div>
)}
{mode === "reset" && (
<button className="back-btn" onClick={() => switchMode("login")} type="button
← กRบJหDาเIาJระบบ
</button>
)}
<div className="login-form-heading">
{mode === "login" ? "Welcome" : mode === "register" ? "สhาง%ญ'ให"" : "bเcตร4ส6
</div>
<div className="login-form-sub">
{mode === "login" ? "เIาJระบบเ|อใ*งาน KuNextGen × AI" : mode === "register" ? "
</div>
{error && <div className="error-box"> {error}</div>}
{success && <div className="success-box">✓ {success}</div>}
{mode === "register" && (
<div className="field" style={{ marginTop: error || success ? 16 : 0 }}>
<label className="field-label">]อ-นามส^ล</label>
<div className="field-wrap">
<input type="text" className="field-input" placeholder="]อของSณ" value={n
<span className="field-icon"> </span>
</div>
</div>
)}
<div className="field" style={{ marginTop: mode !== "register" && (error <label className="field-label">,เมล</label>
<div className="field-wrap">
<input type="email" className="field-input" placeholder="name@ku.th" onChange={(e) => { setEmail(e.target.value); clearMessages(); }}
onKeyDown={(e) => e.key === "Enter" && handleEmailAuth()}
autoFocus={mode !== "register"} />
<span className="field-icon"> </span>
</div>
</div>
|| suc
value=
{mode !== "reset" && (
<div className="field">
<label className="field-label">ร4ส6าน</label>
<div className="field-wrap">
<input type={showPw ? "text" : "password"} className="field-input" onChange={(e) => { setPassword(e.target.value); clearMessages(); placeh
}}
onKeyDown={(e) => e.key === "Enter" && handleEmailAuth()} />
<button className="field-eye" onClick={() => setShowPw((v) => !v)} {showPw ? " " : " "}
</button>
</div>
</div>
type="
)}
{mode === "login" && (
<div className="forgot-row">
<a href="#" className="forgot-link" onClick={(e) => { e.preventDefault(); s
มร4ส6าน?
</a>
</div>
)}
<button className="submit-btn" onClick={handleEmailAuth} disabled={loading} typ
{submitLabel}
</button>
{mode !== "reset" && (
<>
<div className="login-divider">ห1อ</div>
<button className="google-btn" onClick={handleGoogle} disabled={loading} ty
<GoogleIcon />
เIาJระบบrวย Google
</button>
</>
)}
<div className="login-footer">
{mode === "login" ? (
<>eงไ"B%ญ'?{" "}<a href="#" onClick={(e) => { e.preventDefault(); switchMod
) : mode === "register" ? (
<>B%ญ'แ>ว?{" "}<a href="#" onClick={(e) => { e.preventDefault(); switchMode
) : (
<a href="#" onClick={(e) => { e.preventDefault(); switchMode("login"); }}>ก
)}
</div>
</div>
</div>
</div>
</div>
</>
);
}
