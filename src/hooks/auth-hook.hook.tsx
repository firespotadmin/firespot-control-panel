import { login } from "@/services/auth-service.service";
import type { LoginPayload } from "@/types/auth";

export const useLogin = async ({ data }: { data: LoginPayload }) => {
    const response = await login({ data });
    return response;
}