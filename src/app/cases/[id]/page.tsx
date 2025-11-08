"use client";

import { useState, use } from "react";
import { SparklesIcon } from "@/components/Layouts/sidebar/icons";
import Link from "next/link";

export default function CaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [expandedIssue, setExpandedIssue] = useState<number | null>(null);

  // Mock case data - replace with actual data fetching based on params.id
  // In production, fetch from API: const case_ = await fetchCase(params.id);
  const { id } = use(params);
  const caseId = parseInt(id);
  const caseData = {
    101: {
      id: 101,
      title: "Security Deposit – 123 Main St",
      type: "Lease",
      status: "ready",
      statusLabel: "Ready for action",
      statusColor: "coral",
      uploadedDate: "Jan 12, 2025",
      lastActivity: "Jan 15, 2025 at 2:32 PM",
      recovery: "$3,250",
      documentId: 1,
      location: "Massachusetts",
      category: "Tenant rights",
    },
    102: {
      id: 102,
      title: "Hospital Bill – Baystate Medical",
      type: "Medical Bill",
      status: "checking",
      statusLabel: "Checking",
      statusColor: "gold",
      uploadedDate: "Feb 3, 2025",
      lastActivity: "Feb 4, 2025 at 9:18 AM",
      recovery: "$780",
      documentId: 2,
      location: "Massachusetts",
      category: "Patient rights",
    },
    103: {
      id: 103,
      title: "Lease – 45 Elm St",
      type: "Lease",
      status: "resolved",
      statusLabel: "Resolved 🎉",
      statusColor: "mint",
      uploadedDate: "Feb 20, 2025",
      lastActivity: "Feb 23, 2025 at 11:01 AM",
      recovery: "$1,100",
      documentId: 3,
      location: "Massachusetts",
      category: "Tenant rights",
    },
  };

  const case_ = caseData[caseId as keyof typeof caseData] || caseData[101];

  // Case-specific data based on case ID
  const caseDetails = {
    101: {
      overview: {
        description:
          "Your landlord may be holding your security deposit longer than allowed by Massachusetts law.",
        keyPoints: [
          { label: "Deposit", value: "$1,500", icon: "💰" },
          { label: "Move-out date", value: "Apr 30, 2025", icon: "📅" },
          { label: "Days since move-out", value: "45", icon: "⏱️" },
        ],
      },
      issues: [
        {
          id: 1,
          title: "Security deposit held more than 30 days",
          severity: "high",
          summary:
            "Your landlord failed to return your security deposit within 30 days of move-out, which violates Massachusetts state law.",
          statute: "M.G.L. c. 186 §15B",
          impact:
            "You may be entitled to 3x your deposit ($4,500) plus interest.",
          explanation:
            "Under Massachusetts law, landlords have 30 days after the end of your tenancy to return your security deposit or provide an itemized list of deductions.",
          nextSteps: [
            "Send a demand letter requesting return of deposit plus triple damages",
            "File a complaint with the local housing authority if no response",
            "Consider small claims court if the amount exceeds the demand",
          ],
        },
        {
          id: 2,
          title: "Illegal late fee amount",
          severity: "medium",
          summary:
            "The late fee charged exceeds the legal limit of 5% of monthly rent or $30, whichever is greater.",
          statute: "M.G.L. c. 186 §15B",
          impact:
            "You may be entitled to a refund of the excess late fee amount.",
          explanation:
            "Massachusetts caps late fees at the greater of 5% of monthly rent or $30. Your rent is $2,000/month, so the maximum late fee is $100.",
          nextSteps: [
            "Review all late fee charges on your payment history",
            "Request refund of any excess charges",
            "Document all late fee payments made",
          ],
        },
      ],
      timeline: [
        {
          event: "Document uploaded",
          date: "Jan 12, 2025",
          time: "10:15 AM",
          note: null,
        },
        {
          event: "Initial analysis complete",
          date: "Jan 12, 2025",
          time: "10:17 AM",
          note: "AI found 3 potential issues",
        },
        {
          event: "Review confirmed",
          date: "Jan 13, 2025",
          time: "2:30 PM",
          note: "User confirmed detected information",
        },
        {
          event: "Demand letter generated",
          date: "Jan 15, 2025",
          time: "2:32 PM",
          note: "Letter ready for download",
        },
      ],
      financialSummary: {
        total: "$3,250",
        breakdown: [
          { label: "Security Deposit", amount: "$1,500", color: "peach" },
          { label: "Triple Damages", amount: "$4,500", color: "coral" },
          { label: "Interest", amount: "$250", color: "gold" },
          { label: "Illegal Fees", amount: "$200", color: "coral" },
        ],
      },
    },
    102: {
      overview: {
        description:
          "We're reviewing your medical bill for potential billing errors and overcharges.",
        keyPoints: [
          { label: "Total bill", value: "$2,450", icon: "💰" },
          { label: "Service date", value: "Jan 15, 2025", icon: "📅" },
          { label: "Days to review", value: "20", icon: "⏱️" },
        ],
      },
      issues: [
        {
          id: 1,
          title: "Unclear itemization of charges",
          severity: "medium",
          summary:
            "The bill does not clearly break down all charges and services rendered as required by law.",
          statute: "Medical Billing Transparency Act",
          impact:
            "You may be entitled to a corrected bill or refund of unclear charges.",
          explanation:
            "Massachusetts requires medical providers to provide clear, itemized billing statements.",
          nextSteps: [
            "Request an itemized bill from the provider",
            "Review each charge for accuracy",
            "Dispute any unclear or incorrect charges",
          ],
        },
      ],
      timeline: [
        {
          event: "Document uploaded",
          date: "Feb 3, 2025",
          time: "2:15 PM",
          note: null,
        },
        {
          event: "Initial analysis complete",
          date: "Feb 3, 2025",
          time: "2:18 PM",
          note: "AI found potential issues",
        },
        {
          event: "Review in progress",
          date: "Feb 4, 2025",
          time: "9:18 AM",
          note: "Analyzing billing codes",
        },
      ],
      financialSummary: {
        total: "$780",
        breakdown: [
          { label: "Potential Overcharges", amount: "$500", color: "coral" },
          { label: "Billing Errors", amount: "$280", color: "gold" },
        ],
      },
    },
    103: {
      overview: {
        description:
          "This case has been successfully resolved. Your landlord returned the deposit plus damages.",
        keyPoints: [
          { label: "Deposit returned", value: "$800", icon: "💰" },
          { label: "Resolution date", value: "Feb 23, 2025", icon: "📅" },
          { label: "Total recovered", value: "$1,100", icon: "✅" },
        ],
      },
      issues: [],
      timeline: [
        {
          event: "Document uploaded",
          date: "Feb 20, 2025",
          time: "3:30 PM",
          note: null,
        },
        {
          event: "Initial analysis complete",
          date: "Feb 20, 2025",
          time: "3:33 PM",
          note: "AI found 2 potential issues",
        },
        {
          event: "Review confirmed",
          date: "Feb 21, 2025",
          time: "10:15 AM",
          note: "User confirmed detected information",
        },
        {
          event: "Demand letter sent",
          date: "Feb 22, 2025",
          time: "2:00 PM",
          note: "Letter sent to landlord",
        },
        {
          event: "Case resolved",
          date: "Feb 23, 2025",
          time: "11:01 AM",
          note: "Deposit returned plus damages",
        },
      ],
      financialSummary: {
        total: "$1,100",
        breakdown: [
          { label: "Deposit Returned", amount: "$800", color: "mint" },
          { label: "Damages", amount: "$300", color: "mint" },
        ],
      },
    },
  };

  const caseDetail =
    caseDetails[caseId as keyof typeof caseDetails] || caseDetails[101];
  const caseOverview = caseDetail.overview;
  const issues = caseDetail.issues;
  const timeline = caseDetail.timeline;
  const financialSummary = caseDetail.financialSummary;

  const severityColors = {
    high: {
      badge: "severity-high",
      border: "border-coral-400",
      bg: "bg-coral-50/50 dark:bg-coral-900/10",
    },
    medium: {
      badge: "severity-medium",
      border: "border-gold-400",
      bg: "bg-gold-50/50 dark:bg-gold-900/10",
    },
    low: {
      badge: "severity-low",
      border: "border-mint-400",
      bg: "bg-mint-50/50 dark:bg-mint-900/10",
    },
  };

  const statusConfig = {
    checking: {
      color: "gold",
      gradient: "from-gold-400 to-peach-400",
      label: "Checking",
    },
    ready: {
      color: "coral",
      gradient: "from-coral-400 to-orchid-400",
      label: "Ready for action",
    },
    resolved: {
      color: "mint",
      gradient: "from-mint-400 to-green-400",
      label: "Resolved 🎉",
    },
  };

  const currentStatus =
    statusConfig[case_.status as keyof typeof statusConfig] ||
    statusConfig.ready;

  return (
    <div className="space-y-6">
      {/* Case Header / Hero */}
      <div className="glass-card from-peach-100/60 via-coral-100/40 to-orchid-100/40 dark:from-coral-500/15 dark:via-orchid-500/10 rounded-3xl bg-gradient-to-br p-8 dark:to-purple-500/10">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <div className="flex-1">
            <div className="mb-4 flex items-center gap-3">
              <div className="text-4xl">
                {case_.type === "Lease" ? "🏠" : "🏥"}
              </div>
              <div>
                <h1 className="mb-2 text-3xl font-bold text-dark dark:text-white">
                  {case_.title}
                </h1>
                <p className="text-dark-5 dark:text-gray-400">
                  Based on your {case_.type.toLowerCase()} uploaded on{" "}
                  {case_.uploadedDate}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`rounded-full bg-gradient-to-r ${currentStatus.gradient} shadow-soft-2 px-4 py-2 text-sm font-bold text-white`}
              >
                {case_.statusLabel}
              </span>
              <span className="bg-peach-100 text-peach-700 dark:bg-peach-900/30 dark:text-peach-400 rounded-full px-3 py-1.5 text-xs font-semibold">
                {case_.type}
              </span>
              <span className="border-peach-200/50 dark:border-coral-500/20 rounded-full border bg-white/40 px-3 py-1.5 text-xs font-medium text-dark-5 dark:bg-white/5 dark:text-gray-400">
                {case_.location} · {case_.category}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Link
              href={`/analysis?caseId=${case_.id}`}
              className="btn-gradient px-8 py-4 font-semibold"
            >
              View full analysis
            </Link>
            <Link
              href={`/policies/document/${case_.documentId}`}
              className="btn-glass px-8 py-4 text-center font-semibold"
            >
              Open source document
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content - Left Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Case Overview Card */}
          <div className="glass-card">
            <h2 className="mb-4 text-xl font-bold text-dark dark:text-white">
              Case Overview
            </h2>
            <p className="mb-6 leading-relaxed text-dark-5 dark:text-gray-400">
              {caseOverview.description}
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {caseOverview.keyPoints.map((point, idx) => (
                <div
                  key={idx}
                  className="border-peach-200/50 from-peach-50/60 to-coral-50/40 dark:border-coral-500/20 dark:from-coral-500/10 dark:to-orchid-500/10 rounded-2xl border bg-gradient-to-br p-4"
                >
                  <div className="mb-2 text-2xl">{point.icon}</div>
                  <div className="mb-1 text-xs font-medium text-dark-5 dark:text-gray-400">
                    {point.label}
                  </div>
                  <div className="text-lg font-bold text-dark dark:text-white">
                    {point.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Linked Document Card */}
          <div className="glass-card">
            <h2 className="mb-4 text-xl font-bold text-dark dark:text-white">
              Linked Document
            </h2>
            <div className="border-peach-200/50 dark:border-coral-500/20 flex items-center gap-4 rounded-2xl border bg-white/40 p-5 backdrop-blur-xl dark:bg-white/5">
              <div className="from-peach-400 to-coral-400 shadow-soft-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br text-3xl">
                {case_.type === "Lease" ? "🏠" : "🏥"}
              </div>
              <div className="flex-1">
                <h3 className="mb-1 font-bold text-dark dark:text-white">
                  Lease – 123 Main St
                </h3>
                <p className="mb-2 text-sm text-dark-5 dark:text-gray-400">
                  {case_.type} · Uploaded {case_.uploadedDate}
                </p>
                <Link
                  href={`/policies/document/${case_.documentId}`}
                  className="text-coral-600 dark:text-coral-400 inline-flex items-center gap-1 text-sm font-semibold hover:underline"
                >
                  Open document workspace
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
                </Link>
              </div>
            </div>
          </div>

          {/* Findings / Issues Section */}
          <div className="glass-card">
            <h2 className="mb-4 text-xl font-bold text-dark dark:text-white">
              Findings
            </h2>
            <div className="space-y-4">
              {issues.map((issue) => {
                const severity =
                  severityColors[issue.severity as keyof typeof severityColors];
                return (
                  <div
                    key={issue.id}
                    className={`cursor-pointer rounded-2xl border-l-4 p-5 transition-all duration-300 hover:scale-[1.02] ${severity.border} ${severity.bg} ${
                      expandedIssue === issue.id
                        ? "ring-coral-400 shadow-soft-2 ring-2"
                        : ""
                    }`}
                    onClick={() =>
                      setExpandedIssue(
                        expandedIssue === issue.id ? null : issue.id,
                      )
                    }
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <h3 className="flex-1 font-bold text-dark dark:text-white">
                        {issue.title}
                      </h3>
                      <span
                        className={`ml-2 rounded-full px-3 py-1 text-xs font-semibold ${severity.badge}`}
                      >
                        {issue.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="mb-3 leading-relaxed text-dark-5 dark:text-gray-400">
                      {issue.summary}
                    </p>
                    <div className="mb-3 flex items-center gap-2">
                      <span className="bg-peach-100 text-peach-700 dark:bg-peach-900/30 dark:text-peach-400 rounded-full px-3 py-1 font-mono text-xs font-semibold">
                        {issue.statute}
                      </span>
                      <span className="text-sm font-semibold text-dark dark:text-white">
                        Impact: {issue.impact}
                      </span>
                    </div>
                    {expandedIssue === issue.id && (
                      <div className="border-peach-200/50 dark:border-coral-500/20 mt-4 space-y-4 border-t pt-4">
                        <div>
                          <h4 className="mb-2 text-sm font-bold text-dark dark:text-white">
                            What this means
                          </h4>
                          <p className="leading-relaxed text-dark-5 dark:text-gray-400">
                            {issue.explanation}
                          </p>
                        </div>
                        <div>
                          <h4 className="mb-2 text-sm font-bold text-dark dark:text-white">
                            Suggested next steps
                          </h4>
                          <ul className="space-y-2">
                            {issue.nextSteps.map((step, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-2 text-sm text-dark-5 dark:text-gray-400"
                              >
                                <span className="text-coral-500 mt-1">•</span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <Link
                          href={`/policies/document/${case_.documentId}`}
                          className="text-coral-600 dark:text-coral-400 inline-flex items-center gap-1 text-sm font-semibold hover:underline"
                        >
                          Show in document
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
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Timeline Section */}
          <div className="glass-card">
            <h2 className="mb-6 text-xl font-bold text-dark dark:text-white">
              Timeline
            </h2>
            <div className="relative">
              <div className="from-peach-200 via-coral-200 to-mint-200 dark:from-coral-500/30 dark:via-orchid-500/30 dark:to-mint-500/30 absolute bottom-0 left-6 top-0 w-0.5 bg-gradient-to-b"></div>
              <div className="space-y-6">
                {timeline.map((item, idx) => (
                  <div key={idx} className="relative flex items-start gap-4">
                    <div className="shadow-glow-coral relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-primary text-white">
                      {idx === timeline.length - 1 ? (
                        <svg
                          className="h-6 w-6"
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
                      ) : (
                        <div className="h-3 w-3 rounded-full bg-white"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="mb-1 flex items-center gap-2">
                        <h3 className="font-bold text-dark dark:text-white">
                          {item.event}
                        </h3>
                        <span className="text-xs text-dark-5 dark:text-gray-400">
                          {item.date} at {item.time}
                        </span>
                      </div>
                      {item.note && (
                        <p className="text-sm text-dark-5 dark:text-gray-400">
                          {item.note}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Right Column */}
        <div className="space-y-6">
          {/* Case Status Card */}
          <div className="glass-card">
            <h3 className="mb-4 text-lg font-bold text-dark dark:text-white">
              Case Status
            </h3>
            <div className="space-y-4">
              <div>
                <div
                  className={`mb-3 inline-block rounded-full bg-gradient-to-r ${currentStatus.gradient} shadow-soft-2 px-4 py-2 text-sm font-bold text-white`}
                >
                  {case_.statusLabel}
                </div>
                <p className="text-sm text-dark-5 dark:text-gray-400">
                  Last updated: {case_.lastActivity}
                </p>
              </div>
              <div className="space-y-2">
                <div className="bg-mint-50/60 dark:bg-mint-900/20 flex items-center gap-2 rounded-full px-3 py-2">
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-xs font-medium text-dark dark:text-white">
                    AI analysis complete
                  </span>
                </div>
                <div className="bg-mint-50/60 dark:bg-mint-900/20 flex items-center gap-2 rounded-full px-3 py-2">
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-xs font-medium text-dark dark:text-white">
                    Letter generated
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Summary Card */}
          <div className="glass-card border-gold-200/50 from-gold-50/60 via-peach-50/40 to-coral-50/40 dark:border-gold-800/30 dark:from-gold-900/20 dark:via-peach-900/20 dark:to-coral-900/20 rounded-3xl border-2 bg-gradient-to-br">
            <h3 className="mb-4 text-lg font-bold text-dark dark:text-white">
              Financial Summary
            </h3>
            <div className="mb-4 text-center">
              <div className="gradient-text mb-1 text-4xl font-bold">
                {financialSummary.total}
              </div>
              <p className="text-sm font-semibold text-dark dark:text-white">
                You might recover up to
              </p>
            </div>
            <div className="space-y-2">
              {financialSummary.breakdown.map((item, idx) => (
                <div
                  key={idx}
                  className="border-peach-200/50 dark:border-coral-500/20 flex items-center justify-between rounded-xl border bg-white/40 p-3 backdrop-blur-xl dark:bg-white/5"
                >
                  <span className="text-sm text-dark-5 dark:text-gray-400">
                    {item.label}
                  </span>
                  <span className="font-bold text-dark dark:text-white">
                    {item.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="glass-card">
            <h3 className="mb-4 text-lg font-bold text-dark dark:text-white">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="btn-gradient w-full py-3 font-semibold">
                Download demand letter
              </button>
              <button className="btn-glass w-full py-3 font-semibold">
                Open chat about this case
              </button>
              {case_.status !== "resolved" && (
                <button className="glass border-mint-200/50 bg-mint-50/60 hover:shadow-soft-2 dark:border-mint-800/30 dark:bg-mint-900/20 w-full rounded-full border-2 px-6 py-3 font-semibold text-dark transition-all duration-300 hover:scale-105 dark:text-white">
                  Mark case as resolved
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
