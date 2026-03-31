# Wikifile-Transfer-Batch-Upload-History-Metadata-Extraction-Testing

### Tech Stack (Exact)

| Layer | Tool | Version |
|---|---|---|
| Framework | React | 18 |
| UI Components | Material-UI (MUI) | 6 |
| Language | JavaScript (ES2022) | — |
| HTTP client | Axios | latest |
| State management | React Context + useReducer | built-in |
| Routing | React Router DOM | v6 |
| i18n | react-i18next | latest |
| Build tool | Vite | latest |
| CSS approach | MUI `sx` prop + `styled()` | — |
| Testing | Cypress (E2E) | latest |

> **No TypeScript.** Use plain JavaScript with JSDoc comments for type hints.
> **No Redux.** Use React Context + useReducer only.
> **No Tailwind.** Use MUI `sx` prop and `styled()` exclusively.

---

### Design Aesthetic

- **Tone:** Clean, utilitarian, open-source contributor tool — not a SaaS product. Think Wikimedia's editorial clarity meets modern tooling UI.
- **Colors:** Wikimedia blue (`#3366CC`) as primary, white backgrounds, warm gray surfaces (`#F8F9FA`), status colors: green success, amber pending, red failed.
- **Typography:** `IBM Plex Sans` for UI text, `IBM Plex Mono` for file names, IDs, and code values.
- **Motion:** Subtle — progress bar animations, status badge transitions, row reveal on load. Nothing decorative.
- **Layout:** Left sidebar navigation + main content area. Dense information layout because contributors are power users.

---

### Pages & Routes to Build

#### 1. `/` — Home / Single File Transfer (existing, keep as-is reference)
Do not rebuild this page. It already exists in the live tool.

#### 2. `/batch` — Batch Upload Page ⭐ PRIMARY BUILD
This is the main deliverable. Build the complete `BatchUploadPanel` component.

**What it must do:**
- Multi-file selector input: accepts up to 50 file titles (text input list, not actual file upload — these are MediaWiki file titles like `"File:Example.jpg"`)
- Shared metadata form: fields for `target_wiki`, `licensing_template`, `description`, `author`, `date`
- Per-file override: expandable row per file to override shared metadata for that specific file
- "Transfer All" button that calls `POST /api/batch-upload`
- Real-time progress: after submission, poll `GET /api/batch-status/{batch_id}` every 2 seconds
- Per-file status row: file title | source wiki | status badge (Queued / Processing / Success / Failed) | progress bar
- On completion, show summary: X succeeded, Y failed, link to history dashboard

**API contract:**
```json
POST /api/batch-upload
{
  "files": ["File:Example1.jpg", "File:Example2.png"],
  "target_wiki": "hi.wikipedia.org",
  "metadata": {
    "licensing_template": "{{Fair use}}",
    "description": "Image description",
    "author": "Contributor name",
    "date": "2024-01-01"
  },
  "overrides": [
    { "file": "File:Example1.jpg", "description": "Override description" }
  ]
}

Response 202:
{ "batch_id": "abc-123", "queued": 2 }

GET /api/batch-status/{batch_id}
Response:
{
  "batch_id": "abc-123",
  "files": [
    { "title": "File:Example1.jpg", "status": "success", "target_url": "...", "error": null },
    { "title": "File:Example2.png", "status": "processing", "target_url": null, "error": null }
  ]
}
```

#### 3. `/history` — Upload History Dashboard ⭐ PRIMARY BUILD
Build the complete `HistoryDashboard` component.

**What it must do:**
- Paginated table of past transfers (25 per page)
- Columns: File title | Source wiki | Target wiki | Status badge | Timestamp | Actions
- Status filter tabs: All | Success | Failed | Pending
- Filter bar: date range picker, source wiki dropdown, target wiki dropdown
- Retry button on each Failed row → calls `POST /api/retry/{transfer_id}` → row status immediately changes to "Queued"
- `StatsPanel` above the table: Total transfers | Success rate % | Most-used target wiki
- Empty state for no results
- Loading skeleton while fetching

