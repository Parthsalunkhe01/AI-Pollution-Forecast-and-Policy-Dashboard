// src/context/AuthContext.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApps, initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getReactNativePersistence,
  initializeAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import axios from "axios";

// FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyDKfhI0HtcRItpowfV9Y_OQuyyjVN75QI4",
  authDomain: "greenpulsesih.firebaseapp.com",
  projectId: "greenpulsesih",
  storageBucket: "greenpulsesih.firebasestorage.app",
  messagingSenderId: "962530657668",
  appId: "1:962530657668:web:9c9176893154250077c9d1",
  measurementId: "G-1B6ZFKFVV0"
};

let app;
if (!getApps().length) app = initializeApp(firebaseConfig);
else app = getApps()[0];

let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  const { getAuth } = require("firebase/auth");
  auth = getAuth(app);
}

export const AuthContext = createContext();

const BACKEND_BASE = "http://10.10.53.16:3000"; // move to env in production
const BACKEND_TIMEOUT = 8000; // ms

// create an axios instance so we can control defaults & logging
const api = axios.create({
  baseURL: BACKEND_BASE,
  timeout: BACKEND_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);   // "user" | "admin"
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const storedToken = await AsyncStorage.getItem("jwt");
        const storedRole  = await AsyncStorage.getItem("role");
        console.log("AUTH INIT storedRole =", storedRole);
        if (storedToken) setToken(storedToken);
        if (storedRole) setRole(storedRole);
      } catch (e) {
        console.log("AsyncStorage load error:", e.message);
      }
    })();

    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setInitializing(false);
    });

    return unsub;
  }, []);

  // helper to mask token when logging
  const mask = (s) => (typeof s === "string" ? `${s.slice(0, 8)}...${s.slice(-6)}` : "");

  const sendTokenToBackend = async (firebaseToken) => {
    // We POST both shapes so the backend (whatever it expects) likely accepts one.
    // Also include Authorization header as a common convention.
    const body = {
      firebaseToken,        // many backends expect this
      idToken: firebaseToken // some expect idToken
    };

    try {
      const res = await api.post("/auth/firebase-login", body, {
        headers: {
          Authorization: `Bearer ${firebaseToken}`, // harmless if backend ignores it
        },
        validateStatus: (s) => s < 500 // let 4xx pass so we can inspect 401 body
      });

      return res;
    } catch (err) {
      // network-level failure (timeout, DNS, unreachable)
      throw err;
    }
  };

  // LOGIN – always set role even if backend fails
  const login = async (email, password, selectedRole = "user") => {
    console.log("LOGIN CALLED with role =", selectedRole);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const firebaseToken = await cred.user.getIdToken();
      const appRole = selectedRole === "admin" ? "admin" : "user";
      console.log("SETTING ROLE IMMEDIATELY =", appRole);

      // optimistic local state
      setRole(appRole);
      await AsyncStorage.setItem("role", appRole);

      // attempt to exchange with backend for app JWT
      try {
        console.log("📡 Sending firebase token to backend (masked):", mask(firebaseToken));
        const res = await sendTokenToBackend(firebaseToken);

        if (res.status === 200 && res.data?.token) {
          console.log("🔥 BACKEND JWT RECEIVED");
          setToken(res.data.token);
          await AsyncStorage.setItem("jwt", res.data.token);
        } else {
          // backend returned 4xx (401) or something else — log details but do not break UX
          console.warn("Backend returned non-200:", res.status, res.data);
          // optional: clear token if backend explicitly rejected role
          // do NOT unset local role/user — keep firebase auth working
        }
      } catch (err) {
        // network or other error
        console.log("Backend JWT error:", err.message || err);
        if (err.response) {
          console.log("Backend response status:", err.response.status);
          console.log("Backend response data:", err.response.data);
        }
      }
    } catch (err) {
      // Firebase sign-in failed
      console.error("Firebase signIn error:", err.message || err);
      throw err; // rethrow so UI can show authentication error
    }
  };

  // SIGNUP → citizen only
  const signup = async (email, password) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseToken = await cred.user.getIdToken();

      setRole("user");
      await AsyncStorage.setItem("role", "user");

      try {
        console.log("📡 Sending firebase token to backend (signup) masked:", mask(firebaseToken));
        const res = await sendTokenToBackend(firebaseToken);
        if (res.status === 200 && res.data?.token) {
          console.log("🔥 BACKEND JWT RECEIVED (signup)");
          setToken(res.data.token);
          await AsyncStorage.setItem("jwt", res.data.token);
        } else {
          console.warn("Backend returned non-200 on signup:", res.status, res.data);
        }
      } catch (err) {
        console.log("Backend JWT error (signup):", err.message || err);
        if (err.response) {
          console.log("Backend response status:", err.response.status);
          console.log("Backend response data:", err.response.data);
        }
      }
    } catch (err) {
      console.error("Firebase signup error:", err.message || err);
      throw err;
    }
  };

  const logout = async () => {
    await signOut(auth);
    await AsyncStorage.removeItem("jwt");
    await AsyncStorage.removeItem("role");
    setToken(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, role, initializing, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
