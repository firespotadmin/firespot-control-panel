import { getStoredAuthUser } from "@/lib/auth-storage";
import { canAccessRoute } from "@/lib/permissions";
import type { Role } from "@/types/auth";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface RoleGuardProps {
  children: ReactNode;
  /** Path this guard is protecting (e.g. /settings/user-roles). User must have access to this path. */
  path: string;
  /** Where to redirect if access is denied. */
  fallback?: string;
}

/**
 * Renders children only if the current user's role can access the given path.
 * Otherwise redirects to fallback (default /dashboard).
 */
export default function RoleGuard({ children, path, fallback = "/dashboard" }: RoleGuardProps) {
  const location = useLocation();
  const user = getStoredAuthUser();
  const role: Role | undefined = user?.role;

  if (!role || !canAccessRoute(role, path)) {
    return <Navigate to={fallback} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