**API contract:**
```json
GET /api/history?status=failed&source_wiki=en.wikipedia.org&page=1
Response:
{
  "records": [
    {
      "id": "t-001",
      "file_title": "File:Example.jpg",
      "source_wiki": "en.wikipedia.org",
      "target_wiki": "hi.wikipedia.org",
      "status": "failed",
      "error_message": "API rate limit exceeded",
      "created_at": "2024-06-15T10:30:00Z",
      "celery_task_id": "celery-xyz"
    }
  ],
  "total": 42,
  "page": 1,
  "per_page": 25,
  "stats": {
    "total_transfers": 142,
    "success_rate": 87.3,
    "top_target_wiki": "hi.wikipedia.org"
  }
}

POST /api/retry/{transfer_id}
Response 202: { "new_task_id": "celery-abc", "status": "queued" }
```

#### 4. `/` sidebar nav
Left sidebar with: logo, nav links (Single Transfer, Batch Upload, History), language switcher (i18n), logged-in user display.

---

### Component Architecture

```
src/
├── main.jsx                    # Vite entry point
├── App.jsx                     # Router + Layout wrapper
├── i18n.js                     # react-i18next setup
├── api/
│   ├── batchApi.js             # POST /api/batch-upload, GET /api/batch-status
│   └── historyApi.js           # GET /api/history, POST /api/retry
├── context/
│   ├── BatchContext.jsx        # batch upload state + polling logic
│   └── HistoryContext.jsx      # history filter state
├── components/
│   ├── layout/
│   │   ├── AppShell.jsx        # sidebar + main content wrapper
│   │   ├── Sidebar.jsx         # nav links + user info
│   │   └── LanguageSwitcher.jsx
│   ├── batch/
│   │   ├── BatchUploadPanel.jsx       # main batch page component
│   │   ├── FileListInput.jsx          # add/remove file titles
│   │   ├── SharedMetadataForm.jsx     # licensing, description, author, date
│   │   ├── FileOverrideRow.jsx        # per-file expandable override
│   │   ├── BatchProgressTable.jsx     # live per-file status table
│   │   ├── BatchStatusBadge.jsx       # Queued/Processing/Success/Failed chip
│   │   └── BatchSummary.jsx           # completion summary card
│   └── history/
│       ├── HistoryDashboard.jsx       # main history page component
│       ├── StatsPanel.jsx             # 3 metric cards above table
│       ├── HistoryFilterBar.jsx       # status tabs + date/wiki filters
│       ├── HistoryTable.jsx           # paginated MUI DataGrid-style table
│       ├── HistoryTableRow.jsx        # single row with retry button
│       └── HistoryEmptyState.jsx      # empty + error states
├── hooks/
│   ├── useBatchPolling.js      # polling logic with cleanup
│   └── useHistoryFilters.js    # filter state + URL sync
├── locales/
│   └── en.json                 # all UI strings (no hardcoded strings anywhere)
└── theme.js                    # MUI theme: colors, typography, component overrides
```

---

### i18n Rules (Critical)

Every user-visible string MUST use `useTranslation()`. No hardcoded English strings in JSX.

```jsx
// WRONG
<Button>Transfer All</Button>

// CORRECT
const { t } = useTranslation();
<Button>{t('batch.transferAll')}</Button>
```

All keys must be registered in `src/locales/en.json` before use. The tool supports 30+ languages — this is non-negotiable.

---

### Polling Logic (Critical)

The `useBatchPolling` hook must:
- Start polling when `batch_id` is received
- Poll `GET /api/batch-status/{batch_id}` every 2000ms
- Stop automatically when ALL files reach `success` or `failed`
- Clean up interval on component unmount
- Handle network errors gracefully (show toast, keep polling)

```js
// useBatchPolling.js — required behavior
export function useBatchPolling(batchId) {
  // Returns: { files, isComplete, error }
  // Starts polling on mount if batchId exists
  // Stops when every file.status is 'success' or 'failed'
  // Clears interval on unmount
}
```

---

### MUI Theme Requirements

Define a custom MUI theme in `src/theme.js`:

```js
// Required theme tokens
palette.primary.main = '#3366CC'        // Wikimedia blue
palette.success.main = '#00AF89'        // green for success status
palette.warning.main = '#FF9800'        // amber for pending/queued
palette.error.main   = '#D73333'        // red for failed status
palette.background.default = '#F8F9FA'  // warm gray page bg
palette.background.paper   = '#FFFFFF'

typography.fontFamily = '"IBM Plex Sans", sans-serif'
typography.fontFamilyMono = '"IBM Plex Mono", monospace'  // custom token

// Status badge colors must use these palette values — no hardcoded hex in components
```

