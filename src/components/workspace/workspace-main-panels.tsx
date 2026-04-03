import { ArrowDownToLine, ArrowRight, Copy, ChevronDown } from "lucide-react";
import { useState, type RefObject } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { ChatRecord, EditingContext } from "@/components/workspace/types";

const panelHeightClass = "h-[420px] sm:h-[460px] xl:h-[500px]";

type WorkspaceMainPanelsProps = {
  activeChat: ChatRecord;
  inputText: string;
  wordCount: number;
  isBusy: boolean;
  isTranslating: boolean;
  isWaitingResponse: boolean;
  visibleLines: string[];
  transliteratedLines: string[];
  visibleText: string;
  isAnimating: boolean;
  showJumpToLatest: boolean;
  previewScrollRef: RefObject<HTMLDivElement | null>;
  rightPanelEyebrow: string;
  rightPanelTitle: string;
  rightPanelDescription: string;
  onInputChange: (value: string) => void;
  onGenerate: () => void;
  onClear: () => void;
  onPreviewScroll: () => void;
  onJumpToLatest: () => void;
  onCopy: () => void;
  onDownload: () => void;
  onWordClick: (ctx: EditingContext) => void;
};

export function WorkspaceMainPanels(props: WorkspaceMainPanelsProps) {
  const [language, setLanguage] = useState("english");
  const [isLangOpen, setIsLangOpen] = useState(false);

  const {
    activeChat,
    inputText,
    wordCount,
    isBusy,
    isTranslating,
    isWaitingResponse,
    visibleLines,
    transliteratedLines,
    visibleText,
    isAnimating,
    showJumpToLatest,
    previewScrollRef,
    rightPanelEyebrow,
    rightPanelTitle,
    rightPanelDescription,
    onInputChange,
    onGenerate,
    onClear,
    onPreviewScroll,
    onJumpToLatest,
    onCopy,
    onDownload,
    onWordClick,
  } = props;

  return (
    <>
      <section className="grid justify-items-center items-stretch gap-6 transition-[gap,transform,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] xl:grid-cols-[1fr_1fr] xl:gap-5">
        <Card className="flex h-full min-h-0 w-full max-w-[38rem] flex-col xl:justify-self-center">
          <CardHeader>
            <p className="text-sm font-medium text-[var(--text-muted)]">
              {activeChat.title}
            </p>
            <CardTitle>Original Lyrics</CardTitle>
            <CardDescription>
              Write or paste the original song lyrics you want to translate here.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex min-h-0 flex-1 flex-col">
            <div
              className={`flex flex-col rounded-[24px] border border-[var(--border-subtle)] bg-[linear-gradient(180deg,var(--input-bg),var(--surface-soft))] p-4 ${panelHeightClass}`}
            >
              <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
                <span>Draft</span>
                <span>Source lyrics</span>
              </div>

              <Textarea
                className="panel-scroll h-full resize-none border-[var(--border-strong)]"
                onChange={(event) => onInputChange(event.target.value)}
                placeholder="Write something reflective, lyrical, or long-form here..."
                value={inputText}
              />
            </div>

            <div className="mt-auto pt-5">
              <div className="rounded-[20px] border border-[var(--border-subtle)] bg-[var(--surface-muted)] px-4 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex min-w-0 flex-wrap items-center gap-2 text-sm text-[var(--text-secondary)]">
                    <Badge>{wordCount} words</Badge>
                  </div>

                  <div className="relative flex min-w-0 flex-wrap items-center justify-end gap-3 z-20">
                    <Button
                      disabled={isBusy}
                      onClick={onClear}
                      size="sm"
                      type="button"
                      variant="ghost"
                    >
                      Clear
                    </Button>
                    
                    <div className="relative">
                      <button
                        onClick={() => setIsLangOpen(!isLangOpen)}
                        className="flex h-10 min-w-[140px] items-center justify-between appearance-none rounded-xl border border-[var(--border-strong)] bg-[var(--surface-raised)] px-4 text-sm font-medium text-[var(--text-primary)] shadow-[var(--field-shadow)] outline-none transition-all hover:bg-[var(--surface-muted)] focus:border-[var(--ring-color)] focus:shadow-[var(--field-focus-shadow)] cursor-pointer"
                        type="button"
                      >
                        <span className="truncate mr-2">
                          {language === "english" ? "English (Default)" : language === "marathi" ? "Marathi" : "Hindi"}
                        </span>
                        <ChevronDown className={`h-4 w-4 shrink-0 px-0 transition-transform ${isLangOpen ? "rotate-180" : ""}`} />
                      </button>
                      
                      {isLangOpen && (
                        <>
                          <div 
                            className="fixed inset-0 z-[80]" 
                            onClick={() => setIsLangOpen(false)} 
                          />
                          <div className="absolute z-[90] bottom-full mb-2 w-full flex flex-col gap-1 rounded-xl border border-[var(--border-strong)] bg-[color-mix(in_oklab,var(--surface-raised)_95%,white)] p-1.5 shadow-lg backdrop-blur-md dark:bg-[color-mix(in_oklab,var(--surface-raised)_95%,black)]">
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
                                className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
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

                    <Button
                      disabled={isBusy || !inputText.trim()}
                      onClick={onGenerate}
                      type="button"
                    >
                      <span>
                        {isTranslating ? "Translating..." : "Translate lyrics"}
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="flex h-full min-h-0 w-full max-w-[38rem] flex-col xl:justify-self-center">
          <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
            <div className="max-w-xl space-y-2">
              <p className="text-sm font-medium text-[var(--text-muted)]">
                {rightPanelEyebrow}
              </p>
              <CardTitle>{rightPanelTitle}</CardTitle>
              <CardDescription>{rightPanelDescription}</CardDescription>
            </div>

            <Badge variant="secondary">Model output</Badge>
          </CardHeader>

          <CardContent className="flex min-h-0 flex-1 flex-col">
            <div
              ref={previewScrollRef}
              onScroll={onPreviewScroll}
              className={`panel-scroll overflow-y-auto rounded-[24px] border border-[var(--border-subtle)] bg-[var(--surface-soft)] p-5 ${panelHeightClass}`}
            >
              {isWaitingResponse ? (
                <div className="flex h-full min-h-full flex-col justify-center rounded-[20px] border border-dashed border-[var(--border-subtle)] px-6">
                  <div className="mx-auto w-full max-w-lg space-y-4">
                    <div className="flex items-center justify-center">
                      <Badge variant="secondary">
                        Sending lyrics to translation model
                      </Badge>
                    </div>
                    <p className="text-center text-2xl font-semibold">
                      Working on your translation...
                    </p>
                    <p className="text-center text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
                      Real model responses can take a little time. The
                      translated lyrics will start appearing here as soon as a
                      response is ready.
                    </p>
                    <div className="space-y-3 pt-2">
                      <div className="h-4 w-4/5 animate-pulse rounded-full bg-[var(--surface-muted)]" />
                      <div className="h-4 w-full animate-pulse rounded-full bg-[var(--surface-muted)]" />
                      <div className="h-4 w-3/4 animate-pulse rounded-full bg-[var(--surface-muted)]" />
                    </div>
                  </div>
                </div>
              ) : visibleLines.length > 0 ? (
                <div className="space-y-3">
                  {visibleLines.map((line, index) =>
                    line ? (
                      <div key={`${line}-${index}`} className="animate-[fadeInUp_0.45s_ease-out]">
                        <p className="text-base leading-8 text-[var(--text-primary)] sm:text-[1.05rem]">
                          {line.split(" ").map((word, wordIdx, wordsArr) => {
                            const prevWords = wordsArr.slice(Math.max(0, wordIdx - 2), wordIdx).join(" ");
                            const nextWords = wordsArr.slice(wordIdx + 1, Math.min(wordsArr.length, wordIdx + 3)).join(" ");
                            
                            return (
                              <span key={`${index}-${wordIdx}`} className="relative group inline-block mr-1.5">
                                <span 
                                  className="cursor-pointer transition-[colors,transform] duration-200 group-hover:bg-[color-mix(in_oklab,var(--accent-strong)_20%,transparent)] group-hover:text-[var(--accent-strong)] rounded px-0.5 -mx-0.5"
                                  onClick={() => onWordClick({
                                    lineIndex: index,
                                    wordIndex: wordIdx,
                                    prevWords,
                                    targetWord: word,
                                    nextWords
                                  })}
                                >
                                  {word}
                                </span>
                                <div className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 rounded bg-[var(--text-primary)] text-[var(--app-bg)] text-[0.65rem] font-bold uppercase tracking-wider shadow-md whitespace-nowrap z-50">
                                  Click to edit 
                                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[var(--text-primary)]"></div>
                                </div>
                              </span>
                            );
                          })}
                        </p>
                        
                        <div 
                          className={`grid transition-[grid-template-rows,opacity,margin] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                            transliteratedLines[index] 
                              ? "grid-rows-[1fr] opacity-100 mt-0.5 mb-2" 
                              : "grid-rows-[0fr] opacity-0 mt-0 mb-0 pointer-events-none"
                          }`}
                        >
                          <div className="overflow-hidden">
                            <p className="text-[0.95rem] italic tracking-wide text-[color-mix(in_oklab,var(--text-muted)_80%,transparent)]">
                              {transliteratedLines[index]}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div key={`break-${index}`} className="h-3" />
                    ),
                  )}

                  {isAnimating && (
                    <span className="inline-block h-6 w-1.5 animate-pulse rounded-full bg-[var(--accent-soft)] align-middle" />
                  )}
                </div>
              ) : (
                <div className="flex h-full min-h-full flex-col items-center justify-center rounded-[20px] border border-dashed border-[var(--border-subtle)] px-6 text-center">
                  <p className="text-2xl font-semibold">
                    {isTranslating
                      ? "Translating lyrics..."
                      : "Waiting for model output."}
                  </p>
                  <p className="mt-3 max-w-md text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
                    Write lyrics on the left and run the translation. The
                    returned output appears here gradually, and the preview
                    follows the latest text unless you scroll away.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-auto pt-5">
              <div className="flex flex-col gap-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-muted)] px-4 py-3 text-sm text-[var(--text-secondary)]">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <span>
                    {isWaitingResponse
                      ? "Waiting for translation model response"
                      : visibleLines.length > 0
                        ? `${visibleLines.length} lines currently visible`
                        : "No preview generated yet"}
                  </span>

                  <div className="flex flex-wrap items-center gap-2">
                    {showJumpToLatest && (
                      <Button
                        disabled={isBusy}
                        onClick={onJumpToLatest}
                        size="sm"
                        type="button"
                        variant="secondary"
                      >
                        Jump to latest
                      </Button>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    disabled={isBusy || !visibleText.trim()}
                    onClick={onCopy}
                    type="button"
                    variant="secondary"
                  >
                    <Copy className="h-4 w-4" />
                    <span>Copy visible</span>
                  </Button>
                  <Button
                    disabled={isBusy || !visibleText.trim()}
                    onClick={onDownload}
                    type="button"
                    variant="outline"
                  >
                    <ArrowDownToLine className="h-4 w-4" />
                    <span>Download .txt</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* <div className="mt-6 rounded-[22px] border border-[var(--border-subtle)] bg-[var(--surface-soft)] px-5 py-4 text-sm text-[var(--text-secondary)]">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <p>
            Outputs in this workspace may contain model-generated text and
            should be reviewed before final use or sharing.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-[var(--text-muted)]">
            <span>Terms apply</span>
            <span>Privacy-first workspace</span>
            <span>Draft content only</span>
          </div>
        </div>
      </div> */}
    </>
  );
}
