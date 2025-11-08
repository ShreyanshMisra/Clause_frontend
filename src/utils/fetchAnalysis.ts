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

export interface AnalysisData {
  documentId: string;
  pdfUrl: string;
  analysisSummary: {
    status: string;
    summaryText: string;
    potential_recovery: number;
  };
  highlights: Highlight[];
}

export async function fetchAnalysis(documentId: string): Promise<AnalysisData> {
  try {
    // Try to fetch from backend API
    const response = await fetch(`/api/analysis/${documentId}`);
    
    if (response.ok) {
      const data = await response.json();
      return data;
    }
    
    // If backend fails or returns 404, fallback to mock data
    throw new Error('Backend not available');
  } catch (error) {
    // Fallback to local mock data
    console.log('Using mock data for analysis');
    const mockResponse = await fetch('/mock-data/sample-highlights.json');
    const mockData = await mockResponse.json();
    return mockData;
  }
}
