"use client";

import { useState } from "react";

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      question: "How does the AI contract analyzer work?",
      answer:
        "Our AI analyzes your uploaded documents (leases, medical bills) to identify potentially illegal clauses, calculate what you're owed (security deposits, overcharges, etc.), and generate professional demand letters. The AI is trained on Massachusetts state laws and regulations.",
    },
    {
      question: "Is my data private and secure?",
      answer:
        "Yes! We use automatic de-identification before AI analysis, never store PII in our vector database, and encrypt all data at rest and in transit. We comply with GDPR, CCPA, and other privacy regulations.",
    },
    {
      question: "What types of documents can I upload?",
      answer:
        "You can upload lease agreements, rental contracts, medical bills, insurance claims, and other billing documents. We support PDF, JPG, and PNG formats up to 10MB.",
    },
    {
      question: "How accurate is the analysis?",
      answer:
        "Our AI is trained on Massachusetts state laws and has been tested extensively. However, this tool is for informational purposes only and should not replace legal advice. Always consult with a qualified attorney for legal matters.",
    },
    {
      question: "Can I use this for cases outside Massachusetts?",
      answer:
        "Currently, our AI is specifically trained on Massachusetts state laws. We're working on expanding to other states. Sign up for updates to be notified when we launch support for your state.",
    },
    {
      question: "How long does it take to analyze a document?",
      answer:
        "Typically, document analysis takes 30 seconds to 2 minutes. Complex documents with many pages may take slightly longer.",
    },
    {
      question: "What happens after I generate a demand letter?",
      answer:
        "You can download, review, and customize the demand letter before sending it. We provide templates based on Massachusetts law, but you may want to have it reviewed by an attorney before sending.",
    },
    {
      question: "Is this service free?",
      answer:
        "Yes! Clause is currently free to use. We're committed to helping tenants protect their rights and recover what they're owed.",
    },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="mb-1 text-3xl font-bold text-dark dark:text-white">
          Help & FAQ
        </h1>
        <p className="text-dark-5 dark:text-gray-400">
          Find answers to common questions about Clause
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="glass-card cursor-pointer text-center transition-all duration-300 hover:scale-105">
          <div className="mb-3 text-5xl">📚</div>
          <h3 className="mb-1 font-bold text-dark dark:text-white">
            Documentation
          </h3>
          <p className="text-sm text-dark-5 dark:text-gray-400">
            Learn how to use the app
          </p>
        </div>
        <div className="glass-card cursor-pointer text-center transition-all duration-300 hover:scale-105">
          <div className="mb-3 text-5xl">💬</div>
          <h3 className="mb-1 font-bold text-dark dark:text-white">
            Contact Support
          </h3>
          <p className="text-sm text-dark-5 dark:text-gray-400">
            Get help from our team
          </p>
        </div>
        <div className="glass-card cursor-pointer text-center transition-all duration-300 hover:scale-105">
          <div className="mb-3 text-5xl">🎓</div>
          <h3 className="mb-1 font-bold text-dark dark:text-white">
            Learn More
          </h3>
          <p className="text-sm text-dark-5 dark:text-gray-400">
            Understand your rights
          </p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="glass-card">
        <h2 className="mb-6 text-center text-xl font-bold text-dark dark:text-white">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border-peach-200/50 dark:border-coral-500/20 overflow-hidden rounded-2xl border"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="hover:bg-peach-50/50 dark:hover:bg-coral-500/10 flex w-full items-center justify-between px-6 py-4 text-left transition-colors"
              >
                <span className="pr-4 font-bold text-dark dark:text-white">
                  {faq.question}
                </span>
                <svg
                  className={`h-5 w-5 text-dark-5 transition-transform dark:text-gray-400 ${
                    openFaq === idx ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {openFaq === idx && (
                <div className="border-peach-200/50 dark:border-coral-500/20 border-t px-6 py-4">
                  <p className="leading-relaxed text-dark-5 dark:text-gray-400">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="glass-card border-coral-200/50 from-coral-50/60 to-peach-50/40 dark:border-coral-500/30 dark:from-coral-500/10 dark:to-orchid-500/10 rounded-3xl border-2 bg-gradient-to-br p-6 text-center">
        <h2 className="mb-4 text-xl font-bold text-dark dark:text-white">
          Still need help?
        </h2>
        <p className="mb-6 leading-relaxed text-dark-5 dark:text-gray-400">
          Can't find what you're looking for? Our support team is here to help.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <button
            onClick={() => {
              // In production, open contact form modal or navigate to contact page
              window.location.href =
                "mailto:support@clause.app?subject=Support Request";
            }}
            className="btn-gradient px-8 py-4 font-semibold"
          >
            Contact Support
          </button>
          <button
            onClick={() => {
              // In production, open feedback form modal
              window.location.href =
                "mailto:feedback@clause.app?subject=Feedback";
            }}
            className="btn-glass px-8 py-4 font-semibold"
          >
            Send Feedback
          </button>
        </div>
      </div>
    </div>
  );
}
