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
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908C16.658 14.148 17.64 11.84 17.64 9.2Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58Z"
      />
    </svg>
  );
}

function getErrorMessage(code, fallbackMessage) {
  switch (code) {
    case "auth/user-not-found":
      return "ไม่พบบัญชีผู้ใช้นี้";
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "อีเมลหรือรหัสผ่านไม่ถูกต้อง";
    case "auth/email-already-in-use":
      return "อีเมลนี้ถูกใช้งานแล้ว";
    case "auth/invalid-email":
      return "รูปแบบอีเมลไม่ถูกต้อง";
    case "auth/weak-password":
      return "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร";
    case "auth/too-many-requests":
      return "มีการลองเข้าสู่ระบบหลายครั้งเกินไป กรุณาลองใหม่ภายหลัง";
    case "auth/popup-closed-by-user":
      return "คุณปิดหน้าต่างเข้าสู่ระบบ Google ก่อนดำเนินการเสร็จ";
    default:
      return fallbackMessage || "เกิดข้อผิดพลาด กรุณาลองใหม่";
  }
}

function getResetPasswordUrl() {
  const configuredBase = import.meta.env.VITE_PUBLIC_APP_URL?.trim();
  const baseUrl = configuredBase || window.location.origin;
  return `${baseUrl.replace(/\/$/, "")}/reset-password`;
}

