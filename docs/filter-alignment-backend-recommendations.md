# Filter Alignment – Backend Recommendations

This document captures the filter design now used across the backoffice list pages and what the backend should support so every filter is fully functional.

## Goal

Use one consistent filter pattern across list pages:

- pill-style filter controls
- rounded search input
- clear / apply actions where needed
- backend-supported query params only

Pages covered:

- `Customers`
- `Transactions`
- `Support`
- `Audit logs`

## Current frontend state

### 1. Customers

The customers page now uses:

- `from`
- `to`
- `status`
- `search`
- `page`
- `size`

Current backend support already exists at:

- `GET /api/v1/admin/customer/all`

Recommended behavior:

- `from` / `to`: filter by customer creation date
- `status`: filter by account status
- `search`: match name, email, phone, businessId, or storeId

### 2. Transactions

The transactions page now uses:

- `status`
- `search`
- `page`
- `size`

Current backend support already exists at:

- `GET /api/v1/transactions/all`

Recommended behavior:

- `search`: match transaction reference, transaction ID, business ID, customer name, or customer email
- `status`: exact transaction status filter

To make transactions filters better and match the rest of the product, backend should add:

- `from`
- `to`
- `businessId`
- `storeId`
- `paymentMethod`
- `location`

Suggested future endpoint shape:

```http
GET /api/v1/transactions/all?page=0&size=10&status=SUCCESS&search=abc123&from=2026-03-01&to=2026-03-10&businessId=...&storeId=...
```

### 3. Support

The support page now uses:

- `status`
- `search`
- `page`
- `size`

Current backend support already exists at:

- `GET /api/v1/admin/support/tickets`

Recommended behavior:

- `search`: match sender email or subject
- `status`: `OPEN` | `REPLIED` | `CLOSED`

To make support filters more useful, backend should add:

- `from`
- `to`
- `senderEmail`
- `unread`
- `assignedTo` (if ticket assignment exists later)
- `priority` (if ticket priority exists later)

Suggested future endpoint shape:

```http
GET /api/v1/admin/support/tickets?page=0&size=20&status=OPEN&search=withdrawal&from=2026-03-01&to=2026-03-10&unread=true
```

### 4. Audit logs

The audit logs page now uses:

- `from`
- `to`
- `userId`
- `userEmail`
- `page`
- `size`

Current backend support already exists at:

- `GET /api/v1/admin/audit-logs`

Recommended behavior:

- `from` / `to`: request timestamp range
- `userId`: exact user filter
- `userEmail`: exact or partial email filter

To make audit log filters better, backend should add:

- `userType`
- `method`
- `responseStatus`
- `path`

Suggested future endpoint shape:

```http
GET /api/v1/admin/audit-logs?from=2026-03-01&to=2026-03-10&userEmail=admin@example.com&method=GET&responseStatus=200&path=/api/v1/admin/support/tickets&page=0&size=20
```

## General backend recommendations

### 1. Use one pagination shape everywhere

Some pages currently handle multiple possible response shapes. To simplify the frontend, prefer one consistent page response:

```json
{
  "code": "00",
  "message": "Success",
  "data": {
    "content": [],
    "totalElements": 0,
    "totalPages": 0,
    "number": 0,
    "size": 10,
    "first": true,
    "last": true
  }
}
```

This is especially helpful for:

- customers
- transactions
- support tickets
- audit logs

### 2. Make `search` broad and documented

For each page, backend should clearly document which fields `search` matches.

Recommended:

- customers: name, email, phone, businessId, storeId
- transactions: reference, transactionId, businessId, customer name/email
- support: senderEmail, subject
- audit logs: path, userEmail, userId

### 3. Use date-only consistently

For list filters, prefer:

- `YYYY-MM-DD`

This is already how Overview and Audit Logs are being sent from the frontend.

### 4. Keep filter params optional

If a filter is omitted or blank, backend should ignore it and return unfiltered results for that dimension.

## Summary of backend gaps

### Already supported well enough now

- customers: `from`, `to`, `status`, `search`, `page`, `size`
- support: `status`, `search`, `page`, `size`
- audit logs: `from`, `to`, `userId`, `userEmail`, `page`, `size`

### Needs backend additions for full filter parity

- transactions: add `from`, `to`, `businessId`, `storeId`, `paymentMethod`, `location`
- support: add `from`, `to`, `senderEmail`, `unread`
- audit logs: add `userType`, `method`, `responseStatus`, `path`

Once these are added, the frontend can expose richer filters everywhere using the same shared design without needing another layout rewrite.