---

### Status Badge Component

Build `BatchStatusBadge` as a reusable MUI `Chip` with variants:

| Status | Color | Icon |
|---|---|---|
| `queued` | default (gray) | ScheduleIcon |
| `processing` | warning (amber) | CircularProgress size=12 |
| `success` | success (green) | CheckCircleIcon |
| `failed` | error (red) | ErrorIcon |

---

### Cypress E2E Tests to Write

```
cypress/e2e/
├── batch_upload.cy.js
│   ├── loads batch upload page
│   ├── adds 3 file titles to the list
│   ├── fills shared metadata form
│   ├── submits and sees progress table appear
│   ├── polling updates file statuses
│   └── shows summary when all complete
└── history_dashboard.cy.js
    ├── loads history page with records
    ├── filters by Failed status tab
    ├── retries a failed transfer
    ├── row status changes to Queued after retry
    └── pagination works correctly
```

---

### Mock API (for local dev)

Create `src/api/mockData.js` with realistic mock responses so the frontend works without the Flask backend running. Use `VITE_USE_MOCK=true` env flag to enable.

---

### Accessibility Requirements

- All interactive elements keyboard-navigable
- Status badges have `aria-label` with full status text
- Progress bars use `role="progressbar"` with `aria-valuenow`
- Table rows have `aria-label` with file title
- Focus management: after "Transfer All" click, focus moves to progress table

---

### What NOT to Build

- Do not rebuild the single-file transfer page (already exists)
- Do not add WebSocket/real-time — polling every 2s is correct
- Do not add file de-duplication logic
- Do not add authentication UI — auth is handled by Flask sessions
- Do not add dark mode — the tool uses light mode only

---

---

# README.md

```markdown
# Wikifile-Transfer Frontend

React 18 frontend for the Wikifile-Transfer Enhancement project (GSoC 2026, Wikimedia Foundation).

## What This Is

Wikifile-Transfer is a Toolforge web application that helps Wikimedia contributors transfer
media files — especially non-free/fair-use images — between different wiki projects.

This frontend adds three major capabilities to the existing tool:
1. **Batch upload** — transfer up to 50 files in one operation with real-time per-file progress
2. **Upload history dashboard** — view past transfers, filter by status, retry failed ones
3. **Category localization** — categories are automatically translated to the target wiki's language

## Project Context

| Field | Value |
|---|---|
| Organisation | Wikimedia Foundation |
| Programme | Google Summer of Code 2026 |
| Project | Wikifile-Transfer Enhancement |
| Phabricator | T415562 |
| Mentors | @ParasharSarthak, @Jnanaranjan_sahu |
| Size | 350 hours — Medium difficulty |
| Live tool | https://wikifile-transfer.toolforge.org |
| Source | https://github.com/indictechcom/wikifile-transfer |

## Full Project Description

### Background

Wikifile-Transfer was created in 2019 and upgraded to v2 in November 2024. It currently:
- Supports transferring media files across all Wikimedia sister projects
- Provides a UI in 30+ languages via i18n
- Automatically localizes licensing templates during transfer
- Reduces manual transfer time from minutes to seconds

### Problems Being Solved

**Problem 1 — Repetitive manual work:**
Contributors transferring multiple files must repeat the entire transfer process for each file.
A contributor moving 20 files must navigate the full UI, fill in all metadata, and wait for
completion — 20 times. This wastes significant volunteer time.

**Problem 2 — No transfer tracking:**
Users have no way to see past uploads or retry failed transfers. If a transfer fails mid-way,
the contributor must start from scratch with no record of what was attempted.

**Problem 3 — Lost metadata:**
When files are transferred, categories are either dropped or remain in the source language.
Contributors must manually fix categories after every transfer.

**Problem 4 — Zero test coverage:**
The codebase has no test coverage, making it risky to add new features or fix bugs.

### Solution

This project adds four things to the existing tool:

**1. Batch Upload (`/batch` page)**
A new `POST /api/batch-upload` endpoint accepts up to 50 source file titles, a target wiki,
and shared metadata. One Celery task is dispatched per file. The React frontend polls
`GET /api/batch-status/{batch_id}` every 2 seconds to show real-time per-file progress.

**2. Upload History Dashboard (`/history` page)**
A `GET /api/history` endpoint returns paginated transfer records with filtering by status,
date range, source wiki, and target wiki. A `POST /api/retry/{transfer_id}` endpoint
re-enqueues failed transfers. The React dashboard shows status tabs, a retry button per
failed row, and a statistics panel.

**3. Category Localization (backend, surfaced in frontend)**
A `CategoryLocalizationService` Python class fetches translated category names via the
MediaWiki Language Links API and caches results in Redis with a 24-hour TTL. The frontend
shows "Categories localized" in the transfer result row.

**4. Test Coverage**
80%+ backend coverage with pytest. Cypress E2E tests for the batch upload flow and history
dashboard. GitHub Actions CI pipeline.

## System Architecture

```
┌─────────────────────────────────────────────────────┐
│  Frontend (React 18 + MUI 6)                        │
│  /batch — BatchUploadPanel + BatchProgressTable     │
│  /history — HistoryDashboard + StatsPanel           │
└────────────────────┬────────────────────────────────┘
                     │ HTTP (Axios)
