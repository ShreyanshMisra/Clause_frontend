export function CardSkeleton() {
  return (
    <div className="glass-card animate-pulse">
      <div className="bg-peach-200/50 dark:bg-coral-800/30 mb-4 h-6 w-3/4 rounded-full"></div>
      <div className="bg-peach-200/30 dark:bg-coral-800/20 mb-2 h-4 w-full rounded-full"></div>
      <div className="bg-peach-200/30 dark:bg-coral-800/20 h-4 w-5/6 rounded-full"></div>
    </div>
  );
}

export function CaseCardSkeleton() {
  return (
    <div className="glass-card animate-pulse space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <div className="bg-peach-200/50 dark:bg-coral-800/30 h-6 w-3/4 rounded-full"></div>
          <div className="bg-peach-200/30 dark:bg-coral-800/20 h-4 w-1/2 rounded-full"></div>
        </div>
        <div className="bg-peach-200/50 dark:bg-coral-800/30 h-6 w-20 rounded-full"></div>
      </div>
      <div className="bg-peach-200/30 dark:bg-coral-800/20 h-4 w-1/3 rounded-full"></div>
      <div className="bg-peach-200/50 dark:bg-coral-800/30 h-8 w-1/4 rounded-full"></div>
    </div>
  );
}

export function DocumentCardSkeleton() {
  return (
    <div className="glass-card animate-pulse space-y-4">
      <div className="flex items-center gap-4">
        <div className="bg-peach-200/50 dark:bg-coral-800/30 h-16 w-12 rounded-lg"></div>
        <div className="flex-1 space-y-2">
          <div className="bg-peach-200/50 dark:bg-coral-800/30 h-5 w-3/4 rounded-full"></div>
          <div className="bg-peach-200/30 dark:bg-coral-800/20 h-4 w-1/3 rounded-full"></div>
        </div>
      </div>
      <div className="bg-peach-200/30 dark:bg-coral-800/20 h-4 w-1/2 rounded-full"></div>
      <div className="flex gap-2">
        <div className="bg-peach-200/50 dark:bg-coral-800/30 h-8 w-24 rounded-full"></div>
        <div className="bg-peach-200/50 dark:bg-coral-800/30 h-8 w-20 rounded-full"></div>
      </div>
    </div>
  );
}
