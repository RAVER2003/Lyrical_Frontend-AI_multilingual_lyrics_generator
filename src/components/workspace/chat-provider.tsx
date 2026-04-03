import React, { createContext, useContext, useState } from "react";
import { workspaceChats } from "./workspace-data";
import type { ChatRecord, VersionMetadata } from "./types";
import { useAuth } from "@/components/auth/auth-provider";

type ChatContextType = {
  chats: ChatRecord[];
  versionsByChat: Record<string, VersionMetadata[]>;
  createNewChat: () => string;
  updateChat: (id: string, updates: Partial<ChatRecord>) => void;
  deleteChat: (id: string) => void;
  pushVersion: (chatId: string, version: VersionMetadata) => void;
  clearVersions: (chatId: string) => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  
  // Natively seed the DB array with mock data plus any dynamically built payload
  const [chats, setChats] = useState<ChatRecord[]>(workspaceChats);
  const [versionsByChat, setVersionsByChat] = useState<Record<string, VersionMetadata[]>>({});

  // Scoped resolver matching mock data or dynamically built current user elements
  const userChats = chats.filter(chat => !chat.userId || chat.userId === user?.email);

  const createNewChat = () => {
    const latestChat = userChats[0];
    if (latestChat && latestChat.title === "New Translation" && latestChat.input === "" && latestChat.output === "") {
      return latestChat.id;
    }

    const newId = `chat_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newChat: ChatRecord = {
      id: newId,
      title: "New Translation",
      preview: "Empty workspace",
      input: "",
      output: "",
      updatedAt: "Just now",
      notes: [],
      userId: user?.email ?? "anonymous"
    };
    
    setChats(prev => [newChat, ...prev]);
    return newId;
  };

  const updateChat = (id: string, updates: Partial<ChatRecord>) => {
    setChats(prev => prev.map(chat => chat.id === id ? { ...chat, ...updates } : chat));
  };

  const deleteChat = (id: string) => {
    setChats(prev => prev.filter(c => c.id !== id));
  };

  const pushVersion = (chatId: string, version: VersionMetadata) => {
    setVersionsByChat(prev => {
      const currentVersions = prev[chatId] || [];
      return {
        ...prev,
        [chatId]: [version, ...currentVersions]
      };
    });
  };

  const clearVersions = (chatId: string) => {
    setVersionsByChat(prev => ({ ...prev, [chatId]: [] }));
  };

  return (
    <ChatContext.Provider value={{
      chats: userChats,
      versionsByChat,
      createNewChat,
      updateChat,
      deleteChat,
      pushVersion,
      clearVersions
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChats() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChats must be used within a ChatProvider");
  }
  return context;
}
