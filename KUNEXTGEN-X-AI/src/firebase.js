import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  getAuth,
  getRedirectResult,
  GoogleAuthProvider,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  updateProfile,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAAIrRnWpV68jagj2Rk-UpoAUOiwsSjat4",
  authDomain: "kunatgenxai.firebaseapp.com",
  projectId: "kunatgenxai",
  storageBucket: "kunatgenxai.firebasestorage.app",
  messagingSenderId: "367313364763",
  appId: "1:367313364763:web:024ce2b1a795cabe1515be",
  measurementId: "G-TDSTQHBTNT",
};

export const isFirebaseConfigured = () =>
  Object.values(firebaseConfig).every(
    (value) => typeof value === "string" && value.trim().length > 0,
  );

const app = isFirebaseConfigured()
  ? getApps().length
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const analytics = app ? getAnalytics(app) : null;

let persistencePromise = null;

const provider = auth ? new GoogleAuthProvider() : null;
if (provider) provider.setCustomParameters({ prompt: "select_account" });

function ensurePersistence() {
  if (!auth) return Promise.resolve();
  if (!persistencePromise) {
    persistencePromise = setPersistence(auth, browserLocalPersistence).catch((error) => {
      persistencePromise = null;
      throw error;
    });
  }
  return persistencePromise;
}

export function onAuthChanged(callback) {
  if (!auth) return () => {};
  return onAuthStateChanged(auth, callback);
}

export async function loginWithGoogle() {
  if (!auth || !provider) {
    throw new Error("ยังไม่ได้ตั้งค่า Firebase");
  }

  await ensurePersistence();

  try {
    return await signInWithPopup(auth, provider);
  } catch (error) {
    const fallbackCodes = new Set([
      "auth/popup-blocked",
      "auth/popup-closed-by-user",
      "auth/cancelled-popup-request",
      "auth/operation-not-supported-in-this-environment",
    ]);

    if (!fallbackCodes.has(error?.code)) {
      throw error;
    }

    await signInWithRedirect(auth, provider);
    return null;
  }
}

export async function finishGoogleRedirectLogin() {
  if (!auth) return null;

  try {
    await ensurePersistence();
    const credential = await getRedirectResult(auth);
    if (credential?.user) return credential;
    if (auth.currentUser) return { user: auth.currentUser };
    return null;
  } catch {
    return auth.currentUser ? { user: auth.currentUser } : null;
  }
}

export async function loginWithEmail({ email, password }) {
  if (!auth) throw new Error("ยังไม่ได้ตั้งค่า Firebase");
  await ensurePersistence();
  return signInWithEmailAndPassword(auth, email, password);
}

export async function registerWithEmail({ name, email, password }) {
  if (!auth) throw new Error("ยังไม่ได้ตั้งค่า Firebase");
  await ensurePersistence();
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  if (name?.trim()) {
    await updateProfile(credential.user, { displayName: name.trim() });
  }
  return credential;
}

export async function logoutUser() {
  if (!auth) return;
  return signOut(auth);
}
