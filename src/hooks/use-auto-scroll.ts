import { useEffect, useState, type RefObject } from "react";

export function useAutoScroll(
  containerRef: RefObject<HTMLDivElement | null>,
  dependencyCount: number,
  isAnimating: boolean
) {
  const [shouldAutoFollow, setShouldAutoFollow] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !shouldAutoFollow) {
      return;
    }

    container.scrollTo({
      top: container.scrollHeight,
      behavior: isAnimating ? "smooth" : "auto",
    });
  }, [dependencyCount, isAnimating, shouldAutoFollow, containerRef]);

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    // Tolerance of 48px to remain "locked" to the bottom
    setShouldAutoFollow(distanceFromBottom < 48);
  };

  const jumpToLatest = () => {
    const container = containerRef.current;
    if (!container) return;

    setShouldAutoFollow(true);
    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  };

  return {
    shouldAutoFollow,
    setShouldAutoFollow,
    handleScroll,
    jumpToLatest,
  };
}
