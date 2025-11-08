"use client";

import { useState } from "react";
import { SparklesIcon } from "@/components/Layouts/sidebar/icons";
import Link from "next/link";
import { use } from "react";
import AnalysisPreviewModal from "@/components/Modals/AnalysisPreviewModal";
import GenerateLetterModal from "@/components/Modals/GenerateLetterModal";
import CreateCaseModal from "@/components/Modals/CreateCaseModal";

export default function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [analysisModalOpen, setAnalysisModalOpen] = useState(false);
  const [letterModalOpen, setLetterModalOpen] = useState(false);
  const [caseModalOpen, setCaseModalOpen] = useState(false);

  // Mock results data - replace with actual data fetching based on params.id
  // In production, fetch from API: const results = await fetchResults(params.id);
  const { id } = use(params);
  const documentId = parseInt(id);
  const resultsData = {
    1: {
      documentId: 1,
      documentTitle: "Lease – 123 Main St",
      documentType: "Lease",
      estimatedRecovery: "$3,250",
      issuesFound: 3,
      overallRisk: "Medium",
      riskColor: "severity-medium",
    },
    2: {
      documentId: 2,
      documentTitle: "Hospital Bill – Baystate Medical",
      documentType: "Medical Bill",
      estimatedRecovery: "$780",
      issuesFound: 2,
      overallRisk: "Low",
      riskColor: "severity-low",
    },
    3: {
      documentId: 3,
      documentTitle: "Lease – 45 Elm St",
      documentType: "Lease",
      estimatedRecovery: "$1,100",
      issuesFound: 2,
      overallRisk: "Low",
      riskColor: "severity-low",
    },
  };

  const results =
    resultsData[documentId as keyof typeof resultsData] || resultsData[1];

  // Results-specific data based on document ID
  const resultsDetails = {
    1: {
      keyResults: [
        {
          category: "Deposits & Fees",
          icon: "💰",
          text: "Your security deposit may be held too long.",
          amount: "$1,500 at risk",
          color: "from-peach-400 to-coral-400",
        },
        {
          category: "Late Fees / Extra Charges",
          icon: "💸",
          text: "We found potential issues with late fee charges.",
          amount: "$200 in questionable fees",
          color: "from-coral-400 to-orchid-400",
        },
        {
          category: "Timeline Concerns",
          icon: "📅",
          text: "The move-out timeline and deposit return date may violate state rules.",
          amount: "45 days overdue",
          color: "from-gold-400 to-peach-400",
        },
      ],
      findingsPreview: [
        {
          id: 1,
          title: "Security deposit held more than 30 days",
          severity: "high",
          summary:
            "Landlord failed to return deposit within the legal timeframe",
          severityColor: "severity-high",
        },
        {
          id: 2,
          title: "Illegal late fee amount",
          severity: "medium",
          summary: "Late fee exceeds 5% of monthly rent or $30",
          severityColor: "severity-medium",
        },
        {
          id: 3,
          title: "Non-refundable administrative fee",
          severity: "high",
          summary: "Non-refundable fee may violate security deposit law",
          severityColor: "severity-high",
        },
      ],
    },
    2: {
      keyResults: [
        {
          category: "Billing Errors",
          icon: "💸",
          text: "We found potential overcharges in your medical bill.",
          amount: "$500 in potential overcharges",
          color: "from-coral-400 to-orchid-400",
        },
        {
          category: "Itemization Issues",
          icon: "📋",
          text: "The bill lacks clear itemization as required by law.",
          amount: "$280 in unclear charges",
          color: "from-gold-400 to-peach-400",
        },
      ],
      findingsPreview: [
        {
          id: 1,
          title: "Unclear itemization of charges",
          severity: "medium",
          summary: "Bill does not clearly break down all charges and services",
          severityColor: "severity-medium",
        },
        {
          id: 2,
          title: "Potential billing code errors",
          severity: "low",
          summary: "Some charges may be incorrectly coded",
          severityColor: "severity-low",
        },
      ],
    },
    3: {
      keyResults: [
        {
          category: "Deposits & Fees",
          icon: "💰",
          text: "Security deposit return timeline concerns.",
          amount: "$800 at risk",
          color: "from-peach-400 to-coral-400",
        },
        {
          category: "Late Fees",
          icon: "💸",
          text: "Potential late fee calculation issues.",
          amount: "$300 in fees",
          color: "from-coral-400 to-orchid-400",
        },
      ],
      findingsPreview: [
        {
          id: 1,
          title: "Security deposit held more than 30 days",
          severity: "high",
          summary:
            "Landlord failed to return deposit within the legal timeframe",
          severityColor: "severity-high",
        },
        {
          id: 2,
          title: "Late fee calculation error",
          severity: "medium",
          summary: "Late fee may have been calculated incorrectly",
          severityColor: "severity-medium",
        },
      ],
    },
  };

  const detail =
    resultsDetails[documentId as keyof typeof resultsDetails] ||
    resultsDetails[1];
  const keyResults = detail.keyResults;
  const findingsPreview = detail.findingsPreview;

  const nextSteps = [
    {
      icon: "🔍",
      title: "Read the detailed analysis",
      description:
        "See a full breakdown of every issue we found and what you can do about it",
      action: "View Analysis",
      onClick: () => setAnalysisModalOpen(true),
    },
    {
      icon: "✉️",
      title: "Generate a demand letter",
      description:
        "Create a professional letter ready to send to your landlord",
      action: "Generate Letter",
      onClick: () => setLetterModalOpen(true),
    },
    {
      icon: "📂",
      title: "Open a case to track progress",
      description:
        "Keep track of your case, save documents, and monitor your recovery",
      action: "Create Case",
      onClick: () => setCaseModalOpen(true),
    },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Hero Celebration Card */}
      <div className="glass-card from-peach-100/60 via-coral-100/40 to-orchid-100/40 dark:from-coral-500/15 dark:via-orchid-500/10 relative overflow-hidden rounded-3xl bg-gradient-to-br p-10 dark:to-purple-500/10">
        {/* Background sparkles effect */}
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <div className="absolute right-10 top-10 text-4xl">✨</div>
          <div className="absolute bottom-10 left-10 text-3xl">✨</div>
          <div className="absolute right-1/3 top-1/3 text-2xl">✨</div>
        </div>
        <div className="relative z-10 text-center">
          <div className="border-peach-200/40 dark:border-coral-500/30 mb-4 inline-flex items-center gap-2 rounded-full border bg-white/50 px-5 py-2 backdrop-blur-xl dark:bg-white/5">
            <SparklesIcon className="text-coral-500 dark:text-coral-400 h-4 w-4" />
            <span className="text-sm font-semibold text-dark dark:text-white">
              Analysis Complete
            </span>
          </div>
          <h1 className="mb-3 text-4xl font-bold text-dark dark:text-white md:text-5xl">
            Good news! Here's what we found 🎉
          </h1>
          <p className="mx-auto mb-6 max-w-2xl text-lg text-dark-5 dark:text-gray-400">
            Based on your {results.documentType.toLowerCase()} from{" "}
            {results.documentTitle}, you may be owed money.
          </p>
          <div className="mb-8">
            <div className="gradient-text mb-2 text-6xl font-bold md:text-7xl">
              {results.estimatedRecovery}
            </div>
            <p className="text-xl font-semibold text-dark dark:text-white">
              Estimated Recovery
            </p>
          </div>
          <div className="mb-8 flex items-center justify-center gap-6">
            <div className="border-peach-200/50 dark:border-coral-500/20 rounded-full border bg-white/40 px-4 py-2 backdrop-blur-xl dark:bg-white/5">
              <span className="text-sm font-medium text-dark dark:text-white">
                Potential issues found: <strong>{results.issuesFound}</strong>
              </span>
            </div>
            <div
              className={`rounded-full px-4 py-2 text-sm font-semibold ${results.riskColor}`}
            >
              Overall risk: <strong>{results.overallRisk}</strong>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href={`/analysis?documentId=${results.documentId}`}
              className="btn-gradient px-10 py-4 text-lg font-semibold"
            >
              View detailed analysis
            </Link>
            <button className="btn-glass px-10 py-4 text-lg font-semibold">
              Create a case from this document
            </button>
          </div>
        </div>
      </div>

      {/* Key Results Summary Section */}
      <div>
        <h2 className="mb-6 text-2xl font-bold text-dark dark:text-white">
          What We Found
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {keyResults.map((result, idx) => (
            <div
              key={idx}
              className="glass-card group cursor-pointer transition-all duration-300 hover:scale-105"
            >
              <div
                className={`mb-4 inline-flex rounded-2xl bg-gradient-to-br ${result.color} shadow-soft-2 p-4 text-3xl`}
              >
                {result.icon}
              </div>
              <h3 className="mb-2 text-lg font-bold text-dark dark:text-white">
                {result.category}
              </h3>
              <p className="mb-3 text-sm leading-relaxed text-dark-5 dark:text-gray-400">
                {result.text}
              </p>
              <div className="gradient-text text-xl font-bold">
                {result.amount}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Findings Preview */}
      <div className="glass-card">
        <h2 className="mb-6 text-xl font-bold text-dark dark:text-white">
          Key Issues Found
        </h2>
        <div className="space-y-3">
          {findingsPreview.map((finding) => (
            <div
              key={finding.id}
              className="border-peach-200/50 hover:border-coral-300 hover:shadow-soft-2 dark:border-coral-500/20 dark:hover:border-coral-500/40 flex items-start justify-between rounded-2xl border bg-white/40 p-4 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] dark:bg-white/5"
            >
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-3">
                  <h3 className="font-bold text-dark dark:text-white">
                    {finding.title}
                  </h3>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${finding.severityColor}`}
                  >
                    {finding.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-dark-5 dark:text-gray-400">
                  {finding.summary}
                </p>
              </div>
              <Link
                href={`/analysis?documentId=${results.documentId}&issueId=${finding.id}`}
                className="text-coral-600 dark:text-coral-400 ml-4 flex-shrink-0 text-sm font-semibold hover:underline"
              >
                Learn more →
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Next Steps Section */}
      <div>
        <h2 className="mb-6 text-2xl font-bold text-dark dark:text-white">
          What you can do next
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {nextSteps.map((step, idx) => (
            <button
              key={idx}
              onClick={step.onClick}
              className="glass-card group cursor-pointer text-left transition-all duration-300 hover:scale-105"
            >
              <div className="from-peach-400 to-coral-400 shadow-soft-2 group-hover:shadow-glow-peach mb-4 inline-flex rounded-2xl bg-gradient-to-br p-3">
                <span className="text-3xl">{step.icon}</span>
              </div>
              <h3 className="mb-2 text-lg font-bold text-dark dark:text-white">
                {step.title}
              </h3>
              <p className="mb-4 text-sm leading-relaxed text-dark-5 dark:text-gray-400">
                {step.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="btn-gradient inline-block px-6 py-2 text-sm font-semibold">
                  {step.action}
                </span>
                <svg
                  className="h-5 w-5 text-dark-5 transition-transform group-hover:translate-x-1 dark:text-gray-400"
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
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Modals */}
      <AnalysisPreviewModal
        isOpen={analysisModalOpen}
        onClose={() => setAnalysisModalOpen(false)}
        documentTitle={results.documentTitle}
        estimatedRecovery={results.estimatedRecovery}
        issuesFound={results.issuesFound}
        overallRisk={results.overallRisk}
        riskColor={results.riskColor}
        documentId={results.documentId}
      />
      <GenerateLetterModal
        isOpen={letterModalOpen}
        onClose={() => setLetterModalOpen(false)}
        documentTitle={results.documentTitle}
        estimatedRecovery={results.estimatedRecovery}
      />
      <CreateCaseModal
        isOpen={caseModalOpen}
        onClose={() => setCaseModalOpen(false)}
        documentTitle={results.documentTitle}
        documentId={results.documentId}
        estimatedRecovery={results.estimatedRecovery}
        overallRisk={results.overallRisk}
        issuesFound={results.issuesFound}
      />

      {/* Footer Actions */}
      <div className="glass-card">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2 text-sm text-dark-5 dark:text-gray-400">
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
            <span>
              We don't share your documents. You're always in control.
            </span>
          </div>
          <div className="flex gap-3">
            <Link
              href="/"
              className="btn-glass px-6 py-3 text-sm font-semibold"
            >
              Back to dashboard
            </Link>
            <Link
              href="/upload"
              className="btn-gradient px-6 py-3 text-sm font-semibold"
            >
              Upload another document
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
