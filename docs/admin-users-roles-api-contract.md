# Admin Users & Roles – API Contract

This document describes the APIs the control panel expects for **User roles and permissions**: listing admin users, adding new ones, and assigning or changing roles. All endpoints require **admin JWT** unless noted.

**Base path:** `/api/v1/admin`

**Response wrapper:** All responses use `{ "code": "00", "message": "...", "data": ... }`. Use `data` when `code === "00"`.

---

## 1. List admin users

**Purpose:** Return all admin users so the panel can show them in a table and allow role assignment and activation toggles.

| Item   | Value |
|--------|--------|
| Method | `GET` |
| Path   | `/api/v1/admin/users` |
| Auth   | Admin JWT |
| Query  | Optional: `page`, `size` for pagination |

### Response (data when code === "00")

Either a **list** or a **page**:

**Option A – Array**
```json
[
  {
    "id": "uuid",
    "emailAddress": "admin@example.com",
    "firstName": "Jane",
    "lastName": "Doe",
    "phone": "+234...",
    "role": "ADMIN",
    "isActive": true,
    "createdAt": "2026-01-15T10:00:00"
  }
]
```

**Option B – Page**
```json
{
  "content": [ /* same objects as above */ ],
  "totalElements": 100,
  "totalPages": 1,
  "number": 0,
  "size": 50,
  "first": true,
  "last": true
}
```

**Field summary:** `id`, `emailAddress`, `firstName`, `lastName`, `phone` (optional), `role` (`ADMIN` | `CUSTOMER_CARE`), `isActive`, `createdAt` (optional).

---

## 2. Create admin user (add new admin)

**Purpose:** Create a new admin user (e.g. from the “Add admin” form). Backend should validate and persist the user; optional: send OTP or invite email.

| Item   | Value |
|--------|--------|
| Method | `POST` |
| Path   | `/api/v1/admin/create` or `/api/v1/admin/users` |
| Auth   | Admin JWT (recommended when used from control panel) |
| Body   | See below |

### Request body (CreateUserDto)

```json
{
  "emailAddress": "newadmin@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+2348012345678",
  "password": "securePassword123",
  "role": "ADMIN"
}
```

- **role:** `ADMIN` | `CUSTOMER_CARE`
- Backend may send OTP or invite email; frontend only needs success/error.

### Response (data when code === "00")

No strict shape required; can be `null` or `{ id, ... }`. Frontend treats `code === "00"` as success.

---

## 3. Update admin role

**Purpose:** Change an existing admin user’s role (e.g. from CUSTOMER_CARE to ADMIN).

| Item   | Value |
|--------|--------|
| Method | `PATCH` |
| Path   | `/api/v1/admin/users/:id/role` |
| Auth   | Admin JWT |
| Body   | `{ "role": "ADMIN" }` or `{ "role": "CUSTOMER_CARE" }` |

### Response (data when code === "00")

Can be the updated user object or `null`. Frontend only needs success.

---

## 4. Activate / deactivate admin

**Purpose:** Enable or disable an admin’s access (already implemented in the panel).

| Item   | Value |
|--------|--------|
| Method | `PATCH` |
| Path   | `/api/v1/admin/activate` |
| Auth   | Admin JWT |
| Query  | `email` (string), `isActive` (boolean) |

### Response

Standard wrapper. `code === "00"` = success.

---

## 5. Optional: Resend OTP / validate new admin

If new admins must verify email via OTP:

- **Send OTP:** `POST /api/v1/admin/send-otp` (for current user) or a dedicated **resend OTP for a given admin** endpoint, e.g. `POST /api/v1/admin/users/:id/resend-otp`.
- **Validate OTP:** `POST /api/v1/admin/validate-otp` with body `{ "otp": "1234" }` (current user).

The panel can use the existing “Send OTP” / “Validate OTP” flows for the logged-in admin; for **new** admins, backend may send OTP to the new user’s email and require them to verify on first login. No extra panel endpoints are required unless you want “Resend invite” from the table.

---

## Quick reference

| Action           | Method | Path                          |
|------------------|--------|-------------------------------|
| List admins      | GET    | `/api/v1/admin/users`         |
| Create admin     | POST   | `/api/v1/admin/create`        |
| Update role      | PATCH  | `/api/v1/admin/users/:id/role`|
| Activate/Deactivate | PATCH | `/api/v1/admin/activate`   |

**Roles:** `ADMIN`, `CUSTOMER_CARE`