export default function LoginPage({ onAuthSuccess }) {
  const [mode, setMode] = useState("login"); // login | register | reset
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let ignore = false;

    async function completeRedirectLogin() {
      const credential = await finishGoogleRedirectLogin();
      if (!ignore && credential?.user) {
        completeAuthSuccess(credential.user);
      }
    }

    completeRedirectLogin();
    return () => {
      ignore = true;
    };
  }, [onAuthSuccess]);

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const completeAuthSuccess = (user) => {
    if (!user) return;
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

    if (!email.trim()) {
      setError("กรุณากรอกอีเมล");
      return;
    }

    if (mode === "register" && !name.trim()) {
      setError("กรุณากรอกชื่อ-นามสกุล");
      return;
    }

    if (mode !== "reset" && password.length < 6) {
      setError("รหัสผ่านอย่างน้อย 6 ตัวอักษร");
      return;
    }

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
        await sendPasswordResetEmail(auth, email, {
          url: getResetPasswordUrl(),
          handleCodeInApp: false,
        });
        setSuccess("ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลของคุณแล้ว");
      }
    } catch (e) {
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
      if (credential?.user) {
        completeAuthSuccess(credential.user);
      }
    } catch (e) {
      setError(getErrorMessage(e?.code, e?.message || "Google sign-in failed"));
    } finally {
      setLoading(false);
    }
  };

  const submitLabel =
    loading
      ? "กำลังดำเนินการ..."
      : mode === "login"
        ? "เข้าสู่ระบบ"
        : mode === "register"
          ? "สร้างบัญชี"
          : "ส่งลิงก์รีเซ็ต";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

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
          --danger-bg: rgba(255, 120, 120, 0.10);

          --success: #e8f1ee;
          --success-bg: rgba(204, 208, 207, 0.12);

          --shadow-xl: 0 28px 80px rgba(0,0,0,0.48);
          --shadow-lg: 0 20px 50px rgba(0,0,0,0.34);
          --shadow-inset: inset 0 1px 0 rgba(255,255,255,0.03);

          --radius-2xl: 32px;
          --radius-xl: 24px;
          --radius-lg: 18px;
          --radius-md: 16px;
          --radius-sm: 12px;
        }

        * {
          box-sizing: border-box;
        }

        html, body, #root {
          min-height: 100%;
          margin: 0;
        }

        body {
          font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          background:
            radial-gradient(circle at 15% 12%, rgba(255,255,255,0.55), transparent 20%),
            radial-gradient(circle at 80% 18%, rgba(204,208,207,0.42), transparent 24%),
            linear-gradient(180deg, #CCD0CF 0%, #9BA8AB 44%, #11212D 100%);
          color: #06141B;
        }

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

        .login-orb-1 {
          width: 320px;
          height: 320px;
          left: -70px;
          top: -40px;
          background: rgba(204,208,207,0.15);
        }

        .login-orb-2 {
          width: 280px;
          height: 280px;
          right: -50px;
          top: 22%;
          background: rgba(155,168,171,0.14);
        }

        .login-orb-3 {
          width: 340px;
          height: 340px;
          left: 12%;
          bottom: -120px;
          background: rgba(74,92,106,0.22);
        }

        .login-card {
          position: relative;
          z-index: 2;
          width: min(1160px, 100%);
          min-height: 720px;
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          border-radius: var(--radius-2xl);
          overflow: hidden;
          border: 1px solid var(--stroke);
          background: linear-gradient(90deg, #06141B 0 54%, #F6F8F8 54% 100%);
          box-shadow:
            var(--shadow-xl),
            inset 0 1px 0 rgba(255,255,255,0.28);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .login-left {
          position: relative;
          padding: 42px;
          background:
            radial-gradient(circle at 20% 15%, rgba(255,255,255,0.05), transparent 20%),
            linear-gradient(180deg, #06141B 0%, #11212D 60%, #06141B 100%);
          border-right: 1px solid rgba(255,255,255,0.06);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow: hidden;
        }

        .login-right {
          position: relative;
          padding: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            radial-gradient(circle at 80% 10%, rgba(255,255,255,0.45), transparent 20%),
            linear-gradient(180deg, #F6F8F8 0%, #CCD0CF 100%);
        }

        .login-right-inner {
          width: 100%;
          max-width: 430px;
        }

        .login-ring,
        .login-illus-ring {
          position: absolute;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.08);
        }

        .login-ring-1 {
          width: 340px;
          height: 340px;
          top: -140px;
          right: -100px;
        }

        .login-ring-2 {
          width: 460px;
          height: 460px;
          bottom: -240px;
          left: -160px;
        }

        .login-ring-3 {
          width: 180px;
          height: 180px;
          top: 120px;
          left: 56%;
        }

        .login-brand {
          display: flex;
          align-items: center;
          gap: 14px;
          position: relative;
          z-index: 2;
        }

        .login-brand-badge {
          width: 50px;
          height: 50px;
          border-radius: 16px;
          display: grid;
          place-items: center;
          background: linear-gradient(180deg, #CCD0CF, #9BA8AB);
          color: #06141B;
          font-weight: 800;
          font-size: 20px;
          box-shadow:
            0 10px 24px rgba(0,0,0,0.30),
            inset 0 1px 0 rgba(255,255,255,0.55);
        }

        .login-brand-name {
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: var(--text-main);
        }

        .login-brand-x {
          color: rgba(255,255,255,0.45);
        }

        .login-brand-ai {
          color: var(--bg-5);
        }

        .login-hero {
          position: relative;
          z-index: 2;
          max-width: 540px;
          margin-top: 18px;
        }

        .login-illus {
          width: 176px;
          height: 176px;
          margin-bottom: 24px;
          position: relative;
          display: grid;
          place-items: center;
        }

        .login-illus-ring {
          inset: 0;
          opacity: 0.92;
        }

        .login-illus .login-illus-ring:nth-child(2) {
          inset: 16px;
          border-color: rgba(155,168,171,0.18);
        }

        .login-illus .login-illus-ring:nth-child(3) {
          inset: 32px;
          border-color: rgba(204,208,207,0.18);
        }

        .login-illus-core {
          width: 78px;
          height: 78px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          font-size: 34px;
          background: linear-gradient(180deg, #CCD0CF, #9BA8AB);
          color: #06141B;
          border: 1px solid rgba(255,255,255,0.18);
          box-shadow:
            0 18px 40px rgba(0,0,0,0.28),
            inset 0 1px 0 rgba(255,255,255,0.48);
        }

        .login-tagline {
          font-size: clamp(36px, 5vw, 56px);
          line-height: 1.02;
          font-weight: 800;
          letter-spacing: -0.05em;
          margin-bottom: 14px;
          color: #F5F8F8;
        }

        .login-tagline em {
          font-style: normal;
          color: #8EB69B;
          text-shadow: 0 0 18px rgba(255,255,255,0.12);
        }

        .login-sub {
          color: var(--text-soft);
          font-size: 16px;
          line-height: 1.8;
          margin: 0 0 24px;
        }

        .login-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .login-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          border-radius: 999px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          color: #EEF3F4;
          font-size: 13px;
          font-weight: 600;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.03);
        }

        .login-stats {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
          margin-top: 28px;
          max-width: 430px;
        }

        .login-stat {
          background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.035));
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 18px;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.03);
        }

        .login-stat-val {
          font-size: 28px;
          font-weight: 800;
          color: #CCD0CF;
          margin-bottom: 6px;
        }

        .login-stat-lbl {
          color: var(--text-soft);
          font-size: 13px;
        }

        .login-tab-switch {
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          padding: 6px;
          border-radius: 20px;
          background: linear-gradient(180deg, rgba(255,255,255,0.62), rgba(255,255,255,0.40));
          border: 1px solid rgba(6,20,27,0.08);
          box-shadow:
            0 14px 28px rgba(6,20,27,0.08),
            inset 0 1px 0 rgba(255,255,255,0.6);
          margin-bottom: 26px;
        }

        .login-switch-btn {
          border: 0;
          outline: 0;
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

        .login-switch-btn:hover {
          color: #06141B;
          background: rgba(255,255,255,0.72);
        }

        .login-switch-btn.active {
          background: linear-gradient(180deg, #CCD0CF, #BFC5C4);
          color: #06141B;
          box-shadow:
            0 10px 24px rgba(255,255,255,0.12),
            inset 0 1px 0 rgba(255,255,255,0.6);
          transform: translateY(-1px);
        }

        .login-form-heading {
          font-size: 30px;
          font-weight: 800;
          letter-spacing: -0.03em;
          margin-bottom: 8px;
          color: #06141B;
        }

        .login-form-sub {
          color: #31414d;
          font-size: 14px;
          line-height: 1.7;
          margin-bottom: 24px;
        }

        .error-box {
          padding: 12px 14px;
          background: rgba(255, 241, 241, 0.92);
          border: 1px solid rgba(224, 107, 107, 0.24);
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

        .field {
          margin-bottom: 16px;
        }

        .field-label {
          display: block;
          margin-bottom: 8px;
          font-size: 13px;
          color: #1d2c37;
          font-weight: 600;
        }

        .field-wrap {
          position: relative;
        }

        .field-input {
          width: 100%;
          height: 56px;
          border-radius: 18px;
          border: 1px solid rgba(6,20,27,0.1);
          background: linear-gradient(180deg, rgba(255,255,255,0.96), rgba(204,208,207,0.86));
          color: #06141B;
          padding: 0 50px 0 16px;
          outline: none;
          font-size: 15px;
          transition: all 0.22s ease;
          box-shadow:
            0 12px 24px rgba(6,20,27,0.06),
            inset 0 1px 0 rgba(255,255,255,0.7);
        }

        .field-input::placeholder {
          color: rgba(74,92,106,0.7);
        }

        .field-input:focus {
          border-color: rgba(255,255,255,0.92);
          background: linear-gradient(180deg, #FFFFFF, #F2F5F5);
          box-shadow:
            0 0 0 4px rgba(255,255,255,0.55),
            0 0 22px rgba(255,255,255,0.18),
            0 12px 26px rgba(6,20,27,0.08);
        }

        .field-icon,
        .field-eye {
          position: absolute;
          top: 50%;
          right: 14px;
          transform: translateY(-50%);
          color: rgba(74,92,106,0.9);
        }

        .field-eye {
          border: 0;
          background: transparent;
          cursor: pointer;
          font-size: 18px;
          padding: 0;
        }

        .forgot-row {
          display: flex;
          justify-content: flex-end;
          margin-top: -4px;
          margin-bottom: 16px;
        }

        .forgot-link,
        .login-footer a {
          color: #1c2b36;
          text-decoration: none;
          font-weight: 600;
          transition: opacity 0.2s ease;
        }

        .forgot-link:hover,
        .login-footer a:hover {
          opacity: 0.85;
          text-decoration: underline;
        }

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
          box-shadow:
            0 14px 32px rgba(255,255,255,0.10),
            0 8px 24px rgba(0,0,0,0.24),
            inset 0 1px 0 rgba(255,255,255,0.8);
          transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease, opacity 0.18s ease;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          filter: brightness(1.02);
          box-shadow:
            0 18px 40px rgba(255,255,255,0.14),
            0 12px 28px rgba(0,0,0,0.28),
            0 0 24px rgba(255,255,255,0.10),
            inset 0 1px 0 rgba(255,255,255,0.9);
        }

        .submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .submit-btn:disabled {
          opacity: 0.72;
          cursor: not-allowed;
        }

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

        .login-divider::before,
        .login-divider::after {
          content: "";
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.08);
        }

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
          box-shadow:
            0 10px 24px rgba(0,0,0,0.22),
            inset 0 1px 0 rgba(255,255,255,0.75);
        }

        .google-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          background: linear-gradient(180deg, #F6F8F8 0%, #CCD0CF 100%);
          box-shadow:
            0 16px 34px rgba(255,255,255,0.10),
            0 12px 28px rgba(0,0,0,0.24),
            0 0 18px rgba(255,255,255,0.08),
            inset 0 1px 0 rgba(255,255,255,0.85);
        }

        .google-btn:disabled {
          opacity: 0.72;
          cursor: not-allowed;
        }

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

        .login-footer {
          margin-top: 18px;
          text-align: center;
          font-size: 14px;
          color: #31414d;
        }

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

        .back-btn:hover {
          color: #06141B;
        }

        @media (max-width: 980px) {
          .login-card {
            grid-template-columns: 1fr;
            min-height: auto;
          }

          .login-left {
            padding: 30px 24px 24px;
            border-right: 0;
            border-bottom: 1px solid rgba(255,255,255,0.06);
          }

          .login-right {
            padding: 24px;
          }

          .login-hero {
            margin-top: 8px;
          }

          .login-illus {
            width: 126px;
            height: 126px;
            margin-bottom: 16px;
          }

          .login-tagline {
            font-size: 36px;
          }
        }

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
          }

          .login-left,
          .login-right {
            padding: 20px 16px;
          }

          .login-left {
            border-radius: 28px;
            padding: 18px 18px 82px;
            min-height: 0;
            justify-content: flex-start;
            gap: 18px;
            box-shadow:
              0 24px 44px rgba(0,0,0,0.28),
              inset 0 1px 0 rgba(255,255,255,0.05);
          }

          .login-right {
            margin: -54px 10px 0;
            border-radius: 24px;
            background:
              radial-gradient(circle at top right, rgba(255,255,255,0.7), transparent 28%),
              linear-gradient(180deg, #f9fbfb 0%, #e2e8e8 100%);
            box-shadow:
              0 18px 42px rgba(6,20,27,0.16),
              inset 0 1px 0 rgba(255,255,255,0.88);
          }

          .login-right-inner,
          .login-hero,
          .login-stats {
            max-width: none;
          }

          .login-brand {
            gap: 12px;
          }

          .login-brand-badge {
            width: 44px;
            height: 44px;
            border-radius: 14px;
            font-size: 18px;
          }

          .login-brand-name {
            font-size: 18px;
          }

          .login-hero {
            margin-top: 0;
            min-height: 360px;
            padding-right: 150px;
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

          .login-illus .login-illus-ring:nth-child(2) {
            inset: 10px;
          }

          .login-illus .login-illus-ring:nth-child(3) {
            inset: 20px;
          }

          .login-illus-core {
            width: 42px;
            height: 42px;
            font-size: 20px;
          }

          .login-tagline {
            font-size: 42px;
            line-height: 0.96;
            max-width: 8ch;
            margin-bottom: 12px;
          }

          .login-sub {
            max-width: 26ch;
            font-size: 14px;
            line-height: 1.6;
            margin-bottom: 18px;
          }

          .login-chips {
            position: absolute;
            top: 132px;
            right: 2px;
            width: 132px;
            display: grid;
            grid-template-columns: 1fr;
            gap: 8px;
          }

          .login-form-heading {
            font-size: 26px;
          }

          .login-stats {
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-top: 0;
            max-width: none;
          }

          .login-stat {
            padding: 14px;
            border-radius: 18px;
            background: rgba(255,255,255,0.07);
          }

          .login-stat-val {
            font-size: 22px;
            margin-bottom: 4px;
          }

          .login-stat-lbl {
            font-size: 11px;
          }

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

          .field-input,
          .submit-btn,
          .google-btn {
            height: 54px;
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

          .login-chip:nth-child(n+5) {
            display: none;
          }
        }

        @media (max-width: 420px) {
          .login-page {
            padding: 10px;
          }

          .login-left,
          .login-right {
            padding: 18px 14px;
          }

          .login-left {
            padding: 16px 16px 72px;
          }

          .login-right {
            margin: -46px 6px 0;
            border-radius: 22px;
          }

          .login-illus {
            width: 72px;
            height: 72px;
            top: 14px;
            right: 10px;
          }

          .login-tagline {
            font-size: 34px;
            max-width: 7ch;
          }

          .login-sub {
            font-size: 13px;
            max-width: 23ch;
            margin-bottom: 10px;
          }

          .login-hero {
            min-height: 320px;
            padding-right: 132px;
          }

          .login-chips {
            top: 118px;
            right: 0;
            width: 118px;
          }

          .login-stats {
            grid-template-columns: 1fr 1fr;
          }

          .login-tab-switch {
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            padding: 5px;
            border-radius: 18px;
          }
        }
      `}</style>

      <div className="login-page">
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
                <div className="login-illus-core">🎓</div>
              </div>

              <div className="login-tagline">
                Simplifying knowledge for
                <br />
                <em> smarter learning </em>
              </div>

              <p className="login-sub">
                ระบบผู้ช่วยการเรียนรู้ที่ออกแบบให้ดูสะอาดขึ้น ใช้งานง่ายขึ้น
                และคุมโทนเข้มแบบพรีเมียมด้วยปุ่มสว่างตามชุดสีใหม่
              </p>

              <div className="login-chips">
                <span className="login-chip">📁 อัปโหลดไฟล์</span>
                <span className="login-chip">🔗 ลิงก์</span>
                <span className="login-chip">✎ ข้อความ</span>
                <span className="login-chip">📋 สรุปย่อ</span>
                <span className="login-chip">🎯 Key Points</span>
                <span className="login-chip">📝 ข้อสอบ</span>
                <span className="login-chip">🃏 Flashcard</span>
                <span className="login-chip">💬 ถาม AI</span>
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

          <div className="login-right">
            <div className="login-right-inner">
              {mode !== "reset" && (
                <div className="login-tab-switch">
                  <button
                    className={`login-switch-btn ${mode === "login" ? "active" : ""}`}
                    onClick={() => switchMode("login")}
                    type="button"
                  >
                    🔑 เข้าสู่ระบบ
                  </button>
                  <button
                    className={`login-switch-btn ${mode === "register" ? "active" : ""}`}
                    onClick={() => switchMode("register")}
                    type="button"
                  >
                    ✨ สมัครสมาชิก
                  </button>
                </div>
              )}

              {mode === "reset" && (
                <button
                  className="back-btn"
                  onClick={() => switchMode("login")}
                  type="button"
                >
                  ← กลับสู่หน้าเข้าสู่ระบบ
                </button>
              )}

              <div className="login-form-heading">
                {mode === "login"
                  ? "Welcome"
                  : mode === "register"
                    ? "สร้างบัญชีใหม่"
                    : "รีเซ็ตรหัสผ่าน"}
              </div>

              <div className="login-form-sub">
                {mode === "login"
                  ? "เข้าสู่ระบบเพื่อใช้งาน KuNextGen × AI"
                  : mode === "register"
                    ? "เริ่มต้นใช้งานด้วยอีเมลของคุณ"
                    : "กรอกอีเมลเพื่อรับลิงก์รีเซ็ตรหัสผ่าน"}
              </div>

              {error && <div className="error-box">⚠️ {error}</div>}
              {success && <div className="success-box">✓ {success}</div>}

              {mode === "register" && (
                <div className="field" style={{ marginTop: error || success ? 16 : 0 }}>
                  <label className="field-label">ชื่อ-นามสกุล</label>
                  <div className="field-wrap">
                    <input
                      type="text"
                      className="field-input"
                      placeholder="ชื่อของคุณ"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        clearMessages();
                      }}
                    />
                    <span className="field-icon">👤</span>
                  </div>
                </div>
              )}

              <div
                className="field"
                style={{ marginTop: mode !== "register" && (error || success) ? 16 : undefined }}
              >
                <label className="field-label">อีเมล</label>
                <div className="field-wrap">
                  <input
                    type="email"
                    className="field-input"
                    placeholder="name@ku.th"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      clearMessages();
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleEmailAuth()}
                    autoFocus={mode !== "register"}
                  />
                  <span className="field-icon">✉️</span>
                </div>
              </div>

              {mode !== "reset" && (
                <div className="field">
                  <label className="field-label">รหัสผ่าน</label>
                  <div className="field-wrap">
                    <input
                      type={showPw ? "text" : "password"}
                      className="field-input"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        clearMessages();
                      }}
                      onKeyDown={(e) => e.key === "Enter" && handleEmailAuth()}
                    />
                    <button
                      className="field-eye"
                      onClick={() => setShowPw((v) => !v)}
                      type="button"
                    >
                      {showPw ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>
              )}

              {mode === "login" && (
                <div className="forgot-row">
                  <a
                    href="#"
                    className="forgot-link"
                    onClick={(e) => {
                      e.preventDefault();
                      switchMode("reset");
                    }}
                  >
                    ลืมรหัสผ่าน?
                  </a>
                </div>
              )}

              <button
                className="submit-btn"
                onClick={handleEmailAuth}
                disabled={loading}
                type="button"
              >
                {submitLabel}
              </button>

              {mode !== "reset" && (
                <>
                  <div className="login-divider">หรือ</div>

                  <button
                    className="google-btn"
                    onClick={handleGoogle}
                    disabled={loading}
                    type="button"
                  >
                    <GoogleIcon />
                    เข้าสู่ระบบด้วย Google
                  </button>
                </>
              )}

              <div className="login-footer">
                {mode === "login" ? (
                  <>
                    ยังไม่มีบัญชี?{" "}
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        switchMode("register");
                      }}
                    >
                      สมัครสมาชิกฟรี
                    </a>
                  </>
                ) : mode === "register" ? (
                  <>
                    มีบัญชีแล้ว?{" "}
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        switchMode("login");
                      }}
                    >
                      เข้าสู่ระบบ
                    </a>
                  </>
                ) : (
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      switchMode("login");
                    }}
                  >
                    กลับสู่หน้าเข้าสู่ระบบ
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

