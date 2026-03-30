import { NavLink, Outlet } from "react-router-dom"

import { ThemeToggle } from "@/components/theme/theme-toggle"
import { appRoutes } from "@/lib/routes"

const navItems = [
  { label: "Auth", to: appRoutes.auth },
  { label: "Text Preview", to: appRoutes.textPreview },
]

export function AppShell() {
  return (
    <main className="min-h-screen bg-[var(--app-bg)] text-[var(--text-primary)] transition-colors duration-300">
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,var(--ambient-primary),transparent_32%),radial-gradient(circle_at_bottom_right,var(--ambient-secondary),transparent_30%)]" />
        <header className="flex flex-col gap-5 border-b border-[var(--border-subtle)] pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.32em] text-[var(--text-muted)]">Lyrical</p>
            <p className="max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">
              Lyrics translation application
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:items-end">
            <nav className="flex flex-wrap gap-2 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-muted)] p-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  className={({ isActive }) =>
                    [
                      "rounded-xl px-4 py-2 text-sm transition",
                      isActive
                        ? "bg-[var(--surface-raised)] text-[var(--text-primary)] shadow-sm"
                        : "text-[var(--text-muted)] hover:bg-[var(--surface-raised)] hover:text-[var(--text-primary)]",
                    ].join(" ")
                  }
                  to={item.to}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <ThemeToggle />
          </div>
        </header>

        <Outlet />
      </div>
    </main>
  )
}
