# Support Page – API Request & Response Contract

Base path: **`/api/v1/admin/support`**  
All requests require: **`Authorization: Bearer <admin_jwt>`** and **`Content-Type: application/json`** (for POST/PATCH bodies).

---

## Response wrapper (all endpoints)

Every response has this shape:

```json
{
  "code": "00",
  "message": "Success",
  "data": <payload or null>,
  "meta": <optional>
}
```

- **`code === "00"`** → success; use **`data`**.
- **`code !== "00"`** → error; show **`message`** (and optionally `code`).

---

## 1. Sync inbox (create tickets from support inbox)

**Purpose:** Fetch support inbox (IMAP) and create new tickets; duplicates are skipped.

| Item    | Value |
|---------|--------|
| Method  | `GET` |
| Path    | `/api/v1/admin/support/tickets/sync` |
| Query   | None |
| Body    | None |

### Response (data when code === "00")

```json
{
  "message": "Emails synced successfully",
  "ticketsCreated": 5
}
```

### Example full response

```json
{
  "code": "00",
  "message": "Emails synced successfully",
  "data": {
    "message": "Emails synced successfully",
    "ticketsCreated": 5
  }
}
```

---

## 2. List tickets (paginated, filterable, searchable)

**Purpose:** Get paginated list of tickets with optional status filter and search.

| Item    | Value |
|---------|--------|
| Method  | `GET` |
| Path    | `/api/v1/admin/support/tickets` |
| Query   | See below |
| Body    | None |

### Request query (all optional)

| Param   | Type   | Description |
|---------|--------|-------------|
| `page`  | number | 0-based page index |
| `size`  | number | Page size (e.g. 20) |
| `status`| string | `OPEN` \| `REPLIED` \| `CLOSED` |
| `search`| string | Matches sender email or subject |

Example: `GET /api/v1/admin/support/tickets?page=0&size=20&status=OPEN&search=withdrawal`

### Response (data when code === "00")

```json
{
  "tickets": [
    {
      "id": "65f1a2b3c4d5e6f7a8b9c0d1",
      "ticketNumber": "TK-1001",
      "senderEmail": "user@gmail.com",
      "subject": "Withdrawal failed",
      "status": "OPEN",
      "createdAt": "2026-03-09T10:20:00",
      "unread": true
    }
  ],
  "total": 42,
  "page": 0,
  "size": 20
}
```

### Example full response

```json
{
  "code": "00",
  "message": "Success",
  "data": {
    "tickets": [
      {
        "id": "65f1a2b3c4d5e6f7a8b9c0d1",
        "ticketNumber": "TK-1001",
        "senderEmail": "user@gmail.com",
        "subject": "Withdrawal failed",
        "status": "OPEN",
        "createdAt": "2026-03-09T10:20:00",
        "unread": true
      }
    ],
    "total": 42,
    "page": 0,
    "size": 20
  }
}
```

---

## 3. Get ticket detail (conversation)

**Purpose:** Get full ticket with message thread. Backend marks the ticket as read.

| Item    | Value |
|---------|--------|
| Method  | `GET` |
| Path    | `/api/v1/admin/support/tickets/:ticketId` |
| Query   | None |
| Body    | None |

### Response (data when code === "00")

```json
{
  "id": "65f1a2b3c4d5e6f7a8b9c0d1",
  "ticketNumber": "TK-1001",
  "senderEmail": "user@gmail.com",
  "subject": "Withdrawal failed",
  "status": "REPLIED",
  "messages": [
    {
      "from": "user@gmail.com",
      "message": "I tried withdrawing but it failed",
      "date": "2026-03-09T10:20:00"
    },
    {
      "from": "support@firespot.co",
      "message": "We are investigating this issue",
      "date": "2026-03-09T10:30:00"
    }
  ],
  "createdAt": "2026-03-09T10:20:00",
  "updatedAt": "2026-03-09T10:30:00"
}
```

### Example full response

