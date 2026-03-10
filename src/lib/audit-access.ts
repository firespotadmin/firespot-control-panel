const AUDIT_VERIFIED_KEY = "audit_logs_verified";
const AUDIT_VERIFIED_EXPIRY_MS = 15 * 60 * 1000; // 15 minutes

export function setAuditLogsVerified(): void {
  sessionStorage.setItem(AUDIT_VERIFIED_KEY, String(Date.now()));
}

export function isAuditLogsVerified(): boolean {
  const raw = sessionStorage.getItem(AUDIT_VERIFIED_KEY);
  if (!raw) return false;
  const at = Number(raw);
  if (Number.isNaN(at)) return false;
  return Date.now() - at < AUDIT_VERIFIED_EXPIRY_MS;
}

export function clearAuditLogsVerified(): void {
  sessionStorage.removeItem(AUDIT_VERIFIED_KEY);
}
