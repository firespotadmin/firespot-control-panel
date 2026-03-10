import axiosInstance from "@/security/api-secured";
import type { BackofficeApiResponse } from "@/types/api";
import type { CreateUserDto } from "@/types/auth";
import type {
  AdminUserListItem,
  AdminUserPage,
  UpdateAdminRolePayload,
} from "@/types/admin-users";

const ADMIN_BASE = "/api/v1/admin";

/**
 * List all admin users. Supports both array and Spring Page response.
 */
export async function listAdminUsers(): Promise<AdminUserListItem[]> {
  const res = await axiosInstance.get<
    BackofficeApiResponse<AdminUserListItem[] | AdminUserPage>
  >(`${ADMIN_BASE}/users`);
  const body = res.data;
  if (body?.code !== "00" || body?.data == null) {
    throw new Error(body?.message ?? "Failed to load admin users");
  }
  const data = body.data;
  if (Array.isArray(data)) return data;
  return (data as AdminUserPage).content ?? [];
}

/**
 * Create a new admin user (from control panel). Requires admin JWT.
 */
export async function createAdminUser(
  payload: CreateUserDto
): Promise<void> {
  const res = await axiosInstance.post<BackofficeApiResponse<unknown>>(
    `${ADMIN_BASE}/create`,
    payload
  );
  const body = res.data;
  if (body?.code !== "00") {
    throw new Error(body?.message ?? "Failed to create admin user");
  }
}

/**
 * Update an admin user's role.
 */
export async function updateAdminRole(
  id: string,
  role: UpdateAdminRolePayload["role"]
): Promise<void> {
  const res = await axiosInstance.patch<BackofficeApiResponse<unknown>>(
    `${ADMIN_BASE}/users/${id}/role`,
    { role }
  );
  const body = res.data;
  if (body?.code !== "00") {
    throw new Error(body?.message ?? "Failed to update role");
  }
}

/**
 * Activate or deactivate an admin by email.
 */
export async function setAdminActive(
  email: string,
  isActive: boolean
): Promise<void> {
  const res = await axiosInstance.patch<BackofficeApiResponse<unknown>>(
    `${ADMIN_BASE}/activate`,
    null,
    { params: { email, isActive } }
  );
  const body = res.data;
  if (body?.code !== "00") {
    throw new Error(body?.message ?? "Failed to update status");
  }
}
