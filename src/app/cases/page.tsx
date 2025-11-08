"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api, DocumentsListResponse, APIError } from "@/lib/api";
import toast from "react-hot-toast";
import { CardSkeleton } from "@/components/Skeletons/CardSkeleton";

interface CaseItem {
  id: string;
  title: string;
  type: string;
  status: string;
  statusColor: string;
  lastActivity: string;
  recovery: string;
  icon: string;
}

export default function CasesPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch cases from backend
  useEffect(() => {
    const fetchCases = async () => {
      try {
        setLoading(true);
        const response = await api.get<DocumentsListResponse>("/documents");

        // Transform backend response to match UI expectations
        const transformedCases: CaseItem[] = response.documents.map((doc) => {
          // Determine status and color based on backend status
          let status = "Checking";
          let statusColor = "severity-medium";

          if (doc.status === "completed") {
            status = "Ready for action";
            statusColor = "severity-high";
          } else if (doc.status === "processing") {
            status = "Checking";
            statusColor = "severity-medium";
          } else if (doc.status === "failed") {
            status = "Failed";
            statusColor = "severity-high";
          }

          // Calculate time ago from uploaded_at
          const uploadedDate = new Date(doc.uploaded_at);
          const now = new Date();
          const diffMs = now.getTime() - uploadedDate.getTime();
          const diffMins = Math.floor(diffMs / 60000);
          const diffHours = Math.floor(diffMins / 60);
          const diffDays = Math.floor(diffHours / 24);

          let lastActivity = "Just now";
          if (diffMins < 60) {
            lastActivity = `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
          } else if (diffHours < 24) {
            lastActivity = `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
          } else {
            lastActivity = `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
          }

          // Determine icon and type
          let icon = "📄";
          let type = "Document";

          if (doc.filename.toLowerCase().includes("lease")) {
            icon = "🏠";
            type = "Lease";
          } else if (
            doc.filename.toLowerCase().includes("medical") ||
            doc.filename.toLowerCase().includes("bill")
          ) {
            icon = "🏥";
            type = "Medical Bill";
          }

          return {
            id: doc.file_id,
            title: doc.filename.replace(".pdf", ""),
            type,
            status,
            statusColor,
            lastActivity,
            recovery: "$0", // Will be available after analysis
            icon,
          };
        });

        setCases(transformedCases);
        setError(null);
      } catch (err) {
        console.error("Error fetching cases:", err);

        if (err instanceof APIError) {
          setError(err.detail);
          toast.error(`Failed to load cases: ${err.detail}`);
        } else {
          setError("Failed to load cases");
          toast.error("Failed to load cases");
        }

        // Fallback to empty array on error
        setCases([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  const filteredCases = cases.filter((case_) => {
    if (filter !== "all") {
      const statusLower = case_.status.toLowerCase();
      if (filter === "ready" && !statusLower.includes("ready")) return false;
      if (filter === "checking" && !statusLower.includes("checking"))
        return false;
      if (filter === "resolved" && !statusLower.includes("resolved"))
        return false;
    }
    if (search && !case_.title.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  // Calculate filter counts
  const filterCounts = {
    all: cases.length,
    ready: cases.filter((c) => c.status.toLowerCase().includes("ready")).length,
    checking: cases.filter((c) => c.status.toLowerCase().includes("checking"))
      .length,
    resolved: cases.filter((c) => c.status.toLowerCase().includes("resolved"))
      .length,
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="glass-card p-8">
          <div className="animate-pulse">
            <div className="mb-4 h-8 w-1/4 rounded bg-peach-200 dark:bg-coral-800"></div>
            <div className="h-4 w-1/2 rounded bg-peach-200 dark:bg-coral-800"></div>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="glass-card p-12 text-center">
          <div className="mb-4 text-5xl">⚠️</div>
          <h2 className="mb-2 text-2xl font-bold text-dark dark:text-white">
            Failed to Load Cases
          </h2>
          <p className="mb-6 text-dark-5 dark:text-gray-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-gradient px-6 py-3"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="mb-1 text-3xl font-bold text-dark dark:text-white">
            My Cases
          </h1>
          <p className="text-dark-5 dark:text-gray-400">
            Track and manage your money cases
          </p>
        </div>
        <Link href="/upload" className="btn-gradient px-8 py-4 font-semibold">
          Start New Case
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="glass-card">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <input
              type="search"
              placeholder="Search cases..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-pill w-full py-3 pl-12 pr-5"
            />
            <svg
              className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-dark-5 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { key: "all", label: "All" },
              { key: "ready", label: "Ready" },
              { key: "checking", label: "Checking" },
              { key: "resolved", label: "Resolved" },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`rounded-full px-5 py-3 font-semibold transition-all duration-300 ${
                  filter === f.key
                    ? "bg-gradient-primary text-white shadow-glow-coral"
                    : "glass text-dark hover:scale-105 dark:text-white"
                }`}
              >
                {f.label} ({filterCounts[f.key as keyof typeof filterCounts]})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cases Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCases.map((case_) => (
          <Link
            key={case_.id}
            href={`/cases/${case_.id}`}
            className="glass-card group cursor-pointer"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="text-3xl">{case_.icon}</div>
                <div className="flex-1">
                  <h3 className="group-hover:gradient-text mb-1 text-lg font-bold text-dark transition-all dark:text-white">
                    {case_.title}
                  </h3>
                  <p className="text-sm text-dark-5 dark:text-gray-400">
                    {case_.type}
                  </p>
                </div>
              </div>
              <span
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${case_.statusColor}`}
              >
                {case_.status}
              </span>
            </div>
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-dark-5 dark:text-gray-400">
                Last activity
              </span>
              <span className="text-sm font-semibold text-dark dark:text-white">
                {case_.lastActivity}
              </span>
            </div>
            <div className="border-t border-peach-200/50 pt-4 dark:border-coral-500/20">
              <div className="flex items-center justify-between">
                <span className="text-sm text-dark-5 dark:text-gray-400">
                  Est. Recovery
                </span>
                <span className="gradient-text text-2xl font-bold">
                  {case_.recovery}
                </span>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <svg
                className="h-4 w-4 text-coral-500 transition-transform group-hover:translate-x-1 dark:text-coral-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <span className="text-sm font-semibold text-coral-600 dark:text-coral-400">
                View Details
              </span>
            </div>
          </Link>
        ))}
      </div>

      {filteredCases.length === 0 && (
        <div className="glass-card p-12 text-center">
          <div className="mb-4 text-5xl">📁</div>
          <h3 className="mb-2 text-xl font-bold text-dark dark:text-white">
            No cases found
          </h3>
          <p className="mb-6 text-dark-5 dark:text-gray-400">
            {search
              ? "Try adjusting your search"
              : "Get started by uploading a document"}
          </p>
          <Link
            href="/upload"
            className="btn-gradient inline-block px-8 py-4 font-semibold"
          >
            Upload Document
          </Link>
        </div>
      )}
    </div>
  );
}
