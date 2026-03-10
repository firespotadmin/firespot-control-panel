import type { Role } from "@/types/auth";

/**
 * Role-based access: which routes and features each role can see and modify.
 * - ADMIN: full access.
 * - CUSTOMER_CARE: dashboard, insights, businesses, customers, transactions, support, settings (personal info only); no user roles, no audit logs, no referrals, no QR kits, no products.
 */

/** Paths or path prefixes that only ADMIN can access */
const ADMIN_ONLY_PATH_PREFIXES = [
  "/settings/user-roles",
  "/settings/audit-logs",
  "/referrals",
  "/qr-kits",
  "/products",
];

/**
 * Check if a role can access a given path.
 */
export function canAccessRoute(role: Role | null | undefined, path: string): boolean {
  if (!role) return false;
  const isAdminOnly = ADMIN_ONLY_PATH_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(prefix + "/")
  );
  if (isAdminOnly) return role === "ADMIN";
  return true;
}

/** Whether the role can access User roles and permissions (add/edit admins, assign roles). */
export function canAccessUserRoles(role: Role | null | undefined): boolean {
  return role === "ADMIN";
}

/** Whether the role can access Audit logs. */
export function canAccessAuditLogs(role: Role | null | undefined): boolean {
  return role === "ADMIN";
}

/** Whether the role can toggle activate/deactivate (own account in Settings). */
export function canActivateDeactivate(role: Role | null | undefined): boolean {
  return role === "ADMIN" || role === "CUSTOMER_CARE";
}

/** Whether the role can access Referrals. */
export function canAccessReferrals(role: Role | null | undefined): boolean {
  return role === "ADMIN";
}

/** Whether the role can access QR Kits. */
export function canAccessQrKits(role: Role | null | undefined): boolean {
  return role === "ADMIN";
}

/** Whether the role can access Products. */
export function canAccessProducts(role: Role | null | undefined): boolean {
  return role === "ADMIN";
}
