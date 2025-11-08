"use client";

import { SidebarProvider } from "@/components/Layouts/sidebar/sidebar-context";
import { ThemeProvider } from "next-themes";
import ToasterProvider from "@/components/ToasterProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="light" attribute="class">
      <ToasterProvider />
      <SidebarProvider>{children}</SidebarProvider>
    </ThemeProvider>
  );
}
