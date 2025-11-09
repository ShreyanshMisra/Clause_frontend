/**
 * API Configuration and Fetch Utilities
 * Centralized API client for FastAPI backend communication
 */

// Base URL from environment variable, fallback to localhost for development
export const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Token management
const TOKEN_KEY = "auth_token";

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
};

// TypeScript Interfaces matching backend responses
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
  leaseDetails?: {
    leaseType: string;
    propertyAddress: string;
    leaseTerm: string;
    monthlyRent: string;
    securityDeposit: string;
    specialClauses: string[];
  };
}

export interface DeidentificationSummary {
  redactedEntities: {
    address?: number;
    person_name?: number;
    organization?: number;
    [key: string]: number | undefined;
  };
  encryptionStatus: "enabled" | "disabled";
  privacyNote?: string;
}

export interface KeyDetailsDetected {
  parties?: string[];
  propertyInfo?: string;
  rentAmount?: string;
  leaseTerm?: string;
  securityDeposit?: string;
  startDate?: string;
  endDate?: string;
  landlord?: string;
  tenant?: string;
  propertyAddress?: string;
  specialClauses?: string[];
}

export interface TopIssue {
  title: string;
  severity: string;
  amount?: string;
  summary?: string;
}

export interface AnalysisSummary {
  status: string;
  overallRisk: "Low" | "Medium" | "High" | "Critical";
  issuesFound: number;
  estimatedRecovery: string;
  topIssues: TopIssue[];
  highlightCounts?: {
    illegal: number;
    highRisk: number;
    mediumRisk: number;
    favorable: number;
  };
}

export interface HighlightPosition {
  boundingRect: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    width: number;
    height: number;
    pageNumber: number;
  };
  rects: Array<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    width: number;
    height: number;
    pageNumber: number;
  }>;
  pageHeight: number;
  pageWidth: number;
}

export interface Highlight {
  id: string;
  pageNumber: number;
  color: "red" | "orange" | "yellow" | "green";
  priority: "critical" | "high" | "medium" | "low" | number;
  category: string;
  text: string;
  statute: string | null;
  explanation: string;
  damages_estimate: number | null;
  position: HighlightPosition;
}

export interface AnalysisData {
  documentId: string;
  pdfUrl: string;
  documentMetadata: DocumentMetadata;
  deidentificationSummary: DeidentificationSummary;
  keyDetailsDetected: KeyDetailsDetected;
  analysisSummary: AnalysisSummary;
  highlights: Highlight[];
  document_info?: {
    total_chunks: number;
    analysis_method: string;
  };
}

export interface AnalysisResponse {
  file_id: string;
  filename: string;
  uploaded_at: string;
  analyzed_at?: string;
  status: "uploaded" | "processing" | "completed" | "failed";
  analysis?: AnalysisData;
}

export interface UploadResponse {
  file_id: string;
  filename: string;
  size: number;
  upload_time: string;
  pii_redacted: {
    [key: string]: number;
  };
  message: string;
}

export interface StatusResponse {
  file_id: string;
  status:
    | "uploaded"
    | "processing"
    | "completed"
    | "failed"
    | "metadata_extracted";
  progress: number;
  message: string;
  filename?: string;
}

export interface DocumentListItem {
  file_id: string;
  filename: string;
  uploaded_at: string;
  status: string;
  size: number;
}

export interface DocumentsListResponse {
  total: number;
  documents: DocumentListItem[];
}

export interface ChatRequest {
  message: string;
  file_id?: string;
}

export interface ChatResponse {
  answer: string;
  sources: Array<{
    chapter: string;
    section: string;
    relevance: string;
  }>;
  context?: string;
}

export interface MetadataResponse {
  file_id: string;
  status: string;
  metadata?: KeyDetailsDetected;
  message: string;
}

export interface SenderInfo {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone?: string;
  email?: string;
}

export interface RecipientInfo {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  contact_person?: string;
}

export interface DemandLetterPreferences {
  deadline_days?: number;
  tone?: "formal" | "neutral" | "firm";
}

export interface DemandLetterRequest {
  prompt?: string;
  analysis_json: {
    documentId: string;
    pdfUrl: string;
    documentMetadata: DocumentMetadata;
    deidentificationSummary: DeidentificationSummary;
    keyDetailsDetected: KeyDetailsDetected;
    analysisSummary: AnalysisSummary;
    highlights: Array<{
      id: string;
      pageNumber: number;
      color: string;
      priority: number | string;
      category: string;
      text: string;
      statute: string | null;
      explanation: string;
      damages_estimate: number | null;
      position?: any;
    }>;
    document_info?: {
      total_chunks?: number;
      analysis_method?: string;
      analysis_date?: string;
    };
  };
  sender?: SenderInfo;
  recipient?: RecipientInfo;
  preferences?: DemandLetterPreferences;
}

