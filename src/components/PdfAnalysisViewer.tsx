"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import {
  PdfLoader,
  PdfHighlighter,
  Highlight,
  AreaHighlight,
} from "react-pdf-highlighter";
import type {
  IHighlight,
  NewHighlight,
  ScaledPosition,
  Scaled,
} from "react-pdf-highlighter";
import * as pdfjsLib from "pdfjs-dist";
import {
  fetchAnalysis,
  type Highlight as AnalysisHighlight,
  type AnalysisData,
} from "@/utils/fetchAnalysis";

// CRITICAL: Import the CSS styles from react-pdf-highlighter
// This provides the required `position: absolute` styling for the container
import "react-pdf-highlighter/dist/style.css";

// Configure PDF.js worker
if (typeof window !== "undefined" && "GlobalWorkerOptions" in pdfjsLib) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
}

interface PdfAnalysisViewerProps {
  documentId: string;
  apiUrl?: string;
  onSelectIssue?: (highlightId: string) => void;
}

export interface PdfAnalysisViewerRef {
  scrollToHighlight: (highlightId: string) => void;
}

interface CustomPopoverProps {
  highlight: AnalysisHighlight;
}

const CustomPopover: React.FC<CustomPopoverProps> = ({ highlight }) => (
  <div className="max-w-md rounded-lg border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-gray-800">
    <div className="space-y-3">
      <div>
        <h3 className="mb-1 text-lg font-bold text-gray-900 dark:text-white">
          {highlight.category}
        </h3>
        <div className="mb-2 flex items-center gap-2">
          <span
            className={`inline-block rounded px-2 py-1 text-xs font-semibold ${
              highlight.color === "red"
                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                : highlight.color === "orange"
                  ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                  : highlight.color === "yellow"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
            }`}
          >
            Priority {highlight.priority}
          </span>
        </div>
      </div>

      <div className="rounded bg-gray-50 p-3 text-sm italic text-gray-700 dark:bg-gray-700 dark:text-gray-300">
        &quot;{highlight.text}&quot;
      </div>

      <p className="text-sm text-gray-800 dark:text-gray-200">
        {highlight.explanation}
      </p>

      {highlight.statute && (
        <div className="text-xs text-gray-600 dark:text-gray-400">
          <span className="font-semibold">Legal Reference:</span>{" "}
          {highlight.statute}
        </div>
      )}

      {highlight.damages_estimate && highlight.damages_estimate > 0 && (
        <div className="text-sm font-semibold text-green-600 dark:text-green-400">
          Potential Recovery: ${highlight.damages_estimate.toLocaleString()}
        </div>
      )}

      <button className="mt-2 w-full rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
        Generate Demand Letter
      </button>
    </div>
  </div>
);

const getHighlightColor = (color: string): string => {
  switch (color) {
    case "red":
      return "rgba(255, 99, 71, 0.35)";
    case "orange":
      return "rgba(255, 165, 0, 0.35)";
    case "yellow":
      return "rgba(255, 235, 59, 0.35)";
    case "green":
      return "rgba(76, 175, 80, 0.35)";
    default:
      return "rgba(255, 226, 104, 0.35)";
  }
};

/**
 * Normalizes raw position data from JSON into a proper ScaledPosition object
 * that react-pdf-highlighter expects.
 */
const normalizePosition = (
  raw: { boundingRect: any; rects: any[] },
  pageNumber: number,
): ScaledPosition => {
  const makeScaled = (r: any): Scaled => {
    const x1 = r.x1 ?? r.left ?? 0;
    const y1 = r.y1 ?? r.top ?? 0;
    const x2 = r.x2 ?? r.right ?? x1;
    const y2 = r.y2 ?? r.bottom ?? y1;
    const width = r.width ?? Math.max(0, x2 - x1);
    const height = r.height ?? Math.max(0, y2 - y1);
    return {
      x1,
      y1,
      x2,
      y2,
      width,
      height,
      pageNumber,
    };
  };

  const boundingRect = makeScaled(raw.boundingRect || {});
  const rects =
    raw.rects && raw.rects.length > 0
      ? raw.rects.map((r) => makeScaled(r))
      : [boundingRect];

  return {
    pageNumber,
    boundingRect,
    rects,
    usePdfCoordinates: true,
  };
};

