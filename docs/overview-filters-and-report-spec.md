# Overview Pages – Filters & Download Report Spec

This document describes how **filters** and **download report** should work on the **Overview**-style pages (Dashboard and Insights) so the frontend and backend can align.

---

## 1. Scope

- **Overview (Dashboard)** – `/dashboard`: platform stats (users, transactions, businesses, customers, feedback, etc.) driven by **date range**.
- **Insights** – `/insights`: charts and summary cards, also driven by **date range**.
- Both pages use the same **get-stats** API: `GET /api/v1/admin/get-stats?fromDate=&toDate=`.

---

## 2. Date range filter (how we want it to work)

### 2.1 Purpose

- Filter **all** overview stats and charts by a single **date range**.
- When the user changes the range, the app refetches stats with the new `fromDate` and `toDate` and re-renders Dashboard and Insights.

### 2.2 Where it lives

- **One** date-range control at the **top** of the Overview (Dashboard) page (and optionally mirrored on Insights, or Insights can rely on the same Redux state so changing the range on Dashboard already affects Insights when the user navigates there).
- Stored in **Redux** (`dateRange`: `fromDate`, `toDate`) so that:
  - Dashboard and Insights both read the same range.
  - Refreshing the page can optionally persist the range (e.g. from URL or localStorage) if we add that later.

### 2.3 Presets and custom range

- **Presets** (single click, no date picker):
  - **Today** – from and to = today (start/end of day as per backend contract).
  - **This week** – e.g. Sunday–Saturday of the current week.
  - **This month** – 1st to last day of current month.
  - **This quarter** – 1st day of quarter to last day of quarter (e.g. Jan 1–Mar 31).
- **Custom** – user picks **From** and **To** in a date picker; on apply we set Redux and refetch.
- **Clear filters** – reset to a default (e.g. “This week”) and refetch.

### 2.4 API contract we expect

- **Query params:** `fromDate`, `toDate`.
- **Format:** Backend defines one (e.g. ISO 8601 date only `YYYY-MM-DD` or full ISO string). Frontend will send the same format consistently (e.g. `toISOString().split('T')[0]` for date-only).
- **Behaviour:**
  - If both are **empty**, backend returns stats for **all time** (or a sensible default range). Current frontend sends `?fromDate=&toDate=` when Redux is initialised empty.
  - If both are **set**, backend returns stats **only for that date range** (e.g. transactions created/updated in that range, new users in that range, etc., depending on how the backend defines “filter by date” per metric).
- **Response:** Unchanged; same `{ code, message, data: { users, businesses, transactions, customers, feedback } }` wrapper.

### 2.5 UI behaviour

- Changing preset or custom range **immediately** updates Redux and triggers a **refetch** of get-stats on Dashboard (and Insights if that page uses the same store).
- Loading state while refetching; errors shown inline or via toast.
- The selected range is **visible** (e.g. “This week”, “Mar 1 – Mar 9, 2026”, or “Custom”) so the user knows what the numbers represent.

---

## 3. Download report (how we want it to work)

### 3.1 Purpose

- Let the user **download an overview report** for a **chosen date range** in a chosen **format** (e.g. PDF and/or CSV).
- Report should reflect the **same kind of data** as the Overview (platform summary: users, transactions, businesses, customers, feedback, etc.), scoped to the selected range.

### 3.2 Where it lives

- **Overview (Dashboard)** page: a primary action such as **“Download report”** (e.g. top-right near the date filter).
- Opens a **modal** (or slide-over) with:
  - **Date range for the report:** From date, To date (required).
  - **Format:** e.g. **PDF** and **CSV** (or only one if backend supports one).
  - **Actions:** Cancel, **Download** (disabled until From and To are set).

### 3.3 Flow

