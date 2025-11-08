"use client";

import { useState } from "react";
import { SparklesIcon } from "@/components/Layouts/sidebar/icons";
import { useSearchParams } from "next/navigation";
import GenerateLetterModal from "@/components/Modals/GenerateLetterModal";
import CreateCaseModal from "@/components/Modals/CreateCaseModal";
import dynamic from "next/dynamic";

const PdfAnalysisViewer = dynamic(
  () => import("@/components/PdfAnalysisViewer").then((mod) => ({ default: mod.PdfAnalysisViewer })),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-screen"><div className="text-center"><div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div><p className="mt-4">Loading PDF viewer...</p></div></div> }
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

  const issues = [
    {
      title: "Deposit held too long",
      severity: "high",
      summary:
        "Your landlord may be holding your security deposit longer than allowed by Massachusetts law",
      statute: "M.G.L. c. 186 §15B",
      explanation:
        "Under Massachusetts law, landlords must return security deposits within 30 days of lease termination, along with an itemized statement of deductions.",
      impact:
        "You may be entitled to triple damages (3x the deposit amount) plus interest.",
      action:
        "Send a demand letter requesting return of the deposit plus damages.",
      amount: "$2,500",
    },
    {
      title: "Illegal late fee",
      severity: "medium",
      summary:
        "Late fee exceeds 5% of monthly rent or $30, whichever is greater",
      statute: "M.G.L. c. 186 §15B",
      explanation:
        "Late fees in Massachusetts are capped at the greater of 5% of monthly rent or $30.",
      impact:
        "Any amount charged above this limit is illegal and must be refunded.",
      action: "Request refund of excess late fee charges.",
      amount: "$150",
    },
    {
      title: "Non-refundable fee",
      severity: "high",
      summary:
        "Non-refundable 'administrative fee' may violate security deposit law",
      statute: "M.G.L. c. 186 §15B",
      explanation:
        "Most fees collected at move-in are considered part of the security deposit and must be refundable.",
      impact: "You may be entitled to return of this fee plus triple damages.",
      action: "Dispute the non-refundable nature of this fee.",
      amount: "$500",
    },
  ];

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

  // Get document title from documentId (mock - in production, fetch from API)
  const documentTitle = `Lease Agreement - 123 Main St${documentId !== "1" ? ` (Doc ${documentId})` : ""}`;
  const estimatedRecovery = "$3,150";
  const overallRisk = "Medium";
  const issuesFound = issues.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="mb-1 text-2xl font-bold text-dark dark:text-white">
              Lease Agreement - 123 Main St
            </h1>
            <p className="text-dark-5 dark:text-gray-400">
              Uploaded on January 15, 2024
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="severity-high rounded-full px-4 py-2 font-semibold">
              High Risk
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
          <div className="glass-card">
            <h2 className="mb-4 text-lg font-bold text-dark dark:text-white">
              Document Viewer
            </h2>
            <div className="rounded-2xl overflow-hidden min-h-[600px] bg-white dark:bg-dark-2">
              <PdfAnalysisViewer 
                documentId={documentId} 
                onSelectIssue={(highlightId) => {
                  console.log("Selected highlight:", highlightId);
                }}
              />
            </div>
          </div>
        </div>

        {/* Issues Panel */}
        <div className="space-y-4">
          {/* Financial Summary */}
          <div className="glass-card border-gold-200/50 from-gold-50/60 via-peach-50/40 to-coral-50/40 dark:border-gold-800/30 dark:from-gold-900/20 dark:via-peach-900/20 dark:to-coral-900/20 rounded-3xl border-2 bg-gradient-to-br p-6">
            <div className="mb-4 text-center">
              <div className="gradient-text mb-1 text-4xl font-bold">
                $3,150
              </div>
              <p className="text-sm font-semibold text-dark dark:text-white">
                You might be owed
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-dark-5 dark:text-gray-400">
                  Security Deposit
                </span>
                <span className="font-bold text-dark dark:text-white">
                  $2,500
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-dark-5 dark:text-gray-400">
                  Illegal Fees
                </span>
                <span className="font-bold text-dark dark:text-white">
                  $650
                </span>
              </div>
            </div>
          </div>

          {/* Issues List */}
          <div className="glass-card">
            <h2 className="mb-4 text-lg font-bold text-dark dark:text-white">
              Findings
            </h2>
            <div className="space-y-3">
              {issues.map((issue, idx) => (
                <div
                  key={idx}
                  onClick={() =>
                    setSelectedIssue(selectedIssue === idx ? null : idx)
                  }
                  className={`cursor-pointer rounded-2xl border-l-4 p-4 transition-all duration-300 hover:scale-[1.02] ${
                    issue.severity === "high"
                      ? "border-coral-400 bg-coral-50/50 dark:bg-coral-900/10"
                      : issue.severity === "medium"
                        ? "border-gold-400 bg-gold-50/50 dark:bg-gold-900/10"
                        : "border-mint-400 bg-mint-50/50 dark:bg-mint-900/10"
                  } ${selectedIssue === idx ? "ring-coral-400 shadow-soft-2 ring-2" : ""}`}
                >
                  <div className="mb-2 flex items-start justify-between">
                    <h3 className="flex-1 font-bold text-dark dark:text-white">
                      {issue.title}
                    </h3>
                    <span
                      className={`ml-2 rounded-full px-2.5 py-1 text-xs font-semibold ${severityColors[issue.severity as keyof typeof severityColors]}`}
                    >
                      {issue.severity.toUpperCase()}
                    </span>
                  </div>
                  <p className="mb-2 text-sm text-dark-5 dark:text-gray-400">
                    {issue.summary}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="bg-peach-100 text-peach-700 dark:bg-peach-900/30 dark:text-peach-400 rounded-full px-3 py-1 font-mono text-xs font-semibold">
                      {issue.statute}
                    </span>
                    <span className="gradient-text text-sm font-bold">
                      {issue.amount}
                    </span>
                  </div>
                  {selectedIssue === idx && (
                    <div className="border-peach-200/50 dark:border-coral-500/20 mt-4 space-y-3 border-t pt-4">
                      <div>
                        <h4 className="mb-1 text-sm font-bold text-dark dark:text-white">
                          Explanation
                        </h4>
                        <p className="text-sm leading-relaxed text-dark-5 dark:text-gray-400">
                          {issue.explanation}
                        </p>
                      </div>
                      <div>
                        <h4 className="mb-1 text-sm font-bold text-dark dark:text-white">
                          What this means
                        </h4>
                        <p className="text-sm leading-relaxed text-dark-5 dark:text-gray-400">
                          {issue.impact}
                        </p>
                      </div>
                      <div>
                        <h4 className="mb-1 text-sm font-bold text-dark dark:text-white">
                          What you can do
                        </h4>
                        <p className="text-sm leading-relaxed text-dark-5 dark:text-gray-400">
                          {issue.action}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Chat Panel */}
      {chatOpen && (
        <div className="glass-card fixed bottom-6 right-6 z-50 w-96 rounded-3xl shadow-2xl">
          <div className="border-peach-200/50 dark:border-coral-500/20 flex items-center justify-between border-b p-4">
            <div className="flex items-center gap-2">
              <SparklesIcon className="text-coral-500 dark:text-coral-400 size-5" />
              <span className="font-bold text-dark dark:text-white">
                AI Helper
              </span>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="hover:bg-peach-100 dark:hover:bg-coral-500/20 rounded-full p-1.5"
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
                      ? "bg-peach-200 dark:bg-peach-900/30 text-dark dark:text-white"
                      : "from-peach-100/60 to-coral-100/60 dark:from-coral-500/20 dark:to-orchid-500/20 bg-gradient-to-br text-dark dark:text-white"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="from-peach-100/60 to-coral-100/60 dark:from-coral-500/20 dark:to-orchid-500/20 rounded-2xl bg-gradient-to-br p-3">
                  <div className="flex gap-1">
                    <div className="bg-coral-500 h-2 w-2 animate-bounce rounded-full"></div>
                    <div
                      className="bg-coral-500 h-2 w-2 animate-bounce rounded-full"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="bg-coral-500 h-2 w-2 animate-bounce rounded-full"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="border-peach-200/50 dark:border-coral-500/20 border-t p-4">
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
          className="shadow-glow-coral fixed bottom-6 right-6 rounded-full bg-gradient-primary p-5 transition-all duration-300 hover:scale-110 active:scale-95"
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