```json
{
  "code": "00",
  "message": "Success",
  "data": {
    "id": "65f1a2b3c4d5e6f7a8b9c0d1",
    "ticketNumber": "TK-1001",
    "senderEmail": "user@gmail.com",
    "subject": "Withdrawal failed",
    "status": "REPLIED",
    "messages": [
      {
        "from": "user@gmail.com",
        "message": "I tried withdrawing but it failed",
        "date": "2026-03-09T10:20:00"
      },
      {
        "from": "support@firespot.co",
        "message": "We are investigating this issue",
        "date": "2026-03-09T10:30:00"
      }
    ],
    "createdAt": "2026-03-09T10:20:00",
    "updatedAt": "2026-03-09T10:30:00"
  }
}
```

---

## 4. Reply to ticket

**Purpose:** Send reply by email (SMTP) and append to ticket thread. Backend sets status to `REPLIED`.

| Item    | Value |
|---------|--------|
| Method  | `POST` |
| Path    | `/api/v1/admin/support/tickets/:ticketId/reply` |
| Query   | None |
| Body    | JSON below |

### Request body

```json
{
  "message": "Hello, we have resolved your issue. Please try again."
}
```

### Response (data when code === "00")

Usually `null`. Treat **`code === "00"`** and **`message`** as success.

### Example full response

```json
{
  "code": "00",
  "message": "Reply sent successfully",
  "data": null
}
```

---

## 5. Close ticket

**Purpose:** Mark ticket as closed.

| Item    | Value |
|---------|--------|
| Method  | `PATCH` |
| Path    | `/api/v1/admin/support/tickets/:ticketId/close` |
| Query   | None |
| Body    | None (or empty `{}`) |

### Response (data when code === "00")

Usually `null`. Treat **`code === "00"`** as success.

### Example full response

```json
{
  "code": "00",
  "message": "Ticket closed successfully",
  "data": null
}
```

---

## 6. Send new email (not tied to a ticket)

**Purpose:** Send an email that is not part of a ticket thread.

| Item    | Value |
|---------|--------|
| Method  | `POST` |
| Path    | `/api/v1/admin/support/send-email` |
| Query   | None |
| Body    | JSON below |

### Request body

```json
{
  "to": "customer@email.com",
  "subject": "Regarding your issue",
  "message": "We are following up on your request."
}
```

### Response (data when code === "00")

Usually `null`. Treat **`code === "00"`** and **`message`** as success.

### Example full response

```json
{
  "code": "00",
  "message": "Success",
  "data": null
}
```

---

## 7. Unread count (for badge)

**Purpose:** Get number of unread tickets (e.g. for header/sidebar badge).

| Item    | Value |
|---------|--------|
| Method  | `GET` |
| Path    | `/api/v1/admin/support/tickets/unread-count` |
| Query   | None |
| Body    | None |

### Response (data when code === "00")

A number, e.g. `7`.

### Example full response

```json
{
  "code": "00",
  "message": "Success",
  "data": 7
}
```

---

## Quick reference

| Feature        | Method | Path |
|----------------|--------|------|
| Sync inbox     | GET    | `/api/v1/admin/support/tickets/sync` |
| List tickets   | GET    | `/api/v1/admin/support/tickets?page=&size=&status=&search=` |
| Ticket detail  | GET    | `/api/v1/admin/support/tickets/:ticketId` |
| Reply          | POST   | `/api/v1/admin/support/tickets/:ticketId/reply` |
| Close          | PATCH  | `/api/v1/admin/support/tickets/:ticketId/close` |
| Send email     | POST   | `/api/v1/admin/support/send-email` |
| Unread count   | GET    | `/api/v1/admin/support/tickets/unread-count` |

---

## Types summary

- **TicketStatus:** `"OPEN"` | `"REPLIED"` | `"CLOSED"`
- **TicketSummary:** id, ticketNumber, senderEmail, subject, status, createdAt (ISO 8601), unread
- **TicketDetail:** id, ticketNumber, senderEmail, subject, status, messages[], createdAt, updatedAt
- **MessageItem:** from, message, date (ISO 8601)
- **ReplyRequest:** { message: string }
- **SendEmailRequest:** { to: string, subject: string, message: string }
- **SyncResponse (data):** { message: string, ticketsCreated: number }
- **TicketListResponse (data):** { tickets: TicketSummary[], total: number, page: number, size: number }

All responses use the wrapper: **{ code, message, data, meta? }** with **code "00"** for success.
