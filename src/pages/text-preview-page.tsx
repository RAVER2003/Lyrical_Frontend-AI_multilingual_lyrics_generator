import { useEffect, useMemo, useRef, useState } from "react"
import { toast } from "sonner"
import { ArrowDownToLine, ArrowRight, Copy, Wand2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { countWords, formatTextToLines, rightPanelCopy, samplePreviewText } from "@/lib/text-preview"
import { translateLyrics } from "@/services/lyrics/translate-lyrics"

const panelHeightClass = "h-[420px] sm:h-[500px] lg:h-[560px]"

export function TextPreviewPage() {
  const [inputText, setInputText] = useState(samplePreviewText)
  const [renderedLines, setRenderedLines] = useState<string[]>([])
  const [visibleLineCount, setVisibleLineCount] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isTranslating, setIsTranslating] = useState(false)
  const [shouldAutoFollow, setShouldAutoFollow] = useState(true)
  const previewScrollRef = useRef<HTMLDivElement | null>(null)
  const revealTimerRef = useRef<number | null>(null)

  const visibleLines = renderedLines.slice(0, visibleLineCount)
  const visibleText = visibleLines.join("\n")
  const wordCount = useMemo(() => countWords(inputText), [inputText])
  const showJumpToLatest = isAnimating && !shouldAutoFollow && visibleLines.length > 0
  const isWaitingResponse = isTranslating && renderedLines.length === 0
  const isBusy = isTranslating || isAnimating

  useEffect(() => {
    return () => {
      if (revealTimerRef.current) {
        window.clearInterval(revealTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!isAnimating || renderedLines.length === 0) {
      return
    }

    if (revealTimerRef.current) {
      window.clearInterval(revealTimerRef.current)
    }

    setVisibleLineCount(0)

    let nextIndex = 0
    revealTimerRef.current = window.setInterval(() => {
      nextIndex += 1
      setVisibleLineCount(nextIndex)

      if (nextIndex >= renderedLines.length) {
        if (revealTimerRef.current) {
          window.clearInterval(revealTimerRef.current)
        }
        revealTimerRef.current = null
        setIsAnimating(false)
      }
    }, 220)

    return () => {
      if (revealTimerRef.current) {
        window.clearInterval(revealTimerRef.current)
      }
      revealTimerRef.current = null
    }
  }, [isAnimating, renderedLines])

  useEffect(() => {
    const container = previewScrollRef.current

    if (!container || !shouldAutoFollow) {
      return
    }

    container.scrollTo({
      top: container.scrollHeight,
      behavior: isAnimating ? "smooth" : "auto",
    })
  }, [visibleLineCount, isAnimating, shouldAutoFollow])

  const handlePreviewScroll = () => {
    const container = previewScrollRef.current

    if (!container) {
      return
    }

    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight
    setShouldAutoFollow(distanceFromBottom < 48)
  }

  const handleGenerate = () => {
    const run = async () => {
      if (!inputText.trim()) {
        return
      }

      setRenderedLines([])
      setVisibleLineCount(0)
      setIsAnimating(false)
      setIsTranslating(true)
      setShouldAutoFollow(true)

      try {
        const translatedText = await translateLyrics({ input: inputText })
        const translatedLines = formatTextToLines(translatedText)

        setRenderedLines(translatedLines)
        setShouldAutoFollow(true)
        setIsAnimating(true)
      } catch {
        toast.error("Translation could not be completed.")
      } finally {
        setIsTranslating(false)
      }
    }

    void run()
  }

  const handleJumpToLatest = () => {
    const container = previewScrollRef.current

    if (!container) {
      return
    }

    setShouldAutoFollow(true)
    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    })
  }

  const handleCopy = async () => {
    if (!visibleText.trim()) {
      return
    }

    try {
      await navigator.clipboard.writeText(visibleText)
      toast.success("Rendered text copied to clipboard.")
    } catch {
      toast.error("Clipboard copy failed in this browser.")
    }
  }

  const handleDownload = () => {
    if (!visibleText.trim()) {
      return
    }

    const blob = new Blob([visibleText], { type: "text/plain;charset=utf-8" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "rendered-preview.txt"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    toast.success("Rendered text downloaded as .txt.")
  }

  return (
    <section className="grid flex-1 items-stretch gap-6 py-8 lg:auto-rows-fr lg:grid-cols-[1fr_1fr] lg:gap-8 lg:py-10">
      <Card className="flex h-full flex-col">
        <CardHeader>
          <p className="text-sm font-medium text-[var(--text-muted)]">Input</p>
          <CardTitle>Add the lyrics you want translated.</CardTitle>
          <CardDescription>
            This input area stays stable for longer verses and sends the text to your lyrics translation model when you
            run it.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex h-full flex-col">
          <div
            className={`flex flex-1 flex-col rounded-[24px] border border-[var(--border-subtle)] bg-[linear-gradient(180deg,var(--input-bg),var(--surface-soft))] p-4 ${panelHeightClass}`}
          >
            <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
              <span>Draft</span>
              <span>Source lyrics</span>
            </div>

            <Textarea
              className="panel-scroll h-full resize-none border-[var(--border-strong)]"
              onChange={(event) => setInputText(event.target.value)}
              placeholder="Write something reflective, lyrical, or long-form here..."
              value={inputText}
            />
          </div>

          <div className="mt-5 rounded-[20px] border border-[var(--border-subtle)] bg-[var(--surface-muted)] px-4 py-4">
            <p className="text-sm text-[var(--text-secondary)]">
              The source text on the left is sent to the translation model, and the returned lyrics are revealed on the
              right.
            </p>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex min-w-0 flex-wrap items-center gap-2 text-sm text-[var(--text-secondary)]">
                <Badge>{wordCount} words</Badge>
              </div>

              <div className="flex min-w-0 flex-wrap items-center justify-end gap-2">
                <Button disabled={isBusy} onClick={() => setInputText("")} size="sm" type="button" variant="ghost">
                  Clear
                </Button>
                <Button disabled={isBusy} onClick={() => setInputText(samplePreviewText)} size="sm" type="button" variant="ghost">
                  <Wand2 className="h-4 w-4" />
                  Sample
                </Button>
                <Button disabled={isBusy || !inputText.trim()} onClick={handleGenerate} type="button">
                  <span>{isTranslating ? "Translating..." : "Translate lyrics"}</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="flex h-full flex-col">
        <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
          <div className="max-w-xl space-y-2">
            <p className="text-sm font-medium text-[var(--text-muted)]">{rightPanelCopy.eyebrow}</p>
            <CardTitle>{rightPanelCopy.title}</CardTitle>
            <CardDescription>{rightPanelCopy.description}</CardDescription>
          </div>

          <Badge variant="secondary">Model output</Badge>
        </CardHeader>

        <CardContent className="flex h-full flex-col">
          <div
            ref={previewScrollRef}
            onScroll={handlePreviewScroll}
            className={`panel-scroll overflow-y-auto rounded-[24px] border border-[var(--border-subtle)] bg-[var(--surface-soft)] p-5 ${panelHeightClass}`}
          >
            {isWaitingResponse ? (
              <div className="flex h-full min-h-full flex-col justify-center rounded-[20px] border border-dashed border-[var(--border-subtle)] px-6">
                <div className="mx-auto w-full max-w-lg space-y-4">
                  <div className="flex items-center justify-center">
                    <Badge variant="secondary">Sending lyrics to translation model</Badge>
                  </div>
                  <p className="text-center text-2xl font-semibold">Working on your translation...</p>
                  <p className="text-center text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
                    Real model responses can take a little time. The translated lyrics will start appearing here as soon
                    as a response is ready.
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
                    <p
                      key={`${line}-${index}`}
                      className="animate-[fadeInUp_0.45s_ease-out] text-base leading-8 text-[var(--text-primary)] sm:text-[1.05rem]"
                    >
                      {line}
                    </p>
                  ) : (
                    <div key={`break-${index}`} className="h-3" />
                  ),
                )}

                {isAnimating && <span className="inline-block h-6 w-1.5 animate-pulse rounded-full bg-[var(--accent-soft)] align-middle" />}
              </div>
            ) : (
              <div className="flex h-full min-h-full flex-col items-center justify-center rounded-[20px] border border-dashed border-[var(--border-subtle)] px-6 text-center">
                <p className="text-2xl font-semibold">{isTranslating ? "Translating lyrics..." : "Waiting for model output."}</p>
                <p className="mt-3 max-w-md text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
                  Write lyrics on the left and run the translation. The returned output appears here gradually, and the
                  preview follows the latest text unless you scroll away.
                </p>
              </div>
            )}
          </div>

            <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-muted)] px-4 py-3 text-sm text-[var(--text-secondary)]">
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
                    <Button disabled={isBusy} onClick={handleJumpToLatest} size="sm" type="button" variant="secondary">
                      Jump to latest
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button disabled={isBusy || !visibleText.trim()} onClick={handleCopy} type="button" variant="secondary">
                  <Copy className="h-4 w-4" />
                  <span>Copy visible</span>
                </Button>
                <Button disabled={isBusy || !visibleText.trim()} onClick={handleDownload} type="button" variant="outline">
                  <ArrowDownToLine className="h-4 w-4" />
                  <span>Download .txt</span>
                </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
