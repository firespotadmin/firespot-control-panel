import axiosInstance from "@/security/api-secured";
import type { BackofficeApiResponse } from "@/types/api";
import type { Business, UpdateBusinessProfilePayload } from "@/types/business";

export async function updateBusinessProfileById(
  businessId: string,
  payload: UpdateBusinessProfilePayload,
): Promise<Business> {
  const response = await axiosInstance.put<BackofficeApiResponse<Business>>(
    `/api/v1/admin/business/${businessId}`,
    payload,
  );

  const body = response.data;
  if (body?.code !== "00" || !body?.data) {
    throw new Error(body?.message ?? "Failed to update business profile");
  }

  return body.data;
}
