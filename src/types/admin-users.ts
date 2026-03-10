import type { Role } from "@/types/auth";

/** Admin user as returned from GET /api/v1/admin/users (list item). */
export interface AdminUserListItem {
  id: string;
  emailAddress: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: Role;
  isActive: boolean;
  createdAt?: string;
}

/** Page shape if backend returns paginated list. */
export interface AdminUserPage {
  content: AdminUserListItem[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

/** Payload for PATCH /api/v1/admin/users/:id/role */
export interface UpdateAdminRolePayload {
  role: Role;
}
