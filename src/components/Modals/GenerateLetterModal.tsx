"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  api,
  type DemandLetterRequest,
  type DemandLetterResponse,
} from "@/lib/api";
import toast from "react-hot-toast";
import type { Highlight, AnalysisData } from "@/utils/fetchAnalysis";

interface GenerateLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle: string;
  estimatedRecovery: string;
  analysisData?: AnalysisData | null;
}

export default function GenerateLetterModal({
  isOpen,
  onClose,
  documentTitle,
  estimatedRecovery,
  analysisData,
}: GenerateLetterModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [letterText, setLetterText] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      // Reset state when modal closes
      setLetterText(null);
      setIsGenerating(false);
      setCopied(false);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleGenerateLetter = async () => {
    if (!analysisData) {
      toast.error("Analysis data is required to generate a letter");
      return;
    }

    setIsGenerating(true);
    setLetterText(null);
    setCopied(false);

    try {
      // Prepare analysis JSON for the backend
      const analysisJson: any = {
        documentId: analysisData.documentId,
        pdfUrl: analysisData.pdfUrl,
        documentMetadata: analysisData.documentMetadata,
        deidentificationSummary: analysisData.deidentificationSummary,
        keyDetailsDetected: analysisData.keyDetailsDetected,
        analysisSummary: analysisData.analysisSummary,
        highlights: analysisData.highlights.map((h: Highlight) => ({
          id: h.id,
          pageNumber: h.pageNumber,
          color: h.color,
          priority: h.priority,
          category: h.category,
          text: h.text,
          statute: h.statute,
          explanation: h.explanation,
          damages_estimate: h.damages_estimate,
          position: h.position,
        })),
        document_info: (analysisData as any).document_info || {
          total_chunks: 0,
          analysis_method: "RAG with Snowflake + Gemini",
          analysis_date: new Date().toISOString().split("T")[0],
        },
      };

      // Simplified request - backend will generate defaults
      const request: DemandLetterRequest = {
        analysis_json: analysisJson,
        // No sender/recipient required - backend will use defaults from analysis data
      };

      console.log("📤 Sending demand letter request:", {
        endpoint: "/demand-letter/generate",
        baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
        hasAnalysisData: !!analysisData,
        highlightsCount: analysisData?.highlights?.length || 0,
        requestKeys: Object.keys(request),
      });

      const response = await api.post<DemandLetterResponse>(
        "/demand-letter/generate",
        request,
      );

      console.log("📥 Received response:", response);

      if (response.success) {
        const text = response.letter_text || response.latex_source || "";
        setLetterText(text);
        toast.success("Demand letter generated successfully!");

        // Auto-copy to clipboard
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          toast.success("Letter copied to clipboard!");
        } catch (clipboardError) {
          console.warn("Failed to copy to clipboard:", clipboardError);
          // Continue anyway - user can copy manually
        }
      } else {
        throw new Error("Letter generation failed");
      }
    } catch (error: any) {
      console.error("❌ Error generating letter:", error);
      console.error("Error details:", {
        message: error?.message,
        detail: error?.detail,
        status: error?.status,
        response: error?.response,
        stack: error?.stack,
      });

      // Handle APIError from fetchAPI
      let errorMessage = "Failed to generate demand letter. Please try again.";

      // Check for network/connection errors
      if (
        error?.status === 0 ||
        error?.name === "TypeError" ||
        error?.message?.includes("fetch")
      ) {
        errorMessage =
          "Cannot connect to backend server. Please:\n\n" +
          "1. Make sure the backend is running\n" +
          "2. Open terminal: cd clause_backend/app\n" +
          "3. Run: python server.py\n" +
          "4. Verify: http://localhost:8000/docs";
      } else if (error?.status === 404) {
        // 404 - Endpoint not found
        errorMessage =
          "Endpoint not found (404). Please:\n\n" +
          "1. Check if server is running: http://localhost:8000/docs\n" +
          "2. Look for '/demand-letter/generate' in the API docs\n" +
          "3. If missing, restart the server with latest code\n" +
          "4. Command: cd clause_backend/app && python server.py";
      } else if (error?.status === 500) {
        // 500 - Server error
        const detail = error?.detail || "";
        if (
          detail.includes("quota") ||
          detail.includes("billing") ||
          detail.includes("limit") ||
          detail.includes("429") ||
          detail.includes("50")
        ) {
          errorMessage =
            "Gemini API quota/rate limit exceeded. Free tier allows 50 requests/day.\n\n" +
            "Solutions:\n" +
            "1. Wait a few minutes and try again\n" +
            "2. Check quota at https://ai.google.dev/\n" +
            "3. Upgrade API plan if needed";
        } else if (detail.includes("GEMINI_API_KEY")) {
          errorMessage =
            "Gemini API key not configured. Please set GEMINI_API_KEY in clause_backend/.env";
        } else {
          errorMessage = `Server error: ${detail || "Check backend console for details"}`;
        }
      } else if (error?.status === 429) {
        errorMessage =
          "API rate limit exceeded (429). Free tier allows 50 requests/day. Please wait before trying again.";
      } else if (error?.detail) {
        errorMessage = error.detail;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      // Show error toast
      toast.error(errorMessage.split("\n")[0], {
        duration: 5000,
      });

      // Log full error for debugging
      if (errorMessage.includes("\n")) {
        console.error("Full error:", errorMessage);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyToClipboard = async () => {
    if (!letterText) {
      toast.error("No letter to copy. Please generate a letter first.");
      return;
    }

    try {
      await navigator.clipboard.writeText(letterText);
      setCopied(true);
      toast.success("Letter copied to clipboard!");

      // Reset copied state after 3 seconds
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      toast.error("Failed to copy to clipboard. Please copy manually.");
    }
  };

  const handleDownloadLetter = () => {
    if (!letterText) {
      toast.error("No letter to download. Please generate a letter first.");
      return;
    }

    // Create a blob with the letter content
    const blob = new Blob([letterText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `demand-letter-${documentTitle.replace(/\.[^/.]+$/, "")}-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Letter downloaded successfully!");
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md dark:bg-black/70" />

      {/* Modal */}
      <div
        className="glass-card relative z-10 flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl shadow-soft-3"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex-shrink-0 p-8 pb-6">
          <div className="mb-6 flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-gradient-to-br from-coral-400 to-gold-400 p-3 shadow-glow-gold">
                <span className="text-2xl">✉️</span>
              </div>
              <div>
                <h2 className="mb-1 text-2xl font-bold text-dark dark:text-white">
                  Generate Demand Letter
                </h2>
                <p className="text-sm text-dark-5 dark:text-gray-400">
                  {letterText
                    ? "Letter generated! Copy it below and add your information."
                    : "Click the button below to generate a demand letter with placeholders for your information."}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-full bg-peach-100 p-2 text-dark transition-all duration-200 hover:scale-110 hover:bg-peach-200 dark:bg-coral-900/30 dark:text-white dark:hover:bg-coral-900/50"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="custom-scrollbar flex-1 overflow-y-auto px-8">
          <div className="space-y-6 pb-6">
            {!letterText ? (
              /* Before Generation - Simple Info Card */
              <div className="space-y-6">
                {/* Summary Card */}
                <div className="glass rounded-2xl border border-peach-200/50 p-6 dark:border-coral-500/20">
                  <h3 className="mb-4 text-lg font-bold text-dark dark:text-white">
                    Letter Summary
                  </h3>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    <div>
                      <div className="mb-1 text-xs font-medium text-dark-5 dark:text-gray-400">
                        Estimated Recovery
                      </div>
                      <div className="gradient-text text-2xl font-bold">
                        {estimatedRecovery}
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 text-xs font-medium text-dark-5 dark:text-gray-400">
                        Issues Found
                      </div>
                      <div className="text-2xl font-semibold text-dark dark:text-white">
                        {analysisData?.highlights?.length || 0}
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 text-xs font-medium text-dark-5 dark:text-gray-400">
                        Document
                      </div>
                      <div className="text-sm font-semibold text-dark dark:text-white">
                        {documentTitle}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info Card */}
                <div className="glass rounded-2xl border border-peach-200/50 p-6 dark:border-coral-500/20">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-gold-100 p-2 dark:bg-gold-900/30">
                      <span className="text-xl">💡</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-2 font-semibold text-dark dark:text-white">
                        How it works
                      </h3>
                      <p className="text-sm text-dark-5 dark:text-gray-400">
                        The letter will be generated with placeholders like{" "}
                        <span className="font-mono text-xs">[YOUR NAME]</span>,{" "}
                        <span className="font-mono text-xs">
                          [YOUR ADDRESS]
                        </span>
                        , and{" "}
                        <span className="font-mono text-xs">
                          [LANDLORD NAME]
                        </span>
                        . After generation, you can copy the letter and fill in
                        your personal information before sending it.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Generated Letter Display */
              <div className="glass rounded-2xl border border-peach-200/50 p-6 dark:border-coral-500/20">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-dark dark:text-white">
                    Generated Demand Letter
                  </h3>
                  <div className="flex items-center gap-2">
                    {copied && (
                      <span className="text-xs text-green-600 dark:text-green-400">
                        ✓ Copied!
                      </span>
                    )}
                    <button
                      onClick={handleCopyToClipboard}
                      className="rounded-full bg-peach-100 px-3 py-1.5 text-xs font-semibold text-dark transition-colors hover:bg-peach-200 dark:bg-coral-900/30 dark:text-white dark:hover:bg-coral-900/50"
                    >
                      {copied ? "✓ Copied" : "Copy"}
                    </button>
                  </div>
                </div>
                <div className="custom-scrollbar max-h-[60vh] overflow-y-auto rounded-lg bg-gray-50 p-4 dark:bg-dark-2">
                  <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-dark dark:text-gray-300">
                    {letterText}
                  </pre>
                </div>
                <p className="mt-4 text-xs text-dark-5 dark:text-gray-400">
                  💡 Tip: Replace the placeholders (e.g., [YOUR NAME], [LANDLORD
                  NAME]) with your actual information before sending the letter.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-shrink-0 items-center justify-end gap-3 border-t border-peach-200/30 px-8 pb-8 pt-6 dark:border-coral-500/20">
          <button
            onClick={onClose}
            className="btn-glass px-6 py-3 font-semibold"
          >
            {letterText ? "Close" : "Cancel"}
          </button>
          {!letterText ? (
            <button
              onClick={handleGenerateLetter}
              disabled={isGenerating || !analysisData}
              className="btn-gradient flex items-center gap-2 px-8 py-3 font-semibold disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <span>✨</span>
                  <span>Generate Letter</span>
                </>
              )}
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  setLetterText(null);
                  setIsGenerating(false);
                  setCopied(false);
                }}
                className="btn-glass px-6 py-3 font-semibold"
              >
                Generate New
              </button>
              <button
                onClick={handleCopyToClipboard}
                className="btn-gradient flex items-center gap-2 px-6 py-3 font-semibold"
              >
                {copied ? (
                  <>
                    <span>✓</span>
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <span>📋</span>
                    <span>Copy to Clipboard</span>
                  </>
                )}
              </button>
              <button
                onClick={handleDownloadLetter}
                className="btn-gradient flex items-center gap-2 px-6 py-3 font-semibold"
              >
                <span>💾</span>
                <span>Download</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  // Render modal via portal to document.body to ensure it's above all content
  if (typeof window !== "undefined") {
    return createPortal(modalContent, document.body);
  }

  return null;
}
