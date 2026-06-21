import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Firestore
} from 'firebase/firestore';

// Configuration keys following modern SaaS standard environment injections (e.g. Next.js, Vite, or Create React App)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.REACT_APP_FIREBASE_API_KEY || 'AIzaSyFakeKeyJustToInitializeWebSaaS',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'floratrack-saas.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.REACT_APP_FIREBASE_PROJECT_ID || 'floratrack-saas',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'floratrack-saas.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || process.env.REACT_APP_FIREBASE_APP_ID || '1:123456789:web:fakeappid789'
};

// Initialize Firebase safe for standard SSR frameworks (like Next.js) or SPA frameworks
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
export { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where
};
export type { FirebaseUser, Firestore };
