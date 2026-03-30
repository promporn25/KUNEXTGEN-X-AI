import { useEffect, useState } from "react";
import { auth, onAuthChanged, logoutUser } from "./firebase";
import LoginPage from "./LoginPage";
import Home from "./pages/Home";
import ResetPasswordPage from "./ResetPasswordPage";

export default function App() {
  const [user,  setUser]  = useState(() => auth?.currentUser ?? null);
  const [authReady, setAuthReady] = useState(() => !!auth?.currentUser || !auth);
  const [theme, setTheme] = useState("light");
  const [lang,  setLang]  = useState("th");

  // ── ตรวจว่าเป็นหน้า reset-password ไหม ──
  const path     = window.location.pathname;
  const isReset  = path === "/reset-password" || path.startsWith("/reset-password?");

  useEffect(() => {
    const unsub = onAuthChanged((u) => {
      setUser(u ?? null);
      setAuthReady(true);
    });
    return unsub;
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // ── หน้า Reset Password ไม่ต้องรอ auth ──
  if (isReset) {
    return <ResetPasswordPage />;
  }

  if (!authReady) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: "var(--bg)", color: "var(--text-3)", fontFamily: "'DM Sans', sans-serif",
        fontSize: "0.9rem", gap: "0.5rem",
      }}>
        <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⏳</span>
        กำลังโหลด...
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user) {
    return (
      <LoginPage
        onAuthSuccess={(nextUser) => {
          setUser(nextUser ?? null);
          setAuthReady(true);
        }}
      />
    );
  }

  return (
    <Home
      currentUser={user}
      onLogout={() => logoutUser().then(() => setUser(null))}
      theme={theme}
      setTheme={setTheme}
      lang={lang}
      setLang={setLang}
    />
  );
}
