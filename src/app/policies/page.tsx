"use client";

import { useState } from "react";
import Link from "next/link";
import { SparklesIcon } from "@/components/Layouts/sidebar/icons";

export default function PoliciesPage() {
  const [activeTab, setActiveTab] = useState<"documents" | "guides">(
    "documents",
  );
  const [selectedType, setSelectedType] = useState("all");
  const [search, setSearch] = useState("");

  // Import mock data - in production, fetch from API
  const documents = [
    {
      id: 1,
      title: "Lease - 123 Main St, Apt 4B",
      type: "Lease",
      uploadedDate: "Jan 12, 2025",
      lastAnalyzed: "Jan 13, 2025",
      status: "Analyzed",
      statusColor: "severity-low",
      recovery: "$3,250",
      thumbnail: "🏠",
    },
    {
      id: 2,
      title: "Hospital Bill - Baystate Medical",
      type: "Medical Bill",
      uploadedDate: "Feb 3, 2025",
      lastAnalyzed: "Feb 3, 2025",
      status: "Needs review",
      statusColor: "severity-medium",
      recovery: "$780",
      thumbnail: "🏥",
    },
    {
      id: 3,
      title: "Lease - 45 Elm St, Unit 2",
      type: "Lease",
      uploadedDate: "Feb 20, 2025",
      lastAnalyzed: "Feb 21, 2025",
      status: "Draft case created",
      statusColor: "severity-low",
      recovery: "$1,100",
      thumbnail: "📄",
    },
    {
      id: 4,
      title: "Medical Bill - Massachusetts General Hospital",
      type: "Medical Bill",
      uploadedDate: "Mar 5, 2025",
      lastAnalyzed: "Mar 5, 2025",
      status: "Analyzed",
      statusColor: "severity-low",
      recovery: "$450",
      thumbnail: "🏥",
    },
    {
      id: 5,
      title: "Lease - 789 Pine Ave, Suite 301",
      type: "Lease",
      uploadedDate: "Mar 15, 2025",
      lastAnalyzed: "Mar 16, 2025",
      status: "Needs review",
      statusColor: "severity-medium",
      recovery: "$2,800",
      thumbnail: "🏠",
    },
  ];

  // Import mock data - in production, fetch from API
  const policies = [
    {
      id: 1,
      title: "Security Deposit Return – Massachusetts",
      type: "Law",
      summary:
        "Landlords must return the security deposit within 30 days after the end of the tenancy, along with an itemized statement of any deductions.",
      tags: ["Security Deposit", "Massachusetts", "Move-out"],
      violationFrequency: "High",
      violationColor: "severity-high",
      referencedIn: 5,
    },
    {
      id: 2,
      title: "Limits on Late Fees",
      type: "Guide",
      summary:
        "Explains when and how landlords can charge late fees, including grace periods and maximum amounts allowed by law.",
      tags: ["Late Fees", "Rent"],
      violationFrequency: "Medium",
      violationColor: "severity-medium",
      referencedIn: 2,
    },
    {
      id: 3,
      title: "Itemized Deductions for Damage",
      type: "Law",
      summary:
        "Landlords must provide an itemized list of damages before keeping any part of the deposit. This must be provided within 30 days.",
      tags: ["Damage", "Itemized List", "Security Deposit"],
      violationFrequency: "Low",
      violationColor: "severity-low",
      referencedIn: null,
    },
    {
      id: 4,
      title: "Medical Billing Transparency Requirements",
      type: "Law",
      summary:
        "Medical providers must provide clear, itemized billing statements that break down all charges and services rendered.",
      tags: ["Medical Billing", "Transparency", "Patient Rights"],
      violationFrequency: "Medium",
      violationColor: "severity-medium",
      referencedIn: 2,
    },
    {
      id: 5,
      title: "Triple Damages for Security Deposit Violations",
      type: "Law",
      summary:
        "Landlords who fail to return security deposits or provide itemized deductions on time may be liable for triple damages plus interest.",
      tags: ["Security Deposit", "Damages", "Penalties"],
      violationFrequency: "High",
      violationColor: "severity-high",
      referencedIn: 4,
    },
  ];

  const filteredPolicies = policies.filter((policy) => {
    if (
      selectedType !== "all" &&
      policy.type.toLowerCase() !== selectedType.toLowerCase()
    )
      return false;
    if (search && !policy.title.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  // Calculate filter counts for Guides & Laws tab
  const policyFilterCounts = {
    all: policies.length,
    law: policies.filter((p) => p.type.toLowerCase() === "law").length,
    guide: policies.filter((p) => p.type.toLowerCase() === "guide").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card from-peach-50/60 via-coral-50/40 to-orchid-50/40 dark:from-coral-500/10 dark:via-orchid-500/10 rounded-3xl bg-gradient-to-br p-8 dark:to-purple-500/10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="mb-2 text-3xl font-bold text-dark dark:text-white">
              Library
            </h1>
            <p className="mb-4 text-dark-5 dark:text-gray-400">
              Your past documents and the laws behind your rights.
            </p>
            <div className="border-mint-200/50 bg-mint-50/50 dark:border-mint-800/30 dark:bg-mint-900/20 inline-flex items-center gap-2 rounded-full border px-4 py-2">
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
              <span className="text-mint-700 dark:text-mint-400 text-xs font-semibold">
                Secure & private
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="glass flex gap-2 rounded-full p-1">
        <button
          onClick={() => setActiveTab("documents")}
          className={`flex-1 rounded-full px-6 py-3 font-semibold transition-all duration-300 ${
            activeTab === "documents"
              ? "shadow-glow-coral bg-gradient-primary text-white"
              : "text-dark-5 hover:text-dark dark:text-gray-400 dark:hover:text-white"
          }`}
        >
          My Documents
        </button>
        <button
          onClick={() => setActiveTab("guides")}
          className={`flex-1 rounded-full px-6 py-3 font-semibold transition-all duration-300 ${
            activeTab === "guides"
              ? "shadow-glow-coral bg-gradient-primary text-white"
              : "text-dark-5 hover:text-dark dark:text-gray-400 dark:hover:text-white"
          }`}
        >
          Guides & Laws
        </button>
      </div>

      {/* My Documents Tab */}
      {activeTab === "documents" && (
        <div className="space-y-6">
          {/* Search */}
          <div className="glass-card">
            <div className="relative">
              <input
                type="search"
                placeholder="Search documents..."
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
          </div>

          {/* Documents Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {documents.map((doc) => (
              <div key={doc.id} className="glass-card group cursor-pointer">
                {/* Thumbnail */}
                <div className="from-peach-100/60 to-coral-100/40 dark:from-coral-500/20 dark:to-orchid-500/20 mb-4 flex h-32 items-center justify-center rounded-2xl bg-gradient-to-br text-6xl transition-transform duration-300 group-hover:scale-105">
                  {doc.thumbnail}
                </div>

                {/* Title & Type */}
                <h3 className="group-hover:gradient-text mb-2 text-lg font-bold text-dark transition-colors dark:text-white">
                  {doc.title}
                </h3>
                <div className="mb-4 flex items-center gap-2">
                  <span className="bg-peach-100 text-peach-700 dark:bg-peach-900/30 dark:text-peach-400 rounded-full px-3 py-1 text-xs font-semibold">
                    {doc.type}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${doc.statusColor}`}
                  >
                    {doc.status}
                  </span>
                </div>

                {/* Metadata */}
                <div className="mb-4 space-y-2 text-sm text-dark-5 dark:text-gray-400">
                  <div className="flex justify-between">
                    <span>Uploaded</span>
                    <span className="font-medium">{doc.uploadedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last analyzed</span>
                    <span className="font-medium">{doc.lastAnalyzed}</span>
                  </div>
                </div>

                {/* Recovery Amount */}
                <div className="border-peach-200/50 dark:border-coral-500/20 mb-4 border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-dark-5 dark:text-gray-400">
                      Found up to
                    </span>
                    <span className="gradient-text text-xl font-bold">
                      {doc.recovery}
                    </span>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2">
                  <Link
                    href={`/policies/document/${doc.id}`}
                    className="shadow-soft-2 flex-1 rounded-full bg-gradient-primary px-4 py-2.5 text-center text-sm font-semibold text-white transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    Open & Ask
                  </Link>
                  <button className="glass rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-300 hover:scale-105">
                    View Analysis
                  </button>
                </div>
              </div>
            ))}
          </div>

          {documents.length === 0 && (
            <div className="glass-card p-12 text-center">
              <div className="mb-4 text-5xl">📁</div>
              <h3 className="mb-2 text-xl font-bold text-dark dark:text-white">
                No documents yet
              </h3>
              <p className="mb-6 text-dark-5 dark:text-gray-400">
                Upload your first document to get started
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
      )}

      {/* Guides & Laws Tab */}
      {activeTab === "guides" && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="glass-card">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <input
                  type="search"
                  placeholder="Search guides & laws..."
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
              <div className="flex gap-2">
                {[
                  { key: "all", label: "All" },
                  { key: "law", label: "Law" },
                  { key: "guide", label: "Guide" },
                ].map((type) => (
                  <button
                    key={type.key}
                    onClick={() => setSelectedType(type.key)}
                    className={`rounded-full px-5 py-3 font-semibold transition-all duration-300 ${
                      selectedType === type.key
                        ? "shadow-glow-coral bg-gradient-primary text-white"
                        : "glass text-dark hover:scale-105 dark:text-white"
                    }`}
                  >
                    {type.label} (
                    {
                      policyFilterCounts[
                        type.key as keyof typeof policyFilterCounts
                      ]
                    }
                    )
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Policies Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredPolicies.map((policy) => (
              <div key={policy.id} className="glass-card group cursor-pointer">
                <div className="mb-3 flex items-start justify-between">
                  <span className="bg-peach-100 text-peach-700 dark:bg-peach-900/30 dark:text-peach-400 rounded-full px-3 py-1.5 text-xs font-semibold">
                    {policy.type}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${policy.violationColor}`}
                  >
                    {policy.violationFrequency} Violations
                  </span>
                </div>
                <h3 className="group-hover:gradient-text mb-2 text-lg font-bold text-dark transition-all dark:text-white">
                  {policy.title}
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-dark-5 dark:text-gray-400">
                  {policy.summary}
                </p>
                {policy.referencedIn && (
                  <div className="border-coral-300 bg-coral-50/50 text-coral-700 dark:border-coral-700/50 dark:bg-coral-900/20 dark:text-coral-400 mb-3 rounded-full border border-dashed px-3 py-1.5 text-xs font-medium">
                    Referenced in {policy.referencedIn} of your documents
                  </div>
                )}
                <div className="mb-4 flex flex-wrap gap-2">
                  {policy.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-peach-100/60 dark:bg-peach-900/20 rounded-full px-3 py-1 text-xs font-medium text-dark-5 dark:text-gray-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <button className="text-coral-600 dark:text-coral-400 mt-4 flex items-center gap-1 text-sm font-semibold hover:underline">
                  View Details
                  <svg
                    className="h-4 w-4"
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
                </button>
              </div>
            ))}
          </div>

          {filteredPolicies.length === 0 && (
            <div className="glass-card p-12 text-center">
              <div className="mb-4 text-5xl">📚</div>
              <h3 className="mb-2 text-xl font-bold text-dark dark:text-white">
                No policies found
              </h3>
              <p className="text-dark-5 dark:text-gray-400">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
