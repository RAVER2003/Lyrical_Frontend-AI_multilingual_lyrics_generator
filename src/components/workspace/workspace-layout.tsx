import type { ReactNode } from "react";

type WorkspaceLayoutProps = {
  isLargeScreen: boolean;
  isLeftOpen: boolean;
  isRightOpen: boolean;
  leftRailWidth: number;
  rightRailWidth: number;
  leftSidebarWidth: string;
  rightSidebarWidth: string;
  leftSidebar: ReactNode;
  mainContent: ReactNode;
  rightSidebar: ReactNode;
};

export function WorkspaceLayout({
  isLargeScreen,
  isLeftOpen,
  isRightOpen,
  leftRailWidth,
  rightRailWidth,
  leftSidebarWidth,
  rightSidebarWidth,
  leftSidebar,
  mainContent,
  rightSidebar,
}: WorkspaceLayoutProps) {
  const layoutColumns = isLargeScreen
    ? `${isLeftOpen ? leftSidebarWidth : `${leftRailWidth}px`} minmax(0, 1fr) ${isRightOpen ? rightSidebarWidth : `${rightRailWidth}px`}`
    : "minmax(0, 1fr)";

  return (
    <div
      className={[
        "relative grid min-h-0 flex-1 gap-0 transition-[grid-template-columns] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
        isLargeScreen ? "overflow-hidden" : "overflow-visible",
      ].join(" ")}
      style={{ gridTemplateColumns: layoutColumns }}
    >
      {leftSidebar}
      {mainContent}
      {rightSidebar}
    </div>
  );
}
