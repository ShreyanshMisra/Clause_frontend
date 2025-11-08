"use client";

interface ActivityItem {
  id: number;
  action: string;
  target: string;
  timestamp: string;
  icon: string;
}

interface RecentActivityProps {
  activities?: ActivityItem[];
}

const defaultActivities: ActivityItem[] = [
  {
    id: 1,
    action: "Analyzed",
    target: "Lease – 123 Main St",
    timestamp: "2 min ago",
    icon: "🔍",
  },
  {
    id: 2,
    action: "Generated sample demand letter",
    target: "Security Deposit case",
    timestamp: "1 day ago",
    icon: "✉️",
  },
  {
    id: 3,
    action: "Created case",
    target: "Hospital Bill – Baystate Medical",
    timestamp: "2 days ago",
    icon: "📂",
  },
  {
    id: 4,
    action: "Uploaded document",
    target: "Lease – 45 Elm St",
    timestamp: "3 days ago",
    icon: "📤",
  },
];

export default function RecentActivity({
  activities = defaultActivities,
}: RecentActivityProps) {
  return (
    <div className="glass-card">
      <h3 className="mb-4 text-lg font-bold text-dark dark:text-white">
        Recent Activity
      </h3>
      <div className="space-y-3">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="border-peach-200/30 hover:border-peach-300/50 dark:border-coral-500/20 dark:hover:border-coral-500/30 flex items-start gap-3 rounded-2xl border bg-white/20 p-3 backdrop-blur-xl transition-all duration-200 hover:scale-[1.02] dark:bg-white/5"
          >
            <div className="from-peach-400 to-coral-400 shadow-soft-1 rounded-full bg-gradient-to-br p-2 text-sm">
              {activity.icon}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-dark dark:text-white">
                <span className="font-semibold">{activity.action}</span>{" "}
                {activity.target}
              </p>
              <p className="text-xs text-dark-5 dark:text-gray-400">
                {activity.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
