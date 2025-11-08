# Frontend-Backend Integration Setup Steps

## 🚀 Quick Start Guide

Follow these steps to get the integrated system running:

---

## Step 1: Install Dependencies

```bash
# Install react-hot-toast for toast notifications
npm install react-hot-toast

# Verify all other dependencies are installed
npm install
```

---

## Step 2: Configure Environment Variables

Create `.env.local` in the project root:

```bash
# Create the file
touch .env.local

# Add this content:
NEXT_PUBLIC_API_URL=http://localhost:8000
```

> **Note:** For production, change this to your deployed backend URL.

---

## Step 3: Start the Backend

```bash
# Navigate to backend directory
cd clause_backend/app

# Start the FastAPI server
python server.py
```

**Expected Output:**

```
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**Verify Backend is Running:**

```bash
# In a new terminal
curl http://localhost:8000
```

Should return:

```json
{
  "status": "ok",
  "service": "Massachusetts Lease Analyzer API",
  "version": "2.0.0"
}
```

---

## Step 4: Start the Frontend

```bash
# In the project root
npm run dev
```

**Expected Output:**

```
  ▲ Next.js 15.5.6
  - Local:        http://localhost:3000
  - Environments: .env.local

 ✓ Ready in 2.3s
```

---

## Step 5: Test the Upload Flow

1. **Navigate to Upload Page:**
   - Open browser: `http://localhost:3000/upload`

2. **Select Document Type:**
   - Click "Lease"

3. **Upload a PDF:**
   - Use the sample: `clause_backend/sample-lease.pdf`
   - Or drag/drop any PDF

4. **Expected Behavior:**
   - ✅ Upload progress bar appears
   - ✅ Toast notification: "Upload successful! We protected X pieces of personal information."
   - ✅ Automatic redirect to review page
   - ✅ URL should be: `/upload/review?file_id=xxxxx-xxxxx-xxxxx`

**If This Fails:**

- Check browser console for errors
- Check backend terminal for logs
- Verify CORS is configured (see Troubleshooting below)

---

## Step 6: Test Metadata Extraction

On the review page:

1. **Expected Behavior:**
   - ✅ "Extracting document details..." message appears
   - ✅ Loading skeletons show
   - ✅ After 10-15 seconds, form fields populate
   - ✅ Fields show extracted landlord, tenant, property address, etc.

2. **Edit Fields (if needed):**
   - Correct any AI mistakes
   - All fields are editable

3. **Submit:**
   - Click "Confirm & Start Analysis"
   - OR click "Skip & Analyze Now"

4. **Expected Result:**
   - ✅ Toast: "Starting analysis..."
   - ✅ Redirect to analysis progress page
   - ✅ URL: `/upload?step=4&file_id=xxxxx`

**If This Fails:**

- Check if backend is processing metadata
- Look for `POST /extract-metadata` in Network tab
- Check backend logs for Gemini API errors

---

## Step 7: Test Analysis Progress

On the analysis page:

1. **Expected Behavior:**
   - ✅ Animated spinner with AI icon
   - ✅ Progress bar starts at 0%
   - ✅ Message updates every second:
     - "Initializing analyzer..."
     - "Loading document text..."
     - "Chunking document..."
     - "Analyzing chunk 1/4..."
     - ...
     - "Analysis complete"
   - ✅ Progress reaches 100%
   - ✅ Auto-redirect to results page

2. **Timeline:**
   - Small PDFs (1-3 pages): ~2-3 minutes
   - Medium PDFs (4-8 pages): ~3-5 minutes
   - Large PDFs (9+ pages): ~5-7 minutes

3. **Cancel Option:**
   - "Cancel Analysis" button at bottom
   - Confirms before canceling

**If This Fails:**

- Analysis might take longer than expected
- Check backend logs for errors
- Verify Snowflake connection
- Verify Gemini API key

---

## Step 8: Test Results Page

Once analysis completes:

1. **Expected Behavior:**
   - ✅ Summary card shows:
     - Estimated Recovery: $X,XXX
     - Issues Found: X
     - Overall Risk: Low/Medium/High/Critical
   - ✅ Top Issues section shows 3-5 issues with severity badges
   - ✅ Three action buttons at bottom:
     - "View Analysis"
     - "Generate Letter"
     - "Create Case"

2. **Test Action Modals:**
   - Click each button
   - ✅ Modal should open with template content
   - ✅ Modal should be centered, scrollable
   - ✅ "Close" button works

3. **Test PDF Viewer:**
   - Click "View Full Analysis" or navigate to `/analysis`
   - ✅ PDF should load
   - ✅ Highlights should overlay on text
   - ✅ Colors should match severity (red/orange/yellow/green)
   - ✅ Clicking highlights shows popover with details

**If This Fails:**

- Check if `GET /document/{file_id}` returns data
- Verify PDF URL is accessible
- Check highlight coordinates are valid (y2 > y1)

---

## 🐛 Troubleshooting

### CORS Errors

**Symptom:**

