import { useState, useEffect, useRef, useCallback } from "react";

export function useTypewriter(renderedLines: string[], speedMs = 220) {
  const [visibleLineCount, setVisibleLineCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const revealTimerRef = useRef<number | null>(null);

  const startAnimation = useCallback(() => {
    setIsAnimating(true);
  }, []);

  const stopAnimation = useCallback(() => {
    if (revealTimerRef.current) {
      window.clearInterval(revealTimerRef.current);
      revealTimerRef.current = null;
    }
    setIsAnimating(false);
  }, []);

  const resetCount = useCallback((count: number = 0) => {
    setVisibleLineCount(count);
  }, []);

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
    }, speedMs);

    return () => {
      if (revealTimerRef.current) {
        window.clearInterval(revealTimerRef.current);
      }
      revealTimerRef.current = null;
    };
  }, [isAnimating, renderedLines, speedMs]);

  const visibleLines = renderedLines.slice(0, visibleLineCount);

  return {
    visibleLineCount,
    visibleLines,
    isAnimating,
    startAnimation,
    stopAnimation,
    resetCount,
  };
}
