import axiosInstance from "@/security/api-secured";
import type { BackofficeApiResponse } from "@/types/api";
import type { AuthUser } from "@/types/auth";

const PROFILE_PICTURE_UPLOAD_PATH = "/api/v1/admin/profile/picture/upload";
const PROFILE_PICTURE_PATH = "/api/v1/admin/profile/picture";

/** Backend returns full admin object (no password) on upload/PATCH success */
export interface AdminProfileData {
  id: string;
  emailAddress: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: AuthUser["role"];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  profileImageUrl?: string;
}

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * Validate file before upload. Throws with a user-friendly message if invalid.
 */
export function validateProfileImageFile(file: File): void {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    throw new Error("Please choose a JPEG, PNG, or WebP image.");
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error("Image must be 5 MB or smaller.");
  }
}

/**
 * Map backend admin profile response to AuthUser (no password).
 */
function toAuthUser(data: AdminProfileData): AuthUser {
  return {
    id: data.id,
    emailAddress: data.emailAddress,
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone,
    role: data.role,
    isActive: data.isActive,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    profileImageUrl: data.profileImageUrl,
  };
}

/**
 * Upload the admin's profile picture.
 * Backend: POST /api/v1/admin/profile/picture/upload, multipart/form-data field "file".
 * Server uploads to Cloudinary (admin-profiles), updates admin, returns full admin object.
 * Do not set Content-Type header so the browser sets multipart boundary.
 */
export async function uploadProfilePicture(file: File): Promise<AuthUser> {
  validateProfileImageFile(file);
  const formData = new FormData();
  formData.append("file", file);

  const res = await axiosInstance.post<
    BackofficeApiResponse<AdminProfileData>
  >(PROFILE_PICTURE_UPLOAD_PATH, formData);
  // api-secured interceptor omits Content-Type when data is FormData so the browser sets multipart/form-data with boundary

  const body = res.data;
  if (body?.code !== "00" || !body?.data) {
    throw new Error(body?.message ?? "Failed to upload profile picture");
  }
  return toAuthUser(body.data);
}

/**
 * Set the admin's profile picture by URL (no file upload).
 * Backend: PATCH /api/v1/admin/profile/picture with body { profileImageUrl }.
 * Returns full updated admin object.
 */
export async function setProfilePictureUrl(profileImageUrl: string): Promise<AuthUser> {
  const res = await axiosInstance.patch<
    BackofficeApiResponse<AdminProfileData>
  >(PROFILE_PICTURE_PATH, { profileImageUrl });

  const body = res.data;
  if (body?.code !== "00" || !body?.data) {
    throw new Error(body?.message ?? "Failed to update profile picture");
  }
  return toAuthUser(body.data);
}

/**
 * Remove the admin's profile picture (optional; backend may not implement).
 */
export async function removeProfilePicture(): Promise<void> {
  const res = await axiosInstance.delete<
    BackofficeApiResponse<AdminProfileData | { profileImageUrl?: string | null }>
  >(PROFILE_PICTURE_PATH);
  const body = res.data;
  if (body?.code !== "00") {
    throw new Error(body?.message ?? "Failed to remove profile picture");
  }
}
