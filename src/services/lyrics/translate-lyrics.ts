import { apiClient, keycloak } from "@/services/auth/mock-auth";

export type TranslateLyricsParams = {
  workspaceId: string;
  input: string;
  targetDialect: string;
}

export async function streamTranslateLyrics(
  { workspaceId, input, targetDialect }: TranslateLyricsParams,
  onLine: (line: string) => void
) {
  // Ensure token is fresh
  if (keycloak.token) {
    await keycloak.updateToken(30);
  }

  const response = await fetch('http://localhost:8000/api/services/translate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${keycloak.token}`
    },
    body: JSON.stringify({ workspaceId, input, targetDialect })
  });

  if (!response.ok) throw new Error('Translation failed');

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  if (reader) {
    let buffer = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const rawLine of lines) {
        if (!rawLine.trim()) continue;
        try {
          const data = JSON.parse(rawLine);
          onLine(data.line);
        } catch (e) {
          console.error("Parse error in stream", e);
        }
      }
    }
  }
}

export async function translateLyrics({ workspaceId, input, targetDialect }: TranslateLyricsParams) {
  const response = await apiClient.post('/services/translate', {
    workspaceId,
    input,
    targetDialect
  });
  return response.data.output;
}

export type GenerateRhymeParams = {
  workspaceId: string;
  lines: string[];
  genre: string;
  rhymeScheme: string;
}

export async function generateRhymedVerse({ workspaceId, lines, genre, rhymeScheme }: GenerateRhymeParams) {
  // Ensure token is fresh
  if (keycloak.token) {
    await keycloak.updateToken(30);
  }

  const response = await fetch('http://localhost:8000/api/services/generate-rhyme', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${keycloak.token}`
    },
    body: JSON.stringify({ workspaceId, lines, genre, rhymeScheme })
  });

  if (!response.ok) throw new Error('Rhyme generation failed');

  const data = await response.json();
  return data.rhymedLines as string[];
}

export async function transliterateLyrics(workspaceId: string, text: string, targetDialect: string = "phonetic") {
  const response = await apiClient.post('/services/transliterate', {
    workspaceId,
    text,
    targetDialect
  });
  return response.data.transliteratedLines;
}

export async function editLyrics(workspaceId: string, targetWord: string, context: any, customPrompt: string) {
  const response = await apiClient.post('/services/edit-lyrics', {
    workspaceId,
    targetWord,
    context,
    customPrompt
  });
  return response.data.newOutput;
}
