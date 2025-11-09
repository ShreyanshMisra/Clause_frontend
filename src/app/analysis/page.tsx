"use client";

import { useState, useEffect, useRef } from "react";
import { SparklesIcon } from "@/components/Layouts/sidebar/icons";
import { useSearchParams } from "next/navigation";
import GenerateLetterModal from "@/components/Modals/GenerateLetterModal";
import CreateCaseModal from "@/components/Modals/CreateCaseModal";
import dynamic from "next/dynamic";
import {
  fetchAnalysis,
  calculateEstimatedRecovery,
  type Highlight,
  type AnalysisData,
} from "@/utils/fetchAnalysis";
import type { PdfAnalysisViewerRef } from "@/components/PdfAnalysisViewer";
import { api, type ChatRequest, type ChatResponse } from "@/lib/api";
import toast from "react-hot-toast";

const PdfAnalysisViewer = dynamic(
  () =>
    import("@/components/PdfAnalysisViewer").then((mod) => ({
      default: mod.PdfAnalysisViewer,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-4">Loading PDF viewer...</p>
        </div>
      </div>
    ),
  },
);

export default function AnalysisPage() {
  const searchParams = useSearchParams();
  // Get file_id from URL - can be documentId or file_id param
  const fileIdFromUrl =
    searchParams.get("file_id") || searchParams.get("documentId") || null;
  const documentId = fileIdFromUrl || "1";
  const caseId = searchParams.get("caseId");
  const [selectedIssue, setSelectedIssue] = useState<number | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [letterModalOpen, setLetterModalOpen] = useState(false);
  const [caseModalOpen, setCaseModalOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<
    Array<{
      role: "user" | "ai";
      content: string;
      sources?: Array<{ chapter: string; section: string; relevance: string }>;
    }>
  >([
    {
      role: "ai",
      content:
        "Hello! I can help explain any clauses, answer questions about Massachusetts law, or guide you through next steps. 😊",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [issues, setIssues] = useState<Highlight[]>([]);
  const pdfViewerRef = useRef<PdfAnalysisViewerRef>(null);
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (chatOpen && chatMessagesEndRef.current) {
      chatMessagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, chatOpen, isTyping]);

  useEffect(() => {
    const loadAnalysisData = async () => {
      try {
        const data = await fetchAnalysis(documentId);
        console.log("✅ Analysis page loaded data:", data);
        setAnalysisData(data);
        setIssues(data.highlights);
      } catch (error) {
        console.error("❌ Error loading analysis data:", error);
      }
    };
    loadAnalysisData();
  }, [documentId]);

  const getSeverityFromColor = (color: string): "low" | "medium" | "high" => {
    if (color === "red") return "high";
    if (color === "yellow" || color === "orange") return "medium";
    return "low";
  };

  const severityColors = {
    low: "severity-low",
    medium: "severity-medium",
    high: "severity-high",
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isTyping) return;

    setChatMessages((prev) => [...prev, { role: "user", content: message }]);
    setChatInput("");
    setIsTyping(true);

    try {
      // Use file_id from URL for document-specific context
      // Include file_id if it exists and is not the default "1"
      const fileId =
        fileIdFromUrl && fileIdFromUrl !== "1" ? fileIdFromUrl : undefined;

      // Prepare chat request
      const chatRequest: ChatRequest = {
        message: message.trim(),
        ...(fileId && { file_id: fileId }),
      };

      // Call backend chat API
      const response = await api.post<ChatResponse>("/chat", chatRequest);

      // Add AI response with sources
      setChatMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: response.answer,
          sources: response.sources,
        },
      ]);
    } catch (error: any) {
      console.error("Chat error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "I'm having trouble connecting. Please try again.";

      setChatMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: `Sorry, I encountered an error: ${errorMessage}. Please try again.`,
        },
      ]);

      toast.error("Failed to get AI response. Please try again.");
    } finally {
      setIsTyping(false);
    }
  };

  // Voice recording handlers
  // Constants for audio validation
  const MIN_AUDIO_SIZE_BYTES = 1000; // ~200-500ms of audio minimum
  const MAX_RECORDING_DURATION_MS = 60000; // 60 seconds max

  const startRecording = async () => {
    try {
      // Validate state: should not be recording or processing
      if (isRecording || isProcessingVoice) {
        console.warn("[RECORDING] Already recording or processing");
        return;
      }

      // Stop any existing recording first
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        console.log("[RECORDING] Stopping existing recorder");
        mediaRecorderRef.current.stop();
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // Request microphone access
      console.log("[RECORDING] Requesting microphone access...");
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      // Store stream reference for cleanup
      streamRef.current = stream;

      // Determine MIME type - prefer webm with opus codec
      let mimeType = "audio/webm;codecs=opus";
      if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
        mimeType = "audio/webm;codecs=opus";
      } else if (MediaRecorder.isTypeSupported("audio/webm")) {
        mimeType = "audio/webm";
      } else if (MediaRecorder.isTypeSupported("audio/mp4")) {
        mimeType = "audio/mp4";
      } else {
        // Fallback to default
        mimeType = "";
      }

      console.log("[RECORDING] Using MIME type:", mimeType || "default");

      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: mimeType || undefined,
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // Track recording start time for max duration
      const recordingStartTime = Date.now();

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          console.log(
            "[RECORDING] Chunk received:",
            event.data.size,
            "bytes, Total chunks:",
            audioChunksRef.current.length,
          );

          // Check max duration
          const elapsed = Date.now() - recordingStartTime;
          if (elapsed >= MAX_RECORDING_DURATION_MS) {
            console.log("[RECORDING] Max duration reached, stopping");
            stopRecording();
          }
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error("[RECORDING] Error:", event);
        toast.error("Recording error occurred");
        setIsRecording(false);
        cleanupStream();
      };

      mediaRecorder.onstop = () => {
        console.log(
          "[RECORDING] Stopped. Total chunks:",
          audioChunksRef.current.length,
        );

        // Clean up stream immediately
        cleanupStream();

        // Validate and submit audio
        validateAndSubmitAudio();
      };

      // Start recording with timeslice (1000ms = 1 second chunks)
      mediaRecorder.start(1000);
      setIsRecording(true);
      toast.success("Recording... Click again to stop");
    } catch (error: any) {
      console.error("[RECORDING] Error accessing microphone:", error);
      const errorMsg =
        error.name === "NotAllowedError" ||
        error.name === "PermissionDeniedError"
          ? "Microphone permission denied. Please allow microphone access."
          : error.name === "NotFoundError" ||
              error.name === "DevicesNotFoundError"
            ? "No microphone found. Please connect a microphone."
            : "Failed to access microphone. Please check permissions.";
      toast.error(errorMsg);
      setIsRecording(false);
      cleanupStream();
    }
  };

  const cleanupStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
        console.log("[RECORDING] Stopped track:", track.kind);
      });
      streamRef.current = null;
    }
  };

  const validateAndSubmitAudio = async () => {
    // Wait a bit to ensure all chunks are collected
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Validate audio chunks
    if (audioChunksRef.current.length === 0) {
      console.error("[RECORDING] No audio chunks recorded");
      toast.error("No audio recorded. Please try again.");
      setIsProcessingVoice(false);
      audioChunksRef.current = [];
      return;
    }

    // Calculate total size
    const totalSize = audioChunksRef.current.reduce(
      (sum, chunk) => sum + chunk.size,
      0,
    );

    console.log("[RECORDING] Total audio size:", totalSize, "bytes");

    // Validate minimum size (200-500ms of audio)
    if (totalSize < MIN_AUDIO_SIZE_BYTES) {
      console.error("[RECORDING] Audio too short:", totalSize, "bytes");
      toast.error(
        `Recording too short (${Math.round(totalSize / 100)}ms). Please record at least 0.5 seconds.`,
      );
      setIsProcessingVoice(false);
      audioChunksRef.current = [];
      return;
    }

    // Submit audio
    await handleVoiceSubmit();
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current) {
      console.warn("[RECORDING] No recorder to stop");
      setIsRecording(false);
      return;
    }

    const state = mediaRecorderRef.current.state;
    console.log("[RECORDING] Stop requested. Current state:", state);

    if (state === "recording") {
      // Request final data chunk before stopping
      mediaRecorderRef.current.requestData();
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessingVoice(true);
      toast.success("Processing recording...");
    } else if (state === "inactive") {
      // Already stopped
      setIsRecording(false);
    } else {
      // Paused or other state
      setIsRecording(false);
    }
  };

  const handleVoiceSubmit = async () => {
    // This function is called after recording stops and audio is validated
    if (isProcessingVoice) {
      console.warn("[VOICE] Already processing");
      return;
    }

    setIsProcessingVoice(true);

    try {
      // Validate audio chunks (should already be validated, but double-check)
      if (audioChunksRef.current.length === 0) {
        throw new Error("No audio chunks available");
      }

      const totalSize = audioChunksRef.current.reduce(
        (sum, chunk) => sum + chunk.size,
        0,
      );

      if (totalSize < MIN_AUDIO_SIZE_BYTES) {
        throw new Error(`Audio too short: ${totalSize} bytes`);
      }

      console.log(
        "[VOICE] Submitting audio:",
        audioChunksRef.current.length,
        "chunks,",
        totalSize,
        "bytes",
      );

      // Determine MIME type from chunks
      let mimeType = "audio/webm";
      if (audioChunksRef.current[0]?.type) {
        mimeType = audioChunksRef.current[0].type;
      }

      // Create audio blob
      const audioBlob = new Blob(audioChunksRef.current, {
        type: mimeType,
      });

      console.log(
        "[VOICE] Created blob:",
        audioBlob.size,
        "bytes, type:",
        audioBlob.type,
      );

      // Prepare FormData
      const formData = new FormData();
      const filename = mimeType.includes("webm")
        ? "recording.webm"
        : mimeType.includes("mp4")
          ? "recording.mp4"
          : "recording.audio";
      formData.append("audio", audioBlob, filename);

      // Add file_id - use the same logic as text chat for consistency
      // The file_id is critical for document context in voice responses
      // Use the same simple logic as handleSendMessage to ensure consistency
      let fileId: string | undefined = undefined;

      // Use the exact same logic as text chat (handleSendMessage)
      // This ensures voice chat always has the same context as text chat
      if (fileIdFromUrl && fileIdFromUrl !== "1") {
        fileId = fileIdFromUrl;
      }

      // If fileIdFromUrl is not available, try documentId (which is derived from URL)
      // documentId should be the same as fileIdFromUrl, but this is a fallback
      if (!fileId && documentId && documentId !== "1") {
        fileId = documentId;
      }

      // Last resort: if we have analysisData loaded, it means we successfully
      // fetched a document, so use the documentId that was used to fetch it
      // This ensures we always have context when analysis data is loaded
      if (!fileId && analysisData) {
        // If analysisData exists, we know a document was loaded
        // Use documentId from state (which was used to fetch the analysis)
        if (documentId && documentId !== "1") {
          fileId = documentId;
        }
      }

      if (fileId) {
        formData.append("file_id", fileId);
        console.log("[VOICE] ✅ Added file_id to request:", fileId);
        console.log("[VOICE] Analysis data available:", !!analysisData);
        if (analysisData) {
          console.log(
            "[VOICE] Analysis data highlights count:",
            analysisData.highlights?.length || 0,
          );
          console.log("[VOICE] Analysis data summary:", {
            issuesFound: analysisData.analysisSummary?.issuesFound,
            overallRisk: analysisData.analysisSummary?.overallRisk,
            estimatedRecovery: analysisData.analysisSummary?.estimatedRecovery,
          });
        }
      } else {
        console.warn(
          "[VOICE] ⚠️ No file_id available - response will not have document context",
        );
        console.warn("[VOICE] fileIdFromUrl:", fileIdFromUrl);
        console.warn("[VOICE] documentId:", documentId);
        console.warn(
          "[VOICE] analysisData?.documentId:",
          analysisData?.documentId,
        );
        console.warn("[VOICE] caseId:", caseId);
      }

      // Call voice chat endpoint
      const BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      console.log(
        "[VOICE] Calling voice chat endpoint:",
        `${BASE_URL}/chat/voice`,
      );

      const response = await fetch(`${BASE_URL}/chat/voice`, {
        method: "POST",
        body: formData,
      });

      console.log(
        "[VOICE] Response status:",
        response.status,
        response.statusText,
      );

      // Check for errors
      if (!response.ok) {
        const errorText = await response
          .text()
          .catch(() => response.statusText);
        console.error("[VOICE] Error response:", errorText);
        throw new Error(
          `Voice chat failed (${response.status}): ${errorText || response.statusText}`,
        );
      }

      // Get transcript and answer from headers (URL-encoded)
      const transcriptHeader = response.headers.get("X-Transcript-Text");
      const answerHeader = response.headers.get("X-Answer-Text");
      const languageHeader = response.headers.get("X-Language");
      const ttsErrorHeader = response.headers.get("X-TTS-Error");

      // Decode headers
      let transcriptText: string | null = null;
      let answerText: string | null = null;

      if (transcriptHeader) {
        try {
          transcriptText = decodeURIComponent(transcriptHeader);
          console.log("[VOICE] Transcript:", transcriptText);
        } catch (e) {
          console.warn("[VOICE] Failed to decode transcript header:", e);
        }
      }

      if (answerHeader) {
        try {
          answerText = decodeURIComponent(answerHeader);
          console.log("[VOICE] Answer:", answerText);
        } catch (e) {
          console.warn("[VOICE] Failed to decode answer header:", e);
        }
      }

      // Get audio response
      const audioBlobResponse = await response.blob();
      console.log(
        "[VOICE] Received audio response:",
        audioBlobResponse.size,
        "bytes, type:",
        audioBlobResponse.type,
      );

      // Handle TTS error (empty audio but text available)
      if (ttsErrorHeader === "1" && answerText) {
        console.warn("[VOICE] TTS failed, but text response available");
        toast("Voice playback unavailable, showing text response", {
          icon: "⚠️",
        });
        // Still add messages and continue
      }

      // Validate audio response (unless TTS failed)
      if (audioBlobResponse.size === 0 && ttsErrorHeader !== "1") {
        console.warn("[VOICE] Empty audio response received");
        toast.error("Received empty audio response");
        // Continue to add text messages even if audio is empty
      }

      // Play audio if available and TTS didn't fail
      if (audioBlobResponse.size > 0 && ttsErrorHeader !== "1") {
        const audioUrl = URL.createObjectURL(audioBlobResponse);

        // Create or reuse audio element
        const audio = audioPlayerRef.current || new Audio();
        audio.src = audioUrl;

        // Set up event handlers
        audio.onloadeddata = () => {
          console.log("[VOICE] Audio loaded, playing...");
          audio.play().catch((error) => {
            console.error("[VOICE] Error playing audio:", error);
            toast.error(
              "Failed to play audio response. Please check your audio settings.",
            );
          });
        };

        audio.onerror = (error) => {
          console.error("[VOICE] Audio load/play error:", error);
          toast.error("Failed to load audio response");
        };

        audio.onended = () => {
          console.log("[VOICE] Audio playback ended");
          URL.revokeObjectURL(audioUrl);
          setIsProcessingVoice(false);
        };

        // Store reference
        if (!audioPlayerRef.current) {
          audioPlayerRef.current = audio;
        }
      } else {
        // No audio to play, clear processing state immediately
        setIsProcessingVoice(false);
      }

      // Add messages to chat UI
      if (transcriptText) {
        setChatMessages((prev) => [
          ...prev,
          { role: "user", content: transcriptText },
        ]);
      }

      if (answerText) {
        setChatMessages((prev) => [
          ...prev,
          { role: "ai", content: answerText },
        ]);
      }

      if (transcriptText || answerText) {
        toast.success("Voice response received");
      }
    } catch (error: any) {
      console.error("[VOICE] Voice chat error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("[VOICE] Full error details:", {
        message: errorMessage,
        stack: error.stack,
        name: error.name,
      });

      // Provide specific error messages
      if (errorMessage.includes("404") || errorMessage.includes("not found")) {
        toast.error("Voice endpoint not found. Please check backend server.");
      } else if (
        errorMessage.includes("500") ||
        errorMessage.includes("502") ||
        errorMessage.includes("503")
      ) {
        toast.error(
          "Server error. Please check backend logs or try again later.",
        );
      } else if (
        errorMessage.includes("network") ||
        errorMessage.includes("fetch") ||
        errorMessage.includes("Failed to fetch")
      ) {
        toast.error("Network error. Please check your connection.");
      } else if (
        errorMessage.includes("permission") ||
        errorMessage.includes("Permission")
      ) {
        toast.error("Microphone permission denied. Please allow access.");
      } else {
        toast.error(`Voice chat failed: ${errorMessage.substring(0, 100)}`);
      }
    } finally {
      // Clear audio chunks
      audioChunksRef.current = [];
      // Note: isProcessingVoice is cleared in audio.onended or immediately if no audio
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const documentTitle = analysisData?.documentMetadata.fileName || "Loading...";
  const overallRisk = analysisData?.analysisSummary.overallRisk || "Unknown";
  // Use actual highlights count instead of issuesFound from summary
  const issuesFound = analysisData?.highlights?.length || 0;

  // Calculate estimated recovery using shared utility function for consistency
  const estimatedRecovery = calculateEstimatedRecovery(
    analysisData?.highlights,
    analysisData?.analysisSummary.estimatedRecovery,
  );

  // Calculate total recovery for internal use (numeric value)
  const totalRecovery = analysisData?.highlights
    ? analysisData.highlights.reduce((sum, highlight) => {
        return sum + (highlight.damages_estimate || 0);
      }, 0)
    : analysisData?.analysisSummary.potential_recovery || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="mb-1 text-2xl font-bold text-dark dark:text-white">
              {documentTitle}
            </h1>
            <p className="text-dark-5 dark:text-gray-400">
              {analysisData?.documentMetadata.uploadDate
                ? `Uploaded on ${new Date(analysisData.documentMetadata.uploadDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`
                : "Loading..."}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`${overallRisk.toLowerCase().includes("high") ? "severity-high" : overallRisk.toLowerCase().includes("medium") ? "severity-medium" : "severity-low"} rounded-full px-4 py-2 font-semibold`}
            >
              {overallRisk} Risk
            </span>
            <button
              onClick={() => setLetterModalOpen(true)}
              className="btn-gradient px-8 py-3 font-semibold"
            >
              Generate Demand Letter
            </button>
            <button
              onClick={() => setCaseModalOpen(true)}
              className="btn-glass px-8 py-3 font-semibold"
            >
              Save as Case
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Document Viewer */}
        <div className="lg:col-span-2">
          <div className="glass-card flex h-[calc(100vh-12rem)] flex-col">
            <h2 className="mb-4 flex-shrink-0 text-lg font-bold text-dark dark:text-white">
              Document Viewer
            </h2>
            <div className="flex-1 overflow-hidden rounded-2xl bg-white dark:bg-dark-2">
              <PdfAnalysisViewer
                ref={pdfViewerRef}
                documentId={documentId}
                onSelectIssue={(highlightId) => {
                  console.log("Selected highlight:", highlightId);
                }}
              />
            </div>
          </div>
        </div>

        {/* Issues Panel */}
        <div className="flex h-[calc(100vh-12rem)] flex-col space-y-4">
          {/* Financial Summary */}
          <div className="glass-card flex-shrink-0 rounded-3xl border-2 border-gold-200/50 bg-gradient-to-br from-gold-50/60 via-peach-50/40 to-coral-50/40 p-6 dark:border-gold-800/30 dark:from-gold-900/20 dark:via-peach-900/20 dark:to-coral-900/20">
            <div className="mb-4 text-center">
              <div className="gradient-text mb-1 text-4xl font-bold">
                {estimatedRecovery}
              </div>
              <p className="text-sm font-semibold text-dark dark:text-white">
                You might be owed
              </p>
            </div>
            {issues &&
              issues.filter(
                (issue) => issue.damages_estimate && issue.damages_estimate > 0,
              ).length > 0 && (
                <div className="custom-scrollbar max-h-64 overflow-y-auto pr-2">
                  <div className="space-y-2">
                    {issues
                      .filter(
                        (issue) =>
                          issue.damages_estimate && issue.damages_estimate > 0,
                      )
                      .sort(
                        (a, b) =>
                          (b.damages_estimate || 0) - (a.damages_estimate || 0),
                      )
                      .map((issue, idx) => (
                        <div
                          key={issue.id || idx}
                          className="flex flex-col gap-1 rounded-xl border border-peach-200/40 bg-white/70 p-2.5 backdrop-blur-sm transition-all duration-200 hover:border-coral-400/60 hover:bg-white/90 dark:border-coral-500/30 dark:bg-white/10 dark:hover:border-coral-500/50 dark:hover:bg-white/15"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-xs font-semibold text-dark dark:text-white">
                                {issue.category}
                              </p>
                              {issue.statute && (
                                <p className="mt-0.5 truncate text-xs text-dark-5 dark:text-gray-400">
                                  {issue.statute}
                                </p>
                              )}
                            </div>
                            <div className="flex-shrink-0">
                              <span className="gradient-text whitespace-nowrap text-sm font-bold">
                                ${issue.damages_estimate?.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            {(!issues ||
              issues.filter(
                (issue) => issue.damages_estimate && issue.damages_estimate > 0,
              ).length === 0) && (
              <div className="text-center text-sm text-dark-5 dark:text-gray-400">
                No financial damages estimated
              </div>
            )}
          </div>

          {/* Issues List */}
          <div className="glass-card flex min-h-0 flex-1 flex-col">
            <h2 className="mb-4 flex-shrink-0 text-lg font-bold text-dark dark:text-white">
              Findings {issuesFound > 0 && `(${issuesFound})`}
            </h2>
            <div className="custom-scrollbar flex-1 space-y-3 overflow-y-auto pr-2">
              {issues.length > 0 ? (
                issues.map((issue, idx) => {
                  const severity = getSeverityFromColor(issue.color);
                  const amountDisplay =
                    issue.damages_estimate && issue.damages_estimate > 0
                      ? `$${issue.damages_estimate.toLocaleString()}`
                      : null;

                  return (
                    <div
                      key={issue.id}
                      onClick={() => {
                        setSelectedIssue(selectedIssue === idx ? null : idx);
                        // Scroll to highlight in PDF
                        if (pdfViewerRef.current) {
                          pdfViewerRef.current.scrollToHighlight(issue.id);
                        }
                      }}
                      className={`cursor-pointer rounded-2xl border-l-4 p-4 transition-all duration-300 hover:scale-[1.02] ${
                        severity === "high"
                          ? "border-coral-400 bg-coral-50/50 dark:bg-coral-900/10"
                          : severity === "medium"
                            ? "border-gold-400 bg-gold-50/50 dark:bg-gold-900/10"
                            : "border-mint-400 bg-mint-50/50 dark:bg-mint-900/10"
                      } ${selectedIssue === idx ? "shadow-soft-2 ring-2 ring-coral-400" : ""}`}
                    >
                      <div className="mb-2 flex items-start justify-between">
                        <h3 className="flex-1 font-bold text-dark dark:text-white">
                          {issue.category}
                        </h3>
                        <span
                          className={`ml-2 rounded-full px-2.5 py-1 text-xs font-semibold ${severityColors[severity]}`}
                        >
                          {severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="mb-2 text-sm text-dark-5 dark:text-gray-400">
                        {issue.text.length > 100
                          ? issue.text.substring(0, 100) + "..."
                          : issue.text}
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        {issue.statute && (
                          <span className="rounded-full bg-peach-100 px-3 py-1 font-mono text-xs font-semibold text-peach-700 dark:bg-peach-900/30 dark:text-peach-400">
                            {issue.statute}
                          </span>
                        )}
                        {amountDisplay && (
                          <span className="gradient-text text-sm font-bold">
                            {amountDisplay}
                          </span>
                        )}
                      </div>
                      {selectedIssue === idx && (
                        <div className="mt-4 space-y-3 border-t border-peach-200/50 pt-4 dark:border-coral-500/20">
                          <div>
                            <h4 className="mb-1 text-sm font-bold text-dark dark:text-white">
                              Explanation
                            </h4>
                            <p className="text-sm leading-relaxed text-dark-5 dark:text-gray-400">
                              {issue.explanation}
                            </p>
                          </div>
                          {issue.damages_estimate &&
                            issue.damages_estimate > 0 && (
                              <div>
                                <h4 className="mb-1 text-sm font-bold text-dark dark:text-white">
                                  Potential Recovery
                                </h4>
                                <p className="text-sm leading-relaxed text-dark-5 dark:text-gray-400">
                                  ${issue.damages_estimate.toLocaleString()}
                                </p>
                              </div>
                            )}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center text-dark-5 dark:text-gray-400">
                  Loading issues...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* AI Chat Panel */}
      {chatOpen && (
        <div className="glass-card fixed bottom-6 right-6 z-50 w-96 rounded-3xl shadow-2xl">
          <div className="flex items-center justify-between border-b border-peach-200/50 p-4 dark:border-coral-500/20">
            <div className="flex items-center gap-2">
              <SparklesIcon className="size-5 text-coral-500 dark:text-coral-400" />
              <span className="font-bold text-dark dark:text-white">
                AI Helper
              </span>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="rounded-full p-1.5 hover:bg-peach-100 dark:hover:bg-coral-500/20"
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
          <div className="custom-scrollbar h-96 space-y-4 overflow-y-auto p-4">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-3 text-sm ${
                    msg.role === "user"
                      ? "bg-peach-200 text-dark dark:bg-peach-900/30 dark:text-white"
                      : "bg-gradient-to-br from-peach-100/60 to-coral-100/60 text-dark dark:from-coral-500/20 dark:to-orchid-500/20 dark:text-white"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2 border-t border-peach-200/50 pt-2 dark:border-coral-500/20">
                      <p className="mb-1 text-xs font-semibold text-dark-5 dark:text-gray-400">
                        Sources:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {msg.sources.map((source, sourceIdx) => (
                          <span
                            key={sourceIdx}
                            className="rounded-full bg-peach-100 px-2 py-0.5 text-xs font-medium text-peach-700 dark:bg-peach-900/30 dark:text-peach-400"
                          >
                            M.G.L. c. {source.chapter} §{source.section}
                            {source.relevance && (
                              <span className="ml-1 opacity-70">
                                ({parseFloat(source.relevance) * 100}%)
                              </span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-gradient-to-br from-peach-100/60 to-coral-100/60 p-3 dark:from-coral-500/20 dark:to-orchid-500/20">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-coral-500"></div>
                    <div
                      className="h-2 w-2 animate-bounce rounded-full bg-coral-500"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="h-2 w-2 animate-bounce rounded-full bg-coral-500"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatMessagesEndRef} />
          </div>
          <div className="border-t border-peach-200/50 p-4 dark:border-coral-500/20">
            <div className="mb-2 flex flex-wrap gap-2">
              {[
                "Explain this in simple words",
                "What should I ask my landlord?",
                "Can I get my deposit back?",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={async () => {
                    setChatInput(suggestion);
                    await handleSendMessage(suggestion);
                  }}
                  className="glass rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-300 hover:scale-105"
                >
                  {suggestion}
                </button>
              ))}
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await handleSendMessage(chatInput);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask a question..."
                className="input-pill flex-1 py-2 text-sm"
                disabled={isTyping || isProcessingVoice || isRecording}
              />
              <div className="flex flex-col gap-1.5">
                <button
                  type="button"
                  onClick={toggleRecording}
                  disabled={isTyping || isProcessingVoice}
                  className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-semibold transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${
                    isRecording
                      ? "animate-pulse bg-red-500 text-white hover:bg-red-600"
                      : "btn-glass text-coral-600 hover:bg-peach-100 dark:text-coral-400 dark:hover:bg-coral-500/20"
                  }`}
                  title={
                    isRecording ? "Stop recording" : "Start voice recording"
                  }
                >
                  {isRecording ? (
                    <svg
                      className="h-4 w-4 shrink-0"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M6 6h12v12H6z" />
                    </svg>
                  ) : isProcessingVoice ? (
                    <div className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  ) : (
                    <svg
                      className="h-4 w-4 shrink-0"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                      <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                    </svg>
                  )}
                </button>
                <button
                  type="submit"
                  disabled={isTyping || isProcessingVoice || isRecording}
                  className="btn-gradient flex h-9 items-center justify-center rounded-full px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 rounded-full bg-gradient-primary p-5 shadow-glow-coral transition-all duration-300 hover:scale-110 active:scale-95"
        >
          <SparklesIcon className="size-7 text-white" />
        </button>
      )}

      {/* Modals */}
      <GenerateLetterModal
        isOpen={letterModalOpen}
        onClose={() => setLetterModalOpen(false)}
        documentTitle={documentTitle}
        estimatedRecovery={estimatedRecovery}
        analysisData={analysisData}
      />
      <CreateCaseModal
        isOpen={caseModalOpen}
        onClose={() => setCaseModalOpen(false)}
        documentTitle={documentTitle}
        documentId={parseInt(documentId)}
        estimatedRecovery={estimatedRecovery}
        overallRisk={overallRisk}
        issuesFound={issuesFound}
      />
    </div>
  );
}
