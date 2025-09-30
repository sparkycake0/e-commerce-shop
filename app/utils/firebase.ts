import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { GoogleAuthProvider, GithubAuthProvider, getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB5bc71bSLsUkHBbnfYGjhLEIgQOQzm5Fg",
  authDomain: "lunar-shop-92799.firebaseapp.com",
  projectId: "lunar-shop-92799",
  storageBucket: "lunar-shop-92799.firebasestorage.app",
  messagingSenderId: "12425528566",
  appId: "1:12425528566:web:98edc9f7176a04b2ffd8d7",
};

const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
