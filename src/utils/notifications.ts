export interface Notification {
  id: number;
  type: "analysis" | "case" | "letter" | "document" | "system";
  icon: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  link: string;
  color: string;
}

export const mockNotifications: Notification[] = [
  {
    id: 1,
    type: "analysis",
    icon: "🔍",
    title: "Analysis complete for Lease – 123 Main St",
    message: "We found 3 potential issues worth $3,250",
    time: "2 minutes ago",
    read: false,
    link: "/results/1",
    color: "from-peach-400 to-coral-400",
  },
  {
    id: 2,
    type: "case",
    icon: "📂",
    title: "Case ready for action",
    message: "Security Deposit – 123 Main St is ready for you to review",
    time: "1 hour ago",
    read: false,
    link: "/cases/101",
    color: "from-coral-400 to-orchid-400",
  },
  {
    id: 3,
    type: "letter",
    icon: "✉️",
    title: "Demand letter generated",
    message: "Your demand letter for Case #101 is ready to download",
    time: "3 hours ago",
    read: false,
    link: "/cases/101",
    color: "from-gold-400 to-peach-400",
  },
  {
    id: 4,
    type: "document",
    icon: "📄",
    title: "Document analyzed",
    message: "Hospital Bill – Baystate Medical has been analyzed",
    time: "1 day ago",
    read: true,
    link: "/results/2",
    color: "from-mint-400 to-peach-400",
  },
  {
    id: 5,
    type: "case",
    icon: "🎉",
    title: "Case resolved",
    message: "Lease – 45 Elm St case has been marked as resolved",
    time: "2 days ago",
    read: true,
    link: "/cases/103",
    color: "from-orchid-400 to-mint-400",
  },
  {
    id: 6,
    type: "analysis",
    icon: "🔍",
    title: "Analysis complete for Lease – 789 Pine Ave",
    message: "We found 2 potential issues worth $2,800",
    time: "3 days ago",
    read: true,
    link: "/results/5",
    color: "from-peach-400 to-coral-400",
  },
  {
    id: 7,
    type: "system",
    icon: "⚙️",
    title: "System update",
    message: "New features added: Enhanced document analysis and case tracking",
    time: "1 week ago",
    read: true,
    link: "/help",
    color: "from-coral-400 to-gold-400",
  },
  {
    id: 8,
    type: "document",
    icon: "📄",
    title: "New document uploaded",
    message: "Your document has been successfully uploaded and is being processed",
    time: "1 week ago",
    read: true,
    link: "/upload/review",
    color: "from-mint-400 to-peach-400",
  },
];

export function getUnreadCount(notifications: Notification[]): number {
  return notifications.filter((n) => !n.read).length;
}

export function markAsRead(notificationId: number, notifications: Notification[]): Notification[] {
  return notifications.map((n) =>
    n.id === notificationId ? { ...n, read: true } : n
  );
}

export function markAllAsRead(notifications: Notification[]): Notification[] {
  return notifications.map((n) => ({ ...n, read: true }));
}