┌────────────────────▼────────────────────────────────┐
│  Controller (Flask Blueprints)                      │
│  POST /api/batch-upload                             │
│  GET  /api/batch-status/{batch_id}                  │
│  GET  /api/history                                  │
│  POST /api/retry/{transfer_id}                      │
└──────────┬──────────────────────┬───────────────────┘
           │ dispatch             │ query
┌──────────▼──────────┐  ┌───────▼───────────────────┐
│  Redis + Celery     │  │  Python Services           │
│  BatchTransferTask  │  │  CategoryLocalizationSvc   │
│  Task queue         │  │  HistoryService            │
│  24h category cache │  │  SQLAlchemy queries        │
└──────────┬──────────┘  └───────────────────────────┘
           │ upload / fetch
┌──────────▼──────────────────────────────────────────┐
│  Data Layer                                         │
│  MySQL — transfer_history table                     │
│  MediaWiki API — Upload, Langlinks, Categories      │
└─────────────────────────────────────────────────────┘
```

## Data Flow — Batch Transfer

1. User selects up to 50 file titles on `/batch` page
2. User fills shared metadata (target wiki, licensing template, description, author, date)
3. User clicks "Transfer All" → `POST /api/batch-upload` → returns `202 Accepted` + `batch_id`
4. Frontend starts polling `GET /api/batch-status/{batch_id}` every 2 seconds
5. Each Celery worker task:
   a. Fetches source file from origin wiki via MediaWiki API
   b. Calls `CategoryLocalizationService` → translates categories → checks Redis cache
   c. Uploads file to target wiki via chunked MediaWiki API
   d. Writes result to `transfer_history` table (success / failed + error message)
6. Frontend progress table updates per-file status in real time
7. On completion: summary shown, failed files can be retried with one click
8. History dashboard at `/history` reflects all transfers with full filter and retry support

## Tech Stack

### Frontend (this repo)
| Tool | Version | Purpose |
|---|---|---|
| React | 18 | UI framework |
| Material-UI | 6 | Component library |
| React Router DOM | v6 | Client-side routing |
| Axios | latest | HTTP requests |
| react-i18next | latest | Internationalisation (30+ languages) |
| Vite | latest | Build tool |
| Cypress | latest | E2E tests |

### Backend (Flask)
| Tool | Version | Purpose |
|---|---|---|
| Python | 3.11 | Language |
| Flask | latest | Web framework |
| SQLAlchemy | latest | ORM |
| Celery | latest | Background task queue |
| Redis | latest | Task queue broker + category cache |
| MySQL | latest | Database |
| pytest | latest | Unit + integration tests |

## Project Structure

```
src/
├── main.jsx
├── App.jsx
├── i18n.js
├── theme.js                    # MUI theme (Wikimedia blue, IBM Plex fonts)
├── api/
│   ├── batchApi.js
│   └── historyApi.js
├── context/
│   ├── BatchContext.jsx
│   └── HistoryContext.jsx
├── components/
│   ├── layout/
│   │   ├── AppShell.jsx
│   │   ├── Sidebar.jsx
│   │   └── LanguageSwitcher.jsx
│   ├── batch/
│   │   ├── BatchUploadPanel.jsx
│   │   ├── FileListInput.jsx
│   │   ├── SharedMetadataForm.jsx
│   │   ├── FileOverrideRow.jsx
│   │   ├── BatchProgressTable.jsx
│   │   ├── BatchStatusBadge.jsx
│   │   └── BatchSummary.jsx
│   └── history/
│       ├── HistoryDashboard.jsx
│       ├── StatsPanel.jsx
│       ├── HistoryFilterBar.jsx
│       ├── HistoryTable.jsx
│       ├── HistoryTableRow.jsx
│       └── HistoryEmptyState.jsx
├── hooks/
│   ├── useBatchPolling.js
│   └── useHistoryFilters.js
└── locales/
    └── en.json
