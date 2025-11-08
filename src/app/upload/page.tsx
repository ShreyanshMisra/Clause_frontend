"use client";

import { useState, useEffect } from "react";
import { SparklesIcon } from "@/components/Layouts/sidebar/icons";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function ProcessingStep() {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = "/results/1";
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="mb-2 text-3xl font-bold text-dark dark:text-white">
          Analyzing Your Document
        </h1>
        <p className="text-dark-5 dark:text-gray-400">
          Our AI is scanning for issues and potential refunds
        </p>
      </div>

      <div className="glass-card rounded-3xl p-12">
        <div className="text-center">
          <div className="shadow-glow-coral mb-6 inline-flex animate-spin rounded-full bg-gradient-primary p-6">
            <SparklesIcon className="h-12 w-12 text-white" />
          </div>
          <div className="mb-8 space-y-3">
            <p className="animate-pulse text-lg font-bold text-dark dark:text-white">
              Scanning for clauses...
            </p>
            <p className="text-sm text-dark-5 dark:text-gray-400">
              Checking Massachusetts state laws...
            </p>
            <p className="text-sm text-dark-5 dark:text-gray-400">
              Identifying potential refunds...
            </p>
          </div>
          <div className="bg-peach-200 dark:bg-coral-800 h-2 w-full overflow-hidden rounded-full">
            <div
              className="h-full animate-pulse rounded-full bg-gradient-primary"
              style={{ width: "75%" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UploadPage() {
  const searchParams = useSearchParams();
  const stepParam = searchParams.get("step");
  const [step, setStep] = useState(stepParam ? parseInt(stepParam) : 1);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

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

  const handleUpload = () => {
    // Navigate to review page after upload
    setTimeout(() => {
      window.location.href = "/upload/review";
    }, 500);
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
                      ? "shadow-glow-coral scale-110 bg-gradient-primary text-white"
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
                    ? "ring-coral-400 shadow-glow-coral ring-2"
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
              Drag and drop your document or tap to browse
            </p>
          </div>

          <div className="glass-card border-peach-300/50 hover:border-coral-400 hover:shadow-glow-peach dark:border-coral-500/30 rounded-3xl border-2 border-dashed p-16 text-center transition-all duration-300">
            <div className="shadow-glow-coral mb-6 inline-flex rounded-3xl bg-gradient-primary p-8">
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
              Drop your document here
            </h3>
            <p className="mb-6 text-dark-5 dark:text-gray-400">
              or click to browse files
            </p>
            <button
              onClick={handleUpload}
              className="btn-gradient px-8 py-4 font-semibold"
            >
              Select File
            </button>
            <p className="mt-4 text-xs text-dark-5 dark:text-gray-400">
              Supported formats: PDF, JPG, PNG (Max 10MB)
            </p>
          </div>

          {/* Security Strip */}
          <div className="glass-card border-mint-200/50 bg-mint-50/50 dark:border-mint-800/30 dark:bg-mint-900/20 rounded-2xl border p-5">
            <div className="flex items-start gap-3">
              <div className="bg-mint-200 dark:bg-mint-900/40 mt-0.5 rounded-full p-2">
                <svg
                  className="text-mint-600 dark:text-mint-400 h-5 w-5"
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
      {step === 4 && <ProcessingStep />}

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
            <div className="shadow-glow-coral mb-6 inline-flex animate-spin rounded-full bg-gradient-primary p-8">
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

          <div className="glass-card border-gold-200/50 from-gold-50/60 via-peach-50/40 to-coral-50/40 dark:border-gold-800/30 dark:from-gold-900/20 dark:via-peach-900/20 dark:to-coral-900/20 rounded-3xl border-2 bg-gradient-to-br p-10">
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
