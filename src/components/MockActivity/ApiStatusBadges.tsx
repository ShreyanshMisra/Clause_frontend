"use client";

interface ApiStatus {
  name: string;
  status: "connected" | "disconnected" | "coming-soon";
  icon?: string;
}

interface ApiStatusBadgesProps {
  apis?: ApiStatus[];
}

const defaultApis: ApiStatus[] = [
  { name: "OpenAI API", status: "connected", icon: "🤖" },
  { name: "Pinecone", status: "connected", icon: "🔍" },
  { name: "Claude", status: "coming-soon", icon: "✨" },
];

export default function ApiStatusBadges({
  apis = defaultApis,
}: ApiStatusBadgesProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-mint-100 text-mint-700 border-mint-200 dark:bg-mint-900/30 dark:text-mint-400 dark:border-mint-800";
      case "disconnected":
        return "bg-coral-100 text-coral-700 border-coral-200 dark:bg-coral-900/30 dark:text-coral-400 dark:border-coral-800";
      case "coming-soon":
        return "bg-gold-100 text-gold-700 border-gold-200 dark:bg-gold-900/30 dark:text-gold-400 dark:border-gold-800";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "connected":
        return "Connected";
      case "disconnected":
        return "Disconnected";
      case "coming-soon":
        return "Coming soon";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="glass-card">
      <h3 className="mb-4 text-lg font-bold text-dark dark:text-white">
        API Status
      </h3>
      <div className="space-y-2">
        {apis.map((api, idx) => (
          <div
            key={idx}
            className={`flex items-center justify-between rounded-full border px-4 py-2 ${getStatusColor(api.status)}`}
          >
            <div className="flex items-center gap-2">
              {api.icon && <span>{api.icon}</span>}
              <span className="text-sm font-medium">{api.name}</span>
            </div>
            <span className="text-xs font-semibold">
              {getStatusLabel(api.status)}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-dark-5 dark:text-gray-400">
        These are mock status indicators for design purposes.
      </p>
    </div>
  );
}
