import { initiateReset, login, requestAccess, resendOtp, resetPassword, verifyOtp } from "@/services/auth-service.service";
import type { CreateUserDto, LoginPayload, VerifyOtpRequest } from "@/types/auth";

export const useLogin = async ({ data }: { data: LoginPayload }) => {
    const response = await login({ data });
    return response;
}
export const useInitiateReset = async ({ email }: { email: string }) => {
    const response = await initiateReset({ email });
    return response;
}
export const usePasswordReset = async ({ uid, password }: { uid: string, password: string }) => {
    const response = await resetPassword({ uid, password });
    return response;
}
export const useRequestAccess = async ({ data }: { data: CreateUserDto }) => {
    const response = await requestAccess({ data })
    return response;
}
export const useResendOtp = async ({ email }: { email: string }) => {
    const response = await resendOtp({ email })
    return response;
}
export const useVerifyOtp = async ({ data }: { data: VerifyOtpRequest }) => {
    const response = await verifyOtp({ data })
    return response;
}