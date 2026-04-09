import React, { createContext, useContext, useState, useEffect } from "react";
import type { ChatRecord, VersionMetadata } from "./types";
import { useAuth } from "@/components/auth/auth-provider";
import { apiClient } from "@/services/auth/mock-auth";

type ChatContextType = {
  chats: ChatRecord[];
  versionsByChat: Record<string, VersionMetadata[]>;
  createNewChat: () => Promise<string>;
  updateChat: (id: string, updates: Partial<ChatRecord>) => Promise<void>;
  deleteChat: (id: string) => Promise<void>;
  fetchVersions: (chatId: string) => Promise<void>;
  clearVersions: (chatId: string) => Promise<void>;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  
  const [chats, setChats] = useState<ChatRecord[]>([]);
  const [versionsByChat, setVersionsByChat] = useState<Record<string, VersionMetadata[]>>({});

  useEffect(() => {
    if (user) {
      apiClient.get('/workspaces/').then(res => {
        const fetchedChats = res.data.map((w: any) => ({
          ...w,
          input: w.current_input,
          output: w.current_output,
          userId: w.user_id,
          updatedAt: new Date(w.updated_at).toLocaleString()
        }));
        setChats(fetchedChats.reverse());
      }).catch(console.error);
    } else {
      setChats([]);
      setVersionsByChat({});
    }
  }, [user]);

  const createNewChat = async () => {
    const latestChat = chats[0];
    if (latestChat && latestChat.title === "New Translation" && !latestChat.input && !latestChat.output) {
      return latestChat.id;
    }

    const res = await apiClient.post('/workspaces/', { title: "New Translation" });
    const w = res.data;
    const newChat: ChatRecord = {
      ...w,
      input: w.current_input,
      output: w.current_output,
      userId: w.user_id,
      updatedAt: new Date(w.updated_at).toLocaleString()
    };
    
    setChats(prev => [newChat, ...prev]);
    return newChat.id;
  };

  const updateChat = async (id: string, updates: Partial<ChatRecord>) => {
    // optimistic
    setChats(prev => prev.map(chat => chat.id === id ? { ...chat, ...updates } : chat));
    
    const backendUpdates: any = {};
    if (updates.title !== undefined) backendUpdates.title = updates.title;
    if (updates.input !== undefined) backendUpdates.current_input = updates.input;
    if (updates.output !== undefined) backendUpdates.current_output = updates.output;
    if (updates.notes !== undefined) backendUpdates.notes = updates.notes;
    
    await apiClient.patch(`/workspaces/${id}`, backendUpdates);
  };

  const deleteChat = async (id: string) => {
    // optimistic
    setChats(prev => prev.filter(c => c.id !== id));
    await apiClient.delete(`/workspaces/${id}`);
  };

  const fetchVersions = async (chatId: string) => {
    try {
      const res = await apiClient.get(`/workspaces/${chatId}/versions`);
      const mapped = res.data.map((v: any) => ({
        id: v.id,
        label: v.label,
        timestamp: new Date(v.timestamp).getTime(),
        input_state: v.input_state,
        output_state: v.output_state
      })).reverse();
      setVersionsByChat(prev => ({ ...prev, [chatId]: mapped }));
    } catch (e) {
      console.error(e);
    }
  };

  const clearVersions = async (chatId: string) => {
    await apiClient.delete(`/workspaces/${chatId}/versions`);
    setVersionsByChat(prev => ({ ...prev, [chatId]: [] }));
  };

  return (
    <ChatContext.Provider value={{
      chats,
      versionsByChat,
      createNewChat,
      updateChat,
      deleteChat,
      fetchVersions,
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
