import axiosInstance from "@/security/api-secured";
import type { BackofficeApiResponse } from "@/types/api";
import type { BusinessChargesQuery } from "@/types/charge";
import type { CustomersQuery } from "@/types/customer";
import type { BusinessFeedbackQuery } from "@/types/feedback";
import type { BusinessProductsQuery } from "@/types/product";
import type { BusinessQrKitsQuery } from "@/types/qr-kit";
import type { DashboardStats } from "@/types/business";
import type { PlatformStats } from "@/types/stats";
import type { AdminAllTransactionsQuery, BusinessTransactionsQuery } from "@/types/transaction";

function toDateOnly(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function getDefaultApiDateRange() {
  const to = new Date();
  const from = new Date(to);
  from.setFullYear(from.getFullYear() - 1);

  return {
    from: toDateOnly(from),
    to: toDateOnly(to),
  };
}

/** Returns unwrapped stats data when code === "00". */
export const getStats = async ({
  fromDate,
  toDate,
}: {
  fromDate: string;
  toDate: string;
}): Promise<PlatformStats | null> => {
  const response = await axiosInstance.get<
    BackofficeApiResponse<PlatformStats>
  >(`/api/v1/admin/get-stats?fromDate=${fromDate}&toDate=${toDate}`);
  const body = response.data;
  if (body?.code === "00" && body?.data) {
    return body.data;
  }
  return null;
};
/** Returns unwrapped business stats when code === "00". */
export const getStatsBusiness = async (): Promise<DashboardStats | null> => {
  const response = await axiosInstance.get<
    BackofficeApiResponse<DashboardStats>
  >("/api/v1/admin/business/stats");
  const body = response.data;
  if (body?.code === "00" && body?.data) {
    return body.data;
  }
  return null;
};
export const getStatsBusinessById = async ({ id }: { id: string }) => {
  try {
    const response = await axiosInstance.get(`/api/v1/admin/business/${id}`);
    return response.data;
  } catch (error: any) {
    return error?.response;
  }
};

export const getBusiness = async ({
  from,
  to,
  status,
  search,
  page = 0,
  size = 10,
}: {
  from?: string;
  to?: string;
  status?: string;
  search?: string;
  page?: number;
  size?: number;
}) => {
  try {
    const params = new URLSearchParams();
    if (from) params.append("from", from);
    if (to) params.append("to", to);
    if (status) params.append("status", status);
    if (search) params.append("search", search);
    params.append("page", page.toString());
    params.append("size", size.toString());

    const response = await axiosInstance.get(
      `/api/v1/admin/business/all?${params.toString()}`
    );
    return response.data;
  } catch (error: any) {
    return error?.response;
  }
};

export const getBusinessTransactions = async ({
  businessId,
  from,
  to,
  status = "",
  location = "",
  search = "",
  page = 0,
  size = 10,
}: BusinessTransactionsQuery) => {
  try {
    const defaultRange = getDefaultApiDateRange();
    const resolvedFrom = from || defaultRange.from;
    const resolvedTo = to || defaultRange.to;
    const params = new URLSearchParams();
    params.append("from", resolvedFrom);
    params.append("to", resolvedTo);
    params.append("status", status);
    params.append("location", location);
    params.append("search", search);
    params.append("page", page.toString());
    params.append("size", size.toString());

    const response = await axiosInstance.get(
      `/api/v1/admin/business/${businessId}/transactions?${params.toString()}`
    );

    return response.data;
  } catch (error: any) {
    return error?.response?.data || error?.response || error;
  }
};

export const getBusinessFeedbacks = async ({
  businessId,
  from,
  to,
  search = "",
  rating = "",
  page = 0,
  size = 10,
}: BusinessFeedbackQuery) => {
  try {
    const defaultRange = getDefaultApiDateRange();
    const resolvedFrom = from || defaultRange.from;
    const resolvedTo = to || defaultRange.to;
    const params = new URLSearchParams();
    params.append("from", resolvedFrom);
    params.append("to", resolvedTo);
    params.append("search", search);
    params.append("rating", rating);
    params.append("page", page.toString());
    params.append("size", size.toString());

    const response = await axiosInstance.get(
      `/api/v1/admin/business/${businessId}/feedbacks?${params.toString()}`
    );

    return response.data;
  } catch (error: any) {
    return error?.response?.data || error?.response || error;
  }
};

export const getBusinessProducts = async ({
  businessId,
  page = 0,
  size = 10,
  search = "",
}: BusinessProductsQuery) => {
  try {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("size", size.toString());
    params.append("search", search);

    const response = await axiosInstance.get(
      `/api/v1/admin/business/${businessId}/products?${params.toString()}`
    );

    return response.data;
  } catch (error: any) {
    return error?.response?.data || error?.response || error;
  }
};

export const getBusinessCharges = async ({
  businessId,
}: BusinessChargesQuery) => {
  try {
    const response = await axiosInstance.get(
      `/api/v1/admin/business/${businessId}/charges`
    );

    return response.data;
  } catch (error: any) {
    return error?.response?.data || error?.response || error;
  }
};

export const getBusinessQrKits = async ({
  businessId,
  page = 0,
  size = 10,
}: BusinessQrKitsQuery) => {
  try {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("size", size.toString());

    const response = await axiosInstance.get(
      `/api/v1/admin/business/${businessId}/qr-kits?${params.toString()}`
    );

    return response.data;
  } catch (error: any) {
    return error?.response?.data || error?.response || error;
  }
};

export const getCustomers = async ({
  from,
  to,
  status = "",
  search = "",
  page = 0,
  size = 10,
}: CustomersQuery) => {
  try {
    const defaultRange = getDefaultApiDateRange();
    const resolvedFrom = from || defaultRange.from;
    const resolvedTo = to || defaultRange.to;
    const params = new URLSearchParams();
    params.append("from", resolvedFrom);
    params.append("to", resolvedTo);
    params.append("status", status);
    params.append("search", search);
    params.append("page", page.toString());
    params.append("size", size.toString());

    const response = await axiosInstance.get(
      `/api/v1/admin/customer/all?${params.toString()}`
    );

    return response.data;
  } catch (error: any) {
    return error?.response?.data || error?.response || error;
  }
};

export const getCustomerStats = async () => {
  try {
    const response = await axiosInstance.get(`/api/v1/admin/customer/stats`);
    return response.data;
  } catch (error: any) {
    return error?.response?.data || error?.response || error;
  }
};

export const getTransactionStats = async () => {
  try {
    const response = await axiosInstance.get(`/api/v1/admin/transaction/stats`);
    return response.data;
  } catch (error: any) {
    return error?.response?.data || error?.response || error;
  }
};

export const getAllTransactions = async ({
  page,
  size,
  status = "",
  search = "",
}: AdminAllTransactionsQuery) => {
  try {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("size", size.toString());
    if (status) params.append("status", status);
    if (search) params.append("search", search);

    const response = await axiosInstance.get(
      `/api/v1/transactions/all?${params.toString()}`
    );
    return response.data;
  } catch (error: any) {
    return error?.response?.data || error?.response || error;
  }
};
