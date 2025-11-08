# Frontend-Backend Integration Guide

## 📋 Overview

This guide documents the integration between the Next.js frontend (`src/`) and the FastAPI backend (`clause_backend/`) for the Clause AI Lease Analyzer application.

---

## ✅ Completed Integrations

### 1. API Configuration (`src/lib/api.ts`)

**Status:** ✅ Complete

- **Base URL Configuration:** Reads from `NEXT_PUBLIC_API_URL` environment variable, defaults to `http://localhost:8000`
- **Token Management:** Functions for storing/retrieving JWT tokens from localStorage
- **TypeScript Interfaces:** Complete type definitions matching backend responses:
  - `DocumentMetadata`, `AnalysisResponse`, `Highlight`, `UploadResponse`
  - `StatusResponse`, `ChatRequest`, `ChatResponse`, etc.
- **Error Handling:** Custom `APIError` class for structured error handling
- **Retry Logic:** Automatic retry for failed requests (configurable retries, delay, timeout)
- **Helper Methods:** Convenience methods for GET, POST, PUT, DELETE requests

**Files Modified:**

- ✅ `src/lib/api.ts` - Created
- ✅ `.env.local` - Needs to be created by developer (blocked by .gitignore)

### 2. Upload Flow (`src/app/upload/page.tsx`)

**Status:** ✅ Complete

**Features Implemented:**

- Drag-and-drop file selection with visual feedback
- File validation (PDF only, 10MB max)
- Real `POST /upload` API call with FormData
- Upload progress indicator
- PII redaction summary display
- file_id storage in state and sessionStorage
- Automatic navigation to review page with file_id parameter

**User Flow:**

1. User selects document type (Lease/Medical Bill/Other)
2. User drags/drops or selects PDF file
3. File is validated client-side
4. File uploads to backend with progress bar
5. Backend returns `file_id` and PII redaction summary
6. User sees "We protected X pieces of personal information" message
7. Auto-redirect to `/upload/review?file_id={file_id}`

**API Calls:**

- `POST /upload` with FormData

### 3. Review/Metadata Extraction (`src/app/upload/review/page.tsx`)

**Status:** ✅ Complete

**Features Implemented:**

- Automatic metadata extraction on page load
- Real-time polling of extraction status (500ms interval)
- Editable form fields for metadata confirmation
- Validation of required fields
- "Skip & Analyze Now" option for direct analysis
- Loading skeletons during extraction

**User Flow:**

1. Page loads with file_id from URL params
2. Automatically calls `POST /extract-metadata`
3. Polls `GET /status/{file_id}` every 500ms
4. When status === "metadata_extracted", fetches metadata
5. Displays editable form with pre-filled fields
6. User can correct any AI mistakes
7. On submit, calls `POST /confirm-metadata` with confirmed data
8. Navigates to `/upload?step=4&file_id={file_id}` for analysis

**API Calls:**

- `POST /extract-metadata` - Start extraction
- `GET /status/{file_id}` - Poll extraction progress
- `GET /metadata/{file_id}` - Fetch extracted metadata
- `POST /confirm-metadata` - Submit confirmed metadata
- Alternative: `POST /analyze` - Skip metadata confirmation

### 4. Analysis Progress Monitoring (`src/app/upload/page.tsx` - ProcessingStep)

**Status:** ✅ Complete

**Features Implemented:**

- Real-time progress polling (1000ms interval)
- Dynamic progress bar (0-100%)
- Status message updates from backend
- Contextual messages based on progress percentage
- Completion detection and auto-redirect
- Failure handling with error messages
- Cancel analysis button
- Safety timeout (10 minutes)

**User Flow:**

1. Component receives file_id as prop
2. Calls `POST /analyze` to start analysis
3. Polls `GET /status/{file_id}` every 1 second
4. Updates progress bar and messages in real-time
5. Shows contextual icons (⚖️ for law comparison, 📊 for calculations)
6. On completion (status === "completed"), redirects to `/results/{file_id}`
7. On failure, shows error and redirects to upload

**API Calls:**

- `POST /analyze` - Start analysis
- `GET /status/{file_id}` - Poll progress every 1s
- `DELETE /document/{file_id}` - Cancel analysis

**Progress Messages:**

