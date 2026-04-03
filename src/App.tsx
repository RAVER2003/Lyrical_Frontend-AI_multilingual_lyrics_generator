import { Navigate, Route, Routes, Outlet } from "react-router-dom";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { PublicOnlyRoute } from "@/components/auth/public-only-route";
import { AppShell } from "@/components/layout/app-shell";
import { appRoutes } from "@/lib/routes";
import { LoginPage } from "@/pages/login-page";
import { SignupPage } from "@/pages/signup-page";
import { TextPreviewPage } from "@/pages/text-preview-page";
import { ChatProvider } from "@/components/workspace/chat-provider";

function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Navigate replace to={appRoutes.login} />} />
        <Route element={<PublicOnlyRoute />}>
          <Route
            path={appRoutes.auth}
            element={<Navigate replace to={appRoutes.login} />}
          />
          <Route path={appRoutes.login} element={<LoginPage />} />
          <Route path={appRoutes.signup} element={<SignupPage />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<ChatProvider><Outlet /></ChatProvider>}>
            <Route path={appRoutes.home} element={<TextPreviewPage />} />
            <Route path={appRoutes.chat} element={<TextPreviewPage />} />
            <Route
              path={appRoutes.textPreview}
              element={<Navigate replace to={appRoutes.home} />}
            />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
