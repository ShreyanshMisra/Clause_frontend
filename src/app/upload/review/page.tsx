"use client";

import { useState, useEffect } from "react";
import { SparklesIcon } from "@/components/Layouts/sidebar/icons";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchAnalysis, type AnalysisData } from "@/utils/fetchAnalysis";

export default function ReviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const documentId = searchParams.get("documentId") || "1";
  
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        console.log('📄 Loading analysis for documentId:', documentId);
        const data = await fetchAnalysis(documentId);
        console.log('✅ Review page loaded data:', data);
        setAnalysisData(data);
        setError(null);
      } catch (err) {
        console.error("❌ Error loading analysis data:", err);
        setError("Failed to load document analysis");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [documentId]);

  const handleContinue = () => {
    if (confirmed && analysisData) {
      router.push(`/results/${documentId}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent mb-4" />
          <p className="text-lg text-dark dark:text-white">Loading document details...</p>
        </div>
      </div>
    );
  }

  if (error || !analysisData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl font-semibold text-red-600 mb-4">
            {error || "No analysis data available"}
          </p>
          <button
            onClick={() => router.push("/upload")}
            className="btn-gradient px-6 py-3"
          >
            Back to Upload
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Top Info Strip */}
      <div className="glass-card from-peach-50/60 via-coral-50/40 to-orchid-50/40 dark:from-coral-500/10 dark:via-orchid-500/10 rounded-3xl bg-gradient-to-br p-6 dark:to-purple-500/10">
        <div className="flex items-start gap-4">
          <div className="shadow-glow-coral rounded-full bg-gradient-primary p-3">
            <SparklesIcon className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="mb-1 text-xl font-bold text-dark dark:text-white">
              We've read your document. Let's check what we found.
            </h2>
            <p className="text-sm text-dark-5 dark:text-gray-400">
              We also removed personal details before analysis – you can review
              them below.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: What We Detected */}
        <div className="glass-card">
          <h3 className="mb-4 text-lg font-bold text-dark dark:text-white">
            Key details we detected
          </h3>
          <div className="space-y-4">
            {/* Document Type */}
            <div className="border-peach-200/50 dark:border-coral-500/20 flex items-center justify-between rounded-2xl border bg-white/40 p-4 backdrop-blur-xl dark:bg-white/5">
              <span className="text-sm font-medium text-dark-5 dark:text-gray-400">
                Document type
              </span>
              <span className="bg-peach-100 text-peach-700 dark:bg-peach-900/30 dark:text-peach-400 rounded-full px-3 py-1 text-sm font-semibold">
                {analysisData.keyDetailsDetected.leaseType}
              </span>
            </div>

            {/* Parties */}
            <div className="border-peach-200/50 dark:border-coral-500/20 rounded-2xl border bg-white/40 p-4 backdrop-blur-xl dark:bg-white/5">
              <div className="mb-3 text-sm font-medium text-dark-5 dark:text-gray-400">
                Parties
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-dark dark:text-gray-300">
                    Tenant
                  </span>
                  <span className="bg-peach-50/60 dark:bg-peach-900/20 rounded-full px-3 py-1 text-sm font-medium text-dark dark:text-gray-300">
                    {analysisData.documentMetadata.parties.tenant}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-dark dark:text-gray-300">
                    Landlord
                  </span>
                  <span className="bg-peach-50/60 dark:bg-peach-900/20 rounded-full px-3 py-1 text-sm font-medium text-dark dark:text-gray-300">
                    {analysisData.keyDetailsDetected.landlord}
                  </span>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="border-peach-200/50 dark:border-coral-500/20 flex items-center justify-between rounded-2xl border bg-white/40 p-4 backdrop-blur-xl dark:bg-white/5">
              <span className="text-sm font-medium text-dark-5 dark:text-gray-400">
                Location
              </span>
              <span className="bg-peach-50/60 dark:bg-peach-900/20 rounded-full px-3 py-1.5 text-sm font-medium text-dark dark:text-gray-300">
                {analysisData.keyDetailsDetected.propertyAddress}
              </span>
            </div>

            {/* Lease Term */}
            <div className="border-peach-200/50 dark:border-coral-500/20 rounded-2xl border bg-white/40 p-4 backdrop-blur-xl dark:bg-white/5">
              <div className="mb-3 text-sm font-medium text-dark-5 dark:text-gray-400">
                Lease Term
              </div>
              <div className="text-sm font-medium text-dark dark:text-gray-300">
                {analysisData.keyDetailsDetected.leaseTerm}
              </div>
            </div>

            {/* Amounts */}
            {(analysisData.keyDetailsDetected.monthlyRent || analysisData.keyDetailsDetected.securityDeposit) && (
              <div className="border-peach-200/50 dark:border-coral-500/20 rounded-2xl border bg-white/40 p-4 backdrop-blur-xl dark:bg-white/5">
                <div className="mb-3 text-sm font-medium text-dark-5 dark:text-gray-400">
                  Amounts
                </div>
                <div className="space-y-2">
                  {analysisData.keyDetailsDetected.monthlyRent && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-dark dark:text-gray-300">
                        Monthly rent
                      </span>
                      <span className="text-sm font-bold text-dark dark:text-white">
                        {analysisData.keyDetailsDetected.monthlyRent}
                      </span>
                    </div>
                  )}
                  {analysisData.keyDetailsDetected.securityDeposit && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-dark dark:text-gray-300">
                        Security deposit
                      </span>
                      <span className="text-sm font-bold text-dark dark:text-white">
                        {analysisData.keyDetailsDetected.securityDeposit}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Special Clauses */}
            {analysisData.keyDetailsDetected.specialClauses && 
             analysisData.keyDetailsDetected.specialClauses.length > 0 && (
              <div className="border-peach-200/50 dark:border-coral-500/20 rounded-2xl border bg-white/40 p-4 backdrop-blur-xl dark:bg-white/5">
                <div className="mb-3 text-sm font-medium text-dark-5 dark:text-gray-400">
                  Notable Clauses
                </div>
                <ul className="space-y-1">
                  {analysisData.keyDetailsDetected.specialClauses.map((clause, idx) => (
                    <li key={idx} className="text-sm text-dark dark:text-gray-300 flex items-start gap-2">
                      <span className="text-coral-500 mt-1">•</span>
                      <span>{clause}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Right: De-identification & Privacy */}
        <div className="glass-card border-mint-200/50 from-mint-50/40 dark:border-mint-800/30 dark:from-mint-900/20 rounded-3xl border-2 bg-gradient-to-br via-green-50/30 to-emerald-50/30 dark:via-green-900/20 dark:to-emerald-900/20">
          <div className="mb-4 flex items-center gap-2">
            <div className="bg-mint-200 dark:bg-mint-900/40 rounded-full p-2">
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
            <div>
              <h3 className="text-lg font-bold text-dark dark:text-white">
                We de-identified your document
              </h3>
              <p className="text-xs text-dark-5 dark:text-gray-400">
                {analysisData.deidentificationSummary.itemsRedacted} items removed for privacy
              </p>
            </div>
          </div>

          {/* De-identification Categories */}
          <div className="mb-4 space-y-2">
            <div className="text-xs font-semibold text-dark-5 dark:text-gray-400 mb-3">
              What we removed:
            </div>
            <ul className="space-y-2">
              {analysisData.deidentificationSummary.categories.map((category, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-dark dark:text-gray-300">
                  <svg className="text-mint-600 dark:text-mint-400 h-4 w-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{category}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Security Info Strip */}
          <div className="border-mint-200/50 bg-mint-50/60 dark:border-mint-800/30 dark:bg-mint-900/20 rounded-2xl border p-4 backdrop-blur-xl">
            <div className="flex items-start gap-3">
              <div className="bg-mint-200 dark:bg-mint-900/40 rounded-full p-1.5">
                <svg
                  className="text-mint-600 dark:text-mint-400 h-4 w-4"
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
                <p className="text-xs leading-relaxed text-dark-5 dark:text-gray-400">
                  Your original document is encrypted and stored securely. The
                  AI only sees de-identified text.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="glass-card sticky bottom-0">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="border-peach-300 text-coral-500 focus:ring-coral-500 h-5 w-5 rounded"
            />
            <span className="text-sm font-medium text-dark dark:text-white">
              Everything looks correct
            </span>
          </label>
          <div className="flex gap-3">
            <Link
              href="/upload"
              className="btn-glass px-8 py-3 font-semibold"
            >
              Go back & adjust
            </Link>
            <button
              onClick={handleContinue}
              disabled={!confirmed}
              className={`btn-gradient px-8 py-3 font-semibold transition-all duration-300 ${
                confirmed ? "hover:scale-105" : "cursor-not-allowed opacity-50"
              }`}
            >
              {confirmed ? (
                <span className="flex items-center gap-2">
                  Looks good, continue
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
              ) : (
                "Looks good, continue"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