- 10%: "Initializing analyzer..."
- 20%: "Loading document text..."
- 30%: "Chunking document..."
- 40-80%: "Analyzing chunk X/Y..."
- 85%: "Consolidating findings..."
- 90%: "Extracting highlight positions..."
- 95%: "Finalizing results..."
- 100%: "Analysis complete"

### 5. PDF Analysis Viewer (`src/utils/fetchAnalysis.ts`)

**Status:** ✅ Complete

**Features Implemented:**

- Real API call to `GET /document/{file_id}`
- Status validation (must be "completed")
- Data structure validation
- PDF URL conversion to absolute paths
- Fallback to mock data for development
- Error handling and logging

**API Calls:**

- `GET /document/{file_id}` - Fetch complete analysis

**Data Returned:**

- Full `AnalysisData` object with highlights, metadata, summaries
- Highlights with precise PDF.js coordinates
- Color-coded issue severity
- Damages estimates
- Statute references

### 6. Toast Notifications (`src/components/ToasterProvider.tsx`)

**Status:** ✅ Complete

**Features Implemented:**

- Custom styled toast notifications
- Success, error, and loading states
- Liquid glass aesthetic matching app design
- Integrated into providers
- Used throughout upload/review/analysis flow

**Usage Examples:**

```typescript
toast.success("Upload successful!");
toast.error("Analysis failed. Please try again.");
toast.loading("Processing...");
```

---

## 🚧 Partially Implemented

### Results Page (`src/app/results/[id]/page.tsx`)

**Status:** 🟡 Needs Update

**What's Done:**

- Dynamic route parameter extraction (`[id]`)
- Modal components for actions
- UI components for displaying summaries

**What Needs to Be Done:**

1. Replace `mockResults` import with real API call
2. Call `GET /document/${file_id}` on mount
3. Map `analysis.analysisSummary` to summary cards
4. Display `analysis.highlights` counts by severity
5. Show `analysis.keyDetailsDetected` in metadata panel
6. Add loading skeleton while fetching
7. Handle errors gracefully

**Required Changes:**

```typescript
// Replace this:
import { mockResults } from "@/data/mockData";

// With this:
import { api, AnalysisResponse } from "@/lib/api";

// In component:
const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const loadAnalysis = async () => {
    try {
      const response = await api.get<AnalysisResponse>(`/document/${id}`);
      if (response.analysis) {
        setAnalysisData(response.analysis);
      }
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };
  loadAnalysis();
}, [id]);
```

---

## ❌ Not Yet Implemented

### 7. Cases Management

**Files:** `src/app/cases/page.tsx`, `src/app/cases/[id]/page.tsx`
**Status:** ❌ Using Mock Data

**Required Changes:**

- Replace `mockCases` with `GET /documents` API call
- Implement filtering by status
- Map backend status to UI status chips
- Link cards to detail pages
- In detail page, fetch full analysis with `GET /document/{file_id}`

### 8. Chat Interface

**Files:** Document workspace, various chat components
**Status:** ❌ Using Mock Responses

**Required Changes:**

- Implement real `POST /chat` API calls
- Handle RAG responses with legal citations
- Display sources array as citation chips
- Support both document-specific and general queries
- Store chat history in sessionStorage

### 9. Notifications

**Files:** `src/app/notifications/page.tsx`, `src/components/Layouts/header/notification/index.tsx`
**Status:** ❌ Using Mock Data

**Required Changes:**

- Create backend endpoint `GET /notifications`
- Implement polling (every 30s) or WebSocket
- Mark as read functionality
- Filter by read/unread status
- Link notifications to relevant documents

### 10. Authentication

**Files:** `src/app/auth/sign-in/page.tsx`, auth context
**Status:** ❌ Not Implemented

**Required Changes:**

- Create auth context with JWT token management
- Implement login/register forms
- OAuth integration (Google/GitHub)
- Protected route middleware
- Token refresh logic
- Logout functionality

### 11. Dashboard Analytics

**Files:** `src/app/(home)/page.tsx`
**Status:** ❌ Using Mock Data

**Required Changes:**

- Create aggregation endpoint in backend
- Fetch real statistics (total documents, issues, recovery amounts)
- Recent activity from backend events
- Regional map data from case locations

---

## 📦 Required Dependencies

### Install These Packages:

```bash
npm install react-hot-toast
```

### Already Installed (Verify):

- `next` (^15.5.6)
- `react` (19.0.0)
- `react-dom` (19.0.0)
- `next-themes` (^0.4.4)
- `react-pdf` (^10.2.0)
- `pdfjs-dist` (4.4.168)
- `react-pdf-highlighter` (^8.0.0-rc.0)

