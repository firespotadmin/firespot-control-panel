import type { ReactNode } from "react";

export interface LoginPayload {
  email: string;
  password: string;
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
}
