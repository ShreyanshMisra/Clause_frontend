"use client";

import { SparklesIcon } from "@/components/Layouts/sidebar/icons";
import Link from "next/link";

interface AnalysisPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle: string;
  estimatedRecovery: string;
  issuesFound: number;
  overallRisk: string;
  riskColor: string;
  documentId?: number;
}

export default function AnalysisPreviewModal({
  isOpen,
  onClose,
  documentTitle,
  estimatedRecovery,
  issuesFound,
  overallRisk,
  riskColor,
  documentId = 1,
}: AnalysisPreviewModalProps) {
  if (!isOpen) return null;

  const mockIssues = [
    {
      id: 1,
      title: "Security deposit held more than 30 days",
      severity: "high",
      summary:
        "We detected that your landlord may have held your security deposit longer than 30 days.",
      statute: "M.G.L. c. 186 §15B",
    },
    {
      id: 2,
      title: "Illegal late fee amount",
      severity: "medium",
      summary:
        "The late fee charged may exceed the legal limit of 5% of monthly rent or $30.",
      statute: "M.G.L. c. 186 §15B",
    },
    {
      id: 3,
      title: "Non-refundable administrative fee",
      severity: "high",
      summary:
        "Non-refundable fees may violate security deposit law requirements.",
      statute: "M.G.L. c. 186 §15B",
    },
  ];

  const severityColors = {
    high: "severity-high",
    medium: "severity-medium",
    low: "severity-low",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm dark:bg-black/60" />

      {/* Modal */}
      <div
        className="glass-card shadow-soft-3 relative z-10 w-full max-w-2xl rounded-3xl p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="from-peach-400 to-orchid-400 shadow-glow-orchid rounded-2xl bg-gradient-to-br p-3">
              <span className="text-2xl">🔍</span>
            </div>
            <div>
              <h2 className="mb-1 text-2xl font-bold text-dark dark:text-white">
                Analysis preview for {documentTitle}
              </h2>
              <p className="text-sm text-dark-5 dark:text-gray-400">
                Template only – showing mock issue and amounts.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-mint-100 text-mint-700 dark:bg-mint-900/30 dark:text-mint-400 rounded-full px-3 py-1 text-xs font-semibold">
              Mock data
            </span>
            <button
              onClick={onClose}
              className="bg-peach-100 hover:bg-peach-200 dark:bg-coral-900/30 dark:hover:bg-coral-900/50 rounded-full p-2 text-dark transition-all duration-200 hover:scale-110 dark:text-white"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="space-y-6">
          {/* Summary Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="glass border-peach-200/50 dark:border-coral-500/20 rounded-2xl border p-4 text-center">
              <div className="mb-1 text-2xl font-bold text-dark dark:text-white">
                {issuesFound}
              </div>
              <div className="text-xs text-dark-5 dark:text-gray-400">
                Issues found
              </div>
            </div>
            <div className="glass border-peach-200/50 dark:border-coral-500/20 rounded-2xl border p-4 text-center">
              <div
                className={`mb-1 rounded-full px-3 py-1 text-xs font-semibold ${riskColor} inline-block`}
              >
                {overallRisk}
              </div>
              <div className="mt-2 text-xs text-dark-5 dark:text-gray-400">
                Overall risk
              </div>
            </div>
            <div className="glass border-peach-200/50 dark:border-coral-500/20 rounded-2xl border p-4 text-center">
              <div className="gradient-text mb-1 text-2xl font-bold">
                {estimatedRecovery}
              </div>
              <div className="text-xs text-dark-5 dark:text-gray-400">
                Estimated recovery
              </div>
            </div>
          </div>

          {/* Top Issues */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-dark dark:text-white">
              Top Issues
            </h3>
            <div className="space-y-3">
              {mockIssues.map((issue) => (
                <div
                  key={issue.id}
                  className="glass border-peach-200/50 dark:border-coral-500/20 rounded-2xl border p-4"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <h4 className="font-bold text-dark dark:text-white">
                          {issue.title}
                        </h4>
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            severityColors[
                              issue.severity as keyof typeof severityColors
                            ]
                          }`}
                        >
                          {issue.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="mb-2 text-sm text-dark-5 dark:text-gray-400">
                        {issue.summary}
                      </p>
                      <span className="bg-peach-100 text-peach-700 dark:bg-peach-900/30 dark:text-peach-400 rounded-full px-3 py-1 font-mono text-xs font-semibold">
                        {issue.statute}
                      </span>
                    </div>
                    <Link
                      href={`/analysis?documentId=${documentId}&issueId=${issue.id}`}
                      onClick={onClose}
                      className="text-coral-600 dark:text-coral-400 ml-4 flex-shrink-0 text-sm font-semibold hover:underline"
                    >
                      Open full analysis →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mock Analysis Notes */}
          <div className="glass border-mint-200/50 bg-mint-50/30 dark:border-mint-800/30 dark:bg-mint-900/10 rounded-2xl border p-4">
            <h4 className="mb-2 text-sm font-bold text-dark dark:text-white">
              How this analysis was generated
            </h4>
            <ul className="space-y-1 text-xs text-dark-5 dark:text-gray-400">
              <li>• We compared your document to Massachusetts tenant laws.</li>
              <li>
                • We used a RAG pipeline over statutes, guides, and case law.
              </li>
              <li>• This is sample data for design purposes.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="btn-glass px-6 py-3 font-semibold"
          >
            Close
          </button>
          <Link
            href={`/analysis?documentId=${documentId}`}
            onClick={onClose}
            className="btn-gradient px-6 py-3 font-semibold"
          >
            Continue to full analysis
          </Link>
        </div>
      </div>
    </div>
  );
}
