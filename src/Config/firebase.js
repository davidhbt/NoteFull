import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyDRGAsC5389d8jXegdP5_qpSOT5Nyq4D-s",
  authDomain: "fir-tutorial-2393f.firebaseapp.com",
  projectId: "fir-tutorial-2393f",
  storageBucket: "fir-tutorial-2393f.firebasestorage.app",
  messagingSenderId: "279770930404",
  appId: "1:279770930404:web:3e843ee63fc5a5dfe3a0f1",
  measurementId: "G-JHZR41M3HD"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app)
