import axiosInstance from "@/security/api-secured";
import type { BackofficeApiResponse } from "@/types/api";
import type { AuditLogFilters, AuditLogPage } from "@/types/audit";

const AUDIT_BASE = "/api/v1/admin/audit-logs";

/** Fetch paginated request audit logs. Query params: from, to, userId, userEmail, page, size. */
export async function getAuditLogs(
  params: AuditLogFilters = {}
): Promise<AuditLogPage> {
  const q = new URLSearchParams();
  if (params.from) q.set("from", params.from);
  if (params.to) q.set("to", params.to);
  if (params.userId) q.set("userId", params.userId);
  if (params.userEmail) q.set("userEmail", params.userEmail);
  if (params.page != null) q.set("page", String(params.page));
  if (params.size != null) q.set("size", String(params.size));

  const res = await axiosInstance.get<BackofficeApiResponse<AuditLogPage>>(
    `${AUDIT_BASE}?${q.toString()}`
  );
  const body = res.data;
  if (body?.code !== "00" || !body?.data) {
    throw new Error(body?.message ?? "Failed to load audit logs");
  }
  return body.data;
}