export const PdfAnalysisViewer = forwardRef<
  PdfAnalysisViewerRef,
  PdfAnalysisViewerProps
>(({ documentId, apiUrl, onSelectIssue }, ref) => {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollToRef = useRef<((highlight: IHighlight) => void) | null>(null);
  const effectiveHighlightsRef = useRef<IHighlight[]>([]);

  // Expose scrollToHighlight method via ref
  // Must be called before any conditional returns to follow Rules of Hooks
  useImperativeHandle(
    ref,
    () => ({
      scrollToHighlight: (highlightId: string) => {
        // Use ref to get current highlights (always up-to-date)
        const highlights = effectiveHighlightsRef.current;
        const highlight = highlights.find((h) => h.id === highlightId);
        if (highlight && scrollToRef.current) {
          console.log("📜 Scrolling to highlight:", highlightId);
          scrollToRef.current(highlight);
        } else {
          console.warn("⚠️ Could not scroll to highlight:", highlightId, {
            highlightFound: !!highlight,
            scrollToAvailable: !!scrollToRef.current,
            totalHighlights: highlights.length,
          });
        }
      },
    }),
    [], // Empty dependency array since we use refs
  );

  useEffect(() => {
    const loadAnalysis = async () => {
      try {
        setLoading(true);
        // Clear highlights ref while loading
        effectiveHighlightsRef.current = [];
        const data = await fetchAnalysis(documentId);
        console.log("✅ Analysis data loaded:", data);

        // Enhanced logging for debugging
        console.log("fetchAnalysis result:", {
          pdfUrl: data.pdfUrl,
          count: data.highlights?.length,
          firstHighlight: data.highlights?.[0],
        });

        // Ensure highlights is always an array
        const safeHighlights = Array.isArray(data.highlights)
          ? data.highlights
          : [];

        // Validate PDF URL
        if (!data.pdfUrl || typeof data.pdfUrl !== "string") {
          console.error("❌ Invalid PDF URL:", data.pdfUrl);
          setError("Invalid PDF URL in analysis data");
          effectiveHighlightsRef.current = [];
          return;
        }

        setAnalysisData({ ...data, highlights: safeHighlights });
        setError(null);
      } catch (err) {
        console.error("❌ Error loading analysis:", err);
        setError("Failed to load analysis data");
        effectiveHighlightsRef.current = [];
      } finally {
        setLoading(false);
      }
    };
    loadAnalysis();
  }, [documentId]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading PDF analysis...
          </p>
        </div>
      </div>
    );
  }

  if (error || !analysisData) {
    return (
      <div className="flex h-screen items-center justify-center text-center">
        <p className="text-xl font-semibold text-red-600 dark:text-red-400">
          {error || "No analysis data available"}
        </p>
      </div>
    );
  }

  // Normalize highlights from analysis data using the helper function
  const highlights: IHighlight[] = (analysisData.highlights ?? []).map((h) => {
    const normalizedPosition = normalizePosition(h.position, h.pageNumber);
    return {
      id: h.id,
      position: normalizedPosition,
      content: { text: h.text },
      comment: { text: h.category, emoji: "" },
    };
  });

  const highlightMap = new Map(analysisData.highlights.map((h) => [h.id, h]));

  // Test highlight fallback - only used if no highlights from data
  const testHighlight: IHighlight = {
    id: "test-highlight",
    position: {
      pageNumber: 1,
      usePdfCoordinates: true,
      boundingRect: {
        x1: 72,
        y1: 150,
        x2: 540,
        y2: 190,
        width: 540 - 72,
        height: 40,
        pageNumber: 1,
      },
      rects: [
        {
          x1: 72,
          y1: 150,
          x2: 540,
          y2: 190,
          width: 540 - 72,
          height: 40,
          pageNumber: 1,
        },
      ],
    },
    content: { text: "Test highlight" },
    comment: { text: "Test", emoji: "" },
  };

  // Use test highlight if no highlights from data
  // For testing: set to true to always show test highlight, false to only show when no data
  const useTestHighlight = highlights.length === 0;
  const effectiveHighlights = useTestHighlight
    ? [testHighlight, ...highlights]
    : highlights;

  // Update ref with current highlights so useImperativeHandle can access them
  effectiveHighlightsRef.current = effectiveHighlights;

  // Enhanced logging
  console.log("🎨 Highlights to render:", highlights);
  console.log("📍 First highlight position:", highlights[0]?.position);
  console.log("📊 Total highlights from data:", highlights.length);
  console.log("📊 Effective highlights to render:", effectiveHighlights.length);
  console.log("📄 PDF URL:", analysisData.pdfUrl);

  if (useTestHighlight) {
    console.log("⚠️ No highlights from data, using test highlight");
  }

  // Log normalized position structure for first highlight
  if (effectiveHighlights.length > 0) {
    console.log(
      "🔍 First effective highlight structure:",
      JSON.stringify(effectiveHighlights[0], null, 2),
    );
  }

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      <PdfLoader
        url={analysisData.pdfUrl}
        beforeLoad={<div>Loading PDF...</div>}
      >
        {(pdfDocument) => {
          console.log("📄 PDF Document loaded:", pdfDocument);
          console.log(
            "🔢 About to render PdfHighlighter with",
            effectiveHighlights.length,
            "highlights",
          );
          return (
            <PdfHighlighter
              pdfDocument={pdfDocument}
              enableAreaSelection={() => false}
              onScrollChange={() => {}}
              scrollRef={(scrollTo) => {
                console.log("📜 ScrollRef initialized");
                scrollToRef.current = scrollTo;
              }}
              onSelectionFinished={() => null}
              highlightTransform={(
                highlight,
                index,
                setTip,
                hideTip,
                viewportToScaled,
                screenshot,
                isScrolledTo,
              ) => {
                console.log(`🖍️ Rendering highlight ${index}:`, highlight.id);
                console.log(
                  `📍 Full highlight position object:`,
                  JSON.stringify(highlight.position, null, 2),
                );

                const original = highlightMap.get(highlight.id);
                const color = original
                  ? getHighlightColor(original.color)
                  : "rgba(255,226,104,0.35)";

                console.log(
                  `🎨 Using color: ${color} for highlight ${highlight.id}`,
                );
                console.log(
                  `📄 Highlight page number: ${highlight.position.pageNumber}`,
                );
                console.log(
                  `📐 BoundingRect:`,
                  highlight.position.boundingRect,
                );
                console.log(
                  `📦 Rects count: ${highlight.position.rects.length}`,
                );

                // AreaHighlight accepts ...otherProps which are spread to the underlying Rnd component
                // We apply the background color via inline style to override CSS module styles
                // TypeScript doesn't know about these additional props, so we use type assertion
                const areaHighlightProps = {
                  key: highlight.id,
                  highlight,
                  isScrolledTo,
                  onChange: () => {},
                  // Apply style to Rnd component
                  // The backgroundColor should be visible if CSS doesn't override with !important
                  style: {
                    backgroundColor: color,
                  },
                  onClick: (event: React.MouseEvent) => {
                    event.stopPropagation();
                    console.log("🖱️ Clicked highlight:", highlight.id);
                    setTip(highlight, () =>
                      original ? (
                        <CustomPopover highlight={original} />
                      ) : (
                        <div>No details available</div>
                      ),
                    );
                    if (onSelectIssue) onSelectIssue(highlight.id);
                  },
                  onMouseEnter: () => {
                    console.log("🐭 Mouse entered highlight:", highlight.id);
                    setTip(highlight, () =>
                      original ? (
                        <CustomPopover highlight={original} />
                      ) : (
                        <div>No details available</div>
                      ),
                    );
                  },
                  onMouseLeave: hideTip,
                } as any;

                return <AreaHighlight {...areaHighlightProps} />;
              }}
              highlights={effectiveHighlights}
            />
          );
        }}
      </PdfLoader>
    </div>
  );
});

PdfAnalysisViewer.displayName = "PdfAnalysisViewer";
