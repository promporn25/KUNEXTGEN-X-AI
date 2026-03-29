// firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey:            "AIzaSyAAIrRnWpV68jagj2Rk-UpoAUOiwsSjat4",
  authDomain:        "kunatgenxai.firebaseapp.com",
  projectId:         "kunatgenxai",
  storageBucket:     "kunatgenxai.firebasestorage.app",
  messagingSenderId: "367313364763",
  appId:             "1:367313364763:web:024ce2b1a795cabe1515be",
  measurementId:     "G-TDSTQHBTNT",
};

export const isFirebaseConfigured = () =>
  Object.values(firebaseConfig).every(
    value => typeof value === "string" && value.trim().length > 0,
  );

const app = isFirebaseConfigured()
  ? getApps().length ? getApp() : initializeApp(firebaseConfig)
  : null;

export const auth = app ? getAuth(app) : null;
export const db   = app ? getFirestore(app) : null;
export const analytics = app ? getAnalytics(app) : null;

const provider = auth ? new GoogleAuthProvider() : null;
if (provider) provider.setCustomParameters({ prompt: "select_account" });

// ─── Auth helpers ─────────────────────────────────────────────────────────────

export function onAuthChanged(callback) {
  if (!auth) return () => {};
  return onAuthStateChanged(auth, callback);
}

export async function loginWithGoogle() {
  if (!auth || !provider) throw new Error("ยังไม่ได้ตั้งค่า Firebase");
  return signInWithPopup(auth, provider);
}

export async function loginWithEmail({ email, password }) {
  if (!auth) throw new Error("ยังไม่ได้ตั้งค่า Firebase");
  return signInWithEmailAndPassword(auth, email, password);
}

export async function registerWithEmail({ name, email, password }) {
  if (!auth) throw new Error("ยังไม่ได้ตั้งค่า Firebase");
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  if (name?.trim()) await updateProfile(credential.user, { displayName: name.trim() });
  return credential;
}

export async function logoutUser() {
  if (!auth) return;
  return signOut(auth);
}