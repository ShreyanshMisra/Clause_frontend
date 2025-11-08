"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { SparklesIcon } from "@/components/Layouts/sidebar/icons";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { api, UploadResponse, APIError, StatusResponse } from "@/lib/api";
import toast from "react-hot-toast";

function ProcessingStep({ fileId }: { fileId: string }) {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("Initializing analysis...");
  const [status, setStatus] = useState<string>("processing");

  useEffect(() => {
    // Start analysis if not already started
    const startAnalysis = async () => {
      try {
        await api.post("/analyze", { file_id: fileId });
      } catch (error) {
        console.error("Error starting analysis:", error);
      }
    };

    startAnalysis();

    // Poll status every 1 second
    const pollInterval = setInterval(async () => {
      try {
        const response = await api.get<StatusResponse>(`/status/${fileId}`);

        setProgress(response.progress);
        setMessage(response.message);
        setStatus(response.status);

        // Check if completed
        if (response.status === "completed") {
          clearInterval(pollInterval);
          toast.success("Analysis complete!");

          // Wait 1 second to show completion, then redirect
          setTimeout(() => {
            router.push(`/results/${fileId}`);
          }, 1000);
        } else if (response.status === "failed") {
          clearInterval(pollInterval);
          toast.error("Analysis failed. Please try again.");
          setTimeout(() => {
            router.push("/upload");
          }, 2000);
        }
      } catch (error) {
        console.error("Error polling status:", error);
        if (error instanceof APIError) {
          toast.error("Analysis error: " + error.detail);
        }
      }
    }, 1000);

    // Safety timeout (10 minutes)
    const safetyTimeout = setTimeout(() => {
      clearInterval(pollInterval);
      toast.error(
        "Analysis is taking longer than expected. Please check back later.",
      );
      router.push("/cases");
    }, 600000);

    // Cleanup
    return () => {
      clearInterval(pollInterval);
      clearTimeout(safetyTimeout);
    };
  }, [fileId, router]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="mb-2 text-3xl font-bold text-dark dark:text-white">
          Analyzing Your Document
        </h1>
        <p className="text-dark-5 dark:text-gray-400">
          Our AI is scanning for issues and potential refunds. This may take 3-5
          minutes.
        </p>
      </div>

      <div className="glass-card rounded-3xl p-12">
        <div className="text-center">
          <div className="mb-6 inline-flex animate-spin rounded-full bg-gradient-primary p-6 shadow-glow-coral">
            <SparklesIcon className="h-12 w-12 text-white" />
          </div>
          <div className="mb-8 space-y-3">
            <p className="text-lg font-bold text-dark dark:text-white">
              {message}
            </p>
            <p className="text-sm text-dark-5 dark:text-gray-400">
              Progress: {progress}%
            </p>
            {progress >= 40 && progress < 85 && (
              <p className="text-sm text-dark-5 dark:text-gray-400">
                ⚖️ Comparing with Massachusetts General Laws
              </p>
            )}
            {progress >= 85 && progress < 100 && (
              <p className="text-sm text-dark-5 dark:text-gray-400">
                📊 Calculating potential recovery amounts
              </p>
            )}
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-peach-200 dark:bg-coral-800">
            <div
              className="h-full rounded-full bg-gradient-primary transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Cancel button */}
          <button
            onClick={async () => {
              if (confirm("Are you sure you want to cancel this analysis?")) {
                try {
                  await api.delete(`/document/${fileId}`);
                  toast.success("Analysis cancelled");
                  router.push("/upload");
                } catch (error) {
                  console.error("Error cancelling:", error);
                  toast.error("Failed to cancel analysis");
                }
              }
            }}
            className="btn-glass mt-6 px-6 py-2 text-sm"
          >
            Cancel Analysis
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UploadPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stepParam = searchParams.get("step");
  const fileIdParam = searchParams.get("file_id");
  const [step, setStep] = useState(stepParam ? parseInt(stepParam) : 1);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFileId, setUploadedFileId] = useState<string | null>(null);
  const [piiSummary, setPiiSummary] = useState<{
    [key: string]: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get fileId from either state or URL params or sessionStorage
  const fileId =
    uploadedFileId ||
    fileIdParam ||
    (typeof window !== "undefined"
      ? sessionStorage.getItem("current_file_id")
      : null);

  useEffect(() => {
    if (stepParam) {
      setStep(parseInt(stepParam));
    }
  }, [stepParam]);

  const steps = [
    { number: 1, label: "Choose Type", icon: "📋" },
    { number: 2, label: "Upload", icon: "📤" },
    { number: 3, label: "Review", icon: "🔍" },
    { number: 4, label: "Analyze", icon: "⚡" },
    { number: 5, label: "Results", icon: "✅" },
  ];

  const documentTypes = [
    {
      type: "Lease",
      icon: "🏠",
      description: "Rental lease, tenancy agreement, or housing contract",
    },
    {
      type: "Medical Bill",
      icon: "🏥",
      description:
        "Medical billing statement, invoice, or health insurance claim",
    },
    {
      type: "Other",
      icon: "📄",
      description: "Other contract or billing document",
    },
  ];

  // File validation
  const validateFile = (file: File): string | null => {
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!file.type.includes("pdf")) {
      return "Only PDF files are allowed";
    }

    if (file.size > maxSize) {
      return "File size must be less than 10MB";
    }

    return null;
  };

  // Handle file selection
  const handleFileSelect = useCallback((file: File) => {
    const error = validateFile(file);
    if (error) {
      toast.error(error);
      return;
    }

    setSelectedFile(file);
    toast.success(`Selected: ${file.name}`);
  }, []);

  // Drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect],
  );

  // File input change handler
  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect],
  );

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Upload file to backend
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    setIsProcessing(true);
    setUploadProgress(0);

    try {
      // Create FormData
      const formData = new FormData();
      formData.append("file", selectedFile);

      // Simulate progress (actual progress would require XMLHttpRequest)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      // Upload to backend
      const response = await api.post<UploadResponse>("/upload", formData);

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Store file_id in state and sessionStorage
      setUploadedFileId(response.file_id);
      sessionStorage.setItem("current_file_id", response.file_id);
      sessionStorage.setItem("document_type", selectedType || "");

      // Store PII summary
      setPiiSummary(response.pii_redacted);

      // Calculate total PII items
      const totalPII = Object.values(response.pii_redacted).reduce(
        (sum, count) => sum + count,
        0,
      );

      // Show success message with PII info
      if (totalPII > 0) {
        toast.success(
          `Upload successful! We protected ${totalPII} pieces of personal information.`,
        );
      } else {
        toast.success("Upload successful!");
      }

      // Wait a moment to show completion
      setTimeout(() => {
        // Navigate to review page with file_id
        router.push(`/upload/review?file_id=${response.file_id}`);
      }, 1000);
    } catch (error) {
      console.error("Upload error:", error);

      if (error instanceof APIError) {
        toast.error(error.detail);
      } else {
        toast.error("Upload failed. Please try again.");
      }

      setUploadProgress(0);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Step Indicator - Liquid Bubbles */}
      <div className="glass-card">
        <div className="flex items-center justify-between">
          {steps.map((s, idx) => (
            <div key={s.number} className="flex flex-1 items-center">
              <div className="flex flex-1 flex-col items-center">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold transition-all duration-500 ${
                    step >= s.number
                      ? "scale-110 bg-gradient-primary text-white shadow-glow-coral"
                      : "bg-gray-200 text-dark-5 dark:bg-gray-700 dark:text-gray-400"
                  }`}
                >
                  {step > s.number ? "✓" : s.number}
                </div>
                <span className="mt-2 text-center text-xs font-medium text-dark-5 dark:text-gray-400">
                  {s.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`mx-2 h-1.5 flex-1 rounded-full transition-all duration-500 ${
                    step > s.number
                      ? "bg-gradient-primary"
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Document Type Selection */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="mb-2 text-3xl font-bold text-dark dark:text-white">
              What would you like to analyze?
            </h1>
            <p className="text-dark-5 dark:text-gray-400">
              Pick the type of document you want to upload
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {documentTypes.map((doc) => (
              <button
                key={doc.type}
                onClick={() => {
                  setSelectedType(doc.type);
                  setStep(2);
                }}
                className={`glass-card rounded-3xl p-8 text-left transition-all duration-300 hover:scale-105 ${
                  selectedType === doc.type
                    ? "shadow-glow-coral ring-2 ring-coral-400"
                    : ""
                }`}
              >
                <div className="mb-4 text-5xl">{doc.icon}</div>
                <h3 className="mb-2 text-xl font-bold text-dark dark:text-white">
                  {doc.type}
                </h3>
                <p className="text-sm text-dark-5 dark:text-gray-400">
                  {doc.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Upload Document */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="mb-2 text-3xl font-bold text-dark dark:text-white">
              Upload Your {selectedType}
            </h1>
            <p className="text-dark-5 dark:text-gray-400">
              Drag and drop your document or click to browse
            </p>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileInputChange}
            className="hidden"
          />

          {/* Drag and Drop Zone */}
          <div
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={selectedFile ? undefined : triggerFileInput}
            className={`glass-card cursor-pointer rounded-3xl border-2 border-dashed p-16 text-center transition-all duration-300 ${
              isDragging
                ? "scale-[1.02] border-coral-400 shadow-glow-coral"
                : selectedFile
                  ? "border-mint-400 dark:border-mint-600"
                  : "border-peach-300/50 hover:border-coral-400 hover:shadow-glow-peach dark:border-coral-500/30"
            }`}
          >
            {!selectedFile ? (
              <>
                <div className="mb-6 inline-flex rounded-3xl bg-gradient-primary p-8 shadow-glow-coral">
                  <svg
                    className="h-16 w-16 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-bold text-dark dark:text-white">
                  {isDragging
                    ? "Drop your document here"
                    : "Drop your document or click to browse"}
                </h3>
                <p className="mb-6 text-dark-5 dark:text-gray-400">
                  PDF files only (Max 10MB)
                </p>
              </>
            ) : (
              <>
                <div className="mb-6 inline-flex rounded-3xl bg-gradient-to-br from-mint-400 to-mint-600 p-8 shadow-lg">
                  <svg
                    className="h-16 w-16 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-bold text-dark dark:text-white">
                  {selectedFile.name}
                </h3>
                <p className="mb-6 text-dark-5 dark:text-gray-400">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerFileInput();
                    }}
                    className="btn-glass px-6 py-3 font-semibold"
                  >
                    Choose Different File
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpload();
                    }}
                    disabled={isProcessing}
                    className={`btn-gradient px-8 py-3 font-semibold ${
                      isProcessing ? "cursor-not-allowed opacity-50" : ""
                    }`}
                  >
                    {isProcessing ? "Uploading..." : "Upload Document"}
                  </button>
                </div>

                {/* Upload Progress Bar */}
                {isProcessing && (
                  <div className="mt-6">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-peach-200 dark:bg-coral-800">
                      <div
                        className="h-full rounded-full bg-gradient-primary transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="mt-2 text-sm text-dark-5 dark:text-gray-400">
                      {uploadProgress}% complete
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Security Strip */}
          <div className="glass-card rounded-2xl border border-mint-200/50 bg-mint-50/50 p-5 dark:border-mint-800/30 dark:bg-mint-900/20">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-mint-200 p-2 dark:bg-mint-900/40">
                <svg
                  className="h-5 w-5 text-mint-600 dark:text-mint-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="mb-1 text-sm font-bold text-dark dark:text-white">
                  Secure & Private
                </p>
                <p className="text-sm leading-relaxed text-dark-5 dark:text-gray-400">
                  We'll blur out your name, address, and other sensitive details
                  before the AI sees anything. Your privacy is our priority.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Review - Redirected to separate page */}

      {/* Step 4: Processing */}
      {step === 4 && fileId && <ProcessingStep fileId={fileId} />}
      {step === 4 && !fileId && (
        <div className="glass-card p-12 text-center">
          <p className="text-dark dark:text-white">
            No file ID found. Please upload a document first.
          </p>
          <button
            onClick={() => router.push("/upload")}
            className="btn-gradient mt-4 px-6 py-3"
          >
            Back to Upload
          </button>
        </div>
      )}

      {/* Step 5: Results Summary - Redirect to results page */}
      {step === 5 && (
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="mb-2 text-3xl font-bold text-dark dark:text-white">
              Analysis Complete! 🎉
            </h1>
            <p className="text-dark-5 dark:text-gray-400">
              Redirecting to your results...
            </p>
          </div>
          <div className="glass-card p-12 text-center">
            <div className="mb-6 inline-flex animate-spin rounded-full bg-gradient-primary p-8 shadow-glow-coral">
              <SparklesIcon className="h-16 w-16 text-white" />
            </div>
            <Link
              href="/results/1"
              className="btn-gradient inline-block px-10 py-4 text-lg font-semibold"
            >
              View Full Results
            </Link>
          </div>
        </div>
      )}

      {/* Legacy Results Summary - keeping for compatibility */}
      {false && step === 999 && (
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="mb-2 text-3xl font-bold text-dark dark:text-white">
              Good news! 🎉
            </h1>
            <p className="text-dark-5 dark:text-gray-400">
              We found several issues and potential refunds
            </p>
          </div>

          <div className="glass-card rounded-3xl border-2 border-gold-200/50 bg-gradient-to-br from-gold-50/60 via-peach-50/40 to-coral-50/40 p-10 dark:border-gold-800/30 dark:from-gold-900/20 dark:via-peach-900/20 dark:to-coral-900/20">
            <div className="mb-6 text-center">
              <div className="mb-4 text-6xl">🎉</div>
              <div className="gradient-text mb-2 text-5xl font-bold">
                $3,200
              </div>
              <p className="text-lg font-semibold text-dark dark:text-white">
                You might be owed
              </p>
            </div>
            <div className="mb-8 grid gap-4 md:grid-cols-3">
              <div className="glass rounded-2xl p-5 text-center">
                <div className="mb-1 text-3xl font-bold text-dark dark:text-white">
                  $2,500
                </div>
                <div className="text-xs font-medium text-dark-5 dark:text-gray-400">
                  Security Deposit
                </div>
              </div>
              <div className="glass rounded-2xl p-5 text-center">
                <div className="mb-1 text-3xl font-bold text-dark dark:text-white">
                  $500
                </div>
                <div className="text-xs font-medium text-dark-5 dark:text-gray-400">
                  Illegal Fees
                </div>
              </div>
              <div className="glass rounded-2xl p-5 text-center">
                <div className="mb-1 text-3xl font-bold text-dark dark:text-white">
                  $200
                </div>
                <div className="text-xs font-medium text-dark-5 dark:text-gray-400">
                  Interest
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/analysis"
                className="btn-gradient flex-1 py-4 text-center font-semibold"
              >
                See full breakdown
              </Link>
              <button className="btn-glass flex-1 py-4 font-semibold">
                Start a case
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