```
Access to fetch at 'http://localhost:8000/upload' from origin 'http://localhost:3000'
has been blocked by CORS policy
```

**Fix:**
Add CORS middleware to backend (`clause_backend/app/api_v2.py`):

```python
from fastapi.middleware.cors import CORSMiddleware

# After creating app
app = FastAPI(...)

# Add this:
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Restart backend after adding this.

---

### Backend Not Starting

**Symptom:**

```
ModuleNotFoundError: No module named 'fastapi'
```

**Fix:**

```bash
cd clause_backend
pip install -r requirements.txt
```

---

### Environment Variables Not Loading

**Symptom:**
API calls go to wrong URL or fail

**Fix:**

1. Verify `.env.local` exists in project root (not `src/`)
2. Restart dev server after creating `.env.local`
3. Check `process.env.NEXT_PUBLIC_API_URL` in browser console

---

### Upload Fails with 400 Error

**Symptom:**

```
APIError: Only PDF files are allowed
```

**Fix:**

- Ensure file is actually a PDF
- Check file size < 10MB
- Try with `clause_backend/sample-lease.pdf`

---

### Analysis Takes Forever

**Symptom:**
Progress bar stuck, never completes

**Possible Causes:**

1. **Snowflake connection issue** - Check backend logs for database errors
2. **Gemini API rate limit** - Check Gemini API quota
3. **Backend crashed** - Check backend terminal for Python errors
4. **Large document** - Very large PDFs (20+ pages) may take 10+ minutes

**Debug Steps:**

```bash
# Check backend logs
cd clause_backend/app
python server.py  # Look for error messages

# Test Snowflake connection
python -c "import snowflake.connector; print('OK')"

# Test Gemini API
curl -H "Authorization: Bearer YOUR_GEMINI_KEY" \
  https://generativelanguage.googleapis.com/v1/models
```

---

### Toast Notifications Not Showing

**Symptom:**
No success/error messages appear

**Fix:**

1. Verify `react-hot-toast` is installed: `npm list react-hot-toast`
2. Check `ToasterProvider` is in `src/app/providers.tsx`
3. Clear browser cache and refresh

---

### PDF Highlights Don't Align

**Symptom:**
Colored rectangles don't overlay text correctly

**Possible Causes:**

1. **Coordinate system mismatch** - Backend must use PDF.js format (bottom-left origin)
2. **Wrong page numbers** - Verify pageNumber matches actual PDF page
3. **Scaling issues** - Check viewport scale in PDF viewer

**Fix:**

- Verify backend uses `pdfplumber` for coordinate extraction
- Check that y2 > y1 in all highlights
- Test with a known-good PDF

---

## ✅ Verification Checklist

After setup, verify each of these works:

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can access backend health check: `curl http://localhost:8000`
- [ ] Can upload a PDF file
- [ ] PII redaction summary displays
- [ ] Review page loads and extracts metadata
- [ ] Metadata form fields are editable
- [ ] Analysis progress updates in real-time
- [ ] Analysis completes successfully
- [ ] Results page shows summary data
- [ ] Action modals open and close
- [ ] Toast notifications appear for all actions
- [ ] No console errors in browser
- [ ] No errors in backend logs

---

## 📝 Next Steps After Setup

Once everything is working:

1. **Test with Multiple Documents:**
   - Try different PDF lengths
   - Test with various lease types
   - Verify results are accurate

2. **Implement Remaining Features:**
   - See `FRONTEND_BACKEND_INTEGRATION_GUIDE.md` for list
   - Priority: Results page real data, Cases list, Chat interface

3. **Add Error Handling:**
   - Global error boundary
   - Better error messages
   - Retry mechanisms

4. **Performance Optimization:**
   - Add request caching (React Query)
   - Implement lazy loading
   - Optimize images and assets

5. **Production Preparation:**
   - Update environment variables
   - Configure CORS for production domain
   - Set up monitoring and logging
   - Security audit
   - Load testing

---

## 🆘 Getting Help

If you encounter issues not covered here:

1. **Check Documentation:**
   - `FRONTEND_BACKEND_INTEGRATION_GUIDE.md` - Comprehensive integration guide
   - `clause_backend/BACKEND_API_DOCUMENTATION.md` - Backend API reference
   - `clause_backend/ARCHITECTURE.md` - Backend architecture details

2. **Debug Tools:**
   - Browser DevTools → Network tab (inspect API requests)
   - Browser DevTools → Console (check for errors)
   - Backend terminal (view server logs)
   - Add `console.log()` statements liberally

3. **Test Individual Components:**
   - Test backend endpoints with `curl` or Postman
   - Test frontend components in isolation
   - Use mock data to isolate issues

4. **Common Patterns:**
   - Most issues are CORS or environment variable problems
   - Check both frontend and backend logs
   - Verify file paths and imports are correct

---

**Happy Coding! 🎉**

If you've completed this guide successfully, you now have a fully functional
upload → metadata → analysis → results pipeline with real backend integration!
