export const samplePreviewText = `Tonight feels slower than usual.
The city outside is still awake, but this room has gone quiet.

I want a space where unfinished thoughts can land softly,
where long notes, drafts, and reflections still feel beautiful.

If this becomes something more later, that's fine.
For now, let it simply arrive well.`

export const rightPanelCopy = {
  eyebrow: "Translation output",
  title: "Lyrically Translated Version",
  description:
    "The translated version of your song lyrics will appear here, preserving the flow and structure of the original.",
}

export function formatTextToLines(text: string) {
  const normalized = text.replace(/\r\n/g, "\n").trim()

  if (!normalized) {
    return []
  }

  const rawLines = normalized.split("\n")
  const hasStructuredBreaks = rawLines.some((line) => line.trim() === "") || rawLines.length > 1

  if (hasStructuredBreaks) {
    return rawLines.map((line) => line.trim())
  }

  return normalized
    .split(/(?<=[.!?])\s+/)
    .map((line) => line.trim())
    .filter(Boolean)
}

export function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length
}

export function countRawLines(text: string) {
  if (!text) {
    return 0
  }

  return text.replace(/\r\n/g, "\n").split("\n").length
}
