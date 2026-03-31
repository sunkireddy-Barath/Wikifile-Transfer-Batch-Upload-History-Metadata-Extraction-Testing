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
# Add VITE_USE_MOCK=true to your .env file or run directly:
npm run dev -- --host --port 5173 
# (Note: Use VITE_USE_MOCK=true environment variable in your terminal)
VITE_USE_MOCK=true npm run dev
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
