"use client";

import { SecurityIcon } from "@/components/Layouts/sidebar/icons";
import ApiStatusBadges from "@/components/MockActivity/ApiStatusBadges";

export default function SecurityPage() {
  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="mb-1 text-3xl font-bold text-dark dark:text-white">
          Security & Settings
        </h1>
        <p className="text-dark-5 dark:text-gray-400">
          Your privacy and data security are our top priority
        </p>
      </div>

      {/* Security Overview */}
      <div className="glass-card border-mint-200/50 from-mint-50/60 dark:border-mint-800/30 dark:from-mint-900/20 rounded-3xl border-2 bg-gradient-to-br via-green-50/40 to-emerald-50/40 p-8 dark:via-green-900/20 dark:to-emerald-900/20">
        <div className="flex items-start gap-6">
          <div className="from-mint-400 shadow-glow-mint rounded-3xl bg-gradient-to-br to-green-400 p-5">
            <SecurityIcon className="size-10 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="mb-2 text-2xl font-bold text-dark dark:text-white">
              Your Data is Protected
            </h2>
            <p className="mb-6 leading-relaxed text-dark-5 dark:text-gray-400">
              We use industry-leading security practices to keep your personal
              information safe and private.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-start gap-3">
                <div className="bg-mint-200 dark:bg-mint-900/40 mt-0.5 rounded-full p-2">
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
                </div>
                <div>
                  <h3 className="mb-1 font-bold text-dark dark:text-white">
                    No PII in Vector Database
                  </h3>
                  <p className="text-sm leading-relaxed text-dark-5 dark:text-gray-400">
                    We never store personally identifiable information in our AI
                    vector database
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-mint-200 dark:bg-mint-900/40 mt-0.5 rounded-full p-2">
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
                </div>
                <div>
                  <h3 className="mb-1 font-bold text-dark dark:text-white">
                    Automatic De-identification
                  </h3>
                  <p className="text-sm leading-relaxed text-dark-5 dark:text-gray-400">
                    All documents are automatically de-identified before AI
                    analysis
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-mint-200 dark:bg-mint-900/40 mt-0.5 rounded-full p-2">
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
                </div>
                <div>
                  <h3 className="mb-1 font-bold text-dark dark:text-white">
                    Encrypted Storage
                  </h3>
                  <p className="text-sm leading-relaxed text-dark-5 dark:text-gray-400">
                    All data is encrypted at rest and in transit using AES-256
                    encryption
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-mint-200 dark:bg-mint-900/40 mt-0.5 rounded-full p-2">
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
                </div>
                <div>
                  <h3 className="mb-1 font-bold text-dark dark:text-white">
                    GDPR Compliant
                  </h3>
                  <p className="text-sm leading-relaxed text-dark-5 dark:text-gray-400">
                    We comply with GDPR, CCPA, and other data protection
                    regulations
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Retention */}
      <div className="glass-card">
        <h2 className="mb-4 text-xl font-bold text-dark dark:text-white">
          Data Retention
        </h2>
        <div className="space-y-4">
          <div className="border-peach-200/50 dark:border-coral-500/20 flex items-center justify-between rounded-2xl border bg-white/40 p-5 backdrop-blur-xl dark:bg-white/5">
            <div>
              <h3 className="font-bold text-dark dark:text-white">
                Uploaded Documents
              </h3>
              <p className="text-sm text-dark-5 dark:text-gray-400">
                Raw documents and files
              </p>
            </div>
            <span className="bg-peach-100 text-peach-700 dark:bg-peach-900/30 dark:text-peach-400 rounded-full px-4 py-2 text-sm font-semibold">
              90 days
            </span>
          </div>
          <div className="border-peach-200/50 dark:border-coral-500/20 flex items-center justify-between rounded-2xl border bg-white/40 p-5 backdrop-blur-xl dark:bg-white/5">
            <div>
              <h3 className="font-bold text-dark dark:text-white">
                Analysis Results
              </h3>
              <p className="text-sm text-dark-5 dark:text-gray-400">
                Case data and analysis outputs
              </p>
            </div>
            <span className="bg-peach-100 text-peach-700 dark:bg-peach-900/30 dark:text-peach-400 rounded-full px-4 py-2 text-sm font-semibold">
              1 year
            </span>
          </div>
          <div className="border-peach-200/50 dark:border-coral-500/20 flex items-center justify-between rounded-2xl border bg-white/40 p-5 backdrop-blur-xl dark:bg-white/5">
            <div>
              <h3 className="font-bold text-dark dark:text-white">
                Account Data
              </h3>
              <p className="text-sm text-dark-5 dark:text-gray-400">
                User profile and preferences
              </p>
            </div>
            <span className="bg-peach-100 text-peach-700 dark:bg-peach-900/30 dark:text-peach-400 rounded-full px-4 py-2 text-sm font-semibold">
              Until deleted
            </span>
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="glass-card">
        <h2 className="mb-4 text-xl font-bold text-dark dark:text-white">
          Privacy Settings
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-dark dark:text-white">
                Email Notifications
              </h3>
              <p className="text-sm text-dark-5 dark:text-gray-400">
                Receive updates about your cases
              </p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" className="peer sr-only" defaultChecked />
              <div className="peer-focus:ring-coral-300 dark:peer-focus:ring-coral-800 peer h-7 w-12 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-6 after:w-6 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-gradient-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 dark:border-gray-600 dark:bg-gray-700"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-dark dark:text-white">
                Analytics & Improvements
              </h3>
              <p className="text-sm text-dark-5 dark:text-gray-400">
                Help us improve our service (anonymous data only)
              </p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" className="peer sr-only" defaultChecked />
              <div className="peer-focus:ring-coral-300 dark:peer-focus:ring-coral-800 peer h-7 w-12 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-6 after:w-6 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-gradient-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 dark:border-gray-600 dark:bg-gray-700"></div>
            </label>
          </div>
        </div>
      </div>

      {/* API Status */}
      <ApiStatusBadges />

      {/* Delete Account */}
      <div className="glass-card border-coral-200 dark:border-coral-800/50 border-2 p-6">
        <h2 className="text-coral-600 dark:text-coral-400 mb-2 text-xl font-bold">
          Danger Zone
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-dark-5 dark:text-gray-400">
          Permanently delete your account and all associated data. This action
          cannot be undone.
        </p>
        <button className="bg-coral-500 hover:bg-coral-600 hover:shadow-soft-2 rounded-full px-6 py-3 font-semibold text-white transition-all duration-300">
          Delete Account
        </button>
      </div>
    </div>
  );
}
