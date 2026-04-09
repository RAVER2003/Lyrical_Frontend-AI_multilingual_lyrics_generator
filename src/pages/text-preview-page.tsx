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
import { WorkspaceLayout } from "@/components/workspace/workspace-layout";

import type { ChatRecord, LeftSidebarMode, EditingContext } from "@/components/workspace/types";
import { countWords, formatTextToLines, rightPanelCopy } from "@/lib/text-preview";
import { translateLyrics, streamTranslateLyrics, transliterateLyrics, editLyrics, generateRhymedVerse } from "@/services/lyrics/translate-lyrics";

import { useTypewriter } from "@/hooks/use-typewriter";
import { useAutoScroll } from "@/hooks/use-auto-scroll";
import { useMediaQuery } from "@/hooks/use-media-query";

export function TextPreviewPage() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const { chats, versionsByChat, updateChat, createNewChat, fetchVersions, clearVersions } = useChats();
  
  const isLargeScreen = useMediaQuery("(min-width: 1280px)");
  
  const [leftSidebarMode, setLeftSidebarMode] = useState<LeftSidebarMode>("chats");
  const [isLeftOpen, setIsLeftOpen] = useState(isLargeScreen);
  const [isLeftPanelVisible, setIsLeftPanelVisible] = useState(isLargeScreen);
  const [isRightOpen, setIsRightOpen] = useState(false);
  const [isRightPanelVisible, setIsRightPanelVisible] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  
  const activeChat = chats.find((chat) => chat.id === chatId);
  
  const [inputText, setInputText] = useState("");
  const [renderedLines, setRenderedLines] = useState<string[]>([]);
  const [editingContext, setEditingContext] = useState<EditingContext | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isTransliterating, setIsTransliterating] = useState(false);
  const [transliteratedLines, setTransliteratedLines] = useState<string[]>([]);
  const [isFetchingVersion, setIsFetchingVersion] = useState(false);
  const [isDeletingHistory, setIsDeletingHistory] = useState(false);
  
  const [activeOutputTab, setActiveOutputTab] = useState<"flat" | "rhyme">("flat");
  const [rhymedLines, setRhymedLines] = useState<string[]>([]);
  const [isGeneratingRhyme, setIsGeneratingRhyme] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState("party");
  const [selectedRhymeScheme, setSelectedRhymeScheme] = useState("AABB");
  
  const previewScrollRef = useRef<HTMLDivElement | null>(null);
  
  const { 
    visibleLineCount, 
    visibleLines, 
    isAnimating, 
    startAnimation, 
    stopAnimation,
    resetCount 
  } = useTypewriter(renderedLines, 220);
  
  const { 
    shouldAutoFollow, 
    setShouldAutoFollow, 
    handleScroll: onPreviewScroll, 
    jumpToLatest: onJumpToLatest 
  } = useAutoScroll(previewScrollRef, visibleLineCount, isAnimating);

  const versions = chatId ? (versionsByChat[chatId] || []) : [];

  const lastLoadedChatId = useRef<string | null>(null);

  useEffect(() => {
    if (chatId) {
      fetchVersions(chatId);
    } else {
      lastLoadedChatId.current = null;
      setInputText("");
      setRenderedLines([]);
      resetCount(0);
      setTransliteratedLines([]);
      setActiveOutputTab("flat");
      setRhymedLines([]);
    }
  }, [chatId]); 

  // Rehydrate state when URL changes entirely or when activeChat first populates from the API
  useEffect(() => {
    if (activeChat && lastLoadedChatId.current !== activeChat.id) {
      setInputText(activeChat.input || "");
      const rLines = formatTextToLines(activeChat.output || "");
      setRenderedLines(rLines);
      resetCount(rLines.length);
      setTransliteratedLines([]);
      setActiveOutputTab("flat");
      setRhymedLines([]);
      lastLoadedChatId.current = activeChat.id;
    }
  }, [activeChat, resetCount]);

  const visibleText = visibleLines.join("\n");
  const wordCount = useMemo(() => countWords(inputText), [inputText]);
  const showJumpToLatest = isAnimating && !shouldAutoFollow && visibleLines.length > 0;
  const isWaitingResponse = isTranslating && renderedLines.length === 0;
  const isBusy = isTranslating || isAnimating;
  
  const railWidth = 56;
  const sidebarAnimationDuration = isLargeScreen ? 280 : 500;

  useEffect(() => {
    if (isLeftOpen) {
      setIsLeftPanelVisible(true);
      return;
    }
    const timeout = window.setTimeout(() => setIsLeftPanelVisible(false), sidebarAnimationDuration);
    return () => window.clearTimeout(timeout);
  }, [isLeftOpen, sidebarAnimationDuration]);

  useEffect(() => {
    if (isRightOpen) {
      setIsRightPanelVisible(true);
      return;
    }
    const timeout = window.setTimeout(() => setIsRightPanelVisible(false), sidebarAnimationDuration);
    return () => window.clearTimeout(timeout);
  }, [isRightOpen, sidebarAnimationDuration]);

  const handleChatSelect = (chat: ChatRecord) => {
    stopAnimation();
    navigate(`/home/${chat.id}`);
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
      if (next) setIsLeftOpen(false);
      return next;
    });
  };

  const handleGenerate = (targetLang: string) => {
    const run = async () => {
      if (!inputText.trim()) return;

      setRenderedLines([]);
      setTransliteratedLines([]);
      setActiveOutputTab("flat");
      setRhymedLines([]);
      resetCount(0);
      stopAnimation();
      setIsTranslating(true);
      setShouldAutoFollow(true);

      try {
        let fullOutput = "";
        await streamTranslateLyrics(
          { workspaceId: chatId!, input: inputText, targetDialect: targetLang },
          (line) => {
            setRenderedLines((prev) => {
              const next = [...prev, line];
              fullOutput = next.join("\n");
              return next;
            });
            startAnimation();
          }
        );

        if (activeChat && activeChat.title === "New Translation") {
          const freshTitle = inputText.split(" ").slice(0, 3).join(" ") || "New Translation";
          updateChat(chatId!, { title: freshTitle, input: inputText, output: fullOutput });
        } else {
          updateChat(chatId!, { input: inputText, output: fullOutput });
        }
        
        await fetchVersions(chatId!);
      } catch (e) {
        console.error(e);
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

  const handleConfirmEdit = async (newWord: string) => {
    if (!editingContext) return;
    
    setIsTranslating(true);
    stopAnimation();
    
    try {
      const fullNewOutput = await editLyrics(chatId!, newWord, { 
        lineIndex: editingContext.lineIndex,
        wordIndex: editingContext.wordIndex
      }, "Improve word");
      
      await fetchVersions(chatId!);
      setTransliteratedLines([]);

      const nextLines = formatTextToLines(fullNewOutput);
      setRenderedLines(nextLines);
      
      updateChat(chatId!, { output: fullNewOutput });
      resetCount(0);
      setShouldAutoFollow(true);
      startAnimation();
    } catch (e) {
      toast.error("Edit failed");
    } finally {
      setEditingContext(null);
      setIsRightOpen(false);
      setIsTranslating(false);
    }
  };

  const handleTransliterate = async (language: string) => {
    if (visibleLines.length === 0) return;
    setIsTransliterating(true);
    try {
      const translation = visibleLines.join("\n");
      const output = await transliterateLyrics(chatId!, translation, language);
      setTransliteratedLines(output);
    } catch {
      toast.error("Transliteration failed");
    } finally {
      setIsTransliterating(false);
    }
  };

  const handleGenerateRhyme = async () => {
    if (visibleLines.length === 0) return;
    setIsGeneratingRhyme(true);
    try {
      // The backend will create a version internally
      const result = await generateRhymedVerse({
        workspaceId: chatId!,
        lines: visibleLines,
        genre: selectedGenre,
        rhymeScheme: selectedRhymeScheme
      });
      setRhymedLines(result);
      // Wait for backend to finish adding the version before fetching
      await fetchVersions(chatId!);
    } catch {
      toast.error("Failed to generate rhymes.");
    } finally {
      setIsGeneratingRhyme(false);
    }
  };

  const handleSelectVersion = (id: string) => {
    const version = versions.find((v: any) => v.id === id);
    if (!version) return;
    
    setIsFetchingVersion(true);
    setInputText(version.input_state || "");
    const restoredLines = formatTextToLines(version.output_state || "");
    
    setRenderedLines(restoredLines);
    setTransliteratedLines([]);
    setActiveOutputTab("flat");
    setRhymedLines([]);
    resetCount(restoredLines.length);
    stopAnimation();
    setShouldAutoFollow(false);
    setIsFetchingVersion(false);
    setIsRightOpen(false);
    
    updateChat(chatId!, { input: version.input_state || "", output: version.output_state || "" });
  };

  const handleDeleteHistory = async () => {
    setIsDeletingHistory(true);
    try {
      await clearVersions(chatId!);
      toast.success("Version history deleted completely.");
    } finally {
      setIsDeletingHistory(false);
    }
  };

  const handleCopy = async () => {
    if (!visibleText.trim()) return;
    try {
      await navigator.clipboard.writeText(visibleText);
      toast.success("Rendered text copied to clipboard.");
    } catch {
      toast.error("Clipboard copy failed in this browser.");
    }
  };

  const handleDownload = () => {
    if (!visibleText.trim()) return;
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

      <WorkspaceLayout
        isLargeScreen={isLargeScreen}
        isLeftOpen={isLeftOpen}
        isRightOpen={isRightOpen}
        leftRailWidth={railWidth}
        rightRailWidth={railWidth}
        leftSidebarWidth="20vw"
        rightSidebarWidth="25vw"
        leftSidebar={
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
                 onNewChat={async () => {
                   const id = await createNewChat();
                   navigate(`/home/${id}`);
                 }} 
            overlay={!isLargeScreen}
            railWidth={railWidth}
          />
        }
        mainContent={
          <div className="panel-scroll no-scrollbar min-h-0 min-w-0 overflow-y-auto px-4 pb-8 pt-2 transition-[padding,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-6 lg:px-6 lg:pb-10">
            {!chatId || !activeChat ? (
              <HomeWelcome 
                 userName={user?.name || "Creator"} 
                 onNewChat={async () => {
                   const id = await createNewChat();
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
                onJumpToLatest={onJumpToLatest}
                onPreviewScroll={onPreviewScroll}
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
                activeOutputTab={activeOutputTab}
                onTabChange={setActiveOutputTab}
                rhymedLines={rhymedLines}
                isGeneratingRhyme={isGeneratingRhyme}
                selectedGenre={selectedGenre}
                onGenreChange={setSelectedGenre}
                selectedRhymeScheme={selectedRhymeScheme}
                onRhymeSchemeChange={setSelectedRhymeScheme}
                onGenerateRhyme={handleGenerateRhyme}
                onTransliterate={handleTransliterate}
                isTransliterating={isTransliterating}
              />
            )}
          </div>
        }
        rightSidebar={
          chatId && activeChat && (
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
              onOpenAbout={() => setIsAboutOpen(true)}
              overlay={!isLargeScreen}
              railWidth={railWidth}
            />
          )
        }
      />

      <WorkspaceAboutModal
        onClose={() => setIsAboutOpen(false)}
        open={isAboutOpen}
      />
    </section>
  );
}
