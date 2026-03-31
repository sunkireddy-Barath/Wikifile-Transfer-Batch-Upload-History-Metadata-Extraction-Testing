# Google Summer of Code 2026 Proposal - Wikimedia Foundation

## Wikifile-Transfer Batch Upload & History Dashboard

### Enhancement Dashboard — Media Transfer Intelligence

A high-performance, polished interface designed for Wikimedia contributors. This dashboard provides real-time visibility into multi-file transfer operations and enables secure, tracked media migration across the global wiki ecosystem.

---

## Project Description

The **Wikifile-Transfer Dashboard** is a specialized tool under the GSoC 2026 proposal to modernize media transfer workflows within the Wikimedia ecosystem. It replaces traditional, manual single-file transfers with a self-service, real-time platform where contributors can initiate batch operations, monitor their progress, and audit their transfer history across all wiki languages.

The project emphasizes **Operational Efficiency** and **Data Integrity**, ensuring that contributors can move large volumes of media (including non-free content) with automated metadata localization and robust error handling.

---

## Project Motivation

As the Wikimedia movement grows, transferring media across projects remains a bottleneck for many volunteers. This proposal addresses key pain points:

*   **Batch Transfer Efficiency**: Remove the requirement to manually repeat the transfer process for every individual file.
*   **Persistent Transfer Tracking**: Provide a centralized record of all past operations to prevent loss of data during failed attempts.
*   **Metadata Localization**: Automatically translate categories and localize licensing templates during the transfer process.
*   **System Reliability**: Implement a robust polling architecture that ensures users stay informed during long-running background tasks.

---

## System Architecture (High Visibility)

The project follows a modular, state-driven React architecture designed for maximum clarity and performance.

```mermaid
graph TD
    subgraph "Client Layer (React 18 + MUI 6)"
        A[BatchUploadPanel] --> B[BatchContext]
        C[HistoryDashboard] --> D[HistoryContext]
        B --> E[useBatchPolling Hook]
        D --> F[useHistoryFilters Hook]
    end

    subgraph "Service Layer"
        E --> G[Axios API Client]
        F --> G
        G --> |HTTP 202| H[Flask Batch Controller]
        G --> |HTTP 200| I[Flask History Controller]
    end

    subgraph "Background Engine"
        H --> J[Redis Task Queue]
        J --> K[Celery Workers]
        K --> L[MediaWiki Upload API]
        K --> M[CategoryLocalizationSvc]
        M --> |Cache Check| N[(Redis Cache)]
    end

    subgraph "Data Layer"
        I --> O[(MySQL - transfer_history)]
        K --> O
    end
```

---

## Technical Stack

| Layer | Tool | Purpose |
|---|---|---|
| **Frontend** | React 18 / MUI 6 | Core UI and Component Architecture |
| **State** | Context API | Modular state for Batch and History |
| **Routing** | React Router v6 | Client-side navigation |
| **i18n** | react-i18next | International support (EN, ES, FR, DE, IT) |
| **API** | Axios | RESTful communication with Flask |
| **Testing** | Cypress | End-to-End verification |

---

## How to Run

### 1. Prerequisites
- **Node.js**: Version 20 or higher.
- **Git**: To clone the repository.

### 2. Quick Start (Windows)
Navigate to the `wikifile-transfer-frontend` directory and use:
- **`setup.bat`**: Installs all required dependencies.
- **`start.bat`**: Launches the application in **Mock Mode** (no backend required).

### 3. Manual Deployment
```bash
cd wikifile-transfer-frontend
npm install --force
VITE_USE_MOCK=true npm run dev
```

The application will be available at `http://localhost:5173`.
