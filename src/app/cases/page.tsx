"use client";

import { useState } from "react";
import Link from "next/link";

export default function CasesPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  // Import mock data - in production, fetch from API
  const cases = [
    {
      id: 101,
      title: "Security Deposit – 123 Main St",
      type: "Lease",
      status: "Ready for action",
      statusColor: "severity-high",
      lastActivity: "2 hours ago",
      recovery: "$3,250",
      icon: "🏠",
    },
    {
      id: 102,
      title: "Hospital Bill – Baystate Medical",
      type: "Medical Bill",
      status: "Checking",
      statusColor: "severity-medium",
      lastActivity: "1 day ago",
      recovery: "$780",
      icon: "🏥",
    },
    {
      id: 103,
      title: "Lease – 45 Elm St",
      type: "Lease",
      status: "Resolved 🎉",
      statusColor: "severity-low",
      lastActivity: "1 week ago",
      recovery: "$1,100",
      icon: "🏠",
    },
    {
      id: 104,
      title: "Medical Bill Overcharge – MGH",
      type: "Medical Bill",
      status: "Ready for action",
      statusColor: "severity-high",
      lastActivity: "3 days ago",
      recovery: "$450",
      icon: "🏥",
    },
  ];

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
                    ? "shadow-glow-coral bg-gradient-primary text-white"
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
            <div className="border-peach-200/50 dark:border-coral-500/20 border-t pt-4">
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
                className="text-coral-500 dark:text-coral-400 h-4 w-4 transition-transform group-hover:translate-x-1"
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
              <span className="text-coral-600 dark:text-coral-400 text-sm font-semibold">
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
