import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseMenuConfig = {
  apiKey: "AIzaSyCRSaNN2SMSlYaiacm5JP934KrQTvK-jWw",
  authDomain: "dining-menu-45d74.firebaseapp.com",
  projectId: "dining-menu-45d74",
  storageBucket: "dining-menu-45d74.appspot.com",
  messagingSenderId: "529547673995",
  appId: "1:529547673995:web:82888ce89c5eaf295fef8e",
  measurementId: "G-EEKN8KL3EE"
};

// Initialize a separate Firebase app for menus with a unique name
const menuApp = !getApps().some(app => app.name === "menuApp")
  ? initializeApp(firebaseMenuConfig, "menuApp")
  : getApp("menuApp");

// Initialize Firestore for the menu app
export const db = getFirestore(menuApp);
