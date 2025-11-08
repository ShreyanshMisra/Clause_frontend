"use client";

import { useState, useEffect, useRef } from "react";
import { SparklesIcon } from "@/components/Layouts/sidebar/icons";
import { useSearchParams } from "next/navigation";
import GenerateLetterModal from "@/components/Modals/GenerateLetterModal";
import CreateCaseModal from "@/components/Modals/CreateCaseModal";
import dynamic from "next/dynamic";
import {
  fetchAnalysis,
  type Highlight,
  type AnalysisData,
} from "@/utils/fetchAnalysis";
import type { PdfAnalysisViewerRef } from "@/components/PdfAnalysisViewer";

const PdfAnalysisViewer = dynamic(
  () =>
    import("@/components/PdfAnalysisViewer").then((mod) => ({
      default: mod.PdfAnalysisViewer,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-4">Loading PDF viewer...</p>
        </div>
      </div>
    ),
  },
);

export default function AnalysisPage() {
  const searchParams = useSearchParams();
  const documentId = searchParams.get("documentId") || "1";
  const caseId = searchParams.get("caseId");
  const [selectedIssue, setSelectedIssue] = useState<number | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [letterModalOpen, setLetterModalOpen] = useState(false);
  const [caseModalOpen, setCaseModalOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<
    Array<{ role: "user" | "ai"; content: string }>
  >([
    {
      role: "ai",
      content:
        "Hello! I can help explain any clauses, answer questions about Massachusetts law, or guide you through next steps. 😊",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [issues, setIssues] = useState<Highlight[]>([]);
  const pdfViewerRef = useRef<PdfAnalysisViewerRef>(null);

  useEffect(() => {
    const loadAnalysisData = async () => {
      try {
        const data = await fetchAnalysis(documentId);
        console.log("✅ Analysis page loaded data:", data);
        setAnalysisData(data);
        setIssues(data.highlights);
      } catch (error) {
        console.error("❌ Error loading analysis data:", error);
      }
    };
    loadAnalysisData();
  }, [documentId]);

  const getSeverityFromColor = (color: string): "low" | "medium" | "high" => {
    if (color === "red") return "high";
    if (color === "yellow" || color === "orange") return "medium";
    return "low";
  };

  const severityColors = {
    low: "severity-low",
    medium: "severity-medium",
    high: "severity-high",
  };

  const mockChatResponses = [
    "Based on the issues found in your document, you have strong legal grounds to recover your security deposit. Under Massachusetts law, landlords must return deposits within 30 days or provide an itemized list of deductions.",
    "The illegal late fee you were charged can be disputed. Massachusetts caps late fees at the greater of 5% of monthly rent or $30. Any amount above this is illegal and must be refunded.",
    "The non-refundable administrative fee is likely illegal. Most fees collected at move-in are considered part of the security deposit and must be refundable under M.G.L. c. 186 §15B.",
    "You should send a demand letter requesting the return of your deposit plus triple damages. I can help you generate a professional demand letter using the template.",
  ];

  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;

    setChatMessages((prev) => [...prev, { role: "user", content: message }]);
    setChatInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response =
        mockChatResponses[Math.floor(Math.random() * mockChatResponses.length)];
      setChatMessages((prev) => [...prev, { role: "ai", content: response }]);
      setIsTyping(false);
    }, 1500);
  };

  const documentTitle = analysisData?.documentMetadata.fileName || "Loading...";
  const estimatedRecovery =
    analysisData?.analysisSummary.estimatedRecovery || "$0";
  const overallRisk = analysisData?.analysisSummary.overallRisk || "Unknown";
  const issuesFound = analysisData?.analysisSummary.issuesFound || 0;
  const totalRecovery = analysisData?.analysisSummary.potential_recovery || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="mb-1 text-2xl font-bold text-dark dark:text-white">
              {documentTitle}
            </h1>
            <p className="text-dark-5 dark:text-gray-400">
              {analysisData?.documentMetadata.uploadDate
                ? `Uploaded on ${new Date(analysisData.documentMetadata.uploadDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`
                : "Loading..."}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`${overallRisk.toLowerCase().includes("high") ? "severity-high" : overallRisk.toLowerCase().includes("medium") ? "severity-medium" : "severity-low"} rounded-full px-4 py-2 font-semibold`}
            >
              {overallRisk} Risk
            </span>
            <button
              onClick={() => setLetterModalOpen(true)}
              className="btn-gradient px-8 py-3 font-semibold"
            >
              Generate Demand Letter
            </button>
            <button
              onClick={() => setCaseModalOpen(true)}
              className="btn-glass px-8 py-3 font-semibold"
            >
              Save as Case
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Document Viewer */}
        <div className="lg:col-span-2">
          <div className="glass-card flex h-[calc(100vh-12rem)] flex-col">
            <h2 className="mb-4 flex-shrink-0 text-lg font-bold text-dark dark:text-white">
              Document Viewer
            </h2>
            <div className="flex-1 overflow-hidden rounded-2xl bg-white dark:bg-dark-2">
              <PdfAnalysisViewer
                ref={pdfViewerRef}
                documentId={documentId}
                onSelectIssue={(highlightId) => {
                  console.log("Selected highlight:", highlightId);
                }}
              />
            </div>
          </div>
        </div>

        {/* Issues Panel */}
        <div className="flex h-[calc(100vh-12rem)] flex-col space-y-4">
          {/* Financial Summary */}
          <div className="glass-card flex-shrink-0 rounded-3xl border-2 border-gold-200/50 bg-gradient-to-br from-gold-50/60 via-peach-50/40 to-coral-50/40 p-6 dark:border-gold-800/30 dark:from-gold-900/20 dark:via-peach-900/20 dark:to-coral-900/20">
            <div className="mb-4 text-center">
              <div className="gradient-text mb-1 text-4xl font-bold">
                {estimatedRecovery}
              </div>
              <p className="text-sm font-semibold text-dark dark:text-white">
                You might be owed
              </p>
            </div>
            {totalRecovery > 0 && (
              <div className="space-y-3">
                {issues
                  .filter(
                    (issue) =>
                      issue.damages_estimate && issue.damages_estimate > 0,
                  )
                  .map((issue, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-dark-5 dark:text-gray-400">
                        {issue.category}
                      </span>
                      <span className="font-bold text-dark dark:text-white">
                        ${issue.damages_estimate?.toLocaleString()}
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Issues List */}
          <div className="glass-card flex min-h-0 flex-1 flex-col">
            <h2 className="mb-4 flex-shrink-0 text-lg font-bold text-dark dark:text-white">
              Findings {issuesFound > 0 && `(${issuesFound})`}
            </h2>
            <div className="custom-scrollbar flex-1 space-y-3 overflow-y-auto pr-2">
              {issues.length > 0 ? (
                issues.map((issue, idx) => {
                  const severity = getSeverityFromColor(issue.color);
                  const amountDisplay =
                    issue.damages_estimate && issue.damages_estimate > 0
                      ? `$${issue.damages_estimate.toLocaleString()}`
                      : null;

                  return (
                    <div
                      key={issue.id}
                      onClick={() => {
                        setSelectedIssue(selectedIssue === idx ? null : idx);
                        // Scroll to highlight in PDF
                        if (pdfViewerRef.current) {
                          pdfViewerRef.current.scrollToHighlight(issue.id);
                        }
                      }}
                      className={`cursor-pointer rounded-2xl border-l-4 p-4 transition-all duration-300 hover:scale-[1.02] ${
                        severity === "high"
                          ? "border-coral-400 bg-coral-50/50 dark:bg-coral-900/10"
                          : severity === "medium"
                            ? "border-gold-400 bg-gold-50/50 dark:bg-gold-900/10"
                            : "border-mint-400 bg-mint-50/50 dark:bg-mint-900/10"
                      } ${selectedIssue === idx ? "shadow-soft-2 ring-2 ring-coral-400" : ""}`}
                    >
                      <div className="mb-2 flex items-start justify-between">
                        <h3 className="flex-1 font-bold text-dark dark:text-white">
                          {issue.category}
                        </h3>
                        <span
                          className={`ml-2 rounded-full px-2.5 py-1 text-xs font-semibold ${severityColors[severity]}`}
                        >
                          {severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="mb-2 text-sm text-dark-5 dark:text-gray-400">
                        {issue.text.length > 100
                          ? issue.text.substring(0, 100) + "..."
                          : issue.text}
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        {issue.statute && (
                          <span className="rounded-full bg-peach-100 px-3 py-1 font-mono text-xs font-semibold text-peach-700 dark:bg-peach-900/30 dark:text-peach-400">
                            {issue.statute}
                          </span>
                        )}
                        {amountDisplay && (
                          <span className="gradient-text text-sm font-bold">
                            {amountDisplay}
                          </span>
                        )}
                      </div>
                      {selectedIssue === idx && (
                        <div className="mt-4 space-y-3 border-t border-peach-200/50 pt-4 dark:border-coral-500/20">
                          <div>
                            <h4 className="mb-1 text-sm font-bold text-dark dark:text-white">
                              Explanation
                            </h4>
                            <p className="text-sm leading-relaxed text-dark-5 dark:text-gray-400">
                              {issue.explanation}
                            </p>
                          </div>
                          {issue.damages_estimate &&
                            issue.damages_estimate > 0 && (
                              <div>
                                <h4 className="mb-1 text-sm font-bold text-dark dark:text-white">
                                  Potential Recovery
                                </h4>
                                <p className="text-sm leading-relaxed text-dark-5 dark:text-gray-400">
                                  ${issue.damages_estimate.toLocaleString()}
                                </p>
                              </div>
                            )}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center text-dark-5 dark:text-gray-400">
                  Loading issues...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* AI Chat Panel */}
      {chatOpen && (
        <div className="glass-card fixed bottom-6 right-6 z-50 w-96 rounded-3xl shadow-2xl">
          <div className="flex items-center justify-between border-b border-peach-200/50 p-4 dark:border-coral-500/20">
            <div className="flex items-center gap-2">
              <SparklesIcon className="size-5 text-coral-500 dark:text-coral-400" />
              <span className="font-bold text-dark dark:text-white">
                AI Helper
              </span>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="rounded-full p-1.5 hover:bg-peach-100 dark:hover:bg-coral-500/20"
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
          <div className="h-96 space-y-4 overflow-y-auto p-4">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-3 text-sm ${
                    msg.role === "user"
                      ? "bg-peach-200 text-dark dark:bg-peach-900/30 dark:text-white"
                      : "bg-gradient-to-br from-peach-100/60 to-coral-100/60 text-dark dark:from-coral-500/20 dark:to-orchid-500/20 dark:text-white"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-gradient-to-br from-peach-100/60 to-coral-100/60 p-3 dark:from-coral-500/20 dark:to-orchid-500/20">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-coral-500"></div>
                    <div
                      className="h-2 w-2 animate-bounce rounded-full bg-coral-500"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="h-2 w-2 animate-bounce rounded-full bg-coral-500"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="border-t border-peach-200/50 p-4 dark:border-coral-500/20">
            <div className="mb-2 flex flex-wrap gap-2">
              {[
                "Explain this in simple words",
                "What should I ask my landlord?",
                "Can I get my deposit back?",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setChatInput(suggestion);
                    handleSendMessage(suggestion);
                  }}
                  className="glass rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-300 hover:scale-105"
                >
                  {suggestion}
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(chatInput);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask a question..."
                className="input-pill flex-1"
              />
              <button
                type="submit"
                className="btn-gradient rounded-full px-6 py-3 font-semibold"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}

      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 rounded-full bg-gradient-primary p-5 shadow-glow-coral transition-all duration-300 hover:scale-110 active:scale-95"
        >
          <SparklesIcon className="size-7 text-white" />
        </button>
      )}

      {/* Modals */}
      <GenerateLetterModal
        isOpen={letterModalOpen}
        onClose={() => setLetterModalOpen(false)}
        documentTitle={documentTitle}
        estimatedRecovery={estimatedRecovery}
      />
      <CreateCaseModal
        isOpen={caseModalOpen}
        onClose={() => setCaseModalOpen(false)}
        documentTitle={documentTitle}
        documentId={parseInt(documentId)}
        estimatedRecovery={estimatedRecovery}
        overallRisk={overallRisk}
        issuesFound={issuesFound}
      />
    </div>
  );
}
