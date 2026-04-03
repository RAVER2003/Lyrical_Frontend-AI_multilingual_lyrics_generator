import type { ChatRecord } from "@/components/workspace/types";

export const workspaceChats: ChatRecord[] = [
  {
    id: "chat-song-01",
    title: "Song Lyrics Translation",
    preview: "Current working draft for the translation workspace.",
    input:
      "Tonight feels slower than usual.\nThe city outside is still awake, but this room has gone quiet.\n\nI want a space where unfinished thoughts can land softly,\nwhere long notes, drafts, and reflections still feel beautiful.\n\nIf this becomes something more later, that's fine.\nFor now, let it simply arrive well.",
    output:
      "This night is moving more gently than before.\nThe city still glows outside, while this room has fallen calm.\n\nI want a place where unfinished thoughts can rest lightly,\nwhere long notes, drafts, and reflections still feel graceful.\n\nIf it becomes something larger later, that is enough.\nFor now, let it arrive with care.",
    updatedAt: "Today, 2:10 PM",
    notes: [
      "Primary translation workspace",
      "Keep tone reflective and soft",
      "Prepared for future controls in this panel",
    ],
  },
  {
    id: "chat-song-02",
    title: "Seminar Report vs Survey",
    preview: "Draft saved from an earlier writing session.",
    input:
      "A seminar report records the events, takeaways, and structure of a seminar.\nA survey gathers opinions or data from participants.\n\nThe writing should stay clear, factual, and easy to compare.",
    output:
      "A seminar report captures the event, its structure, and the key takeaways.\nA survey is used to collect responses, opinions, or measurable data.\n\nThe explanation should remain clear, factual, and easy to compare.",
    updatedAt: "Yesterday, 8:40 PM",
    notes: [
      "Earlier educational draft",
      "Shorter output with direct phrasing",
      "Can be reopened into the same center workspace",
    ],
  },
  {
    id: "chat-song-03",
    title: "Process Migration in BPE",
    preview: "Technical writing sample with a more formal tone.",
    input:
      "Migration in business process environments needs planning, communication, and system compatibility.\nTeams should reduce downtime while moving data and workflows safely.",
    output:
      "Migration in a business process environment requires planning, communication, and compatibility checks.\nTeams should minimize downtime while moving data and workflows safely.",
    updatedAt: "Monday, 5:20 PM",
    notes: [
      "Formal tone",
      "Concise output shape",
      "Useful for structured translation tests",
    ],
  },
];
