"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { mockNotifications, type Notification, getUnreadCount, markAllAsRead } from "@/utils/notifications";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unreadCount = getUnreadCount(notifications);

  const filteredNotifications =
    filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  const handleMarkAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(markAllAsRead(notifications));
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="glass-card">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="mb-1 text-3xl font-bold text-dark dark:text-white">
              Notifications
            </h1>
            {unreadCount > 0 && (
              <p className="text-sm text-dark-5 dark:text-gray-400">
                You have {unreadCount} unread {unreadCount === 1 ? "notification" : "notifications"}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="border-peach-200/50 dark:border-coral-500/20 flex gap-1 rounded-full border bg-white/40 p-1 dark:bg-white/5">
              <button
                onClick={() => setFilter("all")}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition-all",
                  filter === "all"
                    ? "shadow-glow-coral bg-gradient-primary text-white"
                    : "text-dark hover:bg-white/50 dark:text-white dark:hover:bg-white/10"
                )}
              >
                All
              </button>
              <button
                onClick={() => setFilter("unread")}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition-all",
                  filter === "unread"
                    ? "shadow-glow-coral bg-gradient-primary text-white"
                    : "text-dark hover:bg-white/50 dark:text-white dark:hover:bg-white/10"
                )}
              >
                Unread {unreadCount > 0 && `(${unreadCount})`}
              </button>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="btn-glass px-4 py-2 text-sm font-semibold"
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="border-peach-200/50 dark:border-coral-500/20 rounded-2xl border bg-white/40 p-12 text-center dark:bg-white/5">
              <div className="mb-3 text-5xl">🔔</div>
              <h3 className="mb-2 text-xl font-bold text-dark dark:text-white">
                {filter === "unread" ? "No unread notifications" : "No notifications"}
              </h3>
              <p className="text-sm text-dark-5 dark:text-gray-400">
                {filter === "unread" 
                  ? "You're all caught up!" 
                  : "You don't have any notifications yet."}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <Link
                key={notification.id}
                href={notification.link}
                onClick={() => handleMarkAsRead(notification.id)}
                className={cn(
                  "hover:shadow-soft-2 border-peach-200/50 dark:border-coral-500/20 flex items-start gap-4 rounded-2xl border bg-white/40 p-5 transition-all hover:scale-[1.01] hover:brightness-110 dark:bg-white/5",
                  !notification.read &&
                    "border-coral-300/50 bg-coral-50/30 ring-2 ring-coral-300/30 dark:border-coral-500/40 dark:bg-coral-900/20 dark:ring-coral-500/30"
                )}
              >
                <div
                  className={cn(
                    "shadow-soft-1 flex-shrink-0 rounded-xl bg-gradient-to-br p-3",
                    notification.color
                  )}
                >
                  <span className="text-2xl">{notification.icon}</span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h3
                        className={cn(
                          "mb-1 text-lg font-bold text-dark dark:text-white",
                          notification.read && "opacity-70"
                        )}
                      >
                        {notification.title}
                      </h3>
                      <p className="text-sm text-dark-5 dark:text-gray-400">
                        {notification.message}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="bg-coral-500 dark:bg-coral-400 size-3 flex-shrink-0 rounded-full" />
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-dark-5 dark:text-gray-400">
                      {notification.time}
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-semibold",
                        notification.type === "analysis" && "bg-peach-100 text-peach-700 dark:bg-peach-900/30 dark:text-peach-400",
                        notification.type === "case" && "bg-coral-100 text-coral-700 dark:bg-coral-900/30 dark:text-coral-400",
                        notification.type === "letter" && "bg-gold-100 text-gold-700 dark:bg-gold-900/30 dark:text-gold-400",
                        notification.type === "document" && "bg-mint-100 text-mint-700 dark:bg-mint-900/30 dark:text-mint-400",
                        notification.type === "system" && "bg-orchid-100 text-orchid-700 dark:bg-orchid-900/30 dark:text-orchid-400"
                      )}
                    >
                      {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-dark-5 transition-transform group-hover:translate-x-1 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      <div className="glass-card">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2 text-sm text-dark-5 dark:text-gray-400">
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
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span>Notifications are updated in real-time</span>
          </div>
          <Link
            href="/"
            className="btn-glass px-6 py-3 text-sm font-semibold"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
