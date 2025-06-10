// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebaseの設定
const firebaseConfig = {
  apiKey: "AIzaSyDayES5ci8Yuv9qiKx_zuWW1ZCxrH-Xh68",
  authDomain: "my-tech-blog-62367.firebaseapp.com",
  projectId: "my-tech-blog-62367",
  storageBucket: "my-tech-blog-62367.firebasestorage.app",
  messagingSenderId: "75947302346",
  appId: "1:75947302346:web:e39705296e892084568333",
  measurementId: "G-SW3B6J7FZL",
};

// Firebaseアプリを初期化
const app = initializeApp(firebaseConfig);

// Firestoreのインスタンスを取得
export const db = getFirestore(app);
export const auth = getAuth(app);