---

## 🔧 Environment Setup

### Frontend (.env.local)

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000

# For production:
# NEXT_PUBLIC_API_URL=https://api.yourapp.com
```

### Backend (.env)

See `clause_backend/BACKEND_API_DOCUMENTATION.md` for full backend setup.

Key variables:

```bash
SNOWFLAKE_ACCOUNT=your_account
SNOWFLAKE_USER=your_user
SNOWFLAKE_PASSWORD=your_password
SNOWFLAKE_WAREHOUSE=your_warehouse
SNOWFLAKE_DATABASE=your_database
SNOWFLAKE_SCHEMA=your_schema
GEMINI_API_KEY=your_gemini_api_key
ENCRYPTION_KEY=your_encryption_key
```

---

## 🧪 Testing the Integration

### 1. Start Backend

```bash
cd clause_backend/app
python server.py
# Should start on http://localhost:8000
```

### 2. Start Frontend

```bash
npm run dev
# Should start on http://localhost:3000
```

### 3. Test Upload Flow

1. Navigate to `/upload`
2. Select "Lease" document type
3. Upload a sample PDF (use `clause_backend/sample-lease.pdf`)
4. Verify:
   - ✅ Upload progress appears
   - ✅ PII redaction message shows
   - ✅ Redirects to review page
   - ✅ file_id is in URL

### 4. Test Review/Metadata

1. On review page, verify:
   - ✅ Loading skeleton appears
   - ✅ Metadata extraction polls status
   - ✅ Form fields populate with extracted data
   - ✅ Can edit fields
   - ✅ Submit button triggers analysis

### 5. Test Analysis Progress

1. After submit, verify:
   - ✅ Progress bar shows 0-100%
   - ✅ Messages update in real-time
   - ✅ Progress increases over time
   - ✅ Redirects to results on completion
   - ✅ Typically takes 3-5 minutes

### 6. Test Results Page

1. On results page, verify:
   - ✅ Summary cards display (estimated recovery, issues found, risk level)
   - ✅ Top issues render with severity badges
   - ✅ Modals open when clicking action buttons
   - ✅ PDF URL is correct for analysis viewer

### 7. Test Error Scenarios

- Upload non-PDF file → Should show error toast
- Try to access `/upload?step=4` without file_id → Should redirect
- Try to fetch non-existent document → Should show 404 error

---

## 🐛 Common Issues & Fixes

### Issue: CORS Error

**Symptom:** Network request blocked by CORS policy
**Fix:** Add CORS middleware to FastAPI backend:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Issue: "react-hot-toast is not defined"

**Symptom:** Import error for toast
**Fix:**

```bash
npm install react-hot-toast
```

### Issue: Backend not accessible

**Symptom:** `fetch failed` or connection refused
**Fix:**

1. Verify backend is running: `curl http://localhost:8000`
2. Check `NEXT_PUBLIC_API_URL` in `.env.local`
3. Ensure no firewall blocking port 8000

### Issue: Analysis never completes

**Symptom:** Progress stuck at certain percentage
**Fix:**

1. Check backend logs for errors
2. Verify Snowflake credentials in backend `.env`
3. Check Gemini API key is valid
4. Backend terminal should show progress logs

---

## 📊 API Endpoint Mapping

| Frontend Action  | API Endpoint          | Method | Status          |
| ---------------- | --------------------- | ------ | --------------- |
| Upload file      | `/upload`             | POST   | ✅ Integrated   |
| Extract metadata | `/extract-metadata`   | POST   | ✅ Integrated   |
| Get metadata     | `/metadata/{file_id}` | GET    | ✅ Integrated   |
| Confirm metadata | `/confirm-metadata`   | POST   | ✅ Integrated   |
| Start analysis   | `/analyze`            | POST   | ✅ Integrated   |
| Check progress   | `/status/{file_id}`   | GET    | ✅ Integrated   |
| Get results      | `/document/{file_id}` | GET    | ✅ Integrated   |
| Delete document  | `/document/{file_id}` | DELETE | ✅ Integrated   |
| List documents   | `/documents`          | GET    | ❌ Not used yet |
| Chat with AI     | `/chat`               | POST   | ❌ Not used yet |

---

## 🔄 Data Flow Diagram

