import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/auth-provider";
import { useTheme } from "@/components/theme/theme-provider";
import { LeftSidebar } from "@/components/workspace/left-sidebar";
import { RightSidebar } from "@/components/workspace/right-sidebar";
import { useChats } from "@/components/workspace/chat-provider";
import { HomeWelcome } from "@/components/workspace/home-welcome";
import { WorkspaceAboutModal } from "@/components/workspace/workspace-about-modal";
import { WorkspaceHeader } from "@/components/workspace/workspace-header";
import { WorkspaceMainPanels } from "@/components/workspace/workspace-main-panels";
import type { ChatRecord, LeftSidebarMode, EditingContext } from "@/components/workspace/types";
import {
  countWords,
  formatTextToLines,
  rightPanelCopy,
} from "@/lib/text-preview";
import { translateLyrics } from "@/services/lyrics/translate-lyrics";

function renderLinesFromText(text: string) {
  return formatTextToLines(text);
}

export function TextPreviewPage() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const { chats, versionsByChat, updateChat, createNewChat, pushVersion, clearVersions } = useChats();
  
  const [isLargeScreen, setIsLargeScreen] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(min-width: 1280px)").matches
      : false,
  );
  const [leftSidebarMode, setLeftSidebarMode] = useState<LeftSidebarMode>("chats");
  const [isLeftOpen, setIsLeftOpen] = useState(true);
  const [isLeftPanelVisible, setIsLeftPanelVisible] = useState(true);
  const [isRightOpen, setIsRightOpen] = useState(false);
  const [isRightPanelVisible, setIsRightPanelVisible] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  
  const activeChat = chats.find((chat) => chat.id === chatId);
  
  const [inputText, setInputText] = useState("");
  const [renderedLines, setRenderedLines] = useState<string[]>([]);
  const [visibleLineCount, setVisibleLineCount] = useState(0);
  const [editingContext, setEditingContext] = useState<EditingContext | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isTransliterating, setIsTransliterating] = useState(false);
  const [transliteratedLines, setTransliteratedLines] = useState<string[]>([]);
  const [shouldAutoFollow, setShouldAutoFollow] = useState(true);
  const [isFetchingVersion, setIsFetchingVersion] = useState(false);
  const [isDeletingHistory, setIsDeletingHistory] = useState(false);
  const previewScrollRef = useRef<HTMLDivElement | null>(null);
  const revealTimerRef = useRef<number | null>(null);

  const versions = chatId ? (versionsByChat[chatId] || []) : [];

  // Rehydrate state when URL changes entirely
  useEffect(() => {
    if (activeChat) {
      setInputText(activeChat.input || "");
      const rLines = renderLinesFromText(activeChat.output || "");
      setRenderedLines(rLines);
      setVisibleLineCount(rLines.length);
      setTransliteratedLines([]);
    } else {
      setInputText("");
      setRenderedLines([]);
      setVisibleLineCount(0);
      setTransliteratedLines([]);
    }
  }, [chatId]); // We intentionally do NOT include activeChat to prevent rerender loops from deep updates.

  const visibleLines = renderedLines.slice(0, visibleLineCount);
  const visibleText = visibleLines.join("\n");
  const wordCount = useMemo(() => countWords(inputText), [inputText]);
  const showJumpToLatest =
    isAnimating && !shouldAutoFollow && visibleLines.length > 0;
  const isWaitingResponse = isTranslating && renderedLines.length === 0;
  const isBusy = isTranslating || isAnimating;
  const railWidth = 56;
  const leftSidebarWidth = "20vw";
  const rightSidebarWidth = "25vw";
  const sidebarAnimationDuration = isLargeScreen ? 280 : 500;
  const layoutColumns = isLargeScreen
    ? `${isLeftOpen ? leftSidebarWidth : `${railWidth}px`} minmax(0, 1fr) ${isRightOpen ? rightSidebarWidth : `${railWidth}px`}`
    : "minmax(0, 1fr)";

  useEffect(() => {
    return () => {
      if (revealTimerRef.current) {
        window.clearInterval(revealTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(min-width: 1280px)");
    const handleScreenChange = (event: MediaQueryListEvent) => {
      setIsLargeScreen(event.matches);
    };

    setIsLargeScreen(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleScreenChange);

    return () => {
      mediaQuery.removeEventListener("change", handleScreenChange);
    };
  }, []);

  useEffect(() => {
    if (isLeftOpen) {
      setIsLeftPanelVisible(true);
      return;
    }

    const timeout = window.setTimeout(() => {
      setIsLeftPanelVisible(false);
    }, sidebarAnimationDuration);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [isLeftOpen, sidebarAnimationDuration]);

  useEffect(() => {
    if (isRightOpen) {
      setIsRightPanelVisible(true);
      return;
    }

    const timeout = window.setTimeout(() => {
      setIsRightPanelVisible(false);
    }, sidebarAnimationDuration);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [isRightOpen, sidebarAnimationDuration]);

  useEffect(() => {
    if (!isAnimating || renderedLines.length === 0) {
      return;
    }

    if (revealTimerRef.current) {
      window.clearInterval(revealTimerRef.current);
    }

    setVisibleLineCount(0);

    let nextIndex = 0;
    revealTimerRef.current = window.setInterval(() => {
      nextIndex += 1;
      setVisibleLineCount(nextIndex);

      if (nextIndex >= renderedLines.length) {
        if (revealTimerRef.current) {
          window.clearInterval(revealTimerRef.current);
        }
        revealTimerRef.current = null;
        setIsAnimating(false);
      }
    }, 220);

    return () => {
      if (revealTimerRef.current) {
        window.clearInterval(revealTimerRef.current);
      }
      revealTimerRef.current = null;
    };
  }, [isAnimating, renderedLines]);

  useEffect(() => {
    const container = previewScrollRef.current;

    if (!container || !shouldAutoFollow) {
      return;
    }

    container.scrollTo({
      top: container.scrollHeight,
      behavior: isAnimating ? "smooth" : "auto",
    });
  }, [visibleLineCount, isAnimating, shouldAutoFollow]);

  const handlePreviewScroll = () => {
    const container = previewScrollRef.current;

    if (!container) {
      return;
    }

    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    setShouldAutoFollow(distanceFromBottom < 48);
  };

  const handleChatSelect = (chat: ChatRecord) => {
    if (revealTimerRef.current) {
      window.clearInterval(revealTimerRef.current);
      revealTimerRef.current = null;
    }

    navigate(`/home/${chat.id}`);
    setIsAnimating(false);
    setIsTranslating(false);
    setShouldAutoFollow(true);
  };

  const openLeftSidebar = (mode: LeftSidebarMode = "chats") => {
    setLeftSidebarMode(mode);
    setIsLeftOpen(true);
    setIsRightOpen(false);
  };

  const handleCollapsedChatSelect = (chat: ChatRecord) => {
    setLeftSidebarMode("chats");
    setIsLeftOpen(true);
    setIsRightOpen(false);
    handleChatSelect(chat);
  };

  const toggleLeftSidebar = () => {
    setIsLeftOpen((current) => {
      const next = !current;
      if (next) {
        setLeftSidebarMode("chats");
        setIsRightOpen(false);
      }
      return next;
    });
  };

  const toggleRightSidebar = () => {
    setIsRightOpen((current) => {
      const next = !current;
      if (next) {
        setIsLeftOpen(false);
      }
      return next;
    });
  };

  const handleGenerate = () => {
    const run = async () => {
      if (!inputText.trim()) {
        return;
      }

      setRenderedLines([]);
      setTransliteratedLines([]);
      setVisibleLineCount(0);
      setIsAnimating(false);
      setIsTranslating(true);
      setShouldAutoFollow(true);

      try {
        const translatedText = await translateLyrics({ input: inputText });
        const translatedLines = formatTextToLines(translatedText);

        setRenderedLines(translatedLines);
        
        // If this is a completely fresh chat, rename it using the first three words!
        if (activeChat && activeChat.title === "New Translation") {
          const freshTitle = inputText.split(" ").slice(0, 3).join(" ") || "New Translation";
          updateChat(chatId!, { title: freshTitle, input: inputText, output: translatedText });
        }
        
        pushVersion(chatId!, { id: `v_${Date.now()}`, label: `Translation output (${translatedLines.length} lines)`, timestamp: Date.now() });
        setShouldAutoFollow(true);
        setIsAnimating(true);
      } catch {
        toast.error("Translation could not be completed.");
      } finally {
        setIsTranslating(false);
      }
    };

    void run();
  };

  const handleInitiateEdit = (ctx: EditingContext) => {
    setEditingContext(ctx);
    setIsRightOpen(true);
  };

  const handleCancelEdit = () => {
    setEditingContext(null);
    setIsRightOpen(false);
  };

  const handleConfirmEdit = (newWord: string) => {
    if (!editingContext) return;
    
    setIsTranslating(true);
    setIsAnimating(false);
    setEditingContext(null);
    setIsRightOpen(false);
    
    // Simulate backend call
    setTimeout(() => {
      setRenderedLines((currentLines) => {
         const nextLines = [...currentLines];
         const lineToEdit = nextLines[editingContext.lineIndex];
         if (lineToEdit !== undefined) {
           const words = lineToEdit.split(" ");
           words[editingContext.wordIndex] = newWord;
           nextLines[editingContext.lineIndex] = words.filter(Boolean).join(" ");
         }
         pushVersion(chatId!, { id: `v_${Date.now()}`, label: `Edited word: "${newWord}"`, timestamp: Date.now() });
         return nextLines;
      });
      
      setVisibleLineCount(0);
      setIsTranslating(false);
      setShouldAutoFollow(true);
      setIsAnimating(true);
    }, 1200);
  };

  const handleTransliterate = (language: string) => {
    if (visibleLines.length === 0) return;
    
    setIsTransliterating(true);
    
    // Simulate API delay
    setTimeout(() => {
      const mockOutput = visibleLines.map(line => {
        if (!line) return "";
        // Dummy mock output providing simple transliterated string look
        return line.split(" ").map(w => w.toLowerCase()).join(" ") + (language==='marathi' ? " ||" : " ~");
      });
      setTransliteratedLines(mockOutput);
      setIsTransliterating(false);
    }, 1000);
  };

  const handleSelectVersion = (id: string) => {
    setIsFetchingVersion(true);
    
    // Demux mock payload based directly backwards towards target
    setTimeout(() => {
      setInputText(`Mock recovered source input specifically tracing state towards ${id}`);
      const restoredLines = formatTextToLines(`Mocked historical translation restored for ${id}.\nLinear history synced successfully.\nLines precisely matching historical state.`);
      
      setRenderedLines(restoredLines);
      setTransliteratedLines([]);
      setVisibleLineCount(restoredLines.length);
      setIsAnimating(false);
      setShouldAutoFollow(false);
      
      setIsFetchingVersion(false);
      setIsRightOpen(false); // Snap close the window as user begins viewing main workspace 
    }, 850);
  };

  const handleDeleteHistory = () => {
    setIsDeletingHistory(true);
    
    // Simulate backend deletion processing wait time
    setTimeout(() => {
      clearVersions(chatId!);
      setIsDeletingHistory(false);
      toast.success("Version history deleted completely.");
    }, 1000);
  };

  const handleJumpToLatest = () => {
    const container = previewScrollRef.current;

    if (!container) {
      return;
    }

    setShouldAutoFollow(true);
    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  };

  const handleCopy = async () => {
    if (!visibleText.trim()) {
      return;
    }

    try {
      await navigator.clipboard.writeText(visibleText);
      toast.success("Rendered text copied to clipboard.");
    } catch {
      toast.error("Clipboard copy failed in this browser.");
    }
  };

  const handleDownload = () => {
    if (!visibleText.trim()) {
      return;
    }

    const blob = new Blob([visibleText], { type: "text/plain;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "rendered-preview.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    toast.success("Rendered text downloaded as .txt.");
  };

  return (
    <section className="fixed inset-0 flex h-[100dvh] max-h-[100dvh] flex-col overflow-hidden overscroll-none">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_left,var(--ambient-primary),transparent_28%),radial-gradient(circle_at_right,var(--ambient-secondary),transparent_30%)]" />

      <WorkspaceHeader
        theme={theme}
        onAbout={() => setIsAboutOpen(true)}
        onLogout={logout}
        onToggleTheme={toggleTheme}
      />

      <div
        className={[
          "relative grid min-h-0 flex-1 gap-0 transition-[grid-template-columns] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
          isLargeScreen ? "overflow-hidden" : "overflow-visible",
        ].join(" ")}
        style={{ gridTemplateColumns: layoutColumns }}
      >
        <LeftSidebar
          activeChatId={chatId || ""}
          chats={chats}
          isOpen={isLeftOpen}
          isPanelVisible={isLeftPanelVisible}
          mode={leftSidebarMode}
          onCollapsedSelectChat={handleCollapsedChatSelect}
          onOpenWithMode={openLeftSidebar}
          onSelectChat={handleChatSelect}
          onToggle={toggleLeftSidebar}
          onNewChat={() => {
            const id = createNewChat();
            navigate(`/home/${id}`);
          }}
          overlay={!isLargeScreen}
          railWidth={railWidth}
        />

        <div className="panel-scroll no-scrollbar min-h-0 min-w-0 overflow-y-auto px-4 pb-8 pt-2 transition-[padding,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-6 lg:px-6 lg:pb-10">
          {!chatId || !activeChat ? (
            <HomeWelcome 
               userName={user?.name || "Creator"} 
               onNewChat={() => {
                 const id = createNewChat();
                 navigate(`/home/${id}`);
               }} 
            />
          ) : (
            <WorkspaceMainPanels
              activeChat={activeChat}
              inputText={inputText}
              isAnimating={isAnimating}
              isBusy={isBusy}
              isTranslating={isTranslating}
              isWaitingResponse={isWaitingResponse}
              onClear={() => setInputText("")}
              onCopy={handleCopy}
              onDownload={handleDownload}
              onGenerate={handleGenerate}
              onInputChange={setInputText}
              onJumpToLatest={handleJumpToLatest}
              onPreviewScroll={handlePreviewScroll}
              previewScrollRef={previewScrollRef}
              rightPanelDescription={rightPanelCopy.description}
              rightPanelEyebrow={rightPanelCopy.eyebrow}
              rightPanelTitle={rightPanelCopy.title}
              showJumpToLatest={showJumpToLatest}
              visibleLines={visibleLines}
              transliteratedLines={transliteratedLines}
              visibleText={visibleText}
              wordCount={wordCount}
              onWordClick={handleInitiateEdit}
            />
          )}
        </div>

        {chatId && activeChat && (
          <RightSidebar
            activeChat={activeChat}
            editingContext={editingContext}
            isOpen={isRightOpen}
            isPanelVisible={isRightPanelVisible}
            onToggle={toggleRightSidebar}
            onConfirmEdit={handleConfirmEdit}
            onCancelEdit={handleCancelEdit}
            hasTranslatedLyrics={visibleLines.length > 0}
            isTransliterating={isTransliterating}
            onTransliterate={handleTransliterate}
            versions={versions}
            onSelectVersion={handleSelectVersion}
            isFetchingVersion={isFetchingVersion}
            onDeleteHistory={handleDeleteHistory}
            isDeletingHistory={isDeletingHistory}
            overlay={!isLargeScreen}
            railWidth={railWidth}
          />
        )}
      </div>

      <WorkspaceAboutModal
        onClose={() => setIsAboutOpen(false)}
        open={isAboutOpen}
      />
    </section>
  );
}