```

## Local Development

### Prerequisites
- Node.js 20+
- The Flask backend running on `http://localhost:5000` OR mock mode enabled

### Setup

```bash
git clone https://github.com/indictechcom/wikifile-transfer
cd wikifile-transfer/frontend
npm install
```

### Run (with mock API — no backend needed)

```bash
VITE_USE_MOCK=true npm run dev
```

### Run (with real Flask backend)

```bash
# Start backend first (see backend README)
npm run dev
```

App runs at `http://localhost:5173`

### Run E2E Tests

```bash
npm run cypress:open     # interactive
npm run cypress:run      # headless CI
```

## API Reference

### Batch Upload

```
POST /api/batch-upload
Content-Type: application/json

{
  "files": ["File:Example1.jpg", "File:Example2.png"],
  "target_wiki": "hi.wikipedia.org",
  "metadata": {
    "licensing_template": "{{Fair use}}",
    "description": "Image description",
    "author": "Contributor name",
    "date": "2024-01-01"
  },
  "overrides": [
    { "file": "File:Example1.jpg", "description": "Custom description" }
  ]
}

→ 202 Accepted
{ "batch_id": "abc-123", "queued": 2 }
```

### Batch Status (polling)

```
GET /api/batch-status/{batch_id}

→ 200 OK
{
  "batch_id": "abc-123",
  "files": [
    {
      "title": "File:Example1.jpg",
      "status": "success",
      "target_url": "https://hi.wikipedia.org/wiki/File:Example1.jpg",
      "error": null,
      "categories_localized": ["श्रेणी:उचित उपयोग"]
    },
    {
      "title": "File:Example2.png",
      "status": "processing",
      "target_url": null,
      "error": null,
      "categories_localized": null
    }
  ]
}
```

### History

```
GET /api/history?status=failed&source_wiki=en.wikipedia.org&page=1&per_page=25

→ 200 OK
{
  "records": [...],
  "total": 42,
  "page": 1,
  "per_page": 25,
  "stats": {
    "total_transfers": 142,
    "success_rate": 87.3,
    "top_target_wiki": "hi.wikipedia.org"
  }
}
```

### Retry

```
POST /api/retry/{transfer_id}

→ 202 Accepted
{ "new_task_id": "celery-abc", "status": "queued" }
```

## i18n

All UI strings must use `useTranslation()` from `react-i18next`. No hardcoded English text in components. All keys are registered in `src/locales/en.json`.

The tool supports 30+ languages because it serves Indic language wiki contributors (Hindi, Tamil, Bengali, etc.) and all other Wikimedia language communities.

## Contribution Workflow

1. Fork the repo
2. Create a branch: `git checkout -b feature/batch-upload-panel`
3. Make changes — ensure all strings are i18n keys
4. Run Cypress tests: `npm run cypress:run`
5. Submit a PR — CI must pass green before review

## Related Links

- Live tool: https://wikifile-transfer.toolforge.org
- Meta page: https://meta.wikimedia.org/wiki/Indic-TechCom/Tools/Wikifile-transfer
- Source: https://github.com/indictechcom/wikifile-transfer
- Phabricator T415562: https://phabricator.wikimedia.org/T415562
- MediaWiki Upload API: https://www.mediawiki.org/wiki/API:Upload
- MediaWiki Langlinks API: https://www.mediawiki.org/wiki/API:Langlinks
- Toolforge docs: https://wikitech.wikimedia.org/wiki/Portal:Toolforge

## Mentors

- @ParasharSarthak
- @Jnanaranjan_sahu

## Author

Sunkireddy Barath
Chennai Institute of Technology — B.E. Computer Science & Engineering (2024–2028)
sunkireddybarath07@gmail.com
github.com/sunkireddy-Barath
```
