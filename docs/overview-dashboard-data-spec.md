# Overview (Dashboard) – Data Structure for Backend

This document defines **what data each container on the Overview page needs** and the **exact response shape** for the backend. The frontend calls a **single endpoint** and expects one payload; all containers are filled from that payload so the page loads in one request.

---

## 1. API contract

**Endpoint:** `GET /api/v1/admin/get-stats`  
**Auth:** Admin JWT (`Authorization: Bearer <token>`)  
**Query params:**

| Param     | Type   | Required | Description |
|-----------|--------|----------|-------------|
| `fromDate` | string | No* | Start of range, date-only `YYYY-MM-DD`. |
| `toDate`   | string | No* | End of range, date-only `YYYY-MM-DD`. |

*When both are present, all metrics below should be **scoped to that date range** (see §3). When empty, backend may return all-time or a default range.

**Response wrapper (standard backoffice):**

```json
{
  "code": "00",
  "message": "Success",
  "data": { ... }
}
```

`data` must be a single object with the structure in **§2**. The frontend uses **one** `get-stats` call; it does not call separate endpoints per section.

---

## 2. Full response shape (`data`)

`data` must contain the following top-level keys. Each key maps to an object of stats for that section. **Null or missing** sections are allowed; the UI will show zeros or placeholders.

```json
{
  "users": { ... },
  "transactions": { ... },
  "businesses": { ... },
  "customers": { ... },
  "support": { ... },
  "qrKits": { ... },
  "feedback": { ... },
  "referrals": { ... }
}
```

Sections **users**, **transactions**, **businesses**, **customers**, **feedback** are already used by the frontend. Sections **support**, **qrKits**, **referrals** are defined below so the backend can add them and the frontend can be wired to use them.

---

## 3. Container-by-container specification

### 3.1 Container 1 – Users

**UI title:** “Users”  
**Subtitle:** “Registered, active, and unverified users.”

| Field | Type | Description | Date-range meaning |
|-------|------|-------------|--------------------|
| `newUsersLastPeriod` or `newUsersLast30Days` | number | New users in the selected period (or last 30 days if no range). | Count of users **created** in [fromDate, toDate]. |
| `registeredUsers` | number | Total registered users. | Either **all-time** total or count in range (recommend all-time). |
| `guestUsers` | number | Guest (unregistered) users. | Same as above. |
| `activeUsers` | number | Active users. | All-time or in-range; recommend all-time. |
| `inactiveUsers` | number | Inactive users. | All-time or in-range; recommend all-time. |
| `unverifiedUsers` | number | Unverified users. | All-time or in-range; recommend all-time. |

**Example `data.users`:**

```json
{
  "newUsersLastPeriod": 120,
  "newUsersLast30Days": 350,
  "registeredUsers": 5400,
  "guestUsers": 200,
  "activeUsers": 5000,
  "inactiveUsers": 400,
  "unverifiedUsers": 80
}
```

---

### 3.2 Container 2 – Transactions

**UI title:** “Transactions”  
**Subtitle:** “Gross volume, revenue, and transaction counts.”

| Field | Type | Description | Date-range meaning |
|-------|------|-------------|--------------------|
| `grossMerchandiseVolume` | number | Total GMV (e.g. in NGN). | Sum of transaction amounts in range. |
| `walletFloat` | number | Wallet float / balance (NGN). | Point-in-time or sum; clarify with product. |
| `grossRevenue` | number | Revenue from transaction fees (NGN). | Sum in range. |
| `totalTransactions` | number | Total number of transactions. | Count in range. |
| `successfulTransactions` | number | Successful count. | Count in range. |
| `failedTransactions` | number | Failed count. | Count in range. |
| `cardsProcessed` | number | Card transactions processed. | Count in range. |
| `transfersProcessed` | number | Transfers processed. | Count in range. |
| `pendingTransactions` | number | Pending count. | Count in range. |

**Note:** Frontend shows success rate as `(successfulTransactions / totalTransactions) * 100` and displays `failedTransactions` as a raw count with a “%” label (backend should send counts, not percentages).

**Example `data.transactions`:**