export interface DemandLetterResponse {
  success: boolean;
  latex_source: string;
  letter_text?: string; // Plain text version
  metadata: {
    generated_at: string;
    total_damages: number;
    issues_count: number;
    deadline_date: string;
    model_used: string;
  };
}

// Custom error class for API errors
export class APIError extends Error {
  constructor(
    public status: number,
    public detail: string,
    public response?: Response,
  ) {
    super(detail);
    this.name = "APIError";
  }
}

// Fetch API wrapper with auth, error handling, and retry logic
interface FetchAPIOptions extends RequestInit {
  retries?: number;
  retryDelay?: number;
  timeout?: number;
}

export async function fetchAPI<T = any>(
  endpoint: string,
  options: FetchAPIOptions = {},
): Promise<T> {
  const {
    retries = 2,
    retryDelay = 1000,
    timeout = 30000,
    headers = {},
    ...fetchOptions
  } = options;

  // Build full URL
  const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint}`;

  // Add authorization header if token exists
  const token = getToken();
  const requestHeaders: Record<string, string> = {
    ...headers,
  } as Record<string, string>;

  if (token) {
    requestHeaders["Authorization"] = `Bearer ${token}`;
  }

  // Don't set Content-Type for FormData (browser sets it with boundary)
  if (!(fetchOptions.body instanceof FormData)) {
    requestHeaders["Content-Type"] = "application/json";
  }

  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  // Retry logic
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers: requestHeaders,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle HTTP errors
      if (!response.ok) {
        let errorDetail = `HTTP ${response.status}: ${response.statusText}`;
        let errorData: any = null;

        try {
          errorData = await response.json();
          errorDetail = errorData.detail || errorData.message || errorDetail;
        } catch {
          // If response is not JSON, try to get text
          try {
            const text = await response.text();
            if (text) {
              errorDetail = text.substring(0, 500);
            }
          } catch {
            // If response is not JSON, use status text
          }
        }

        // Special handling for 404
        if (response.status === 404) {
          // Check if it's actually a network error or a real 404
          if (errorData && errorData.detail) {
            errorDetail = errorData.detail;
          } else {
            errorDetail = `Endpoint ${endpoint} not found. The server returned 404. This could mean:\n1. The endpoint path is incorrect\n2. The server needs to be restarted\n3. There's a routing issue\n\nPlease check:\n- Server is running: http://localhost:8000/docs\n- Endpoint exists: /demand-letter/generate\n- Try restarting the backend server`;
          }
        }

        throw new APIError(response.status, errorDetail, response);
      }

      // Parse JSON response
      const data = await response.json();
      return data as T;
    } catch (error) {
      clearTimeout(timeoutId);
      lastError = error as Error;

      // Don't retry on client errors (4xx) or abort errors
      if (
        error instanceof APIError &&
        error.status >= 400 &&
        error.status < 500
      ) {
        throw error;
      }

      if (error instanceof Error && error.name === "AbortError") {
        throw new APIError(408, "Request timeout");
      }

      // Handle network errors (TypeError: Failed to fetch)
      if (
        error instanceof TypeError &&
        (error.message.includes("fetch") || error.message.includes("network"))
      ) {
        throw new APIError(
          0,
          `Network error: Cannot connect to backend at ${BASE_URL}. Please make sure the backend server is running. Start it with: cd clause_backend/app && python server.py`,
        );
      }

      // Handle AbortError (timeout)
      if (error instanceof Error && error.name === "AbortError") {
        throw new APIError(
          408,
          `Request timeout: The server did not respond within the timeout period. Please check if the backend server is running and try again.`,
        );
      }

      // Retry on network errors or 5xx errors
      if (attempt < retries) {
        await new Promise((resolve) =>
          setTimeout(resolve, retryDelay * (attempt + 1)),
        );
        continue;
      }
    }
  }

  // If all retries failed
  throw lastError || new Error("Request failed after retries");
}

// Convenience methods for common HTTP verbs
export const api = {
  get: <T = any>(endpoint: string, options?: FetchAPIOptions) =>
    fetchAPI<T>(endpoint, { ...options, method: "GET" }),

  post: <T = any>(endpoint: string, data?: any, options?: FetchAPIOptions) =>
    fetchAPI<T>(endpoint, {
      ...options,
      method: "POST",
      body: data instanceof FormData ? data : JSON.stringify(data),
    }),

  put: <T = any>(endpoint: string, data?: any, options?: FetchAPIOptions) =>
    fetchAPI<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: <T = any>(endpoint: string, options?: FetchAPIOptions) =>
    fetchAPI<T>(endpoint, { ...options, method: "DELETE" }),
};

// Helper to construct full file URLs
export const getFileUrl = (path: string): string => {
  if (path.startsWith("http")) return path;
  return `${BASE_URL}${path}`;
};
