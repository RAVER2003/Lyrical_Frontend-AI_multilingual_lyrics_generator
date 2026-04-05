import { Sparkles, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type WorkspaceAboutModalProps = {
  open: boolean;
  onClose: () => void;
};

export function WorkspaceAboutModal({
  open,
  onClose,
}: WorkspaceAboutModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[radial-gradient(circle_at_top,var(--ambient-primary),transparent_25%),rgba(2,6,23,0.52)] px-4 py-4 sm:p-0 backdrop-blur-md">
      <Card className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto overflow-x-hidden rounded-[24px] sm:rounded-[32px] border border-[var(--border-strong)] bg-[linear-gradient(180deg,var(--surface-raised),var(--surface-soft))] p-0 shadow-[0_30px_90px_rgba(2,6,23,0.22)]">
        <div className="absolute inset-x-0 top-0 h-28 sm:h-36 bg-[linear-gradient(135deg,var(--ambient-primary),transparent_45%,var(--ambient-secondary))] opacity-80" />
        <div className="absolute right-8 top-8 h-20 w-20 rounded-full bg-[var(--ambient-primary)] blur-3xl" />

        <div className="relative border-b border-[var(--border-subtle)] px-5 sm:px-7 pb-5 sm:pb-6 pt-5 sm:pt-7">
          <div className="flex items-start justify-between gap-3 sm:gap-4">
            <div className="space-y-3 sm:space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-3 sm:px-4 py-1.5 sm:py-2 text-[0.65rem] sm:text-xs font-medium uppercase tracking-[0.24em] text-[var(--accent-strong)] shadow-[0_10px_24px_rgba(2,6,23,0.08)]">
                <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span>About Lyrical</span>
              </div>
              <div className="space-y-2 sm:space-y-3">
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                  Multilingual Lyrics Translator.
                </h2>
                <p className="max-w-lg text-xs sm:text-sm leading-6 sm:leading-7 text-[var(--text-secondary)] sm:text-base">
                  Lyrical provides culturally-aware song lyrics translations, instant phonetic transliterations, and a complete version history of your edits—all securely managed within isolated workspaces.
                </p>
              </div>
            </div>

            <Button onClick={onClose} size="icon" type="button" variant="ghost" className="shrink-0 h-8 w-8 sm:h-10 sm:w-10">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="relative grid gap-3 sm:gap-4 px-5 sm:px-7 py-5 sm:py-6 sm:grid-cols-3">
          <div className="rounded-[20px] sm:rounded-[24px] border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-4 py-4 shadow-[0_12px_28px_rgba(2,6,23,0.06)]">
            <p className="text-[0.65rem] sm:text-xs font-medium uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Translation
            </p>
            <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-6 sm:leading-7 text-[var(--text-secondary)]">
              Preserve the structural flow and emotional weight of the original song dynamics.
            </p>
          </div>

          <div className="rounded-[20px] sm:rounded-[24px] border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-4 py-4 shadow-[0_12px_28px_rgba(2,6,23,0.06)]">
            <p className="text-[0.65rem] sm:text-xs font-medium uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Transliteration
            </p>
            <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-6 sm:leading-7 text-[var(--text-secondary)]">
              Read and pronounce lines intuitively matching phonetics of the target dialect.
            </p>
          </div>

          <div className="rounded-[20px] sm:rounded-[24px] border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-4 py-4 shadow-[0_12px_28px_rgba(2,6,23,0.06)]">
            <p className="text-[0.65rem] sm:text-xs font-medium uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Workspaces
            </p>
            <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-6 sm:leading-7 text-[var(--text-secondary)]">
              Every chat session manages its own distinct timeline and contextual metadata.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
