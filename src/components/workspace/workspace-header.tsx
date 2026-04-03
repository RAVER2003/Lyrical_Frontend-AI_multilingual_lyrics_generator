import { Info, LogOut, Moon, SunMedium } from "lucide-react";

import { Button } from "@/components/ui/button";

type WorkspaceHeaderProps = {
  theme: string;
  onAbout: () => void;
  onToggleTheme: () => void;
  onLogout: () => void;
};

export function WorkspaceHeader({
  theme,
  onAbout,
  onToggleTheme,
  onLogout,
}: WorkspaceHeaderProps) {
  return (
    <header className="relative z-10 mx-auto mb-4 mt-3 flex w-4/5 flex-none overflow-hidden rounded-[28px] border border-[var(--shell-border)] bg-[color-mix(in_oklab,var(--shell-bg)_84%,transparent)] px-5 py-3 shadow-[var(--shell-shadow)] backdrop-blur-[26px] sm:px-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-full bg-[linear-gradient(180deg,var(--shell-highlight),transparent_38%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,var(--shell-highlight),transparent_24%),radial-gradient(circle_at_85%_30%,var(--ambient-secondary),transparent_22%)] opacity-90" />
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-white/70" />

      <div className="relative flex w-full items-center justify-between lg:gap-6">
        <div className="flex items-center gap-5">
          <p className="text-sm font-medium uppercase tracking-[0.44em] text-[var(--accent-strong)] sm:text-base">
            Lyrical
          </p>
          <p className="text-xl font-semibold tracking-[-0.02em] text-[var(--text-primary)] sm:text-2xl [font-family:Georgia,'Times_New_Roman',serif]">
            Workspace
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2 hidden lg:block">
          <Button className="inline-flex" onClick={onAbout} type="button" variant="outline">
            <Info className="h-4 w-4" />
            <span>About</span>
          </Button>
          <Button onClick={onToggleTheme} type="button" variant="outline">
            {theme === "light" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <SunMedium className="h-4 w-4" />
            )}
            <span>{theme === "light" ? "Dark mode" : "Light mode"}</span>
          </Button>
          <Button onClick={onLogout} type="button" variant="ghost">
            <LogOut className="h-4 w-4" />
            <span>Log out</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
