"use client";

import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_DATA } from "./data";
import { ArrowLeftIcon, ChevronUp, SparklesIcon } from "./icons";
import * as Icons from "./icons";
import { MenuItem } from "./menu-item";
import { useSidebarContext } from "./sidebar-context";

export function Sidebar() {
  const pathname = usePathname();
  const { setIsOpen, isOpen, isMobile, toggleSidebar } = useSidebarContext();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<
    Array<{ role: "user" | "ai"; content: string }>
  >([
    {
      role: "ai",
      content: "Hello! I'm your AI assistant. How can I help you today? 😊",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) => (prev.includes(title) ? [] : [title]));

    // Uncomment the following line to enable multiple expanded items
    // setExpandedItems((prev) =>
    //   prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title],
    // );
  };

  useEffect(() => {
    // Keep collapsible open, when it's subpage is active
    NAV_DATA.some((section) => {
      return section.items.some((item) => {
        if (item.items && Array.isArray(item.items) && item.items.length > 0) {
          return item.items.some((subItem: any) => {
            if (subItem?.url === pathname) {
              if (!expandedItems.includes(item.title)) {
                toggleExpanded(item.title);
              }
              // Break the loop
              return true;
            }
            return false;
          });
        }
        return false;
      });
    });
  }, [pathname, expandedItems, toggleExpanded]);

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "border-peach-200/30 dark:border-coral-500/20 max-w-[290px] overflow-hidden rounded-r-3xl border-r bg-white/40 backdrop-blur-2xl transition-[width] duration-300 ease-out dark:bg-white/5",
          isMobile
            ? "fixed bottom-0 top-0 z-50 mb-4 ml-4 mt-4"
            : "sticky top-4 my-4 ml-4 h-[calc(100vh-2rem)]",
          isOpen ? "w-full" : "w-0",
        )}
        style={{
          boxShadow:
            "0px 8px 32px rgba(255, 149, 120, 0.12), 0px 0px 0px 1px rgba(255, 255, 255, 0.6) inset",
        }}
        aria-label="Main navigation"
        aria-hidden={!isOpen}
        inert={!isOpen}
      >
        <div className="flex h-full flex-col py-10 pl-[25px] pr-[7px]">
          <div className="relative pr-4.5">
            <Link
              href={"/"}
              onClick={() => isMobile && toggleSidebar()}
              className="px-0 py-2.5 min-[850px]:py-0"
            >
              <Logo />
            </Link>

            {isMobile && (
              <button
                onClick={toggleSidebar}
                className="absolute left-3/4 right-4.5 top-1/2 -translate-y-1/2 text-right"
              >
                <span className="sr-only">Close Menu</span>

                <ArrowLeftIcon className="ml-auto size-7" />
              </button>
            )}
          </div>

          {/* Navigation */}
          <div className="custom-scrollbar mt-6 flex-1 overflow-y-auto pr-3 min-[850px]:mt-10">
            {NAV_DATA.map((section) => (
              <div key={section.label} className="mb-6">
                <h2 className="mb-5 text-sm font-medium text-dark-4 dark:text-dark-6">
                  {section.label}
                </h2>

                <nav role="navigation" aria-label={section.label}>
                  <ul className="space-y-2">
                    {section.items.map((item) => (
                      <li key={item.title}>
                        {item.items.length ? (
                          <div>
                            <MenuItem
                              isActive={item.items.some(
                                ({ url }) => url === pathname,
                              )}
                              onClick={() => toggleExpanded(item.title)}
                            >
                              <item.icon
                                className="size-6 shrink-0"
                                aria-hidden="true"
                              />

                              <span>{item.title}</span>

                              <ChevronUp
                                className={cn(
                                  "ml-auto rotate-180 transition-transform duration-200",
                                  expandedItems.includes(item.title) &&
                                    "rotate-0",
                                )}
                                aria-hidden="true"
                              />
                            </MenuItem>

                            {expandedItems.includes(item.title) &&
                              item.items &&
                              Array.isArray(item.items) &&
                              item.items.length > 0 && (
                                <ul
                                  className="ml-9 mr-0 space-y-1.5 pb-[15px] pr-0 pt-2"
                                  role="menu"
                                >
                                  {item.items.map((subItem: any) => {
                                    if (subItem?.title && subItem?.url) {
                                      return (
                                        <li key={subItem.title} role="none">
                                          <MenuItem
                                            as="link"
                                            href={subItem.url}
                                            isActive={pathname === subItem.url}
                                          >
                                            <span>{subItem.title}</span>
                                          </MenuItem>
                                        </li>
                                      );
                                    }
                                    return null;
                                  })}
                                </ul>
                              )}
                          </div>
                        ) : (
                          (() => {
                            const href =
                              "url" in item && item.url
                                ? String(item.url)
                                : "/" +
                                  String(item.title)
                                    .toLowerCase()
                                    .split(" ")
                                    .join("-");

                            return (
                              <MenuItem
                                className="flex items-center gap-3 py-3"
                                as="link"
                                href={href}
                                isActive={pathname === href}
                              >
                                <item.icon
                                  className="size-6 shrink-0"
                                  aria-hidden="true"
                                />

                                <span>{String(item.title)}</span>
                              </MenuItem>
                            );
                          })()
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            ))}
          </div>

          {/* AI Helper Card */}
          <div className="mb-6 mr-3 mt-auto">
            <div className="border-peach-200/40 from-peach-50/80 to-coral-50/60 dark:border-coral-500/30 dark:from-coral-500/10 dark:to-orchid-500/10 rounded-3xl border bg-gradient-to-br p-5 backdrop-blur-xl">
              <div className="mb-4 flex items-center gap-3">
                <div className="shadow-glow-coral rounded-full bg-gradient-primary p-2.5">
                  <Icons.SparklesIcon
                    className="size-5 text-white"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-dark dark:text-white">
                    AI Helper
                  </h3>
                  <p className="text-xs text-dark-5 dark:text-gray-400">
                    Ask a question
                  </p>
                </div>
              </div>
              <button
                onClick={() => setChatOpen(true)}
                className="shadow-glow-coral w-full rounded-full bg-gradient-primary px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Ask a Question
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* AI Chat Panel - Bottom Left */}
      {chatOpen && (
        <div className="glass-card fixed bottom-6 left-6 z-50 w-96 rounded-3xl shadow-2xl">
          <div className="border-peach-200/50 dark:border-coral-500/20 flex items-center justify-between border-b p-4">
            <div className="flex items-center gap-2">
              <SparklesIcon className="text-coral-500 dark:text-coral-400 size-5" />
              <span className="font-bold text-dark dark:text-white">
                AI Helper
              </span>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="hover:bg-peach-100 dark:hover:bg-coral-500/20 rounded-full p-1.5 transition-colors"
              aria-label="Close chat"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="h-96 space-y-4 overflow-y-auto p-4">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-3 text-sm ${
                    msg.role === "user"
                      ? "bg-peach-200 dark:bg-peach-900/30 text-dark dark:text-white"
                      : "from-peach-100/60 to-coral-100/60 dark:from-coral-500/20 dark:to-orchid-500/20 bg-gradient-to-br text-dark dark:text-white"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="from-peach-100/60 to-coral-100/60 dark:from-coral-500/20 dark:to-orchid-500/20 rounded-2xl bg-gradient-to-br p-3">
                  <div className="flex gap-1">
                    <div className="bg-coral-500 h-2 w-2 animate-bounce rounded-full"></div>
                    <div
                      className="bg-coral-500 h-2 w-2 animate-bounce rounded-full"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="bg-coral-500 h-2 w-2 animate-bounce rounded-full"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="border-peach-200/50 dark:border-coral-500/20 border-t p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!chatInput.trim()) return;

                setChatMessages((prev) => [
                  ...prev,
                  { role: "user", content: chatInput },
                ]);
                setChatInput("");
                setIsTyping(true);

                // Mock response - replace with actual API call later
                setTimeout(() => {
                  setChatMessages((prev) => [
                    ...prev,
                    {
                      role: "ai",
                      content:
                        "This is a template response. The backend chatbot integration will be implemented here.",
                    },
                  ]);
                  setIsTyping(false);
                }, 1500);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask a question..."
                className="input-pill flex-1"
              />
              <button
                type="submit"
                className="btn-gradient rounded-full px-6 py-3 font-semibold"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
