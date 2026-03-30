type TranslateLyricsParams = {
  input: string
}

function normalizeVerse(text: string) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .trim()
}

export async function translateLyrics({ input }: TranslateLyricsParams) {
  const normalized = normalizeVerse(input)

  // Placeholder until the real translation model API is connected.
  await new Promise((resolve) => window.setTimeout(resolve, 550))

  return normalized
}
