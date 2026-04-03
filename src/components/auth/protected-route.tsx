import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "@/components/auth/auth-provider";
import { appRoutes } from "@/lib/routes";

export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location }} to={appRoutes.login} />;
  }

  return <Outlet />;
}
