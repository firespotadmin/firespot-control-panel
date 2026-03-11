import axiosInstance, { axiosPublicInstance } from "@/security/api-secured";
import type { BackofficeApiResponse } from "@/types/api";
import type {
  BusinessSignupPayload,
  BusinessSignupResponseData,
  CreateUserDto,
  CustomerSignupPayload,
  CustomerSignupResponseData,
  LoginPayload,
  LoginResponseData,
  VerifyOtpRequest,
  VerifyOtpResponseData,
} from "@/types/auth";

/** Login returns { code, message, data: { user, token } }. Use code === "00" for success. */
export const login = async ({
  data,
}: {
  data: LoginPayload;
}): Promise<BackofficeApiResponse<LoginResponseData>> => {
  const response = await axiosPublicInstance.post<
    BackofficeApiResponse<LoginResponseData>
  >("/api/v1/admin/login", {
    emailAddress: data?.email,
    password: data?.password,
  });
  return response.data;
};
/** Response shape: { code, message, data }. Use code === "00" for success. */
export const initiateReset = async ({
  email,
}: {
  email: string;
}): Promise<BackofficeApiResponse<unknown>> => {
  const response = await axiosPublicInstance.post<BackofficeApiResponse<unknown>>(
    "/api/v1/admin/initiate-reset",
    { email }
  );
  return response.data;
};

export const resetPassword = async ({
  uid,
  password,
}: {
  uid: string;
  password: string;
}): Promise<BackofficeApiResponse<unknown>> => {
  const response = await axiosPublicInstance.put<BackofficeApiResponse<unknown>>(
    "/api/v1/admin/reset-password",
    { uid, password }
  );
  return response.data;
};

export const requestAccess = async ({
  data,
}: {
  data: CreateUserDto;
}): Promise<BackofficeApiResponse<unknown>> => {
  const response = await axiosPublicInstance.post<BackofficeApiResponse<unknown>>(
    "/api/v1/admin/create",
    data
  );
  return response.data;
};

export const resendOtp = async ({
  email,
}: {
  email: string;
}): Promise<BackofficeApiResponse<unknown>> => {
  const response = await axiosInstance.post<BackofficeApiResponse<unknown>>(
    "/api/v1/admin/resend-otp",
    { email }
  );
  return response.data;
};

export const verifyOtp = async ({
  data,
}: {
  data: VerifyOtpRequest;
}): Promise<BackofficeApiResponse<VerifyOtpResponseData>> => {
  const response = await axiosInstance.post<
    BackofficeApiResponse<VerifyOtpResponseData>
  >("/api/v1/admin/verify-otp", data);
  return response.data;
};

export const customerSignup = async ({
  data,
}: {
  data: CustomerSignupPayload;
}): Promise<CustomerSignupResponseData> => {
  const response = await axiosPublicInstance.post<CustomerSignupResponseData>(
    "/api/v1/customer",
    data,
  );
  return response.data;
};

export const businessSignup = async ({
  data,
}: {
  data: BusinessSignupPayload;
}): Promise<BusinessSignupResponseData> => {
  const response = await axiosPublicInstance.post<BusinessSignupResponseData>(
    "/api/v1/business",
    data,
  );
  return response.data;
};
