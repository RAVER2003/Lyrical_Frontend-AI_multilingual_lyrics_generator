import { useState } from "react";
import { Info, LogOut, Sparkles, X } from "lucide-react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "@/components/auth/auth-provider";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { appRoutes } from "@/lib/routes";

export function AppShell() {
  const { isAuthenticated, logout, user } = useAuth();
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const location = useLocation();
  const isWorkspaceRoute = location.pathname.startsWith(appRoutes.home);

  const navItems = isAuthenticated
    ? [{ label: "Home", to: appRoutes.home }]
    : [];

  return (
    <main className="min-h-screen bg-[var(--app-bg)] text-[var(--text-primary)] transition-colors duration-300">
      <div
        className={[
          "relative flex min-h-screen flex-col",
          isWorkspaceRoute
            ? "w-full px-0 py-0"
            : "mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8",
        ].join(" ")}
      >
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,var(--ambient-primary),transparent_30%),radial-gradient(circle_at_top_right,var(--ambient-secondary),transparent_30%),radial-gradient(circle_at_bottom_center,var(--ambient-tertiary),transparent_35%)]" />
        <div className="absolute left-10 top-10 -z-10 h-32 w-32 rounded-full bg-[var(--ambient-primary)] blur-3xl" />
        <div className="absolute bottom-16 right-0 -z-10 h-44 w-44 rounded-full bg-[var(--ambient-secondary)] blur-3xl" />
        {!isWorkspaceRoute && (
          <header className="sticky top-4 z-20 mb-6 overflow-hidden rounded-[30px] border border-[var(--shell-border)] bg-[var(--shell-bg)] px-5 py-5 shadow-[var(--shell-shadow)] backdrop-blur-[22px] sm:px-6">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,var(--shell-highlight),transparent_38%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,var(--shell-highlight),transparent_24%),radial-gradient(circle_at_85%_30%,var(--ambient-secondary),transparent_22%)] opacity-90" />
            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-white/70" />
            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium uppercase tracking-[0.44em] text-[var(--accent-strong)] sm:text-base">
                  Lyrical
                </p>
                <p className="max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">
                  {isAuthenticated ? `Welcome, ${user?.name ?? "User"}` : ""}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-start gap-3 sm:justify-end">
                {navItems.length > 0 && (
                  <nav className="flex flex-wrap gap-2 rounded-2xl border border-[var(--shell-border)] bg-[var(--shell-nav-bg)] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                    {navItems.map((item) => (
                      <NavLink
                        key={item.to}
                        className={({ isActive }) =>
                          [
                            "rounded-xl px-4 py-2 text-sm transition",
                            isActive
                              ? "bg-[var(--surface-raised)] text-[var(--text-primary)] shadow-[0_10px_24px_rgba(2,6,23,0.12)]"
                              : "text-[var(--text-muted)] hover:bg-[var(--surface-raised)] hover:text-[var(--text-primary)]",
                          ].join(" ")
                        }
                        to={item.to}
                      >
                        {item.label}
                      </NavLink>
                    ))}
                  </nav>
                )}

                <Button
                  className="hidden lg:inline-flex"
                  onClick={() => setIsAboutOpen(true)}
                  type="button"
                  variant="outline"
                >
                  <Info className="h-4 w-4" />
                  <span>About</span>
                </Button>
                <ThemeToggle />
                {isAuthenticated && (
                  <Button onClick={logout} type="button" variant="ghost">
                    <LogOut className="h-4 w-4" />
                    <span>Log out</span>
                  </Button>
                )}
              </div>
            </div>
          </header>
        )}

        <Outlet />
      </div>

      {isAboutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[radial-gradient(circle_at_top,var(--ambient-primary),transparent_25%),rgba(2,6,23,0.52)] px-4 backdrop-blur-md">
          <Card className="relative w-full max-w-xl overflow-hidden rounded-[32px] border border-[var(--border-strong)] bg-[linear-gradient(180deg,var(--surface-raised),var(--surface-soft))] p-0 shadow-[0_30px_90px_rgba(2,6,23,0.22)]">
            <div className="absolute inset-x-0 top-0 h-36 bg-[linear-gradient(135deg,var(--ambient-primary),transparent_45%,var(--ambient-secondary))] opacity-80" />
            <div className="absolute right-8 top-8 h-20 w-20 rounded-full bg-[var(--ambient-primary)] blur-3xl" />

            <div className="relative border-b border-[var(--border-subtle)] px-7 pb-6 pt-7">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-4 py-2 text-xs font-medium uppercase tracking-[0.24em] text-[var(--accent-strong)] shadow-[0_10px_24px_rgba(2,6,23,0.08)]">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>About Lyrical</span>
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-3xl font-semibold tracking-tight">
                      A focused frontend for a compact product.
                    </h2>
                    <p className="max-w-lg text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
                      Lyrical is currently designed around a simple
                      authentication flow and a protected workspace, with room
                      to grow without making the interface feel crowded.
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => setIsAboutOpen(false)}
                  size="icon"
                  type="button"
                  variant="ghost"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="relative grid gap-4 px-7 py-6 sm:grid-cols-3">
              <div className="rounded-[24px] border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-4 py-4 shadow-[0_12px_28px_rgba(2,6,23,0.06)]">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--text-muted)]">
                  Access
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                  Separate login and signup pages with protected routing.
                </p>
              </div>

              <div className="rounded-[24px] border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-4 py-4 shadow-[0_12px_28px_rgba(2,6,23,0.06)]">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--text-muted)]">
                  Design
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                  Bright light mode, calmer dark mode, and a subtle glass
                  header.
                </p>
              </div>

              <div className="rounded-[24px] border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-4 py-4 shadow-[0_12px_28px_rgba(2,6,23,0.06)]">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--text-muted)]">
                  Ready Next
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                  Prepared for backend auth integration and future feature
                  pages.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </main>
  );
}
