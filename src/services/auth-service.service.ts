import axiosInstance from "@/security/api-secured";
import type { LoginPayload } from "@/types/auth";

export const login = async ({ data }: { data: LoginPayload }) => {
  try {
    const response = await axiosInstance.post("/api/v1/admin/login", {
      emailAddress: data?.email,
      password: data?.password,
    });
    return response.data;
  } catch (error: any) {
    return error?.response;
  }
};
