import axiosInstance, { axiosPublicInstance } from "@/security/api-secured";
import type { CreateUserDto, LoginPayload, VerifyOtpRequest } from "@/types/auth";

export const login = async ({ data }: { data: LoginPayload }) => {
  try {
    const response = await axiosPublicInstance.post("/api/v1/admin/login", {
      emailAddress: data?.email,
      password: data?.password,
    });
    return response.data;
  } catch (error: any) {
    return error?.response;
  }
};
export const initiateReset = async ({ email }: { email: string }) => {
  try {
    const response = await axiosPublicInstance.post("/api/v1/admin/initiate-reset", {
      email: email,
    });
    return response.data;
  } catch (error: any) {
    return error?.response;
  }
};
export const resetPassword = async ({
  uid,
  password,
}: {
  uid: string;
  password: string;
}) => {
  try {
    const response = await axiosPublicInstance.put("/api/v1/admin/reset-password", {
      uid: uid,
      password: password,
    });
    return response.data;
  } catch (error: any) {
    return error?.response;
  }
};
export const requestAccess = async ({ data }: { data: CreateUserDto }) => {
  try {
    const response = await axiosPublicInstance.post("/api/v1/admin/create", data);
    return response.data;
  } catch (error: any) {
    return error?.response;
  }
};
export const resendOtp = async ({ email }: { email: string }) => {
  try {
    const response = await axiosInstance.post("/api/v1/admin/resend-otp", {
      email : email,
    });
    return response.data;
  } catch (error: any) {
    return error?.response;
  }
};
export const verifyOtp = async ({ data }: { data: VerifyOtpRequest }) => {
  try {
    const response = await axiosInstance.post("/api/v1/admin/verify-otp",data);
    return response.data;
  } catch (error: any) {
    return error?.response;
  }
};
