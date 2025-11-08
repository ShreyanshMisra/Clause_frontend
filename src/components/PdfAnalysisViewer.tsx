"use client";

import React, { useState, useEffect } from "react";
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

interface CustomPopoverProps {
  highlight: AnalysisHighlight;
}

const CustomPopover: React.FC<CustomPopoverProps> = ({ highlight }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 max-w-md border border-gray-200 dark:border-gray-700">
    <div className="space-y-3">
      <div>
        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
          {highlight.category}
        </h3>
        <div className="flex items-center gap-2 mb-2">
          <span
            className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
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

      <div className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded italic">
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

      <button className="w-full mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors">
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

export const PdfAnalysisViewer: React.FC<PdfAnalysisViewerProps> = ({
  documentId,
  apiUrl,
  onSelectIssue,
}) => {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAnalysis = async () => {
      try {
        setLoading(true);
        const data = await fetchAnalysis(documentId);
        console.log("✅ Analysis data loaded:", data);
        setAnalysisData(data);
        setError(null);
      } catch (err) {
        console.error("❌ Error loading analysis:", err);
        setError("Failed to load analysis data");
      } finally {
        setLoading(false);
      }
    };
    loadAnalysis();
  }, [documentId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
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
      <div className="flex items-center justify-center h-screen text-center">
        <p className="text-xl font-semibold text-red-600 dark:text-red-400">
          {error || "No analysis data available"}
        </p>
      </div>
    );
  }

  const highlights: IHighlight[] = analysisData.highlights.map((h) => ({
    id: h.id,
    position: {
      boundingRect: h.position.boundingRect,
      rects: h.position.rects,
      pageNumber: h.pageNumber,
    },
    content: { text: h.text },
    comment: { text: h.category, emoji: "" },
  }));

  const highlightMap = new Map(analysisData.highlights.map((h) => [h.id, h]));

  console.log("🎨 Highlights to render:", highlights);
  console.log("📍 First highlight position:", highlights[0]?.position);
  console.log("📊 Total highlights:", highlights.length);
  console.log("📄 PDF URL:", analysisData.pdfUrl);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
      }}
    >
      <PdfLoader url={analysisData.pdfUrl} beforeLoad={<div>Loading PDF...</div>}>
        {(pdfDocument) => {
          console.log("📄 PDF Document loaded:", pdfDocument);
          return (
            <PdfHighlighter
              pdfDocument={pdfDocument}
              enableAreaSelection={() => false}
              onScrollChange={() => {}}
              scrollRef={(scrollTo) => {
                console.log("📜 ScrollRef initialized");
              }}
              onSelectionFinished={() => null}
              highlightTransform={(
                highlight,
                index,
                setTip,
                hideTip,
                viewportToScaled,
                screenshot,
                isScrolledTo
              ) => {
                console.log(`🖍️ Rendering highlight ${index}:`, highlight.id, highlight.position);
                
                const original = highlightMap.get(highlight.id);
                const color = original
                  ? getHighlightColor(original.color)
                  : "rgba(255,226,104,0.3)";

                console.log(`🎨 Using color: ${color} for highlight ${highlight.id}`);

                return (
                  <AreaHighlight
                    key={highlight.id}
                    highlight={highlight}
                    isScrolledTo={isScrolledTo}
                    onChange={() => {}}
                    onClick={() => {
                      console.log("🖱️ Clicked highlight:", highlight.id);
                      setTip(highlight, () =>
                        original ? (
                          <CustomPopover highlight={original} />
                        ) : (
                          <div>No details available</div>
                        )
                      );
                      if (onSelectIssue) onSelectIssue(highlight.id);
                    }}
                    onMouseEnter={() => {
                      console.log("🐭 Mouse entered highlight:", highlight.id);
                      setTip(highlight, () =>
                        original ? (
                          <CustomPopover highlight={original} />
                        ) : (
                          <div>No details available</div>
                        )
                      );
                    }}
                    onMouseLeave={hideTip}
                  />
                );
              }}
              highlights={highlights}
            />
          );
        }}
      </PdfLoader>
    </div>
  );
};
