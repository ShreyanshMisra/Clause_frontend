"use client";

import { SparklesIcon } from "@/components/Layouts/sidebar/icons";

export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="shadow-glow-coral rounded-2xl bg-gradient-primary p-2">
        <SparklesIcon className="size-6 text-white" />
      </div>
      <div>
        <h1 className="gradient-text text-xl font-bold tracking-tight">
          Clause
        </h1>
        <p className="text-xs font-medium text-dark-5 dark:text-gray-400">
          AI Lease Analyzer
        </p>
      </div>
    </div>
  );
}
