"use client";

import { useState, useEffect } from "react";
import SplashScreen from "./SplashScreen";

export default function SplashScreenProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showSplash, setShowSplash] = useState(true);
  const [hasSeenSplash, setHasSeenSplash] = useState(false);

  useEffect(() => {
    // Check if user has already seen splash screen in this session
    const seen = sessionStorage.getItem("hasSeenSplash");
    if (seen === "true") {
      setShowSplash(false);
      setHasSeenSplash(true);
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    setHasSeenSplash(true);
    // Store in session storage so it doesn't show again during this session
    sessionStorage.setItem("hasSeenSplash", "true");
  };

  return (
    <>
      {showSplash && !hasSeenSplash && (
        <SplashScreen onComplete={handleSplashComplete} />
      )}
      {/* Only render children after splash is complete or if already seen */}
      <div className={showSplash && !hasSeenSplash ? "invisible" : "visible"}>
        {children}
      </div>
    </>
  );
}
