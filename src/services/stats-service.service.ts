import axiosInstance from "@/security/api-secured";
import type { BusinessChargesQuery } from "@/types/charge";
import type { CustomersQuery } from "@/types/customer";
import type { BusinessFeedbackQuery } from "@/types/feedback";
import type { BusinessProductsQuery } from "@/types/product";
import type { BusinessQrKitsQuery } from "@/types/qr-kit";
import type { AdminAllTransactionsQuery, BusinessTransactionsQuery } from "@/types/transaction";

export const getStats = async ({
  fromDate,
  toDate,
}: {
  fromDate: string;
  toDate: string;
}) => {
  try {
    const response = await axiosInstance.get(
      `/api/v1/admin/get-stats?fromDate=${fromDate}&toDate=${toDate}`
    );
    return response.data;
  } catch (error: any) {
    return error?.response;
  }
};
export const getStatsBusiness = async () => {
  try {
    const response = await axiosInstance.get(`/api/v1/admin/business/stats`);
    return response.data;
  } catch (error: any) {
    return error?.response;
  }
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
  from = "2024-01-01",
  to = "2024-12-31",
  status = "",
  location = "",
  search = "",
  page = 0,
  size = 10,
}: BusinessTransactionsQuery) => {
  try {
    const params = new URLSearchParams();
    params.append("from", from);
    params.append("to", to);
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
  from = "2024-01-01",
  to = "2024-12-31",
  search = "",
  rating = "",
  page = 0,
  size = 10,
}: BusinessFeedbackQuery) => {
  try {
    const params = new URLSearchParams();
    params.append("from", from);
    params.append("to", to);
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
  from = "2024-01-01",
  to = "2024-12-31",
  status = "",
  search = "",
  page = 0,
  size = 10,
}: CustomersQuery) => {
  try {
    const params = new URLSearchParams();
    params.append("from", from);
    params.append("to", to);
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
