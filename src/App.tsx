import { Navigate, Route, Routes } from "react-router-dom"

import { AppShell } from "@/components/layout/app-shell"
import { appRoutes } from "@/lib/routes"
import { AuthPage } from "@/pages/auth-page"
import { TextPreviewPage } from "@/pages/text-preview-page"

function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Navigate replace to={appRoutes.auth} />} />
        <Route path={appRoutes.auth} element={<AuthPage />} />
        <Route path={appRoutes.textPreview} element={<TextPreviewPage />} />
      </Route>
    </Routes>
  )
}

export default App
