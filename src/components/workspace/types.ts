export type ChatRecord = {
  id: string;
  title: string;
  preview: string;
  input: string;
  output: string;
  updatedAt: string;
  notes: string[];
  userId?: string;
};

export type LeftSidebarMode = "chats" | "search" | "new";

export type EditingContext = {
  lineIndex: number;
  wordIndex: number;
  prevWords: string;
  targetWord: string;
  nextWords: string;
};

export type VersionMetadata = {
  id: string;
  label: string;
  timestamp: number;
  input_state?: string;
  output_state?: string;
};
