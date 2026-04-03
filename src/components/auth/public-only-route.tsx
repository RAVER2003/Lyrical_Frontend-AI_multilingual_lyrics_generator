import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "@/components/auth/auth-provider";
import { appRoutes } from "@/lib/routes";

export function PublicOnlyRoute() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate replace to={appRoutes.home} />;
  }

  return <Outlet />;
}