```json
{
  "grossMerchandiseVolume": 125000000,
  "walletFloat": 5000000,
  "grossRevenue": 2500000,
  "totalTransactions": 18000,
  "successfulTransactions": 17200,
  "failedTransactions": 800,
  "cardsProcessed": 10000,
  "transfersProcessed": 8000,
  "pendingTransactions": 150
}
```

---

### 3.3 Container 3 – Businesses

**UI title:** “Businesses”  
**Subtitle:** “Sign ups, active, and statements generated.”

| Field | Type | Description | Date-range meaning |
|-------|------|-------------|--------------------|
| `newSignUps` | number | New business sign-ups. | Count **created** in range. |
| `activeBusinesses` | number | Currently active businesses. | All-time or in-range; recommend all-time. |
| `statementsGenerated` | number | Statements generated. | Count in range. |
| `totalBusinesses` | number | (Optional) Total businesses. | All-time. |
| `verifiedBusinesses` | number | (Optional) Verified businesses. | All-time. |

**Example `data.businesses`:**

```json
{
  "newSignUps": 45,
  "activeBusinesses": 320,
  "statementsGenerated": 1200,
  "totalBusinesses": 350,
  "verifiedBusinesses": 300
}
```

---

### 3.4 Container 4 – Customers

**UI title:** “Customers”  
**Subtitle:** “Signed up, paid, and statements generated.”

| Field | Type | Description | Date-range meaning |
|-------|------|-------------|--------------------|
| `customersSignedUp` | number | Customers who signed up. | Count in range. |
| `customersPaid` | number | Customers who made a payment. | Count in range. |
| `customerStatementsGenerated` | number | Customer statements generated. | Count in range. |

**Example `data.customers`:**

```json
{
  "customersSignedUp": 890,
  "customersPaid": 1200,
  "customerStatementsGenerated": 3400
}
```

---

### 3.5 Container 5 – Support

**UI title:** “Support”  
**Subtitle:** “Total, resolved, and open support tickets.”

Currently the UI shows placeholders (0). Backend should provide:

| Field | Type | Description | Date-range meaning |
|-------|------|-------------|--------------------|
| `totalSupportTickets` | number | All tickets (or in range). | Count in range or all-time; recommend all-time for “total”. |
| `resolvedSupportTickets` | number | Resolved count. | Count in range (resolved in period) or all-time. |
| `openSupportTickets` | number | Open / unresolved count. | Point-in-time (current open). |

**Example `data.support`:**

```json
{
  "totalSupportTickets": 450,
  "resolvedSupportTickets": 420,
  "openSupportTickets": 30
}
```

**Frontend:** Will use `data.support` when present; otherwise show zeros.

---

### 3.6 Container 6 – QR Kits

**UI title:** “QR Kits”  
**Subtitle:** “QR kits generated and scan counts.”

Currently the UI shows placeholders (0). Backend should provide:

| Field | Type | Description | Date-range meaning |
|-------|------|-------------|--------------------|
| `qrKitsGenerated` | number | QR kits created. | Count in range. |
| `staticQrScans` | number | Scans of static QR codes. | Count in range. |
| `dynamicQrScans` | number | Scans of dynamic QR codes. | Count in range. |

**Example `data.qrKits`:**

```json
{
  "qrKitsGenerated": 1200,
  "staticQrScans": 8500,
  "dynamicQrScans": 12000
}
```

**Frontend:** Will use `data.qrKits` when present; otherwise show zeros.

---

### 3.7 Container 7 – Feedback

**UI title:** “Feedback”  
**Subtitle:** “Feedback sent to businesses and businesses rated.”

| Field | Type | Description | Date-range meaning |
|-------|------|-------------|--------------------|
| `feedbackSentToBusinesses` | number | Feedback items sent. | Count in range. |
| `businessesRated` | number | Businesses that received at least one rating. | Count (unique businesses) in range. |

**Example `data.feedback`:**

```json
{
  "feedbackSentToBusinesses": 2100,
  "businessesRated": 180
}
```

---

### 3.8 Container 8 – Referrals

**UI title:** “Referrals”  
**Subtitle:** “Total referrals and related metrics.”

Currently the UI shows one placeholder (0). Backend should provide:

| Field | Type | Description | Date-range meaning |
|-------|------|-------------|--------------------|
| `totalReferrals` | number | Total referrals. | Count in range or all-time. |
| `successfulReferrals` | number | (Optional) Referrals that converted. | Count in range. |
| `pendingReferrals` | number | (Optional) Pending. | Count or point-in-time. |

