"use client";

import { useEffect, useRef, useState } from "react";

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<any>(null);
  const [isAnimating, setIsAnimating] = useState(true);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Initialize Vanta.js BIRDS effect
    if (vantaRef.current && typeof window !== "undefined") {
      try {
        // @ts-ignore - Vanta is loaded via CDN
        if (window.VANTA) {
          vantaEffect.current = window.VANTA.BIRDS({
            el: vantaRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            scale: 1.0,
            scaleMobile: 1.0,
            backgroundColor: 0xfff5f0, // Light peach background (from peach-50)
            color1: 0xff6b6b, // Vibrant red
            color2: 0x4ecdc4, // Vibrant teal/cyan
            colorMode: "variance", // Use variance for more color variety (rainbow effect)
            birdSize: 1.0,
            wingSpan: 20.0,
            speedLimit: 4.0,
            separation: 35.0,
            alignment: 35.0,
            cohesion: 35.0,
            quantity: 5.0, // 5 birds for rainbow variety
          });
        }
      } catch (error) {
        console.error("Error initializing Vanta:", error);
      }
    }

    // Show button after 3 seconds
    const buttonTimer = setTimeout(() => {
      setShowButton(true);
    }, 3000);

    // Cleanup
    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
      }
      clearTimeout(buttonTimer);
    };
  }, []);

  const handleStart = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onComplete();
    }, 500);
  };

  return (
    <div
      ref={vantaRef}
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-500 ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Subtle overlay for better text visibility on light background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-peach-50/20 to-coral-50/30" />

      {/* Skip button in top right corner */}
      <button
        onClick={handleStart}
        className="absolute top-8 right-8 text-dark/60 hover:text-dark transition-colors text-sm font-medium z-20"
      >
        Skip →
      </button>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-8">
        {/* Animated Logo/Text */}
        <div className="text-center space-y-4">
          <h1 className="text-8xl md:text-9xl font-bold animate-fade-in">
            <span className="bg-gradient-to-r from-coral-500 via-peach-500 to-gold-500 bg-clip-text text-transparent animate-gradient drop-shadow-sm">
              Clause
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-dark/70 animate-fade-in-delay font-light tracking-wide">
            Fine Print, Finally Fair
          </p>
        </div>

        {/* Animated Start Button */}
        {showButton && (
          <button
            onClick={handleStart}
            className="group relative px-12 py-4 text-lg font-semibold text-white overflow-hidden rounded-full animate-fade-in-button shadow-glow-coral"
          >
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-coral-500 via-peach-500 to-gold-500 transition-transform group-hover:scale-110" />
            
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-coral-400 via-peach-400 to-gold-400 blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
            
            {/* Button text */}
            <span className="relative z-10 flex items-center gap-2">
              Get Started
              <svg 
                className="w-5 h-5 transition-transform group-hover:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
        )}

        {/* Loading indicator before button appears */}
        {!showButton && (
          <div className="flex gap-2 animate-fade-in-delay">
            <div className="w-3 h-3 bg-coral-500 rounded-full animate-bounce shadow-sm" style={{ animationDelay: "0s" }} />
            <div className="w-3 h-3 bg-peach-500 rounded-full animate-bounce shadow-sm" style={{ animationDelay: "0.2s" }} />
            <div className="w-3 h-3 bg-gold-500 rounded-full animate-bounce shadow-sm" style={{ animationDelay: "0.4s" }} />
          </div>
        )}
      </div>

      {/* Scroll indicator */}
      {showButton && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-slow">
          <svg 
            className="w-6 h-6 text-dark/40" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      )}
    </div>
  );
}
