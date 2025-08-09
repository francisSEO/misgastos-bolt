// Firebase configuration
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  // Replace with your Firebase config
  apiKey: "AIzaSyD_vecioAlnVbSnsJYv4ixp1m1I4cGxd3o",
  authDomain: "misgastos-f8a32.firebaseapp.com",
  projectId: "misgastos-f8a32",
  storageBucket: "misgastos-f8a32.firebasestorage.app",
  messagingSenderId: "863876741202",
  appId: "1:863876741202:web:535109efc8537901e3078b"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;