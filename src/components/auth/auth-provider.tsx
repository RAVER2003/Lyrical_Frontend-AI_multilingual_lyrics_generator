import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  type ReactNode,
  useMemo,
} from "react";

import { keycloak, type AuthUser } from "@/services/auth/mock-auth";

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isInit, setIsInit] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const isRun = useRef(false);

  useEffect(() => {
    if (isRun.current) return;
    isRun.current = true;

    keycloak
      .init({ onLoad: "check-sso", checkLoginIframe: false })
      .then((authenticated) => {
        if (authenticated && keycloak.tokenParsed) {
          setUser({
            id: keycloak.tokenParsed.sub || "",
            name:
              keycloak.tokenParsed.name ||
              keycloak.tokenParsed.preferred_username ||
              "User",
            email: keycloak.tokenParsed.email || "",
          });
        }
        setIsInit(true);
      })
      .catch((err) => {
        console.error("Keycloak init failed", err);
        setIsInit(true);
      });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login: () => keycloak.login(),
      logout: () => keycloak.logout(),
    }),
    [user]
  );

  if (!isInit) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--app-bg)] text-[var(--text-primary)]">
        <p className="animate-pulse text-sm font-medium tracking-[0.2em] text-[var(--text-muted)]">
          INITIALIZING...
        </p>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
