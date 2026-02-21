import type { AuthUser } from "@/types/auth";

const AUTH_TOKEN_KEY = "token";
const AUTH_USER_KEY = "auth_user";

export const saveAuthSession = ({
  token,
  user,
}: {
  token?: string;
  user?: AuthUser | null;
}) => {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }

  if (user) {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  }
};

export const getStoredAuthUser = (): AuthUser | null => {
  const user = localStorage.getItem(AUTH_USER_KEY);

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user) as AuthUser;
  } catch {
    return null;
  }
};

export const clearAuthSession = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  localStorage.removeItem("access_token");
};