**Example `data.referrals`:**

```json
{
  "totalReferrals": 340,
  "successfulReferrals": 120,
  "pendingReferrals": 50
}
```

**Frontend:** Will use `data.referrals` when present; otherwise show zeros.

---

## 4. Summary table (all containers)

| Container   | Data key      | Purpose |
|------------|----------------|---------|
| 1 – Users  | `users`        | New, registered, guest, active, inactive, unverified counts. |
| 2 – Transactions | `transactions` | GMV, wallet float, revenue, transaction counts, success/fail, cards, transfers, pending. |
| 3 – Businesses | `businesses`   | New sign-ups, active, statements (and optional total/verified). |
| 4 – Customers  | `customers`   | Signed up, paid, statements generated. |
| 5 – Support    | `support`    | Total, resolved, open tickets. |
| 6 – QR Kits    | `qrKits`    | Kits generated, static/dynamic scans. |
| 7 – Feedback   | `feedback`   | Feedback sent, businesses rated. |
| 8 – Referrals  | `referrals`  | Total (and optional successful/pending). |

---

## 5. Date-range behaviour (recommendation)

- **Counts “in period”:** e.g. new users, new sign-ups, transactions, feedback, scans – **count only records created or occurring in [fromDate, toDate]** (inclusive, server local date).
- **Point-in-time / totals:** e.g. “active users”, “active businesses”, “open tickets” – can be **current** values so the card reflects “as of now” rather than “in range”.
- **Sums:** e.g. GMV, revenue – **sum only over transactions in [fromDate, toDate]**.

Backend should document clearly for each field whether it is “in range” or “all-time / point-in-time” so the frontend can align labels/tooltips if needed.

---

## 6. TypeScript types (for reference)

Backend does not need to implement TypeScript; this is for frontend/contract alignment.

```ts
interface PlatformStats {
  users: UserStats;
  transactions: TransactionStats;
  businesses: BusinessStats;
  customers: CustomerStats;
  support?: SupportStats;
  qrKits?: QrKitsStats;
  feedback: FeedbackStats;
  referrals?: ReferralsStats;
}

interface UserStats {
  totalUsers?: number;
  newUsersLastPeriod?: number;
  newUsersLast30Days?: number;
  registeredUsers: number;
  guestUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  unverifiedUsers: number;
}

interface TransactionStats {
  grossMerchandiseVolume: number;
  walletFloat: number;
  grossRevenue: number;
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  cardsProcessed: number;
  transfersProcessed: number;
  pendingTransactions: number;
}

interface BusinessStats {
  newSignUps: number;
  activeBusinesses: number;
  statementsGenerated: number;
  totalBusinesses?: number;
  verifiedBusinesses?: number;
}

interface CustomerStats {
  customersSignedUp: number;
  customersPaid: number;
  customerStatementsGenerated: number;
}

interface SupportStats {
  totalSupportTickets: number;
  resolvedSupportTickets: number;
  openSupportTickets: number;
}

interface QrKitsStats {
  qrKitsGenerated: number;
  staticQrScans: number;
  dynamicQrScans: number;
}

interface FeedbackStats {
  feedbackSentToBusinesses: number;
  businessesRated: number;
}

interface ReferralsStats {
  totalReferrals: number;
  successfulReferrals?: number;
  pendingReferrals?: number;
}
```

---

## 7. Checklist for backend

- [ ] **get-stats** returns a **single** `data` object with all sections above (or a subset; frontend handles missing with zeros).
- [ ] **fromDate / toDate** are `YYYY-MM-DD`; filter “in period” metrics by this range.
- [ ] **users**, **transactions**, **businesses**, **customers**, **feedback** match the field names and types in this doc.
- [ ] **support**, **qrKits**, **referrals** are added when ready; same endpoint, new keys in `data`.
- [ ] All monetary values use a consistent unit (e.g. NGN) and are numbers (not strings).
- [ ] Document for each field whether it is “in range” or “all-time / current” for product/UX clarity.

Once the backend exposes this shape, the frontend can pass `data.support`, `data.qrKits`, and `data.referrals` into the corresponding Overview containers so every section shows useful, real data.
