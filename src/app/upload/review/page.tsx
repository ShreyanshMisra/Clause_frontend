"use client";

import { useState, useEffect } from "react";
import { SparklesIcon } from "@/components/Layouts/sidebar/icons";
import { useRouter, useSearchParams } from "next/navigation";
import {
  api,
  StatusResponse,
  MetadataResponse,
  KeyDetailsDetected,
  APIError,
} from "@/lib/api";
import toast from "react-hot-toast";
import { CardSkeleton } from "@/components/Skeletons/CardSkeleton";

export default function ReviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileId = searchParams.get("file_id");

  const [metadata, setMetadata] = useState<KeyDetailsDetected | null>(null);
  const [loading, setLoading] = useState(true);
  const [extracting, setExtracting] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [landlord, setLandlord] = useState("");
  const [tenant, setTenant] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [leaseTerm, setLeaseTerm] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [securityDeposit, setSecurityDeposit] = useState("");
  const [specialClauses, setSpecialClauses] = useState<string[]>([]);

  // Redirect if no file_id
  useEffect(() => {
    if (!fileId) {
      toast.error("No file ID found. Please upload a document first.");
      router.push("/upload");
    }
  }, [fileId, router]);

  // Start metadata extraction and poll for completion
  useEffect(() => {
    if (!fileId) return;

    let pollInterval: NodeJS.Timeout | null = null;

    const startExtraction = async () => {
      try {
        // Start metadata extraction
        await api.post("/extract-metadata", { file_id: fileId });

        // Poll for metadata extraction completion
        pollInterval = setInterval(async () => {
          try {
            const status = await api.get<StatusResponse>(`/status/${fileId}`);

            if (status.status === "metadata_extracted") {
              // Metadata extraction complete, fetch the metadata
              clearInterval(pollInterval!);
              setExtracting(false);

              const metadataResponse = await api.get<MetadataResponse>(
                `/metadata/${fileId}`,
              );

              if (metadataResponse.metadata) {
                setMetadata(metadataResponse.metadata);

                // Populate form fields
                setLandlord(metadataResponse.metadata.landlord || "");
                setTenant(metadataResponse.metadata.tenant || "");
                setPropertyAddress(
                  metadataResponse.metadata.propertyAddress || "",
                );
                setLeaseTerm(metadataResponse.metadata.leaseTerm || "");
                setMonthlyRent(
                  metadataResponse.metadata.rentAmount ||
                    metadataResponse.metadata.monthlyRent ||
                    "",
                );
                setSecurityDeposit(
                  metadataResponse.metadata.securityDeposit || "",
                );
                setSpecialClauses(
                  metadataResponse.metadata.specialClauses || [],
                );
              }

              setLoading(false);
              toast.success("Metadata extracted successfully!");
            } else if (status.status === "failed") {
              clearInterval(pollInterval!);
              throw new Error("Metadata extraction failed");
            }
          } catch (err) {
            clearInterval(pollInterval!);
            console.error("Error polling status:", err);
            throw err;
          }
        }, 500); // Poll every 500ms
      } catch (err) {
        console.error("Error starting extraction:", err);
        setError("Failed to extract metadata. Please try again.");
        setLoading(false);
        setExtracting(false);

        if (err instanceof APIError) {
          toast.error(err.detail);
        } else {
          toast.error("Failed to extract metadata");
        }
      }
    };

    startExtraction();

    // Cleanup interval on unmount
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [fileId]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fileId) {
      toast.error("No file ID found");
      return;
    }

    // Validation
    if (!landlord || !tenant || !propertyAddress) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);

    try {
      // Prepare metadata object
      const confirmedMetadata: KeyDetailsDetected = {
        landlord,
        tenant,
        propertyAddress,
        leaseTerm,
        rentAmount: monthlyRent,
        monthlyRent,
        securityDeposit,
        specialClauses,
      };

      // Send confirmed metadata to backend
      await api.post("/confirm-metadata", {
        file_id: fileId,
        metadata: confirmedMetadata,
      });

      toast.success("Metadata confirmed. Starting analysis...");

      // Navigate to analysis progress page
      router.push(`/upload?step=4&file_id=${fileId}`);
    } catch (err) {
      console.error("Error confirming metadata:", err);

      if (err instanceof APIError) {
        toast.error(err.detail);
      } else {
        toast.error("Failed to confirm metadata");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Skip to direct analysis (no metadata confirmation)
  const handleSkipToAnalysis = async () => {
    if (!fileId) return;

    setSubmitting(true);

    try {
      // Start analysis directly without metadata confirmation
      await api.post("/analyze", { file_id: fileId });

      toast.success("Starting analysis...");
      router.push(`/upload?step=4&file_id=${fileId}`);
    } catch (err) {
      console.error("Error starting analysis:", err);

      if (err instanceof APIError) {
        toast.error(err.detail);
      } else {
        toast.error("Failed to start analysis");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || extracting) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="glass-card rounded-3xl bg-gradient-to-br from-peach-50/60 via-coral-50/40 to-orchid-50/40 p-6 dark:from-coral-500/10 dark:via-orchid-500/10 dark:to-purple-500/10">
          <div className="flex items-start gap-4">
            <div className="animate-pulse rounded-full bg-gradient-primary p-3 shadow-glow-coral">
              <SparklesIcon className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="mb-1 text-xl font-bold text-dark dark:text-white">
                Extracting document details...
              </h2>
              <p className="text-sm text-dark-5 dark:text-gray-400">
                Our AI is reading your document and extracting key information.
                This may take 10-15 seconds.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="glass-card p-12 text-center">
          <div className="mb-4 text-5xl">⚠️</div>
          <h2 className="mb-2 text-2xl font-bold text-dark dark:text-white">
            Error Loading Document
          </h2>
          <p className="mb-6 text-dark-5 dark:text-gray-400">{error}</p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => router.push("/upload")}
              className="btn-glass px-6 py-3"
            >
              Back to Upload
            </button>
            <button
              onClick={handleSkipToAnalysis}
              className="btn-gradient px-6 py-3"
            >
              Skip to Analysis
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Top Info Strip */}
      <div className="glass-card rounded-3xl bg-gradient-to-br from-peach-50/60 via-coral-50/40 to-orchid-50/40 p-6 dark:from-coral-500/10 dark:via-orchid-500/10 dark:to-purple-500/10">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-gradient-primary p-3 shadow-glow-coral">
            <SparklesIcon className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="mb-1 text-xl font-bold text-dark dark:text-white">
              Review & Confirm Document Details
            </h2>
            <p className="text-sm text-dark-5 dark:text-gray-400">
              We extracted these details from your document. Please review and
              correct any mistakes before we analyze for legal issues.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Main Content Area */}
        <div className="mb-6 grid gap-6 lg:grid-cols-2">
          {/* Left: Party Information */}
          <div className="glass-card space-y-4">
            <h3 className="text-lg font-bold text-dark dark:text-white">
              Parties & Property
            </h3>

            <div>
              <label className="mb-2 block text-sm font-semibold text-dark dark:text-white">
                Landlord Name *
              </label>
              <input
                type="text"
                value={landlord}
                onChange={(e) => setLandlord(e.target.value)}
                required
                placeholder="Enter landlord name"
                className="glass w-full rounded-xl border border-peach-200/50 px-4 py-3 text-dark outline-none transition focus:border-coral-400 focus:ring-2 focus:ring-coral-400/20 dark:border-coral-500/30 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-dark dark:text-white">
                Tenant Name *
              </label>
              <input
                type="text"
                value={tenant}
                onChange={(e) => setTenant(e.target.value)}
                required
                placeholder="Enter tenant name"
                className="glass w-full rounded-xl border border-peach-200/50 px-4 py-3 text-dark outline-none transition focus:border-coral-400 focus:ring-2 focus:ring-coral-400/20 dark:border-coral-500/30 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-dark dark:text-white">
                Property Address *
              </label>
              <textarea
                value={propertyAddress}
                onChange={(e) => setPropertyAddress(e.target.value)}
                required
                placeholder="Enter property address"
                rows={3}
                className="glass w-full resize-none rounded-xl border border-peach-200/50 px-4 py-3 text-dark outline-none transition focus:border-coral-400 focus:ring-2 focus:ring-coral-400/20 dark:border-coral-500/30 dark:text-white"
              />
            </div>
          </div>

          {/* Right: Financial Details */}
          <div className="glass-card space-y-4">
            <h3 className="text-lg font-bold text-dark dark:text-white">
              Financial Terms
            </h3>

            <div>
              <label className="mb-2 block text-sm font-semibold text-dark dark:text-white">
                Lease Term
              </label>
              <input
                type="text"
                value={leaseTerm}
                onChange={(e) => setLeaseTerm(e.target.value)}
                placeholder="e.g., 12 months, Month-to-month"
                className="glass w-full rounded-xl border border-peach-200/50 px-4 py-3 text-dark outline-none transition focus:border-coral-400 focus:ring-2 focus:ring-coral-400/20 dark:border-coral-500/30 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-dark dark:text-white">
                Monthly Rent
              </label>
              <input
                type="text"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(e.target.value)}
                placeholder="e.g., $2,000"
                className="glass w-full rounded-xl border border-peach-200/50 px-4 py-3 text-dark outline-none transition focus:border-coral-400 focus:ring-2 focus:ring-coral-400/20 dark:border-coral-500/30 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-dark dark:text-white">
                Security Deposit
              </label>
              <input
                type="text"
                value={securityDeposit}
                onChange={(e) => setSecurityDeposit(e.target.value)}
                placeholder="e.g., $2,000"
                className="glass w-full rounded-xl border border-peach-200/50 px-4 py-3 text-dark outline-none transition focus:border-coral-400 focus:ring-2 focus:ring-coral-400/20 dark:border-coral-500/30 dark:text-white"
              />
            </div>

            {specialClauses && specialClauses.length > 0 && (
              <div>
                <label className="mb-2 block text-sm font-semibold text-dark dark:text-white">
                  Special Clauses
                </label>
                <div className="flex flex-wrap gap-2">
                  {specialClauses.map((clause, index) => (
                    <span
                      key={index}
                      className="glass rounded-full px-3 py-1 text-xs font-medium text-dark dark:text-white"
                    >
                      {clause}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col justify-end gap-4 sm:flex-row">
          <button
            type="button"
            onClick={() => router.push("/upload")}
            disabled={submitting}
            className="btn-glass px-8 py-4 font-semibold"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleSkipToAnalysis}
            disabled={submitting}
            className="btn-glass px-8 py-4 font-semibold"
          >
            Skip & Analyze Now
          </button>
          <button
            type="submit"
            disabled={submitting}
            className={`btn-gradient px-8 py-4 font-semibold ${
              submitting ? "cursor-not-allowed opacity-50" : ""
            }`}
          >
            {submitting ? "Confirming..." : "Confirm & Start Analysis"}
          </button>
        </div>
      </form>

      {/* Security Note */}
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
              Privacy Protected
            </p>
            <p className="text-sm leading-relaxed text-dark-5 dark:text-gray-400">
              All personal information was automatically removed before AI
              analysis. Your data is encrypted and secure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
