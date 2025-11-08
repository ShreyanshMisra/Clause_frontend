import "@/css/satoshi.css";
import "@/css/style.css";

import { Sidebar } from "@/components/Layouts/sidebar";

import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/jsvectormap.css";

import { Header } from "@/components/Layouts/header";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import type { PropsWithChildren } from "react";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    template: "%s | Free Money App - AI Contract Analyzer",
    default: "Free Money App - AI-Powered Contract Analyzer",
  },
  description:
    "AI-powered contract analyzer for rental and medical billing in Massachusetts. Spot illegal clauses, calculate what you're owed, and generate demand letters.",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          <NextTopLoader color="#FF9578" showSpinner={false} />

          <div className="flex min-h-screen">
            <Sidebar />

            <div className="w-full bg-transparent">
              <Header />

              <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden px-4 py-6 md:px-6 md:py-8 2xl:px-10 2xl:py-12">
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
