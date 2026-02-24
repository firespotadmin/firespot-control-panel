# Support Ticketing Backend Implementation Guide

## Purpose
This document defines how to implement backend support APIs to match the current frontend Support page flow:
- List support requests
- Update ticket status
- Respond to ticket
- Return paginated results for table + filters

The frontend route is `/support` and currently calls:
- `GET /api/v1/admin/support`
- `PATCH /api/v1/admin/support/:ticketId/status`
- `POST /api/v1/admin/support/:ticketId/respond`

---

## 1) Authentication & Authorization

### Authentication
- Require Bearer token on all admin support endpoints.
- Reject missing/invalid token with `401`.

### Authorization
- Only admin/customer-care roles should access support operations.
- Reject unauthorized roles with `403`.

### Headers
- `Authorization: Bearer <jwt>`
- `Content-Type: application/json`

---

## 2) Data Model (Recommended)

## support_tickets
- `id` (uuid, pk)
- `customer_id` (nullable uuid)
- `name` (varchar 120, nullable)
- `email` (varchar 255, not null)
- `subject` (varchar 180, not null)
- `message` (text, not null)
- `status` (enum: `OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`; default `OPEN`)
- `response` (text, nullable)
- `responded_at` (timestamp, nullable)
- `responded_by` (uuid, nullable)
- `created_at` (timestamp, not null)
- `updated_at` (timestamp, not null)

## support_ticket_events (optional but strongly recommended)
- `id` (uuid, pk)
- `ticket_id` (uuid, fk)
- `action` (enum: `CREATED`, `STATUS_CHANGED`, `RESPONDED`)
- `old_value` (jsonb, nullable)
- `new_value` (jsonb, nullable)
- `actor_id` (uuid, nullable)
- `created_at` (timestamp)

Use this for audit/history.

---

## 3) API Contract

## A) List Tickets
### Endpoint
`GET /api/v1/admin/support`

### Query Params
- `page` (number, required, zero-based)
- `size` (number, required)
- `search` (string, optional): search in `subject`, `message`, `email`, `name`
- `status` (string, optional): one of `OPEN|IN_PROGRESS|RESOLVED|CLOSED`

### Success Response (recommended canonical shape)
```json
{
  "success": true,
  "message": "Support tickets fetched",
  "status": "OK",
  "data": {
    "content": [
      {
        "id": "7f65f18b-9d50-4758-8514-cb54b389f563",
        "createdAt": "2026-02-24T10:20:00.000Z",
        "updatedAt": "2026-02-24T10:20:00.000Z",
        "email": "customer@firespot.com",
        "name": "Jane Doe",
        "subject": "Unable to complete payment",
        "message": "Card debited but order still pending",
        "status": "OPEN",
        "response": null,
        "respondedAt": null
      }
    ],
    "totalPages": 3,
    "currentPage": 0,
    "totalElements": 25
  }
}
```

### Notes
- Frontend currently supports several nested formats, but standardize on the above.
- Return empty array for no records (not null).

---

## B) Update Ticket Status
### Endpoint
`PATCH /api/v1/admin/support/:ticketId/status`

### Request Body
```json
{
  "status": "IN_PROGRESS"
}
```

### Validation
- `status` required and must be valid enum.
- `ticketId` must exist.

### Success Response
```json
{
  "success": true,
  "message": "Ticket status updated",
  "status": "OK",
  "data": {
    "id": "7f65f18b-9d50-4758-8514-cb54b389f563",
    "status": "IN_PROGRESS",
    "updatedAt": "2026-02-24T11:02:17.000Z"
  }
}
```

### Recommended Transition Rules
- `OPEN -> IN_PROGRESS|RESOLVED|CLOSED`
- `IN_PROGRESS -> RESOLVED|CLOSED|OPEN`
- `RESOLVED -> CLOSED|IN_PROGRESS`
- `CLOSED -> IN_PROGRESS` (optional reopen policy)

If invalid transition, return `422` with clear message.

---

## C) Respond to Ticket
### Endpoint
`POST /api/v1/admin/support/:ticketId/respond`

### Request Body
```json
{
  "response": "Thanks for reaching out. We have confirmed your transaction and it is now settled."
}
```

### Behavior
- Save response text
- Set `respondedAt`
- Set `respondedBy` from token subject
- Optional: auto move `OPEN -> IN_PROGRESS` when first response is sent
- Optional: send email to customer with response

### Success Response
```json
{
  "success": true,
  "message": "Response sent successfully",
  "status": "OK",
  "data": {
    "id": "7f65f18b-9d50-4758-8514-cb54b389f563",
    "response": "Thanks for reaching out...",
    "respondedAt": "2026-02-24T11:05:05.000Z",
    "status": "IN_PROGRESS"
  }
}
```

---

## 4) Error Handling Standard

Use a consistent envelope:
```json
{
  "success": false,
  "message": "Human-readable error",
  "status": "BAD_REQUEST",
  "errors": []
}
```

Recommended status codes:
- `400` invalid input
- `401` unauthenticated
- `403` unauthorized role
- `404` ticket not found
- `409` conflict (e.g., already closed and not reopenable)
- `422` invalid status transition
- `500` unexpected server error

---

## 5) Query & Indexing Guidance

Indexes:
- `idx_support_tickets_created_at (created_at desc)`
- `idx_support_tickets_status (status)`
- `idx_support_tickets_email (email)`
- Full-text index on `(subject, message, email, name)` if supported

Search query recommendation:
- Use case-insensitive search
- Tokenize user input and match across subject/message/email/name

---

## 6) Service Layer Pseudocode

```ts
// list
findSupportTickets({ page, size, search, status })
  -> build where clause
  -> query + count
  -> map columns to camelCase DTO
  -> return paginated envelope

// update status
updateSupportStatus(ticketId, newStatus, actor)
  -> load ticket
  -> validate transition
  -> update row
  -> insert event log
  -> return DTO

// respond
respondToTicket(ticketId, response, actor)
  -> load ticket
  -> update response/respondedAt/respondedBy
  -> optional auto status transition
  -> optional trigger email
  -> insert event log
  -> return DTO
```

---

## 7) Optional Enhancements

- SLA fields (`priority`, `dueAt`, `firstResponseAt`)
- Assignee support (`assignedTo`) for customer-care agents
- WebSocket or SSE for live ticket updates
- Attachments on tickets (`support_ticket_attachments`)
- Internal notes separate from customer-visible response

---

## 8) QA Checklist

- [ ] List endpoint returns valid pagination metadata
- [ ] Search works across subject/message/email/name
- [ ] Status filter works for each enum
- [ ] Invalid status value returns `400`
- [ ] Invalid transition returns `422`
- [ ] Respond endpoint persists response and timestamp
- [ ] Audit event rows are created for status change/response
- [ ] Auth/role checks enforced (`401`/`403`)
- [ ] No PII leakage in logs/errors

---

## 9) Seed Data (for local testing)

Create at least 5 tickets with mixed statuses so frontend table and filters can be fully exercised:
- 2 x `OPEN`
- 1 x `IN_PROGRESS`
- 1 x `RESOLVED`
- 1 x `CLOSED`

This removes dependence on fallback demo ticket and enables realistic testing.
