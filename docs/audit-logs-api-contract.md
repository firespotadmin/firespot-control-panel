# Request Audit Logs – API Contract

Aligned with the backend **Request Audit Logs** feature. All requests require **admin JWT** (`Authorization: Bearer <token>`).

**Base path:** `/api/v1/admin`

---

## Admin OTP (email verification before viewing audit logs)

The audit logs page requires the user to verify via OTP sent to the logged-in admin’s email before showing the table.

### POST /api/v1/admin/send-otp

- **Auth:** `Authorization: Bearer <admin JWT>`
- **Body:** none
- Backend validates the token and reads the email from it; sends OTP to that email (e.g. via `adminUserService.resendOtp(email)`).
- **Response:** Standard wrapper. `code === "00"` = success. Returns 401/400 on failure.

### POST /api/v1/admin/validate-otp

- **Auth:** `Authorization: Bearer <admin JWT>`
- **Body:** `{ "otp": "1234" }` (4-digit OTP)
- Backend uses email from the token and the provided OTP (e.g. `adminUserService.verifyOtp(VerifyOtp(email, otp))`).
- **Response:** Same as verify-otp (e.g. token on success). Standard wrapper; `code === "00"` = success.

---

## GET /api/v1/admin/audit-logs

---

## Response wrapper

All responses use the usual backoffice shape:

```json
{
  "code": "00",
  "message": "Success",
  "data": { ... }
}
```

- `code === "00"` → success; use `data`.
- `code !== "00"` → error; use `message`.

---

## Query parameters

| Parameter  | Type   | Required | Description |
|-----------|--------|----------|-------------|
| `from`    | date (ISO) | No | Start date (inclusive), e.g. `2026-03-01`. Default: 30 days ago |
| `to`      | date (ISO) | No | End date (inclusive), e.g. `2026-03-09`. Default: now |
| `userId`  | string | No | Filter by user ID (e.g. admin ID) |
| `userEmail` | string | No | Filter by user email |
| `page`    | number | No | 0-based page index (default: 0) |
| `size`    | number | No | Page size (default: 50, max: 100) |

- If both `userId` and `userEmail` are provided, backend may prefer `userId`.
- Dates are in **server local time**; pass calendar dates in ISO format (`yyyy-MM-dd`).

---

## Response (data when code === "00")

`data` is a Spring `Page<RequestAuditLog>`:

```json
{
  "content": [
    {
      "id": "...",
      "timestamp": "2026-03-09T14:30:00",
      "method": "GET",
      "path": "/api/v1/admin/support/tickets",
      "queryString": "page=0&size=20",
      "userId": "65f1a2b3c4d5e6f7",
      "userEmail": "admin@firespot.co",
      "userType": "ADMIN",
      "remoteAddr": "41.203.123.45",
      "userAgent": "Mozilla/5.0 ...",
      "responseStatus": 200,
      "durationMs": 125
    }
  ],
  "totalElements": 1000,
  "totalPages": 20,
  "number": 0,
  "size": 50,
  "first": true,
  "last": false
}
```

---

## Types summary (frontend)

- **RequestAuditLog:**  
  `id`, `timestamp`, `method`, `path`, `queryString`, `userId`, `userEmail`, `userType`, `remoteAddr`, `userAgent`, `responseStatus`, `durationMs`
- **userType:** `"ADMIN"` | `"SUPERADMIN"` | `"CUSTOMER"` | `"MERCHANT"` | `"ANONYMOUS"`
- **Page:** `content` (array of RequestAuditLog), `totalElements`, `totalPages`, `number`, `size`, `first`, `last`

---

## Quick reference

| Item        | Value |
|------------|--------|
| Send OTP   | `POST /api/v1/admin/send-otp` (no body) |
| Validate OTP | `POST /api/v1/admin/validate-otp` body `{ "otp": "..." }` |
| List logs  | `GET /api/v1/admin/audit-logs` |
| Collection | `request_audit_logs` (MongoDB) |
| Auth       | Admin JWT for all above |
| Filter by date | `from`, `to` (ISO date) |
| Filter by user | `userId`, `userEmail` |
| Pagination | `page`, `size` (max 100) |
