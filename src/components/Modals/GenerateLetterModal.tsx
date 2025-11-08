"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

interface GenerateLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle: string;
  estimatedRecovery: string;
}

export default function GenerateLetterModal({
  isOpen,
  onClose,
  documentTitle,
  estimatedRecovery,
}: GenerateLetterModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const mockLetterData = {
    recipientName: "[LANDLORD NAME]",
    propertyAddress: "123 Main St, Boston, MA",
    amount: estimatedRecovery,
    date: "March 5, 2025",
    tenantName: "[TENANT_NAME]",
    address: "[ADDRESS]",
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md dark:bg-black/70" />

      {/* Modal */}
      <div
        className="glass-card shadow-soft-3 relative z-10 flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex-shrink-0 p-8 pb-6">
          <div className="mb-6 flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="from-coral-400 to-gold-400 shadow-glow-gold rounded-2xl bg-gradient-to-br p-3">
                <span className="text-2xl">✉️</span>
              </div>
              <div>
                <h2 className="mb-1 text-2xl font-bold text-dark dark:text-white">
                  Demand letter preview
                </h2>
                <p className="text-sm text-dark-5 dark:text-gray-400">
                  Template layout with mock wording.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-gold-100 text-gold-700 dark:bg-gold-900/30 dark:text-gold-400 rounded-full px-3 py-1 text-xs font-semibold">
                Mock letter – not legally reviewed
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
        </div>

        {/* Scrollable Body */}
        <div className="custom-scrollbar flex-1 overflow-y-auto px-8">
          <div className="space-y-6 pb-6">
            {/* Letter Metadata */}
            <div className="glass border-peach-200/50 dark:border-coral-500/20 rounded-2xl border p-4">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div>
                  <div className="mb-1 text-xs font-medium text-dark-5 dark:text-gray-400">
                    Recipient
                  </div>
                  <div className="font-semibold text-dark dark:text-white">
                    {mockLetterData.recipientName}
                  </div>
                </div>
                <div>
                  <div className="mb-1 text-xs font-medium text-dark-5 dark:text-gray-400">
                    Property
                  </div>
                  <div className="font-semibold text-dark dark:text-white">
                    {mockLetterData.propertyAddress}
                  </div>
                </div>
                <div>
                  <div className="mb-1 text-xs font-medium text-dark-5 dark:text-gray-400">
                    Amount
                  </div>
                  <div className="gradient-text font-bold">
                    {mockLetterData.amount}
                  </div>
                </div>
                <div>
                  <div className="mb-1 text-xs font-medium text-dark-5 dark:text-gray-400">
                    Date
                  </div>
                  <div className="font-semibold text-dark dark:text-white">
                    {mockLetterData.date}
                  </div>
                </div>
              </div>
            </div>

            {/* Letter Body Preview */}
            <div className="glass border-peach-200/50 dark:border-coral-500/20 rounded-2xl border p-6">
              <div className="max-h-96 space-y-4 overflow-y-auto">
                <p className="font-semibold text-dark dark:text-white">
                  Dear {mockLetterData.recipientName},
                </p>
                <p className="leading-relaxed text-dark-5 dark:text-gray-400">
                  I am writing to you regarding my security deposit for the
                  property located at {mockLetterData.address}. As you may
                  recall, I was a tenant at this property and provided a
                  security deposit of {mockLetterData.amount} at the beginning
                  of my tenancy.
                </p>
                <p className="leading-relaxed text-dark-5 dark:text-gray-400">
                  Under Massachusetts General Laws Chapter 186, Section 15B,
                  landlords are required to return a tenant's security deposit
                  within 30 days of the termination of the tenancy, along with
                  an itemized statement of any deductions. As of today, more
                  than 30 days have passed since the end of my tenancy, and I
                  have not received my security deposit or any itemized
                  statement of deductions.
                </p>
                <p className="leading-relaxed text-dark-5 dark:text-gray-400">
                  I am therefore requesting the immediate return of my security
                  deposit in the amount of {mockLetterData.amount}, plus any
                  applicable interest as required by law. If the deposit is not
                  returned within 14 days of receipt of this letter, I may be
                  entitled to three times the amount of the deposit, plus
                  interest, as provided for under M.G.L. c. 186 §15B.
                </p>
                <p className="leading-relaxed text-dark-5 dark:text-gray-400">
                  Please send the deposit to the address provided above, or
                  contact me to arrange an alternative method of payment. I hope
                  we can resolve this matter amicably and without the need for
                  further legal action.
                </p>
                <p className="mt-4 leading-relaxed text-dark dark:text-white">
                  Sincerely,
                  <br />
                  {mockLetterData.tenantName}
                </p>
              </div>
            </div>

            {/* Template Controls (Mock) */}
            <div className="glass border-peach-200/50 dark:border-coral-500/20 rounded-2xl border p-4">
              <div className="mb-3 flex items-center gap-4">
                <div className="flex-1">
                  <label className="mb-1 block text-xs font-medium text-dark-5 dark:text-gray-400">
                    Tone
                  </label>
                  <select
                    disabled
                    className="border-peach-200/50 dark:border-coral-500/20 w-full rounded-full border bg-white/40 px-4 py-2 text-sm backdrop-blur-xl disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white/5"
                  >
                    <option>Formal</option>
                    <option>Neutral</option>
                    <option>Firm</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="includeCitations"
                    disabled
                    className="rounded border-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <label
                    htmlFor="includeCitations"
                    className="text-sm text-dark-5 dark:text-gray-400"
                  >
                    Include statute citations
                  </label>
                </div>
              </div>
              <p className="text-xs text-dark-5 dark:text-gray-400">
                Later, this section will let you tweak tone and details before
                downloading.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-peach-200/30 dark:border-coral-500/20 flex flex-shrink-0 items-center justify-end gap-3 border-t px-8 pb-8 pt-6">
          <button
            onClick={onClose}
            className="btn-glass px-6 py-3 font-semibold"
          >
            Close
          </button>
          <button className="btn-gradient px-6 py-3 font-semibold">
            Download letter
          </button>
        </div>
      </div>
    </div>
  );

  // Render modal via portal to document.body to ensure it's above all content
  if (typeof window !== "undefined") {
    return createPortal(modalContent, document.body);
  }

  return null;
}
