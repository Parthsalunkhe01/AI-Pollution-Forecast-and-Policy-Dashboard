// src/context/AuthContext.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApps, initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  getReactNativePersistence,
  initializeAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { createContext, useEffect, useState } from 'react';

// ----- YOUR FIREBASE CONFIG -----
const firebaseConfig = {
  apiKey: "AIzaSyDKfhI0HtcRItpowfV9Y_OQuyyjVN75QI4",
  authDomain: "greenpulsesih.firebaseapp.com",
  projectId: "greenpulsesih",
  storageBucket: "greenpulsesih.firebasestorage.app",
  messagingSenderId: "962530657668",
  appId: "1:962530657668:web:9c9176893154250077c9d1",
  measurementId: "G-1B6ZFKFVV0"
};
// ----------------------------------

// initialize Firebase only once
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// 🚀 THIS IS THE IMPORTANT PART
// Initialize Auth with AsyncStorage persistence
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  // if already initialized (hot reload), fallback
  const { getAuth } = require('firebase/auth');
  auth = getAuth(app);
}

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (initializing) setInitializing(false);
    });
    return unsubscribe;
  }, []);

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const signup = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider
      value={{ user, initializing, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
