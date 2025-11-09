export interface HighlightPosition {
  boundingRect: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    pageNumber: number;
  };
  rects: Array<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    pageNumber: number;
  }>;
}

export interface Highlight {
  id: string;
  pageNumber: number;
  color: string;
  priority: number;
  category: string;
  text: string;
  statute: string | null;
  explanation: string;
  damages_estimate: number | null;
  position: HighlightPosition;
}

export interface DocumentMetadata {
  fileName: string;
  uploadDate: string;
  fileSize: string;
  pageCount: number;
  documentType: string;
  parties: {
    landlord: string;
    tenant: string;
    property: string;
  };
}

export interface DeidentificationSummary {
  itemsRedacted: number;
  categories: string[];
}

export interface KeyDetailsDetected {
  leaseType: string;
  propertyAddress: string;
  landlord: string;
  leaseTerm: string;
  monthlyRent?: string;
  securityDeposit?: string;
  specialClauses?: string[];
}

export interface TopIssue {
  title: string;
  severity: string;
  amount: string;
}

export interface AnalysisSummary {
  status: string;
  summaryText: string;
  overallRisk: string;
  issuesFound: number;
  potential_recovery: number;
  estimatedRecovery: string;
  topIssues: TopIssue[];
}

export interface AnalysisData {
  documentId: string;
  pdfUrl: string;
  documentMetadata: DocumentMetadata;
  deidentificationSummary: DeidentificationSummary;
  keyDetailsDetected: KeyDetailsDetected;
  analysisSummary: AnalysisSummary;
  highlights: Highlight[];
}

/**
 * Calculate estimated recovery from highlights' damages_estimate values
 * Always prefers calculated value from highlights over summary value.
 * This ensures consistent amounts across all pages.
 */
export function calculateEstimatedRecovery(
  highlights: Highlight[] | undefined | null,
  fallbackValue: string | undefined,
): string {
  // If highlights array exists (even if empty), always calculate from them
  // This ensures consistency - if highlights exist, we use the calculated value
  if (highlights !== undefined && highlights !== null) {
    const total = highlights.reduce((sum, highlight) => {
      return sum + (highlight.damages_estimate || 0);
    }, 0);
    return `$${total.toLocaleString()}`;
  }

  // Fall back to summary value only if highlights don't exist at all
  return fallbackValue || "$0";
}

export async function fetchAnalysis(file_id: string): Promise<AnalysisData> {
  try {
    // Import the API client
    const { api, getFileUrl } = await import("@/lib/api");

    // Fetch analysis from backend
    const response = await api.get<{
      file_id: string;
      filename: string;
      uploaded_at: string;
      analyzed_at?: string;
      status: string;
      analysis?: AnalysisData;
    }>(`/document/${file_id}`);

    console.log("✅ Fetched analysis data from backend:", response);

    // Check if analysis is complete
    if (response.status !== "completed" || !response.analysis) {
      throw new Error(
        `Document analysis not complete. Status: ${response.status}`,
      );
    }

    const data = response.analysis;

    // Validate that required fields exist
    if (!data.documentMetadata || !data.analysisSummary || !data.highlights) {
      console.error("❌ Invalid analysis data structure:", data);
      throw new Error("Invalid analysis data structure");
    }

    // Ensure documentId is set to the file_id used to fetch the analysis
    // This ensures we always have the file_id available for context
    if (!data.documentId || data.documentId === "1") {
      data.documentId = file_id;
    }

    // Convert relative PDF URL to absolute URL
    if (data.pdfUrl && !data.pdfUrl.startsWith("http")) {
      data.pdfUrl = getFileUrl(data.pdfUrl);
    }

    return data;
  } catch (error) {
    console.error("❌ Error in fetchAnalysis:", error);

    // Fallback to mock data for development/testing
    console.warn("⚠️  Falling back to mock data...");
    try {
      const response = await fetch("/mock-data/sample-highlights.json");
      if (response.ok) {
        return await response.json();
      }
    } catch (fallbackError) {
      console.error("❌ Fallback to mock data also failed:", fallbackError);
    }

    throw error;
  }
}
