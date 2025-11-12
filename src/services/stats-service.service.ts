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
