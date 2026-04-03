import { ChevronLeft, ChevronRight, PencilLine } from "lucide-react";

import type {
  ChatRecord,
  LeftSidebarMode,
} from "@/components/workspace/types";

type LeftSidebarProps = {
  chats: ChatRecord[];
  activeChatId: string;
  isOpen: boolean;
  isPanelVisible: boolean;
  mode: LeftSidebarMode;
  overlay: boolean;
  railWidth: number;
  onToggle: () => void;
  onOpenWithMode: (mode: LeftSidebarMode) => void;
  onSelectChat: (chat: ChatRecord) => void;
  onCollapsedSelectChat: (chat: ChatRecord) => void;
  onNewChat: () => void;
};

export function LeftSidebar({
  chats,
  activeChatId,
  isOpen,
  isPanelVisible,
  mode,
  overlay,
  railWidth,
  onToggle,
  onOpenWithMode,
  onSelectChat,
  onCollapsedSelectChat,
  onNewChat,
}: LeftSidebarProps) {
  const asideClassName = overlay
    ? "pointer-events-none absolute left-0 top-0 z-20 flex h-full w-0 items-start overflow-visible bg-transparent"
    : "flex h-[80dvh] max-h-[80dvh] min-h-0 w-full self-start overflow-hidden bg-transparent";

  return (
    <aside className={asideClassName}>
      {isPanelVisible ? (
        <div
          className={[
            "h-full flex flex-col overflow-hidden px-4 py-4 transition-[opacity,transform] ease-[cubic-bezier(0.22,1,0.36,1)]",
            overlay
              ? "pointer-events-auto absolute left-0 top-0 z-[70] w-[min(20rem,calc(100vw-4rem))] duration-500"
              : "w-full duration-300",
            isOpen
              ? "opacity-100 translate-x-0"
              : overlay
                ? "pointer-events-none opacity-0 -translate-x-10"
                : "pointer-events-none opacity-0 -translate-x-4",
          ].join(" ")}
        >
          <div
            className={[
              "flex h-full min-h-full flex-col rounded-[28px] border p-4",
              overlay
                ? "border-[var(--border-subtle)] bg-[var(--surface-raised)] shadow-[0_18px_34px_rgba(15,23,42,0.14)]"
                : "border-white/60 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--surface-soft)_94%,white),color-mix(in_oklab,var(--surface-raised)_90%,var(--ambient-primary)))] shadow-[inset_0_1px_0_rgba(255,255,255,0.78),0_18px_34px_rgba(218,168,134,0.1)]",
            ].join(" ")}
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="truncate text-sm font-medium uppercase tracking-[0.24em] text-[var(--text-muted)]">
                Your chats
              </p>
              <button
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] text-[var(--text-secondary)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]"
                onClick={onToggle}
                type="button"
                title="Close chats"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>

            <button
              className="flex w-full items-center gap-3 rounded-2xl bg-[var(--surface-raised)] px-4 py-3 text-left text-sm font-medium text-[var(--text-primary)] shadow-[0_10px_24px_rgba(2,6,23,0.06)] transition hover:bg-[var(--surface-muted)]"
              onClick={onNewChat}
              type="button"
            >
              <PencilLine className="h-4 w-4" />
              <span>New chat</span>
            </button>


            <div className="panel-scroll mt-5 flex-1 space-y-1.5 overflow-y-auto min-h-0 pr-1">
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  className={[
                    "w-full shrink-0 rounded-2xl px-4 py-3 text-left transition",
                    chat.id === activeChatId
                      ? "bg-[var(--surface-raised)] shadow-[0_10px_24px_rgba(2,6,23,0.06)]"
                      : "hover:bg-[var(--surface-raised)]",
                  ].join(" ")}
                  onClick={() => onSelectChat(chat)}
                  type="button"
                >
                  <p className="truncate text-sm font-medium text-[var(--text-primary)]">
                    {chat.title}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div
          className={[
            "flex shrink-0 flex-col items-center bg-transparent px-2 py-3",
            overlay ? "pointer-events-auto absolute left-0 top-0 z-[60]" : "",
          ].join(" ")}
          style={{ width: `${railWidth}px` }}
        >
          <div className="flex h-full w-full flex-col items-center rounded-[22px] border border-white/55 bg-[color-mix(in_oklab,var(--surface-raised)_82%,white)] px-1.5 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_12px_26px_rgba(218,168,134,0.08)]">
            <button
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] text-[var(--text-secondary)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]"
              onClick={onToggle}
              type="button"
              title="Open chats"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            <div className="mt-3 flex flex-col items-center gap-2">
              <button
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--surface-soft)] text-[var(--text-secondary)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]"
                onClick={onNewChat}
                type="button"
                title="New chat"
              >
                <PencilLine className="h-4 w-4" />
              </button>

            </div>

            {!overlay ? (
              <>
                <div className="my-3 h-px w-7 bg-[linear-gradient(90deg,transparent,var(--border-subtle),transparent)]" />

                <div className="flex flex-1 flex-col items-center gap-2">
                  {chats.slice(0, 4).map((chat) => (
                    <button
                      key={chat.id}
                      className={[
                        "relative flex h-9 w-9 items-center justify-center rounded-xl text-[11px] font-semibold transition",
                        chat.id === activeChatId
                          ? "bg-[var(--surface-raised)] text-[var(--text-primary)] shadow-[0_10px_24px_rgba(2,6,23,0.06)]"
                          : "bg-[var(--surface-soft)] text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]",
                      ].join(" ")}
                      onClick={() => onCollapsedSelectChat(chat)}
                      type="button"
                      title={chat.title}
                    >
                      {chat.id === activeChatId && (
                        <span className="absolute -left-1 h-5 w-1 rounded-full bg-[var(--accent-strong)]" />
                      )}
                      {chat.title.slice(0, 2).toUpperCase()}
                    </button>
                  ))}
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </aside>
  );
}
