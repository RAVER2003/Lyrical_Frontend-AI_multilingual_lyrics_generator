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
                  Translation workspace with chat-bound context.
                </h2>
                <p className="max-w-lg text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
                  Each chat in the left panel can feed the center translation
                  area, while the right panel holds chat-specific details and
                  supporting context.
                </p>
              </div>
            </div>

            <Button onClick={onClose} size="icon" type="button" variant="ghost">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
