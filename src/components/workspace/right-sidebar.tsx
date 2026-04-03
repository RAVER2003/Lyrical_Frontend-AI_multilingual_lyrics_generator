import { useState, useEffect } from "react";
import { ChevronRight, Info, ChevronDown, ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { ChatRecord, EditingContext, VersionMetadata } from "@/components/workspace/types";

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
            "panel-scroll h-full flex flex-col overflow-hidden px-4 py-4 transition-[opacity,transform] ease-[cubic-bezier(0.22,1,0.36,1)]",
            overlay
              ? "pointer-events-auto absolute right-0 top-0 z-[70] w-[min(26rem,calc(100vw-4rem))] duration-500"
              : "w-[24rem] duration-300",
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
                : "border-white/60 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--surface-soft)_94%,white),color-mix(in_oklab,var(--surface-raised)_90%,var(--ambient-secondary)))] shadow-[inset_0_1px_0_rgba(255,255,255,0.78),0_18px_34px_rgba(140,176,222,0.1)]",
            ].join(" ")}
          >
            {/* Contextual Header with Actions */}
            <div className="mb-3 flex items-center justify-between gap-3 px-1">
              <div className="flex items-center gap-3">
                <button
                  onClick={onOpenAbout}
                  className="flex h-11 px-4 items-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] text-[var(--text-secondary)] text-sm font-medium shadow-sm transition hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]"
                  title="About Lyrical"
                  type="button"
                >
                  <Info className="h-5 w-5" />
                  <span>About</span>
                </button>
              </div>
              <button
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] text-[var(--text-secondary)] shadow-sm transition hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]"
                onClick={onToggle}
                type="button"
                title="Close right sidebar"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Pill Tabs Container */}
            <div className="mt-1 flex gap-1 border-b border-t border-[var(--border-subtle)] py-4">
              {([
                 { id: "transliteration", label: "Transliteration" },
                 { id: "versionHistory", label: "Version History" },
                 { id: "editLyrics", label: "Edit Lyrics" },
               ] as const)
                 .filter(tab => tab.id !== "editLyrics" || editingContext !== null)
                 .map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={[
                    "flex-1 whitespace-nowrap rounded-full px-2 py-1.5 text-[0.7rem] font-semibold tracking-wide transition-all",
                    activeTab === tab.id
                      ? "[background:var(--button-primary)] text-[var(--button-primary-text)] shadow-[var(--button-primary-shadow)]"
                      : "border border-transparent text-[var(--text-secondary)] hover:border-[var(--border-subtle)] hover:bg-[var(--surface-soft)]"
                  ].join(" ")}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Views */}
            <div className="mt-4 flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden">
              
              {/* --- Transliteration Tab --- */}
              {activeTab === "transliteration" && (
                <div className="flex h-full flex-col gap-5 px-1 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex flex-col gap-2">
                    <label className="text-[0.8rem] font-bold uppercase tracking-widest text-[var(--text-muted)] pl-1">Select Language</label>
                    <div className="relative">
                      <button
                        onClick={() => setIsLangOpen(!isLangOpen)}
                        className="w-full appearance-none rounded-xl border border-[var(--border-strong)] bg-[var(--surface-raised)] pl-4 pr-10 py-3 text-left text-sm font-medium text-[var(--text-primary)] shadow-[var(--field-shadow)] outline-none transition-all hover:bg-[var(--surface-muted)] focus:border-[var(--ring-color)] focus:shadow-[var(--field-focus-shadow)] cursor-pointer"
                        type="button"
                      >
                        {language === "english" ? "English (Default)" : language === "marathi" ? "Marathi" : "Hindi"}
                      </button>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-[var(--text-muted)]">
                        <ChevronDown className={`h-4 w-4 transition-transform ${isLangOpen ? "rotate-180" : ""}`} />
                      </div>
                      
                      {isLangOpen && (
                        <>
                          <div 
                            className="fixed inset-0 z-[80]" 
                            onClick={() => setIsLangOpen(false)} 
                          />
                          <div className="absolute z-[90] mt-2 w-full flex flex-col gap-1 rounded-xl border border-[var(--border-strong)] bg-[color-mix(in_oklab,var(--surface-raised)_95%,white)] p-1.5 shadow-lg backdrop-blur-md dark:bg-[color-mix(in_oklab,var(--surface-raised)_95%,black)]">
                            {[
                              { id: "english", label: "English (Default)" },
                              { id: "marathi", label: "Marathi" },
                              { id: "hindi", label: "Hindi" },
                            ].map((opt) => (
                              <button
                                key={opt.id}
                                onClick={() => {
                                  setLanguage(opt.id);
                                  setIsLangOpen(false);
                                }}
                                className={`w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                                  language === opt.id 
                                    ? "[background:var(--button-primary)] text-[var(--button-primary-text)] shadow-sm" 
                                    : "text-[var(--text-primary)] hover:bg-[var(--surface-muted)]"
                                }`}
                                type="button"
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col gap-2">
                    <label className="text-sm font-medium text-[var(--text-primary)]">Area for transliteration</label>
                    <div className="flex flex-1 items-center justify-center rounded-[16px] border border-dashed border-[var(--border-strong)] bg-[var(--surface-soft)] p-4 text-sm text-[var(--text-muted)]">
                      Transliteration Preview Area
                    </div>
                  </div>
                  <Button 
                    className="mt-2 h-auto w-full rounded-xl py-4 text-[0.85rem] font-medium tracking-wide"
                    disabled={!hasTranslatedLyrics || isTransliterating}
                    onClick={() => onTransliterate(language)}
                  >
                    {isTransliterating ? "Transliterating..." : "Perform Transliteration"}
                  </Button>
                </div>
              )}

              {/* --- Version History Tab --- */}
              {activeTab === "versionHistory" && (
                <div className="flex h-full flex-col overflow-hidden animate-in fade-in px-1">
                   <div className="panel-scroll flex-1 space-y-3 overflow-y-auto rounded-[20px] border border-[var(--border-strong)] bg-[var(--surface-soft)] p-3 shadow-inner">
                      {versions.map((version) => (
                        <button 
                          key={version.id} 
                          onClick={() => onSelectVersion(version.id)}
                          disabled={isFetchingVersion}
                          className="flex flex-col w-full cursor-pointer justify-start rounded-[14px] border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-4 py-3.5 text-left shadow-[var(--field-shadow)] transition hover:border-[var(--text-muted)] hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group/version relative overflow-hidden"
                        >
                          <span className="text-[0.85rem] font-bold text-[var(--text-primary)] truncate z-10 w-full">{version.label}</span>
                          <span className="text-[0.65rem] uppercase font-bold text-[var(--text-muted)] mt-1.5 tracking-wider z-10">{new Date(version.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}</span>
                          
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[color-mix(in_oklab,var(--text-muted)_5%,transparent)] to-transparent -translate-x-full group-hover/version:translate-x-full transition-transform duration-1000 z-0"></div>
                        </button>
                      ))}
                      
                      {versions.length === 0 && (
                        <div className="flex h-full items-center justify-center p-4 text-center text-sm text-[var(--text-muted)]">
                          No history captured yet. Try translating something!
                        </div>
                      )}
                   </div>
                   <div className="mt-4 shrink-0">
                     <Button 
                       onClick={onDeleteHistory}
                       disabled={isDeletingHistory || versions.length === 0}
                       variant="ghost" 
                       className="w-full rounded-xl border border-rose-200/50 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-400 dark:hover:bg-rose-950/60 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                       {isDeletingHistory ? "Deleting History..." : "Delete History"}
                     </Button>
                   </div>
                </div>
              )}

              {/* --- Edit Lyrics Tab --- */}
              {activeTab === "editLyrics" && (
                <div className="flex h-full flex-col px-1 animate-in fade-in slide-in-from-right-2">
                   <div className="flex flex-1 flex-col justify-between rounded-[22px] border border-[var(--border-strong)] bg-[var(--surface-soft)] p-5 shadow-sm">
                     <div className="space-y-4">
                       <p className="text-[0.8rem] font-bold uppercase tracking-widest text-[var(--text-muted)] border-b border-[var(--border-subtle)] pb-2">
                         Edit View
                       </p>
                       <div className="flex flex-wrap items-center gap-x-2 gap-y-3 text-sm text-[var(--text-primary)] leading-loose">
                         {editingContext?.prevWords.split(" ").filter(Boolean).map((word: string, i: number) => (
                           <span key={`prev-${i}`} className="cursor-not-allowed opacity-60">{word}</span>
                         ))}
                         
                         <input 
                           type="text" 
                           className="flex items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--input-bg)] px-2 py-1 text-center font-bold text-[var(--text-primary)] shadow-[var(--field-shadow)] outline-none transition-all focus:shadow-[var(--field-focus-shadow)] min-w-[80px]"
                           value={editWordInput}
                           onChange={(e) => setEditWordInput(e.target.value)}
                         />
                         
                         {editingContext?.nextWords.split(" ").filter(Boolean).map((word: string, i: number) => (
                           <span key={`next-${i}`} className="cursor-not-allowed opacity-60">{word}</span>
                         ))}
                       </div>
                     </div>

                     <div className="flex gap-3 pt-6 shrink-0 mt-auto">
                       <Button onClick={onCancelEdit} variant="outline" className="flex-1 rounded-full border border-[var(--border-strong)] bg-transparent">
                         Cancel
                       </Button>
                       <Button onClick={() => onConfirmEdit(editWordInput)} className="flex-1 rounded-full">
                         Confirm
                       </Button>
                     </div>
                   </div>
                </div>
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
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--surface-soft)] text-[var(--text-secondary)] shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]">
                <Info className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
