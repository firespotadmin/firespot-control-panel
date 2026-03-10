import axiosInstance from "@/security/api-secured";
import type { BackofficeApiResponse } from "@/types/api";

const ADMIN_BASE = "/api/v1/admin";

/**
 * Send OTP to the authenticated admin's email.
 * Requires Authorization: Bearer <admin JWT>. Backend reads email from the token.
 */
export async function sendAdminOtp(): Promise<void> {
  const res = await axiosInstance.post<BackofficeApiResponse<null>>(
    `${ADMIN_BASE}/send-otp`
  );
  const body = res.data;
  if (body?.code !== "00") {
    throw new Error(body?.message ?? "Failed to send OTP");
  }
}

/**
 * Validate OTP for the authenticated admin.
 * Requires Authorization: Bearer <admin JWT> and body { otp }.
 * Returns the same verify-otp response (e.g. token on success).
 */
export async function validateAdminOtp(otp: string): Promise<unknown> {
  const res = await axiosInstance.post<BackofficeApiResponse<unknown>>(
    `${ADMIN_BASE}/validate-otp`,
    { otp }
  );
  const body = res.data;
  if (body?.code !== "00") {
    throw new Error(body?.message ?? "Invalid OTP");
  }
  return body.data ?? null;
}
