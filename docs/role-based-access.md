# Role-based access (dashboard)

The control panel limits **what each role can see and access** on the dashboard. Implementation lives in `src/lib/permissions.ts`, `src/pages/security/role-guard.tsx`, the sidebar, and Settings.

---

## Roles

| Role           | Description |
|----------------|-------------|
| **ADMIN**      | Full access: all routes, user roles, audit logs, referrals, QR kits, products, activate/deactivate. |
| **CUSTOMER_CARE** | Limited: Overview, Insights, Businesses, Customers, Transactions, Support, Settings (personal info only). No user roles, audit logs, referrals, QR kits, or products. |

---

## Access matrix

| Area / Route              | ADMIN | CUSTOMER_CARE |
|---------------------------|-------|----------------|
| Overview (Dashboard)      | ✅    | ✅             |
| Insights                  | ✅    | ✅             |
| Businesses                | ✅    | ✅             |
| Business view (:id)       | ✅    | ✅             |
| Customers                 | ✅    | ✅             |
| Transactions              | ✅    | ✅             |
| Support                   | ✅    | ✅             |
| Settings                  | ✅    | ✅             |
| **User roles & permissions** | ✅ | ❌             |
| **Audit logs**            | ✅    | ❌             |
| **Referrals**             | ✅    | ❌             |
| **QR Kits**               | ✅    | ❌             |
| **Products**              | ✅    | ❌             |
| Activate / Deactivate (own account) | ✅ | ✅   |

---

## How it works

1. **Sidebar** – Nav items are shown only if `canAccessRoute(role, path)` is true. CUSTOMER_CARE does not see User roles, Audit logs, Referrals, QR Kits, or Products.
2. **Routes** – `/settings/user-roles`, `/settings/audit-logs`, and `/products` are wrapped in **RoleGuard**. If the user’s role cannot access the path, they are redirected to `/settings` or `/dashboard`.
3. **Settings** – “User roles and permissions” and “Audit logs” links are rendered only when `canAccessUserRoles(role)` / `canAccessAuditLogs(role)` is true (ADMIN only).
4. **Backend** – APIs should enforce the same rules (e.g. list admins, audit logs, report download only for ADMIN). Frontend hiding is for UX; backend must enforce security.

---

## Changing permissions

Edit **`src/lib/permissions.ts`**:

- **ADMIN_ONLY_PATH_PREFIXES** – Paths or prefixes that only ADMIN can access. Add/remove entries to change which routes are admin-only.
- **canAccessUserRoles**, **canAccessAuditLogs**, **canAccessReferrals**, **canAccessQrKits**, **canAccessProducts** – Use these in components to show/hide features by role.

After changing permissions, ensure:

- Sidebar still uses `canAccessRoute(role, path)` for each link.
- Any new admin-only route is wrapped in `<RoleGuard path="..." fallback="...">` in `App.tsx`.
- Settings sidebar links use the right `canAccess*` helpers.