1. User clicks “Download report”.
2. Modal opens; user selects **From** and **To** (and format if multiple).
3. User clicks **Download**.
4. Frontend calls the **report API** (see below) with the chosen range and format.
5. Backend returns the file (or a URL to the file):
   - **Option A:** Binary/file response (e.g. `Content-Disposition: attachment; filename="overview-report-2026-03-09.pdf"`). Frontend triggers a download (e.g. blob + link click).
   - **Option B:** Backend returns a **URL** (e.g. pre-signed S3) and frontend opens or redirects to that URL to download.
6. On success: close modal, optional toast “Report downloaded”.
7. On error: show backend `message` (or generic “Download failed”) and keep modal open.

### 3.4 API contract we want (backend to provide)

- **Endpoint (suggestion):**  
  `GET /api/v1/admin/reports/overview?fromDate=YYYY-MM-DD&toDate=YYYY-MM-DD&format=pdf`  
  or  
  `POST /api/v1/admin/reports/overview` with body `{ fromDate, toDate, format }`.

- **Auth:** Same admin JWT as rest of admin APIs.

- **Query/body:**
  - `fromDate` (required): start of range.
  - `toDate` (required): end of range.
  - `format` (required): e.g. `pdf` or `csv`.

- **Response:**
  - **Option A – file stream:**  
    - Status 200, `Content-Type: application/pdf` or `text/csv`, plus  
    - `Content-Disposition: attachment; filename="overview-report-YYYY-MM-DD.pdf"` (or `.csv`).  
    - Frontend will treat response as blob and trigger download.
  - **Option B – URL:**  
    - JSON: `{ code: "00", message: "...", data: { downloadUrl: "https://..." } }`.  
    - Frontend opens `downloadUrl` (e.g. in a new tab or via fetch + blob) to download.

- **Errors:** Same wrapper `{ code, message }` when not "00"; frontend shows `message`.

### 3.5 Report content (what we expect in the file)

- **PDF:** Human-readable summary of platform stats for the date range (e.g. same metrics as Dashboard: users, transactions, businesses, customers, feedback), with titles, dates, and optional branding.
- **CSV:** Tabular or structured data for the same metrics (e.g. one row per metric, or multiple sections), so it can be used in spreadsheets.

Exact columns/sections can be defined by the backend; frontend only needs to trigger the download and handle success/error.

---

## 4. Summary table

| Feature            | Where        | What user does              | What frontend does                    | What backend does                          |
|--------------------|-------------|-----------------------------|----------------------------------------|--------------------------------------------|
| Date range filter  | Dashboard   | Pick preset or custom range | Set Redux, refetch get-stats           | Return stats for that range                |
| Date range filter  | Insights    | (Uses same Redux range)     | Refetch get-stats when range changes   | Same as above                              |
| Download report    | Dashboard   | Picks range + format, Download | Call report API, then trigger download | Return file or download URL for that range |

---

## 5. Frontend implementation notes (current state)

- **Redux:** `dateRange` has `fromDate` and `toDate` (strings). Dashboard and Insights already read them and pass to `getStats({ fromDate, toDate })`.
- **Filter UI:** The previous `TopContentOne` component had the date presets (Today, This week, This month, This quarter, Custom), Clear filters, and the Download report dialog. It was removed from the Dashboard when we unified layout. Re-adding a **filter + download** bar (or reusing TopContentOne in a slim form) on the Overview page will restore this behaviour once the backend supports the report endpoint.
- **Default range:** When `fromDate` and `toDate` are empty, the app currently sends empty query params; backend can treat that as “all time” or apply its own default.

---

## 6. Backend checklist

- [ ] **get-stats** accepts `fromDate` and `toDate` and filters results by that range (or documents “all time” when empty).
- [ ] **Report endpoint** exists (e.g. `/api/v1/admin/reports/overview`) with `fromDate`, `toDate`, `format` (pdf/csv).
- [ ] Report returns either a file stream with `Content-Disposition` or a JSON payload with `downloadUrl`.
- [ ] Same auth (admin JWT) and response conventions (`code` "00" for success) as the rest of the admin API.

This spec defines how we want the overview filters and download report to work end-to-end; backend and frontend can use it as the single reference.
