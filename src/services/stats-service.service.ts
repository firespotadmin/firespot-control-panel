import axiosInstance from "@/security/api-secured";

export const getStats = async () => {
  try {
    const response = await axiosInstance.get("/api/v1/admin/get-stats");
    return response.data;
  } catch (error: any) {
    return error?.response;
  }
};