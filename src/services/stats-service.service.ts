import axiosInstance from "@/security/api-secured";

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
