import { useState, useEffect } from "react";
import { ChevronRight, Info, ChevronLeft } from "lucide-react";

import type { ChatRecord, EditingContext, VersionMetadata } from "@/components/workspace/types";
import { TransliterationTab } from "./right-sidebar-tabs/transliteration-tab";
import { VersionHistoryTab } from "./right-sidebar-tabs/version-history-tab";
import { EditLyricsTab } from "./right-sidebar-tabs/edit-lyrics-tab";

type RightSidebarProps = {
  activeChat: ChatRecord;
  editingContext: EditingContext | null;
  isOpen: boolean;
  isPanelVisible: boolean;
  overlay: boolean;
  railWidth: number;
  onToggle: () => void;
  onConfirmEdit: (newWord: string) => void;
  onCancelEdit: () => void;
  hasTranslatedLyrics: boolean;
  isTransliterating: boolean;
  onTransliterate: (language: string) => void;
  versions: VersionMetadata[];
  onSelectVersion: (id: string) => void;
  isFetchingVersion: boolean;
  onDeleteHistory: () => void;
  isDeletingHistory: boolean;
  onOpenAbout: () => void;
};

type Tab = "transliteration" | "versionHistory" | "editLyrics";

export function RightSidebar({
  activeChat: _activeChat,
  editingContext,
  isOpen,
  isPanelVisible,
  overlay,
  railWidth,
  onToggle,
  onConfirmEdit,
  onCancelEdit,
  hasTranslatedLyrics,
  isTransliterating,
  onTransliterate,
  versions,
  onSelectVersion,
  isFetchingVersion,
  onDeleteHistory,
  isDeletingHistory,
  onOpenAbout,
}: RightSidebarProps) {
  
  const [activeTab, setActiveTab] = useState<Tab>("transliteration");
  const [language, setLanguage] = useState("english");
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [editWordInput, setEditWordInput] = useState("");

  useEffect(() => {
    if (editingContext) {
      setActiveTab("editLyrics");
      setEditWordInput(editingContext.targetWord);
    } else if (activeTab === "editLyrics") {
      setActiveTab("transliteration");
    }
  }, [editingContext]);

  const asideClassName = overlay
    ? "pointer-events-none absolute right-0 top-0 z-20 flex h-full w-0 items-start justify-end overflow-visible bg-transparent"
    : "flex h-[80dvh] max-h-[80dvh] min-h-0 w-full self-start overflow-hidden bg-transparent";

  return (
    <aside className={asideClassName}>
      {isPanelVisible ? (
        <div
          className={[
            "h-full flex flex-col overflow-hidden px-4 py-4 transition-[opacity,transform] ease-[cubic-bezier(0.22,1,0.36,1)]",
            overlay
              ? "pointer-events-auto absolute right-0 top-0 z-[70] w-[min(25rem,calc(100vw-4rem))] duration-500"
              : "w-full duration-300",
            isOpen
              ? "opacity-100 translate-x-0"
              : overlay
                ? "pointer-events-none opacity-0 translate-x-10"
                : "pointer-events-none opacity-0 translate-x-4",
          ].join(" ")}
        >
          <div
            className={[
              "flex h-full min-h-full flex-col rounded-[28px] border p-4",
              overlay
                ? "border-[var(--border-subtle)] bg-[var(--surface-raised)] shadow-[0_18px_34px_rgba(15,23,42,0.14)]"
                : "border-white/60 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--surface-soft)_94%,white),color-mix(in_oklab,var(--surface-raised)_90%,var(--ambient-secondary)))] shadow-[inset_0_1px_0_rgba(255,255,255,0.78),0_18px_34px_rgba(180,210,240,0.1)]",
            ].join(" ")}
          >
            <div className="mb-4 flex items-center justify-between">
              <button
                className="flex items-center gap-2 rounded-xl bg-[var(--surface-raised)] px-4 py-2 text-sm font-bold text-[var(--text-secondary)] shadow-sm transition hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]"
                onClick={onOpenAbout}
                type="button"
              >
                <Info className="h-4 w-4" />
                <span>About</span>
              </button>
              <button
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--surface-raised)] text-[var(--text-secondary)] shadow-sm transition hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]"
                onClick={onToggle}
                type="button"
                title="Close details"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* <div className="mb-2 h-px w-full bg-[var(--border-subtle)]" /> */}

            <nav className="relative mt-2 flex gap-1 border-b border-t border-[var(--border-subtle)] py-4">
              <div 
                className="absolute bottom-4 left-0 top-4 rounded-full transition-all duration-300 ease-out [background:var(--button-primary)] shadow-[var(--button-primary-shadow)]"
                style={{
                  width: editingContext ? 'calc((100% - 8px) / 3)' : 'calc((100% - 4px) / 2)',
                  transform: `translateX(${
                    activeTab === 'transliteration' ? '0' :
                    activeTab === 'versionHistory' ? 'calc(100% + 4px)' :
                    'calc(200% + 8px)'
                  })`
                }}
              />
              <button
                className={[
                  "relative z-10 flex-1 whitespace-nowrap rounded-full px-2 py-1.5 text-[0.7rem] font-semibold tracking-wide transition-colors duration-300",
                  activeTab === "transliteration"
                    ? "text-[var(--button-primary-text)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]",
                ].join(" ")}
                onClick={() => setActiveTab("transliteration")}
                type="button"
              >
                Transliteration
              </button>
              <button
                className={[
                  "relative z-10 flex-1 whitespace-nowrap rounded-full px-2 py-1.5 text-[0.7rem] font-semibold tracking-wide transition-colors duration-300",
                  activeTab === "versionHistory"
                    ? "text-[var(--button-primary-text)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]",
                ].join(" ")}
                onClick={() => setActiveTab("versionHistory")}
                type="button"
              >
                Version History
              </button>
              {editingContext && (
                <button
                  className={[
                    "relative z-10 flex-1 whitespace-nowrap rounded-full px-2 py-1.5 text-[0.7rem] font-semibold tracking-wide transition-colors duration-300",
                    activeTab === "editLyrics"
                      ? "text-[var(--button-primary-text)]"
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)]",
                  ].join(" ")}
                  onClick={() => setActiveTab("editLyrics")}
                  type="button"
                >
                  Edit Lyrics
                </button>
              )}
            </nav>

            <div className="mb-2 h-px w-full" />

            <div className="panel-scroll flex-1 min-h-0 overflow-y-auto w-full px-1 py-1">
              {activeTab === "transliteration" && (
                <TransliterationTab
                  language={language}
                  setLanguage={setLanguage}
                  isLangOpen={isLangOpen}
                  setIsLangOpen={setIsLangOpen}
                  hasTranslatedLyrics={hasTranslatedLyrics}
                  isTransliterating={isTransliterating}
                  onTransliterate={onTransliterate}
                />
              )}

              {activeTab === "versionHistory" && (
                <VersionHistoryTab
                  versions={versions}
                  onSelectVersion={onSelectVersion}
                  isFetchingVersion={isFetchingVersion}
                  onDeleteHistory={onDeleteHistory}
                  isDeletingHistory={isDeletingHistory}
                />
              )}

              {activeTab === "editLyrics" && editingContext && (
                <EditLyricsTab
                  editingContext={editingContext}
                  editWordInput={editWordInput}
                  setEditWordInput={setEditWordInput}
                  onCancelEdit={onCancelEdit}
                  onConfirmEdit={onConfirmEdit}
                />
              )}
            </div>
          </div>
        </div>
      ) : (
        <div
          className={[
            "flex shrink-0 flex-col items-center bg-transparent px-2 py-3",
            overlay ? "pointer-events-auto absolute right-0 top-0 z-[60]" : "",
          ].join(" ")}
          style={{ width: `${railWidth}px` }}
        >
          <div className="flex h-full w-full flex-col items-center rounded-[22px] border border-[var(--shell-border)] bg-[color-mix(in_oklab,var(--surface-raised)_82%,white)] px-1.5 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_12px_26px_rgba(140,176,222,0.08)]">
            <button
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] text-[var(--text-secondary)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]"
              onClick={onToggle}
              type="button"
              title="Open details"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="my-3 h-px w-7 bg-[linear-gradient(90deg,transparent,var(--border-subtle),transparent)]" />

            <div className="flex flex-1 flex-col items-center gap-2">
              <button
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--surface-soft)] text-[var(--text-secondary)] shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]"
                onClick={onOpenAbout}
                type="button"
                title="About Lyrical"
              >
                <Info className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
