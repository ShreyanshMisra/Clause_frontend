"use client";

import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { BellIcon } from "./icons";
import { mockNotifications, type Notification, getUnreadCount } from "@/utils/notifications";

export function Notification() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const isMobile = useIsMobile();

  const unreadCount = getUnreadCount(notifications);
  const notificationList = notifications.slice(0, 5);

  const handleNotificationClick = (notificationId: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
    setIsOpen(false);
  };

  return (
    <Dropdown
      isOpen={isOpen}
      setIsOpen={(open) => {
        setIsOpen(open);
      }}
    >
      <DropdownTrigger
        className="glass hover:shadow-glow-peach border-peach-200/50 focus-visible:border-coral-400 focus-visible:text-coral-500 dark:border-coral-500/30 dark:focus-visible:border-coral-400 grid size-12 place-items-center rounded-full border text-dark outline-none transition-all hover:scale-110 dark:text-white"
        aria-label="View Notifications"
      >
        <span className="relative">
          <BellIcon />

          {unreadCount > 0 && (
            <span className="from-coral-500 to-peach-500 absolute -right-1 -top-1 z-10 flex size-5 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white ring-2 ring-white dark:ring-dark-3">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </span>
      </DropdownTrigger>

      <DropdownContent
        align={isMobile ? "end" : "center"}
        className="dark:border-coral-500/20 min-w-[20rem] rounded-3xl border border-gray-200 bg-white px-3.5 py-3 shadow-xl dark:border-gray-700 dark:bg-dark-2"
        style={{
          isolation: "isolate",
        }}
      >
        <div className="mb-1 flex items-center justify-between px-2 py-1.5">
          <span className="text-lg font-bold text-dark dark:text-white">
            Notifications
          </span>
          {unreadCount > 0 && (
            <span className="shadow-glow-coral rounded-full bg-gradient-primary px-3 py-1 text-xs font-bold text-white">
              {unreadCount} new
            </span>
          )}
        </div>

        <ul className="custom-scrollbar mb-3 max-h-[23rem] space-y-2 overflow-y-auto">
          {notificationList.length === 0 ? (
            <li className="px-2 py-4 text-center text-sm text-dark-5 dark:text-gray-400">
              No notifications
            </li>
          ) : (
            notificationList.map((notification) => (
              <li key={notification.id} role="menuitem">
                <Link
                  href={notification.link}
                  onClick={() => handleNotificationClick(notification.id)}
                  className={cn(
                    "hover:shadow-soft-2 flex items-start gap-3 rounded-2xl p-3 outline-none transition-all hover:brightness-110",
                    "border border-transparent",
                    !notification.read &&
                      "border-coral-300/50 bg-coral-50/20 dark:border-coral-500/30 dark:bg-coral-900/10",
                  )}
                >
                  <div
                    className={cn(
                      "shadow-soft-1 flex-shrink-0 rounded-xl bg-gradient-to-br p-2",
                      notification.color,
                    )}
                  >
                    <span className="text-lg">{notification.icon}</span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-start justify-between gap-2">
                      <strong
                        className={cn(
                          "block flex-1 text-sm font-bold text-dark dark:text-white",
                          notification.read && "opacity-70",
                        )}
                      >
                        {notification.title}
                      </strong>
                      {!notification.read && (
                        <div className="bg-coral-500 dark:bg-coral-400 size-2 flex-shrink-0 rounded-full" />
                      )}
                    </div>

                    <p className="mb-1 truncate text-xs text-dark-5 dark:text-gray-400">
                      {notification.message}
                    </p>

                    <span className="text-xs font-medium text-dark-5 dark:text-gray-400">
                      {notification.time}
                    </span>
                  </div>
                </Link>
              </li>
            ))
          )}
        </ul>

        <Link
          href="/notifications"
          onClick={() => setIsOpen(false)}
          className="btn-gradient focus-visible:ring-coral-400 block rounded-full p-2.5 text-center text-sm font-bold text-white outline-none transition-all hover:scale-105 focus-visible:ring-2"
        >
          See all notifications
        </Link>
      </DropdownContent>
    </Dropdown>
  );
}
