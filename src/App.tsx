import { Navigate, Route, Routes, Outlet } from "react-router-dom";
import { useEffect } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { PublicOnlyRoute } from "@/components/auth/public-only-route";
import { AppShell } from "@/components/layout/app-shell";
import { appRoutes } from "@/lib/routes";
import { TextPreviewPage } from "@/pages/text-preview-page";
import { ChatProvider } from "@/components/workspace/chat-provider";

function KeycloakRedirect() {
  const { login } = useAuth();
  useEffect(() => {
    login();
  }, [login]);

  return (
    <div className="flex h-[50vh] items-center justify-center">
      <p className="animate-pulse text-sm font-medium tracking-[0.2em] text-[var(--text-muted)]">
        REDIRECTING TO SSO...
      </p>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Navigate replace to={appRoutes.login} />} />
        <Route element={<PublicOnlyRoute />}>
          <Route path={appRoutes.auth} element={<Navigate replace to={appRoutes.login} />} />
          <Route path={appRoutes.login} element={<KeycloakRedirect />} />
          <Route path={appRoutes.signup} element={<KeycloakRedirect />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<ChatProvider><Outlet /></ChatProvider>}>
            <Route path={appRoutes.home} element={<TextPreviewPage />} />
            <Route path={appRoutes.chat} element={<TextPreviewPage />} />
            <Route path={appRoutes.textPreview} element={<Navigate replace to={appRoutes.home} />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
