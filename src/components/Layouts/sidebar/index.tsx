"use client";

import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { NAV_DATA } from "./data";
import { ArrowLeftIcon, ChevronUp, SparklesIcon } from "./icons";
import * as Icons from "./icons";
import { MenuItem } from "./menu-item";
import { useSidebarContext } from "./sidebar-context";
import { api, type ChatRequest, type ChatResponse } from "@/lib/api";
import toast from "react-hot-toast";

export function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { setIsOpen, isOpen, isMobile, toggleSidebar } = useSidebarContext();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<
    Array<{
      role: "user" | "ai";
      content: string;
      sources?: Array<{ chapter: string; section: string; relevance: string }>;
    }>
  >([
    {
      role: "ai",
      content:
        "Hello! I'm your AI assistant. I can help answer questions about Massachusetts housing laws and your documents. How can I help you today? 😊",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (chatOpen && chatMessagesEndRef.current) {
      chatMessagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, chatOpen, isTyping]);

  // Get current file_id from URL if available (for document-specific context)
  const getCurrentFileId = (): string | undefined => {
    try {
      // Check for file_id in search params (analysis/results pages)
      if (searchParams) {
        const fileId =
          searchParams.get("file_id") || searchParams.get("documentId");
        if (fileId && fileId !== "1") return fileId;
      }

      // Check for file_id in path (results page: /results/[id])
      if (pathname && pathname.startsWith("/results/")) {
        const match = pathname.match(/\/results\/([^/]+)/);
        if (match && match[1] && match[1] !== "1") return match[1];
      }

      // Check sessionStorage for current file_id
      if (typeof window !== "undefined") {
        const sessionFileId = sessionStorage.getItem("current_file_id");
        if (sessionFileId) return sessionFileId;
      }
    } catch (error) {
      // If searchParams is not available, try sessionStorage
      if (typeof window !== "undefined") {
        const sessionFileId = sessionStorage.getItem("current_file_id");
        if (sessionFileId) return sessionFileId;
      }
    }

    return undefined;
  };

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
          "max-w-[290px] overflow-hidden rounded-r-3xl border-r border-peach-200/30 bg-white/40 backdrop-blur-2xl transition-[width] duration-300 ease-out dark:border-coral-500/20 dark:bg-white/5",
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
            <div className="rounded-3xl border border-peach-200/40 bg-gradient-to-br from-peach-50/80 to-coral-50/60 p-5 backdrop-blur-xl dark:border-coral-500/30 dark:from-coral-500/10 dark:to-orchid-500/10">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-full bg-gradient-primary p-2.5 shadow-glow-coral">
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
                className="w-full rounded-full bg-gradient-primary px-4 py-3 text-sm font-semibold text-white shadow-glow-coral transition-all duration-300 hover:scale-105 active:scale-95"
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
          <div className="flex items-center justify-between border-b border-peach-200/50 p-4 dark:border-coral-500/20">
            <div className="flex items-center gap-2">
              <SparklesIcon className="size-5 text-coral-500 dark:text-coral-400" />
              <span className="font-bold text-dark dark:text-white">
                AI Helper
              </span>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="rounded-full p-1.5 transition-colors hover:bg-peach-100 dark:hover:bg-coral-500/20"
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
          <div className="custom-scrollbar h-96 space-y-4 overflow-y-auto p-4">
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
                      ? "bg-peach-200 text-dark dark:bg-peach-900/30 dark:text-white"
                      : "bg-gradient-to-br from-peach-100/60 to-coral-100/60 text-dark dark:from-coral-500/20 dark:to-orchid-500/20 dark:text-white"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2 border-t border-peach-200/50 pt-2 dark:border-coral-500/20">
                      <p className="mb-1 text-xs font-semibold text-dark-5 dark:text-gray-400">
                        Sources:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {msg.sources.map((source, sourceIdx) => (
                          <span
                            key={sourceIdx}
                            className="rounded-full bg-peach-100 px-2 py-0.5 text-xs font-medium text-peach-700 dark:bg-peach-900/30 dark:text-peach-400"
                          >
                            M.G.L. c. {source.chapter} §{source.section}
                            {source.relevance && (
                              <span className="ml-1 opacity-70">
                                ({parseFloat(source.relevance) * 100}%)
                              </span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-gradient-to-br from-peach-100/60 to-coral-100/60 p-3 dark:from-coral-500/20 dark:to-orchid-500/20">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-coral-500"></div>
                    <div
                      className="h-2 w-2 animate-bounce rounded-full bg-coral-500"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="h-2 w-2 animate-bounce rounded-full bg-coral-500"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatMessagesEndRef} />
          </div>
          <div className="border-t border-peach-200/50 p-4 dark:border-coral-500/20">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!chatInput.trim() || isTyping) return;

                const userMessage = chatInput.trim();
                setChatMessages((prev) => [
                  ...prev,
                  { role: "user", content: userMessage },
                ]);
                setChatInput("");
                setIsTyping(true);

                try {
                  // Get current file_id for context if available
                  const fileId = getCurrentFileId();

                  // Prepare chat request
                  const chatRequest: ChatRequest = {
                    message: userMessage,
                    ...(fileId && { file_id: fileId }),
                  };

                  // Call backend chat API
                  const response = await api.post<ChatResponse>(
                    "/chat",
                    chatRequest,
                  );

                  // Add AI response with sources
                  setChatMessages((prev) => [
                    ...prev,
                    {
                      role: "ai",
                      content: response.answer,
                      sources: response.sources,
                    },
                  ]);
                } catch (error: any) {
                  console.error("Chat error:", error);
                  const errorMessage =
                    error instanceof Error
                      ? error.message
                      : "I'm having trouble connecting. Please try again.";

                  setChatMessages((prev) => [
                    ...prev,
                    {
                      role: "ai",
                      content: `Sorry, I encountered an error: ${errorMessage}. Please try again.`,
                    },
                  ]);

                  toast.error("Failed to get AI response. Please try again.");
                } finally {
                  setIsTyping(false);
                }
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask a question..."
                className="input-pill flex-1"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={isTyping}
                className="btn-gradient rounded-full px-6 py-3 font-semibold disabled:cursor-not-allowed disabled:opacity-50"
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