```
User Action          Frontend               Backend                    AI/Database
─────────────────────────────────────────────────────────────────────────────────

[Select PDF] ──────> Upload Component
                           │
                           ├──────────────> POST /upload ────────────> [PII Redaction]
                           │                                                 │
                           │                    file_id <────────────────────┘
                           │                 pii_redacted
                           │                      │
                           └──────────────────────┘
                                    │
                         [Store in sessionStorage]
                                    │
                                    v
                           Navigate to Review
                                    │
[Review Page] ────────> Review Component
                                    │
                        ├──────────────> POST /extract-metadata ────> [Gemini AI]
                        │                                                  │
                        │               Poll GET /status/{id} <────────────┤
                        │                                                  │
                        │               GET /metadata/{id} <───────────────┘
                        │                      │
                        │           [Display in form fields]
                        │                      │
[Edit & Confirm] ───────┘                      │
                                               │
                        POST /confirm-metadata │
                                               │
                                               v
                                    Navigate to Analysis
                                               │
[Analysis Page] ─────> Processing Component
                                    │
                        ├──────────────> POST /analyze ─────────────> [RAG System]
                        │                                                  │
                        │                                          [Snowflake Search]
                        │                                                  │
                        │               Poll GET /status/{id} <────────────┤
                        │                                                  │
                        │                (progress: 0% → 100%)      [Gemini Analysis]
                        │                                                  │
                        │                                          [Coordinate Extract]
                        │                                                  │
                        │               Status: completed <────────────────┘
                        │                      │
                        └──────────────────────┘
                                    │
                         Navigate to Results
                                    │
[Results Page] ──────> Results Component
                                    │
                        GET /document/{id} ─────────> [Retrieve Analysis]
                                    │                          │
                                    │      <────────────────────┘
                                    │           analysis data
                                    │
                        [Display highlights, summaries, actions]
                                    │
                                    v
                         User views full analysis
```

---

## 🎯 Next Steps for Complete Integration

### Immediate Priorities:

1. ✅ Install `react-hot-toast` dependency
2. ✅ Create `.env.local` with `NEXT_PUBLIC_API_URL`
3. ⏳ Update Results page to fetch real data
4. ⏳ Test complete upload → analysis → results flow
5. ⏳ Verify PDF viewer works with real highlights

### Short Term (Next Session):

6. Implement Cases list page with real data
7. Implement Case detail page with analysis
8. Implement Chat interface with RAG responses
9. Create Notifications system

### Medium Term:

10. Implement Authentication system
11. Update Dashboard with real analytics
12. Add error boundaries throughout app
13. Implement proper loading states everywhere
14. Add retry mechanisms for failed requests

### Before Production:

15. Remove all mock data imports
16. Delete `/mock-data/sample-highlights.json`
17. Add comprehensive error handling
18. Implement rate limiting on frontend
19. Add request caching (React Query or SWR)
20. Security audit (XSS, CSRF protection)
21. Performance optimization (lazy loading, code splitting)
22. Mobile responsiveness testing
23. Accessibility audit (WCAG compliance)
24. Set up monitoring and analytics

---

## 📚 References

- **Backend API Docs:** `clause_backend/BACKEND_API_DOCUMENTATION.md`
- **Backend Architecture:** `clause_backend/ARCHITECTURE.md`
- **API Quick Reference:** `clause_backend/API_QUICK_REFERENCE.md`
- **Next.js Docs:** https://nextjs.org/docs
- **FastAPI Docs:** https://fastapi.tiangolo.com
- **react-pdf-highlighter:** https://github.com/agentcooper/react-pdf-highlighter

---

## 💡 Tips for Developers

1. **Always check backend logs** when debugging API issues
2. **Use browser DevTools Network tab** to inspect API requests/responses
3. **Test with real PDFs** of varying lengths (1-page, 6-page, 20-page)
4. **Monitor Gemini API quota** as each analysis uses ~4 API calls
5. **Keep sessionStorage clean** by clearing `current_file_id` after completion
6. **Use toast notifications** for all user-facing actions
7. **Implement proper TypeScript types** for all API responses
8. **Add console.log statements** liberally during development
9. **Test error scenarios** (network failures, invalid files, etc.)
10. **Document any deviations** from this guide for future developers

---

**Last Updated:** December 2024  
**Integration Status:** 🟢 Core Flow Complete | 🟡 Additional Features Pending  
**Maintained By:** Development Team
