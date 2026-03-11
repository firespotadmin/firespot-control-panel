import type { ReactNode } from "react";

export interface LoginPayload {
  email: string;
  password: string;
}

/** Login API success payload: backend returns this inside response.data when code === "00" */
export interface LoginResponseData {
  user: AuthUser;
  token: string;
}
// types.ts
export type Role = "ADMIN" | "CUSTOMER_CARE";

export interface CreateUserDto {
  emailAddress: string;
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  role: Role; // or use `string` if roles are dynamic
}
// types.ts
export interface AdminResponse {
  message: string;
  data: AdminRes;
  status: string;
  success: boolean;
}

export interface AdminRes {
  data: AdminData;
  message: string;
  status: string;
  success: boolean;
}

export interface AdminData {
  id: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  emailAddress: string;
  role: Role;
  firstName: string;
  lastName: string;
  isActive: boolean;
  password: string; // usually hashed
  profileImageUrl?: string;
}

export interface AuthUser {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  emailAddress: string;
  role: Role;
  firstName: string;
  lastName: string;
  phone?: string;
  isActive?: boolean;
  profileImageUrl?: string;
}

export interface PhoneNumberPayload {
  countryCode: string;
  number: string;
}

export interface CustomerSignupPayload {
  firstName: string;
  lastName: string;
  emailAddress: string;
  password: string;
  phoneNumber: PhoneNumberPayload;
  profilePictureUrl?: string;
}

export interface CustomerSignupResponseData {
  message: string;
  data: {
    token: string | null;
    userId: string;
    transactionPinSetup: boolean;
    isActivated: boolean;
    isBlocked: boolean;
    profilePicture?: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    phoneNumber: PhoneNumberPayload;
  };
}

export interface BusinessSignupPayload {
  businessName: string;
  contactInformation: {
    firstName: string;
    lastName: string;
    phoneNumber: PhoneNumberPayload;
    customerSupport: {
      emailAddress: string;
      phoneNumber: PhoneNumberPayload;
    };
  };
  emailAddress: string;
  password: string;
  businessImageUrl?: string;
}

export interface BusinessSignupResponseData {
  message: string;
  data: {
    token: string;
    businessData: {
      id: string;
      businessName: string;
      businessImageUrl?: string;
    };
  };
}
// types.ts
export interface VerifyOtpRequest {
  email: string;
  otp: string;
}
export interface VerifyOtpResponse {
  message: string;
  data: VerifyOtpResponseData;
}

export interface VerifyOtpResponseData {
  isSuccess: boolean;
  isVerified: boolean;
  token: string; // JWT token
}
export interface LinkCompoProps {
  icon: ReactNode;
  text: string;
  link: string;
  active?: boolean;
  badge?: number;
}
