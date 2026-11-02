import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { Analytics, getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCYS-8w96_Usiw4Zo4xXpXQxmAXv47kiAQ",
  authDomain: "e-sakay-353d8.firebaseapp.com",
  projectId: "e-sakay-353d8",
  storageBucket: "e-sakay-353d8.firebasestorage.app",
  messagingSenderId: "718021148377",
  appId: "1:718021148377:web:f7c5ba8f97e8d9bb4c88c8",
  measurementId: "G-CCR84XQVTX"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Explicit Exports
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Analytics safely
export let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export default app;