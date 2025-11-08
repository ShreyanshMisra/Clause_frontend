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

export async function fetchAnalysis(documentId: string): Promise<AnalysisData> {
  try {
    // In production, this would call the backend API
    // For now, always use the mock data as fallback
    const response = await fetch('/mock-data/sample-highlights.json');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch analysis data: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ Fetched analysis data from mock JSON:', data);
    
    // Validate that required fields exist
    if (!data.documentMetadata || !data.analysisSummary || !data.highlights) {
      console.error('❌ Invalid analysis data structure:', data);
      throw new Error('Invalid analysis data structure');
    }
    
    return data;
  } catch (error) {
    console.error('❌ Error in fetchAnalysis:', error);
    throw error;
  }
}
