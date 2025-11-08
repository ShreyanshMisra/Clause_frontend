"use client";

import { useState, use } from "react";
import { SparklesIcon } from "@/components/Layouts/sidebar/icons";
import Link from "next/link";

export default function DocumentWorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [chatMessages, setChatMessages] = useState<
    Array<{ role: "user" | "ai"; content: string }>
  >([
    {
      role: "ai",
      content:
        "Hello! I can answer questions about this specific document. What would you like to know?",
    },
    {
      role: "user",
      content:
        "Can I get my deposit back if my landlord hasn't returned it in 45 days?",
    },
    {
      role: "ai",
      content:
        "Under Massachusetts law, your landlord must return your security deposit within 30 days of the end of your tenancy. If they haven't returned it after 45 days, you may be entitled to three times the amount of the deposit, plus interest, under M.G.L. c. 186 §15B. This document shows your move-out date was 45 days ago, so you should consider sending a demand letter.",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const document = {
    id: id,
    title: "Lease – 123 Main St",
    type: "Lease",
  };

  const mockResponses = [
    "Based on this document, I can help you understand your rights regarding the security deposit mentioned in the lease. Under Massachusetts law, your landlord must return the deposit within 30 days of move-out.",
    "This lease shows a security deposit of $2,500. If your landlord hasn't returned it within 30 days, you may be entitled to triple damages plus interest under M.G.L. c. 186 §15B.",
    "The late fee clause in this lease specifies $75. Massachusetts caps late fees at the greater of 5% of monthly rent or $30, so if your rent is $2,000/month, the maximum legal late fee would be $100.",
    "I can see this document was uploaded recently. Would you like me to analyze specific clauses or help you understand your rights regarding any particular section?",
  ];

  const handleSend = () => {
    if (!inputValue.trim()) return;

    setChatMessages((prev) => [...prev, { role: "user", content: inputValue }]);
    const userInput = inputValue;
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response with contextual mock responses
    setTimeout(() => {
      const randomResponse =
        mockResponses[Math.floor(Math.random() * mockResponses.length)];
      setChatMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: randomResponse,
        },
      ]);
      setIsTyping(false);
    }, 1500);
  };

  const quickSuggestions = [
    "Summarize this lease in plain English",
    "What are my rights here?",
    "Is there anything illegal in this clause?",
  ];

  return (
    <div className="flex h-[calc(100vh-12rem)] flex-col space-y-4">
      {/* Document Header */}
      <div className="glass-card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <h1 className="mb-1 text-2xl font-bold text-dark dark:text-white">
                {document.title}
              </h1>
              <div className="flex items-center gap-3">
                <span className="bg-peach-100 text-peach-700 dark:bg-peach-900/30 dark:text-peach-400 rounded-full px-3 py-1 text-xs font-semibold">
                  {document.type}
                </span>
                <span className="border-peach-200/50 dark:border-coral-500/20 rounded-full border bg-white/40 px-3 py-1 text-xs font-medium text-dark-5 dark:bg-white/5 dark:text-gray-400">
                  This chat is about this document only
                </span>
                <div className="border-mint-200/50 bg-mint-50/50 dark:border-mint-800/30 dark:bg-mint-900/20 flex items-center gap-1.5 rounded-full border px-3 py-1">
                  <svg
                    className="text-mint-600 dark:text-mint-400 h-3.5 w-3.5"
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
                    Secure · De-identified
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/analysis?documentId=${id}`}
              className="btn-glass px-6 py-2.5 text-sm font-semibold"
            >
              View full analysis
            </Link>
            <Link
              href="/cases/101"
              className="btn-gradient px-6 py-2.5 text-sm font-semibold"
            >
              Open case
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* PDF Viewer - Left Side */}
        <div className="flex-1 overflow-hidden">
          <div className="glass-card h-full overflow-auto">
            <div className="border-peach-200/50 dark:border-coral-500/20 flex items-center justify-between border-b p-4">
              <h2 className="font-bold text-dark dark:text-white">
                Document Viewer
              </h2>
              <div className="flex gap-2">
                <button className="glass rounded-full px-3 py-1.5 text-sm font-medium">
                  ← Previous
                </button>
                <span className="flex items-center px-3 text-sm text-dark-5 dark:text-gray-400">
                  Page 1 of 5
                </span>
                <button className="glass rounded-full px-3 py-1.5 text-sm font-medium">
                  Next →
                </button>
                <button className="glass rounded-full px-3 py-1.5 text-sm font-medium">
                  + Zoom
                </button>
              </div>
            </div>
            <div className="p-8">
              {/* Simulated PDF Content */}
              <div className="border-peach-200/50 to-peach-50/30 shadow-soft-2 dark:border-coral-500/20 dark:to-coral-500/5 mx-auto max-w-2xl rounded-2xl border bg-gradient-to-br from-white p-12 dark:from-dark-2">
                <div className="prose dark:prose-invert max-w-none">
                  <h2 className="mb-4 text-2xl font-bold">Lease Agreement</h2>
                  <p className="mb-4 text-dark dark:text-gray-300">
                    This lease agreement is entered into on January 1, 2024,
                    between the Landlord and the Tenant.
                  </p>
                  <div className="my-6 rounded-lg bg-yellow-100/60 p-4 dark:bg-yellow-900/20">
                    <p className="mb-2 font-semibold text-dark dark:text-white">
                      Security Deposit: $2,500
                    </p>
                    <p className="text-sm text-dark-5 dark:text-gray-400">
                      Tenant agrees to pay a security deposit of $2,500 upon
                      execution of this lease. The deposit will be held in an
                      interest-bearing account.
                    </p>
                  </div>
                  <p className="mb-4 text-dark dark:text-gray-300">
                    <strong>Late Fees:</strong> Tenant agrees to pay a late fee
                    of $75 for any rent payment received after the 5th of the
                    month.
                  </p>
                  <p className="text-dark dark:text-gray-300">
                    <strong>Term:</strong> This lease shall commence on January
                    1, 2024, and terminate on December 31, 2024.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Document-Scoped Chat - Right Side */}
        <div className="w-96 flex-shrink-0">
          <div className="glass-card flex h-full flex-col">
            {/* Chat Header */}
            <div className="border-peach-200/50 dark:border-coral-500/20 border-b p-4">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-gradient-primary p-2">
                  <SparklesIcon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-dark dark:text-white">
                    Ask about this document
                  </h3>
                  <p className="text-xs text-dark-5 dark:text-gray-400">
                    The AI only uses this file to answer.
                  </p>
                </div>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.role === "user"
                        ? "from-peach-100/60 to-coral-100/60 dark:from-coral-500/20 dark:to-orchid-500/20 bg-gradient-to-br text-dark dark:text-white"
                        : "from-coral-100/60 to-orchid-100/60 dark:from-coral-500/20 dark:to-orchid-500/20 bg-gradient-to-br text-dark dark:text-white"
                    }`}
                  >
                    {msg.role === "ai" && (
                      <div className="mb-1 flex items-center gap-1.5">
                        <SparklesIcon className="text-coral-500 dark:text-coral-400 h-3.5 w-3.5" />
                        <span className="text-xs font-semibold">
                          AI Assistant
                        </span>
                      </div>
                    )}
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="from-coral-100/60 to-orchid-100/60 dark:from-coral-500/20 dark:to-orchid-500/20 rounded-2xl bg-gradient-to-br px-4 py-3">
                    <div className="flex gap-1">
                      <div className="bg-coral-500 h-2 w-2 animate-bounce rounded-full [animation-delay:-0.3s]"></div>
                      <div className="bg-coral-500 h-2 w-2 animate-bounce rounded-full [animation-delay:-0.15s]"></div>
                      <div className="bg-coral-500 h-2 w-2 animate-bounce rounded-full"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Suggestions */}
            <div className="border-peach-200/50 dark:border-coral-500/20 border-t p-4">
              <div className="mb-3 flex flex-wrap gap-2">
                {quickSuggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInputValue(suggestion)}
                    className="glass rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-300 hover:scale-105"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>

              {/* Input Area */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask something about this document..."
                  className="input-pill flex-1 py-2.5 text-sm"
                />
                <button
                  onClick={handleSend}
                  className="shadow-soft-2 rounded-full bg-gradient-primary p-2.5 text-white transition-all duration-300 hover:scale-105 active:scale-95"
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
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </div>

              {/* Contextual Reminder */}
              <div className="border-peach-200/50 bg-peach-50/30 dark:border-coral-500/20 dark:bg-coral-500/10 mt-3 rounded-full border px-3 py-2 text-xs text-dark-5 dark:text-gray-400">
                This chat is limited to this document. For other questions, use
                the main AI helper.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
