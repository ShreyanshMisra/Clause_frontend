"use client";

import { useState } from "react";
import type { Metadata } from "next";

export default function SettingsPage() {
  const [name, setName] = useState("John Smith");
  const [email, setEmail] = useState("johnson@nextadmin.com");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage("");
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSaveMessage("Settings saved successfully!");
    setIsSaving(false);
    
    // Clear message after 3 seconds
    setTimeout(() => setSaveMessage(""), 3000);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="glass-card">
        <h1 className="text-2xl font-bold text-dark dark:text-white mb-2">
          Account Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your account information
        </p>
      </div>

      {/* Settings Form */}
      <div className="glass-card">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Name Field */}
          <div>
            <label 
              htmlFor="name" 
              className="block text-sm font-semibold text-dark dark:text-white mb-2"
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-2 text-dark dark:text-white focus:ring-2 focus:ring-coral-500 focus:border-transparent transition-all outline-none"
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Email Field */}
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-semibold text-dark dark:text-white mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-2 text-dark dark:text-white focus:ring-2 focus:ring-coral-500 focus:border-transparent transition-all outline-none"
              placeholder="Enter your email address"
              required
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              This email will be used for notifications and account recovery
            </p>
          </div>

          {/* Save Message */}
          {saveMessage && (
            <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <p className="text-green-800 dark:text-green-200 text-sm font-medium">
                ✓ {saveMessage}
              </p>
            </div>
          )}

          {/* Save Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSaving}
              className="btn-gradient px-8 py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="glass-card border-red-200 dark:border-red-900">
        <h2 className="text-lg font-bold text-red-600 dark:text-red-400 mb-4">
          Danger Zone
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button
          onClick={() => {
            if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
              // Handle account deletion
              console.log("Account deletion requested");
            }
          }}
          className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}

