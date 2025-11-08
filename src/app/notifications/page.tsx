"use client";

import { useState } from "react";
import Link from "next/link";
import { mockNotifications } from "@/data/mockData";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications =
    filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="mb-1 text-3xl font-bold text-dark dark:text-white">
            Notifications
          </h1>
          <p className="text-dark-5 dark:text-gray-400">
            Stay updated on your documents, cases, and analysis results
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="btn-glass px-6 py-3 font-semibold"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="glass-card">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`rounded-full px-6 py-3 font-semibold transition-all duration-300 ${
              filter === "all"
                ? "shadow-glow-coral bg-gradient-primary text-white"
                : "glass text-dark hover:scale-105 dark:text-white"
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`rounded-full px-6 py-3 font-semibold transition-all duration-300 ${
              filter === "unread"
                ? "shadow-glow-coral bg-gradient-primary text-white"
                : "glass text-dark hover:scale-105 dark:text-white"
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="glass-card py-12 text-center">
            <div className="mb-4 text-6xl">🔔</div>
            <h3 className="mb-2 text-xl font-bold text-dark dark:text-white">
              No notifications
            </h3>
            <p className="text-dark-5 dark:text-gray-400">
              {filter === "unread"
                ? "You're all caught up! No unread notifications."
                : "You don't have any notifications yet."}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <Link
              key={notification.id}
              href={notification.link}
              onClick={() => markAsRead(notification.id)}
              className={`glass-card group block transition-all duration-300 hover:scale-[1.02] ${
                !notification.read
                  ? "border-coral-300/50 dark:border-coral-500/30 border-2"
                  : ""
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className={`flex-shrink-0 rounded-2xl bg-gradient-to-br ${notification.color} shadow-soft-2 p-3`}
                >
                  <span className="text-2xl">{notification.icon}</span>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="mb-2 flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3
                        className={`mb-1 font-bold text-dark dark:text-white ${
                          !notification.read ? "text-lg" : "text-base"
                        }`}
                      >
                        {notification.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-dark-5 dark:text-gray-400">
                        {notification.message}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="flex-shrink-0">
                        <div className="bg-coral-500 dark:bg-coral-400 h-2 w-2 rounded-full" />
                      </div>
                    )}
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs font-medium text-dark-5 dark:text-gray-400">
                      {notification.time}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        notification.type === "analysis"
                          ? "bg-peach-100 text-peach-700 dark:bg-peach-900/30 dark:text-peach-400"
                          : notification.type === "case"
                            ? "bg-coral-100 text-coral-700 dark:bg-coral-900/30 dark:text-coral-400"
                            : notification.type === "letter"
                              ? "bg-gold-100 text-gold-700 dark:bg-gold-900/30 dark:text-gold-400"
                              : notification.type === "system"
                                ? "bg-orchid-100 text-orchid-700 dark:bg-orchid-900/30 dark:text-orchid-400"
                                : "bg-mint-100 text-mint-700 dark:bg-mint-900/30 dark:text-mint-400"
                      }`}
                    >
                      {notification.type.charAt(0).toUpperCase() +
                        notification.type.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Template Notice */}
      <div className="glass-card border-mint-200/50 bg-mint-50/30 dark:border-mint-800/30 dark:bg-mint-900/10 rounded-2xl border p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <h4 className="mb-1 text-sm font-bold text-dark dark:text-white">
              Template Mode
            </h4>
            <p className="text-xs leading-relaxed text-dark-5 dark:text-gray-400">
              This is a template notifications page using mock data. In
              production, notifications will be fetched from your account and
              updated in real-time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
