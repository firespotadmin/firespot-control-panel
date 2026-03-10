# Admin Profile Picture – API Contract

This document describes the API for **uploading and updating the admin profile picture** (used in Settings and in the header dropdown). All requests require **admin JWT** (`Authorization: Bearer <token>`).

**Base path:** `/api/v1/admin`

---

## 1. Upload file (recommended)

**Purpose:** Upload an image file; backend stores it (e.g. Cloudinary in folder `admin-profiles`), updates the admin’s `profileImageUrl`, and returns the new URL.

| Item   | Value |
|--------|--------|
| Method | `POST` |
| Path   | `/api/v1/admin/profile/picture/upload` |
| Auth   | Admin JWT |
| Body   | `multipart/form-data` with field **`file`** (image) |

### Request

- **Content-Type:** `multipart/form-data`
- **Field name:** `file`
- **Accepted types:** `image/jpeg`, `image/png`, `image/webp` (backend may enforce)
- **Max file size:** e.g. 5 MB (backend to enforce)

### Backend flow

1. Validate token and resolve admin user.
2. Validate file type and size.
3. Upload file to **Cloudinary** in folder **`admin-profiles`**.
4. Update the admin’s `profileImageUrl` with the returned URL.
5. Return the same payload as the PATCH endpoint (see below).

### Response (standard wrapper)

**Success (`code === "00"`):** Same shape as PATCH – e.g.:

```json
{
  "code": "00",
  "message": "Success",
  "data": {
    "profileImageUrl": "https://res.cloudinary.com/.../admin-profiles/xyz.jpg"
  }
}
```

---

## 2. Set URL (PATCH)

**Purpose:** Set the admin’s profile picture to an existing URL (no file upload).

| Item   | Value |
|--------|--------|
| Method | `PATCH` |
| Path   | `/api/v1/admin/profile/picture` |
| Auth   | Admin JWT |
| Body   | `{ "profileImageUrl": "https://..." }` |

### Response (standard wrapper)

**Success (`code === "00"`):**

```json
{
  "code": "00",
  "message": "Success",
  "data": {
    "profileImageUrl": "https://..."
  }
}
```

The upload endpoint returns the **same payload** as this PATCH response so the frontend can treat both the same.

---

## 3. Quick reference

| Action        | Method | Path                                      |
|---------------|--------|-------------------------------------------|
| Upload file   | POST   | `/api/v1/admin/profile/picture/upload`   |
| Set URL       | PATCH  | `/api/v1/admin/profile/picture`         |

- **Upload:** `multipart/form-data`, field `file`. Backend uploads to Cloudinary folder `admin-profiles`, updates admin, returns `data.profileImageUrl`.
- **Set URL:** JSON body `{ "profileImageUrl": "https://..." }`.
- **Auth:** Admin JWT for all.

---

## 4. Login / me

The admin’s **profile image URL** should be returned in the **login** (or “me”) response as part of the user object (`user.profileImageUrl`). The control panel stores it and uses it in Settings and the header; after upload or PATCH, the frontend updates the stored user with the new `profileImageUrl`.
