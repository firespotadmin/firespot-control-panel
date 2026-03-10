/** Request audit log entry (from GET /api/v1/admin/audit-logs). */
export interface RequestAuditLog {
  id: string;
  timestamp: string;
  method: string;
  path: string;
  queryString: string;
  userId: string | null;
  userEmail: string | null;
  userType: UserType;
  remoteAddr: string;
  userAgent: string;
  responseStatus: number;
  durationMs: number;
}

export type UserType =
  | "ADMIN"
  | "SUPERADMIN"
  | "CUSTOMER"
  | "MERCHANT"
  | "ANONYMOUS";

/** Spring Page response (data when code === "00"). */
export interface AuditLogPage {
  content: RequestAuditLog[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export interface AuditLogFilters {
  from?: string;
  to?: string;
  userId?: string;
  userEmail?: string;
  page?: number;
  size?: number;
}
