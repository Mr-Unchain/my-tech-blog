// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebaseの設定
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Firebase設定の検証
const hasValidConfig = Object.values(firebaseConfig).every(value => value && value !== 'undefined');

let app: any = null;
let db: any = null;
let auth: any = null;

// 有効な設定がある場合のみFirebaseを初期化
if (hasValidConfig) {
  try {
    // Firebaseアプリを初期化（既に初期化されていれば既存のものを利用）
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    
    // Firestoreのインスタンスを取得
    db = getFirestore(app);
    auth = getAuth(app);
  } catch (error) {
    console.warn('Firebase initialization failed:', error);
  }
}

export { db, auth };
