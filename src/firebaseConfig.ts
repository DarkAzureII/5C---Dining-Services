// firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyBKsNbOuzzk1UxgoF3E7upOfFUXKt_KNks",

  authDomain: "dining-service.firebaseapp.com",

  databaseURL: "https://dining-service-default-rtdb.firebaseio.com",

  projectId: "dining-service",

  storageBucket: "dining-service.appspot.com",

  messagingSenderId: "810433911925",

  appId: "1:810433911925:web:a7a7306553870a6fa2ac3c",

  measurementId: "G-NRZLGVCCQ7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export auth and firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
