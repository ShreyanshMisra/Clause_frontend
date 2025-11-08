"use client";

interface CreateCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle: string;
  documentId: number;
  estimatedRecovery: string;
  overallRisk: string;
  issuesFound: number;
}

export default function CreateCaseModal({
  isOpen,
  onClose,
  documentTitle,
  documentId,
  estimatedRecovery,
  overallRisk,
  issuesFound,
}: CreateCaseModalProps) {
  if (!isOpen) return null;

  const mockCaseData = {
    title: `Security Deposit – ${documentTitle.split("–")[1]?.trim() || "123 Main St"}`,
    type: "Lease",
    linkedDocument: `${documentTitle} (Document #${documentId})`,
    estimatedRecovery: estimatedRecovery,
    riskLevel: overallRisk,
    issues: issuesFound,
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
            <div className="from-orchid-400 to-mint-400 shadow-glow-mint rounded-2xl bg-gradient-to-br p-3">
              <span className="text-2xl">📂</span>
            </div>
            <div>
              <h2 className="mb-1 text-2xl font-bold text-dark dark:text-white">
                Create a new case
              </h2>
              <p className="text-sm text-dark-5 dark:text-gray-400">
                Template case setup using mock fields.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-orchid-100 text-orchid-700 dark:bg-orchid-900/30 dark:text-orchid-400 rounded-full px-3 py-1 text-xs font-semibold">
              Template – no real submission yet
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
          {/* Case Basics */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-dark dark:text-white">
              Case Basics
            </h3>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  Case title
                </label>
                <input
                  type="text"
                  value={mockCaseData.title}
                  disabled
                  className="input-pill w-full disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  Case type
                </label>
                <div className="flex gap-2">
                  <button
                    disabled
                    className="shadow-glow-coral rounded-full bg-gradient-primary px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {mockCaseData.type}
                  </button>
                  <button
                    disabled
                    className="border-peach-200/50 dark:border-coral-500/20 rounded-full border bg-white/40 px-4 py-2 text-sm font-semibold text-dark-5 backdrop-blur-xl disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white/5 dark:text-gray-400"
                  >
                    Medical Bill
                  </button>
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  Linked document
                </label>
                <div className="glass border-peach-200/50 dark:border-coral-500/20 flex items-center gap-3 rounded-2xl border p-4">
                  <div className="text-2xl">📄</div>
                  <div className="flex-1">
                    <div className="font-semibold text-dark dark:text-white">
                      {mockCaseData.linkedDocument}
                    </div>
                    <div className="text-xs text-dark-5 dark:text-gray-400">
                      Document will be linked to this case
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Values */}
          <div className="glass border-peach-200/50 from-peach-50/60 to-coral-50/40 dark:border-coral-500/20 dark:from-coral-500/10 dark:to-orchid-500/10 rounded-2xl border bg-gradient-to-br p-6">
            <h3 className="mb-4 text-lg font-bold text-dark dark:text-white">
              Key Values
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="gradient-text mb-1 text-2xl font-bold">
                  {mockCaseData.estimatedRecovery}
                </div>
                <div className="text-xs text-dark-5 dark:text-gray-400">
                  Estimated recovery
                </div>
              </div>
              <div className="text-center">
                <div className="bg-gold-100 text-gold-700 dark:bg-gold-900/30 dark:text-gold-400 mb-1 inline-block rounded-full px-3 py-1 text-xs font-semibold">
                  {mockCaseData.riskLevel}
                </div>
                <div className="mt-2 text-xs text-dark-5 dark:text-gray-400">
                  Risk level
                </div>
              </div>
              <div className="text-center">
                <div className="mb-1 text-2xl font-bold text-dark dark:text-white">
                  {mockCaseData.issues}
                </div>
                <div className="text-xs text-dark-5 dark:text-gray-400">
                  Issues
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps & Notifications (Dummy) */}
          <div className="glass border-peach-200/50 dark:border-coral-500/20 rounded-2xl border p-4">
            <h3 className="mb-4 text-lg font-bold text-dark dark:text-white">
              Next Steps & Notifications
            </h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  disabled
                  className="rounded border-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <span className="text-sm text-dark-5 dark:text-gray-400">
                  Notify me when the landlord responds
                </span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  disabled
                  checked
                  className="rounded border-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <span className="text-sm text-dark-5 dark:text-gray-400">
                  Include demand letter in this case
                </span>
              </label>
            </div>
            <p className="mt-4 text-xs text-dark-5 dark:text-gray-400">
              These options will be configurable once backend workflows are
              implemented.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="btn-glass px-6 py-3 font-semibold"
          >
            Cancel
          </button>
          <button className="btn-gradient px-6 py-3 font-semibold">
            Create case
          </button>
        </div>
      </div>
    </div>
  );
}
