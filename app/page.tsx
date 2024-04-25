"use client";
import { useState, useEffect, useRef } from "react";
import {
  onAuthStateChanged,
  User,
  signOut,
  signInWithCredential,
} from "firebase/auth";
import { auth } from "@/firebase";
import Login from "@/components/Login";
import UserInfo from "@/components/UserInfo";

export default function Home() {
  const timeout = useRef<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(auth.currentUser));
  const [sessionStart, setSessionStart] = useState(Date.now());

  //Token Refresh
  useEffect(() => {
    const refresh = async (currentUser: User) => {
      if (currentUser) {
        setIsLoggedIn(true);
        const credential = await currentUser.getIdTokenResult();
        if (Number(credential.expirationTime) - Date.now() < 5 * 60 * 1000) {
          const existingCredential = await currentUser.providerData[0]; // Assuming provider data is at index 0
          await signInWithCredential(auth, existingCredential);
        }
      } else {
        setIsLoggedIn(false);
        signOut(auth);
      }
    };

    const refreshTimer = setInterval(refresh, 5 * 60 * 1000); // Refresh every 5 minutes

    const unsubscribe = onAuthStateChanged(auth, refresh);

    return () => {
      unsubscribe();
      clearInterval(refreshTimer);
    };
  }, []);

  //Idle Timeout
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        timeout.current = setTimeout(() => {
          // Logout after 30 minutes of idle time
          console.log("User timed out due to inactivity");
          signOut(auth);
          setIsLoggedIn(false);
        }, 30 * 60 * 1000);
      } else if (document.visibilityState === "visible") {
        clearTimeout(timeout.current);
      }
    };

    const handleUserInteraction = () => {
      clearTimeout(timeout.current);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("click", handleUserInteraction);
    window.addEventListener("scroll", handleUserInteraction);
    window.addEventListener("keydown", handleUserInteraction);

    return () => {
      clearTimeout(timeout.current);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("scroll", handleUserInteraction);
      window.removeEventListener("keydown", handleUserInteraction);
    };
  }, []);

  // Session Expiry
  useEffect(() => {
    const handleAuthChange = (currentUser: any) => {
      setIsLoggedIn(!!currentUser);
      setSessionStart(Date.now());
    };

    const checkSession = () => {
      if (Date.now() - sessionStart > 60 * 60 * 1000) {
        console.log("Session expired. Please re-authenticate");
        signOut(auth);
        setIsLoggedIn(false);
        clearInterval(expiryTimer);
      }
    };
    const unsubscribe = onAuthStateChanged(auth, handleAuthChange);
    const expiryTimer = setInterval(checkSession, 5000); // Check for expiry every 5 seconds

    return () => {
      unsubscribe();
      clearInterval(expiryTimer);
    };
  }, [isLoggedIn]);

  const handleLoginSuccess = (user: User) => {
    setIsLoggedIn(true);
  };

  return (
    <main className="main">
      <div>
        <h2>Social Auth Demo</h2>
      </div>
      {isLoggedIn ? (
        <UserInfo />
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </main>
  );
}
