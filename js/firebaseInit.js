import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAWLazCv2YK7WfFP2xsw27sha6z-v4aAGI",
  authDomain: "unihack-835e4.firebaseapp.com",
  projectId: "unihack-835e4",
  storageBucket: "unihack-835e4.firebasestorage.app",
  messagingSenderId: "761874442520",
  appId: "1:761874442520:web:d12aa7c064a2b6a7b8166d",
  measurementId: "G-KTJ9SXS64S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);