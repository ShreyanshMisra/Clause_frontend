"use client";

import { useState } from "react";
import { SparklesIcon } from "@/components/Layouts/sidebar/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ReviewPage() {
  const [confirmed, setConfirmed] = useState(false);
  const router = useRouter();

  const detectedInfo = {
    documentType: "Lease",
    tenant: "John Smith",
    landlord: "ABC Properties LLC",
    location: "123 Main St, Boston, MA 02115",
    startDate: "January 1, 2024",
    endDate: "December 31, 2024",
    rent: "$2,000",
    securityDeposit: "$2,500",
    lateFee: "$75",
  };

  const handleContinue = () => {
    if (confirmed) {
      // Navigate to analyze step (step 4)
      router.push("/upload?step=4");
    }
  };

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
                {detectedInfo.documentType}
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
                    {detectedInfo.tenant}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-dark dark:text-gray-300">
                    Landlord
                  </span>
                  <span className="bg-peach-50/60 dark:bg-peach-900/20 rounded-full px-3 py-1 text-sm font-medium text-dark dark:text-gray-300">
                    {detectedInfo.landlord}
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
                {detectedInfo.location}
              </span>
            </div>

            {/* Dates */}
            <div className="border-peach-200/50 dark:border-coral-500/20 rounded-2xl border bg-white/40 p-4 backdrop-blur-xl dark:bg-white/5">
              <div className="mb-3 text-sm font-medium text-dark-5 dark:text-gray-400">
                Dates
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-dark dark:text-gray-300">
                    Start date
                  </span>
                  <span className="text-sm font-medium text-dark dark:text-gray-300">
                    {detectedInfo.startDate}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-dark dark:text-gray-300">
                    End date
                  </span>
                  <span className="text-sm font-medium text-dark dark:text-gray-300">
                    {detectedInfo.endDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Amounts */}
            <div className="border-peach-200/50 dark:border-coral-500/20 rounded-2xl border bg-white/40 p-4 backdrop-blur-xl dark:bg-white/5">
              <div className="mb-3 text-sm font-medium text-dark-5 dark:text-gray-400">
                Amounts
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-dark dark:text-gray-300">
                    Monthly rent
                  </span>
                  <span className="text-sm font-bold text-dark dark:text-white">
                    {detectedInfo.rent}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-dark dark:text-gray-300">
                    Security deposit
                  </span>
                  <span className="text-sm font-bold text-dark dark:text-white">
                    {detectedInfo.securityDeposit}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-dark dark:text-gray-300">
                    Late fee
                  </span>
                  <span className="text-sm font-bold text-dark dark:text-white">
                    {detectedInfo.lateFee}
                  </span>
                </div>
              </div>
            </div>
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
                This is what we send to our AI.
              </p>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="mb-4 space-y-3">
            <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-dark-5 dark:text-gray-400">
              <div>Original details</div>
              <div>AI sees this instead</div>
            </div>

            <div className="space-y-2">
              {/* Name */}
              <div className="grid grid-cols-2 gap-3">
                <div className="border-peach-200/50 dark:border-coral-500/20 rounded-xl border bg-white/60 p-3 backdrop-blur-xl dark:bg-white/5">
                  <div className="mb-1 text-xs text-dark-5 dark:text-gray-400">
                    Name
                  </div>
                  <div className="text-sm font-medium text-dark blur-sm dark:text-gray-300">
                    {detectedInfo.tenant}
                  </div>
                </div>
                <div className="border-mint-200/50 bg-mint-50/60 dark:border-mint-800/30 dark:bg-mint-900/20 rounded-xl border p-3 backdrop-blur-xl">
                  <div className="mb-1 text-xs text-dark-5 dark:text-gray-400">
                    Name
                  </div>
                  <div className="font-mono text-sm font-medium text-dark dark:text-gray-300">
                    [TENANT_1]
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="grid grid-cols-2 gap-3">
                <div className="border-peach-200/50 dark:border-coral-500/20 rounded-xl border bg-white/60 p-3 backdrop-blur-xl dark:bg-white/5">
                  <div className="mb-1 text-xs text-dark-5 dark:text-gray-400">
                    Address
                  </div>
                  <div className="text-sm font-medium text-dark blur-sm dark:text-gray-300">
                    {detectedInfo.location}
                  </div>
                </div>
                <div className="border-mint-200/50 bg-mint-50/60 dark:border-mint-800/30 dark:bg-mint-900/20 rounded-xl border p-3 backdrop-blur-xl">
                  <div className="mb-1 text-xs text-dark-5 dark:text-gray-400">
                    Address
                  </div>
                  <div className="font-mono text-sm font-medium text-dark dark:text-gray-300">
                    [ADDRESS_1]
                  </div>
                </div>
              </div>

              {/* Amount */}
              <div className="grid grid-cols-2 gap-3">
                <div className="border-peach-200/50 dark:border-coral-500/20 rounded-xl border bg-white/60 p-3 backdrop-blur-xl dark:bg-white/5">
                  <div className="mb-1 text-xs text-dark-5 dark:text-gray-400">
                    Amount
                  </div>
                  <div className="text-sm font-medium text-dark blur-sm dark:text-gray-300">
                    {detectedInfo.securityDeposit}
                  </div>
                </div>
                <div className="border-mint-200/50 bg-mint-50/60 dark:border-mint-800/30 dark:bg-mint-900/20 rounded-xl border p-3 backdrop-blur-xl">
                  <div className="mb-1 text-xs text-dark-5 dark:text-gray-400">
                    Amount
                  </div>
                  <div className="font-mono text-sm font-medium text-dark dark:text-gray-300">
                    [AMOUNT_1]
                  </div>
                </div>
              </div>
            </div>
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
              href="/upload?step=2"
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

// Wrap in Suspense for useSearchParams compatibility
function ReviewPageWrapper() {
  return <ReviewPage />;
}
