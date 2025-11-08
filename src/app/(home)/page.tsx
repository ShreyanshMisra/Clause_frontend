"use client";

import { SparklesIcon } from "@/components/Layouts/sidebar/icons";
import Link from "next/link";
import RecentActivity from "@/components/MockActivity/RecentActivity";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Hero Summary Card - "My Money Home Screen" */}
      <div className="glass-card rounded-3xl bg-gradient-to-br from-peach-100/60 via-coral-100/40 to-orchid-100/40 p-8 dark:from-coral-500/15 dark:via-orchid-500/10 dark:to-purple-500/10 md:p-10">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="flex-1">
            <p className="mb-2 text-sm font-semibold text-dark-5 dark:text-gray-400">
              Hi there! 👋
            </p>
            <h1 className="mb-3 text-3xl font-bold text-dark dark:text-white md:text-4xl">
              You might be owed up to{" "}
              <span className="gradient-text text-4xl md:text-5xl">
                $12,450
              </span>
            </h1>
            <p className="text-dark-5 dark:text-gray-400">
              Based on your analyzed documents, here's what we found
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/upload"
              className="btn-gradient px-8 py-4 font-semibold"
            >
              Upload a new document
            </Link>
            <Link
              href="/results/1"
              className="btn-glass px-8 py-4 font-semibold"
            >
              View my last report
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total potential refunds found",
            value: "$12,450",
            change: "+$2,340 this month",
            icon: "💰",
            gradient: "from-gold-400 to-peach-400",
          },
          {
            label: "Documents analyzed",
            value: "47",
            change: "+12 this month",
            icon: "📄",
            gradient: "from-peach-400 to-coral-400",
          },
          {
            label: "Cases in progress",
            value: "8",
            change: "3 ready for action",
            icon: "📁",
            gradient: "from-coral-400 to-orchid-400",
          },
          {
            label: "Avg. processing time",
            value: "2.3 min",
            change: "⚡ Lightning fast",
            icon: "⚡",
            gradient: "from-mint-400 to-peach-400",
          },
        ].map((stat, idx) => (
          <div key={idx} className="glass-card group cursor-pointer">
            <div
              className={`mb-4 inline-flex rounded-2xl bg-gradient-to-br ${stat.gradient} p-3.5 shadow-soft-2`}
            >
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <div className="group-hover:gradient-text mb-1 text-3xl font-bold text-dark transition-all dark:text-white">
              {stat.value}
            </div>
            <div className="mb-2 text-sm font-medium text-dark-5 dark:text-gray-400">
              {stat.label}
            </div>
            <div className="text-xs font-semibold text-coral-600 dark:text-coral-400">
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      {/* Upload Zone - Centerpiece */}
      <div className="glass-card group cursor-pointer rounded-3xl border-2 border-dashed border-peach-300/50 bg-gradient-to-br from-peach-50/60 to-coral-50/40 p-12 text-center transition-all duration-300 hover:border-coral-400 hover:shadow-glow-peach dark:border-coral-500/30 dark:from-coral-500/10 dark:to-orchid-500/10">
        <div className="mb-6 inline-flex rounded-3xl bg-gradient-primary p-6 shadow-glow-coral">
          <svg
            className="h-12 w-12 text-white"
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
        <h3 className="mb-3 text-2xl font-bold text-dark dark:text-white">
          Drag & drop a lease or bill
        </h3>
        <p className="mx-auto mb-6 max-w-md text-dark-5 dark:text-gray-400">
          or tap to browse files. We support PDF, JPG, and PNG formats.
        </p>
        <Link
          href="/upload"
          className="btn-gradient inline-flex items-center gap-2"
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
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          Upload Document
        </Link>
        <p className="mt-4 text-xs text-dark-5 dark:text-gray-400">
          PDF, JPG, PNG up to 10MB • We automatically remove personal details
          before analysis
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Active Cases */}
        <div className="lg:col-span-2">
          <div className="glass-card">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-dark dark:text-white">
                Recent Documents
              </h2>
              <Link
                href="/cases"
                className="text-sm font-semibold text-coral-600 hover:underline dark:text-coral-400"
              >
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {[
                {
                  title: "Security Deposit – 123 Main St",
                  type: "Lease",
                  status: "High Priority",
                  statusColor: "severity-high",
                  lastUpdated: "2 hours ago",
                  recovery: "$3,200",
                  icon: "🏠",
                },
                {
                  title: "Medical Bill Overcharge",
                  type: "Medical",
                  status: "In Review",
                  statusColor: "severity-medium",
                  lastUpdated: "1 day ago",
                  recovery: "$850",
                  icon: "🏥",
                },
                {
                  title: "Late Fee Dispute",
                  type: "Lease",
                  status: "Ready for action",
                  statusColor: "severity-low",
                  lastUpdated: "3 days ago",
                  recovery: "$150",
                  icon: "🏠",
                },
              ].map((case_, idx) => (
                <div
                  key={idx}
                  className="group cursor-pointer rounded-2xl border border-peach-200/50 bg-white/40 p-5 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:border-coral-300 hover:shadow-soft-2 dark:border-coral-500/20 dark:bg-white/5 dark:hover:border-coral-500/40"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{case_.icon}</div>
                      <div className="flex-1">
                        <h3 className="mb-1 font-bold text-dark transition-colors group-hover:text-coral-600 dark:text-white dark:group-hover:text-coral-400">
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
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-dark-5 dark:text-gray-400">
                      Updated {case_.lastUpdated}
                    </span>
                    <span className="gradient-text text-xl font-bold">
                      {case_.recovery}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar - AI Helper & Recent Activity */}
        <div className="space-y-6">
          {/* AI Helper Card */}
          <div className="glass-card sticky top-24">
            <div className="mb-6 text-center">
              <div className="mb-4 inline-flex rounded-3xl bg-gradient-primary p-5 shadow-glow-coral">
                <SparklesIcon className="size-8 text-white" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-dark dark:text-white">
                AI Helper
              </h3>
              <p className="text-sm leading-relaxed text-dark-5 dark:text-gray-400">
                Ask about your rights, get instant answers about Massachusetts
                rental and medical billing laws.
              </p>
            </div>
            <button className="btn-gradient w-full py-4 font-semibold">
              Chat with AI
            </button>
            <div className="mt-4 space-y-2">
              <button className="glass w-full rounded-full px-4 py-2.5 text-left text-sm font-medium transition-all duration-300 hover:scale-105">
                💡 Explain security deposit laws
              </button>
              <button className="glass w-full rounded-full px-4 py-2.5 text-left text-sm font-medium transition-all duration-300 hover:scale-105">
                📋 What can I do about this?
              </button>
              <button className="glass w-full rounded-full px-4 py-2.5 text-left text-sm font-medium transition-all duration-300 hover:scale-105">
                ❓ How long do I have?
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
