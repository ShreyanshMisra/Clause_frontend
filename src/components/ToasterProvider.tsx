"use client";

import { Toaster } from "react-hot-toast";

export default function ToasterProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        // Default options
        className: "",
        duration: 4000,
        style: {
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(10px)",
          color: "#2D1B3D",
          borderRadius: "1rem",
          padding: "1rem 1.5rem",
          fontSize: "14px",
          fontWeight: "500",
          boxShadow: "0 8px 32px rgba(255, 149, 120, 0.2)",
          border: "1px solid rgba(255, 220, 200, 0.3)",
        },
        // Success
        success: {
          duration: 3000,
          icon: "✅",
          style: {
            background: "rgba(230, 255, 245, 0.95)",
            border: "1px solid rgba(134, 239, 172, 0.5)",
            color: "#065F46",
          },
        },
        // Error
        error: {
          duration: 5000,
          icon: "❌",
          style: {
            background: "rgba(254, 242, 242, 0.95)",
            border: "1px solid rgba(252, 165, 165, 0.5)",
            color: "#991B1B",
          },
        },
        // Loading
        loading: {
          icon: "⏳",
          style: {
            background: "rgba(255, 248, 245, 0.95)",
            border: "1px solid rgba(255, 149, 120, 0.3)",
            color: "#2D1B3D",
          },
        },
      }}
    />
  );
}
