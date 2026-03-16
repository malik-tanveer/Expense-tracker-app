import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
 apiKey: "AIzaSyBuIAvS4Xy3rkTkdiqeLqncekM2p71_Ca0",
  authDomain: "expense-tracker-b28ca.firebaseapp.com",
  projectId: "expense-tracker-b28ca",
  storageBucket: "expense-tracker-b28ca.firebasestorage.app",
  messagingSenderId: "1003348563253",
  appId: "1:1003348563253:web:c14a2d6d5811a38edb287c",
  measurementId: "G-9G8PX7DRG2"

};

const app = initializeApp(firebaseConfig);

// Auth + Google Provider
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

// Firestore
export const db = getFirestore(app);