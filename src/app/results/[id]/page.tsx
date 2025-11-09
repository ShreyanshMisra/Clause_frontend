"use client";

import { useState, useEffect } from "react";
import { SparklesIcon } from "@/components/Layouts/sidebar/icons";
import Link from "next/link";
import { use } from "react";
import AnalysisPreviewModal from "@/components/Modals/AnalysisPreviewModal";
import GenerateLetterModal from "@/components/Modals/GenerateLetterModal";
import CreateCaseModal from "@/components/Modals/CreateCaseModal";
import {
  fetchAnalysis,
  calculateEstimatedRecovery,
  type Highlight,
  type AnalysisData,
} from "@/utils/fetchAnalysis";

export default function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [analysisModalOpen, setAnalysisModalOpen] = useState(false);
  const [letterModalOpen, setLetterModalOpen] = useState(false);
  const [caseModalOpen, setCaseModalOpen] = useState(false);
  const [keyIssues, setKeyIssues] = useState<Highlight[]>([]);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);

  const { id } = use(params);
  const documentId = parseInt(id);

  useEffect(() => {
    const loadAnalysisData = async () => {
      try {
        const data = await fetchAnalysis(id);
        console.log("✅ Loaded analysis data:", data);
        console.log("📄 Has documentMetadata?", !!data?.documentMetadata);
        console.log("📊 Has analysisSummary?", !!data?.analysisSummary);
        setAnalysisData(data);

        if (data?.highlights) {
          const topIssues = data.highlights
            .sort((a, b) => a.priority - b.priority)
            .slice(0, 3);
          setKeyIssues(topIssues);
        }
      } catch (error) {
        console.error("❌ Error loading analysis data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadAnalysisData();
  }, [id]);

  const getRiskColor = (risk: string) => {
    const riskLower = risk.toLowerCase();
    if (riskLower.includes("high")) return "severity-high";
    if (riskLower.includes("medium")) return "severity-medium";
    return "severity-low";
  };

  // LOADING STATE CHECK - MUST COME BEFORE ANY DATA ACCESS
  if (loading) {
    return (
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="glass-card p-10 text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="text-lg text-dark dark:text-white">
            Loading analysis results...
          </p>
        </div>
      </div>
    );
  }

  // ERROR STATE CHECK - ENSURE DATA EXISTS
  if (
    !analysisData ||
    !analysisData.documentMetadata ||
    !analysisData.analysisSummary
  ) {
    return (
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="glass-card p-10 text-center">
          <p className="mb-4 text-lg text-dark dark:text-white">
            ⚠️ Unable to load analysis data
          </p>
          <Link
            href="/"
            className="btn-gradient px-6 py-3 text-sm font-semibold"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  // NOW IT'S SAFE TO ACCESS analysisData PROPERTIES
  // Use actual highlights count instead of issuesFound from summary
  const actualIssuesFound = analysisData.highlights?.length || 0;

  // Calculate estimated recovery using shared utility function for consistency
  const estimatedRecoveryAmount = calculateEstimatedRecovery(
    analysisData.highlights,
    analysisData.analysisSummary.estimatedRecovery,
  );

  const results = {
    documentId: parseInt(analysisData.documentId),
    documentTitle: analysisData.documentMetadata.fileName,
    documentType: analysisData.documentMetadata.documentType,
    estimatedRecovery: estimatedRecoveryAmount,
    issuesFound: actualIssuesFound,
    overallRisk: analysisData.analysisSummary.overallRisk,
    riskColor: getRiskColor(analysisData.analysisSummary.overallRisk),
  };

  const keyResults =
    analysisData.analysisSummary.topIssues?.map((issue, idx) => {
      const icons = ["💰", "⚖️", "📋"];
      const colors = [
        "from-peach-400 to-coral-400",
        "from-coral-400 to-orchid-400",
        "from-gold-400 to-peach-400",
      ];
      return {
        category: issue.title,
        icon: icons[idx % icons.length],
        text: `Issue severity: ${issue.severity}`,
        amount: issue.amount,
        color: colors[idx % colors.length],
      };
    }) || [];

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
      <div className="glass-card relative overflow-hidden rounded-3xl bg-gradient-to-br from-peach-100/60 via-coral-100/40 to-orchid-100/40 p-10 dark:from-coral-500/15 dark:via-orchid-500/10 dark:to-purple-500/10">
        {/* Background sparkles effect */}
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <div className="absolute right-10 top-10 text-4xl">✨</div>
          <div className="absolute bottom-10 left-10 text-3xl">✨</div>
          <div className="absolute right-1/3 top-1/3 text-2xl">✨</div>
        </div>
        <div className="relative z-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-peach-200/40 bg-white/50 px-5 py-2 backdrop-blur-xl dark:border-coral-500/30 dark:bg-white/5">
            <SparklesIcon className="h-4 w-4 text-coral-500 dark:text-coral-400" />
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
          <div className="mb-6">
            <div className="gradient-text mb-2 text-6xl font-bold md:text-7xl">
              {results.estimatedRecovery}
            </div>
            <p className="text-xl font-semibold text-dark dark:text-white">
              Estimated Recovery
            </p>
          </div>

          {/* Scrollable Financial Breakdown */}
          {analysisData?.highlights &&
            analysisData.highlights.filter(
              (h) => h.damages_estimate && h.damages_estimate > 0,
            ).length > 0 && (
              <div className="mx-auto mb-6 w-full max-w-2xl">
                <div className="glass-card rounded-2xl border-2 border-gold-200/50 bg-gradient-to-br from-gold-50/60 via-peach-50/40 to-coral-50/40 p-5 backdrop-blur-xl dark:border-gold-800/30 dark:from-gold-900/20 dark:via-peach-900/20 dark:to-coral-900/20">
                  <h3 className="mb-4 text-center text-sm font-semibold text-dark dark:text-white">
                    Breakdown by Finding
                  </h3>
                  <div className="custom-scrollbar max-h-64 space-y-2 overflow-y-auto pr-2">
                    {analysisData.highlights
                      .filter(
                        (issue) =>
                          issue.damages_estimate && issue.damages_estimate > 0,
                      )
                      .sort(
                        (a, b) =>
                          (b.damages_estimate || 0) - (a.damages_estimate || 0),
                      )
                      .map((issue, idx) => (
                        <div
                          key={issue.id || idx}
                          className="flex items-start justify-between gap-3 rounded-xl border border-peach-200/40 bg-white/70 p-3 backdrop-blur-sm transition-all duration-200 hover:border-coral-400/60 hover:bg-white/90 hover:shadow-sm dark:border-coral-500/30 dark:bg-white/10 dark:hover:border-coral-500/50 dark:hover:bg-white/15"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-dark dark:text-white">
                              {issue.category}
                            </p>
                            {issue.statute && (
                              <p className="mt-1 text-xs font-medium text-dark-5 dark:text-gray-400">
                                {issue.statute}
                              </p>
                            )}
                          </div>
                          <div className="flex-shrink-0">
                            <span className="gradient-text whitespace-nowrap text-base font-bold">
                              ${issue.damages_estimate?.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

          <div className="mb-8 flex items-center justify-center gap-6">
            <div className="rounded-full border border-peach-200/50 bg-white/40 px-4 py-2 backdrop-blur-xl dark:border-coral-500/20 dark:bg-white/5">
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
          {keyResults.length > 0 ? (
            keyResults.map((result, idx) => (
              <div
                key={idx}
                className="glass-card group cursor-pointer transition-all duration-300 hover:scale-105"
              >
                <div
                  className={`mb-4 inline-flex rounded-2xl bg-gradient-to-br ${result.color} p-4 text-3xl shadow-soft-2`}
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
            ))
          ) : (
            <div className="col-span-3 text-center text-dark-5 dark:text-gray-400">
              Loading analysis results...
            </div>
          )}
        </div>
      </div>

      {/* Findings Preview */}
      <div className="glass-card">
        <h2 className="mb-6 text-xl font-bold text-dark dark:text-white">
          Key Issues Found
        </h2>
        <div className="space-y-3">
          {keyIssues.length > 0 ? (
            keyIssues.map((issue) => {
              const severityColor =
                issue.color === "red"
                  ? "severity-high"
                  : issue.color === "yellow" || issue.color === "orange"
                    ? "severity-medium"
                    : "severity-low";
              const severityLabel =
                issue.color === "red"
                  ? "high"
                  : issue.color === "yellow" || issue.color === "orange"
                    ? "medium"
                    : "low";

              return (
                <div
                  key={issue.id}
                  className="flex items-start justify-between rounded-2xl border border-peach-200/50 bg-white/40 p-4 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:border-coral-300 hover:shadow-soft-2 dark:border-coral-500/20 dark:bg-white/5 dark:hover:border-coral-500/40"
                >
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <h3 className="font-bold text-dark dark:text-white">
                        {issue.category}
                      </h3>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${severityColor}`}
                      >
                        {severityLabel.toUpperCase()}
                      </span>
                    </div>
                    <p className="mb-2 text-sm text-dark-5 dark:text-gray-400">
                      {issue.text.length > 100
                        ? issue.text.substring(0, 100) + "..."
                        : issue.text}
                    </p>
                    {issue.statute && (
                      <p className="mt-1 text-xs text-dark-5 dark:text-gray-500">
                        <span className="font-semibold">Legal Reference:</span>{" "}
                        {issue.statute}
                      </p>
                    )}
                  </div>
                  <Link
                    href={`/analysis?documentId=${results.documentId}#${issue.id}`}
                    className="ml-4 flex-shrink-0 text-sm font-semibold text-coral-600 hover:underline dark:text-coral-400"
                  >
                    Learn more →
                  </Link>
                </div>
              );
            })
          ) : (
            <div className="text-center text-dark-5 dark:text-gray-400">
              Loading key issues...
            </div>
          )}
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
              <div className="mb-4 inline-flex rounded-2xl bg-gradient-to-br from-peach-400 to-coral-400 p-3 shadow-soft-2 group-hover:shadow-glow-peach">
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
        analysisData={analysisData}
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
