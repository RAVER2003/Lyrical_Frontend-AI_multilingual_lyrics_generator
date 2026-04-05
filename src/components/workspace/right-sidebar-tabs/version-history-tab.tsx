import { Button } from "@/components/ui/button";
import type { VersionMetadata } from "@/components/workspace/types";

type VersionHistoryTabProps = {
  versions: VersionMetadata[];
  onSelectVersion: (id: string) => void;
  isFetchingVersion: boolean;
  onDeleteHistory: () => void;
  isDeletingHistory: boolean;
};

export function VersionHistoryTab({
  versions,
  onSelectVersion,
  isFetchingVersion,
  onDeleteHistory,
  isDeletingHistory,
}: VersionHistoryTabProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden animate-in fade-in px-1">
       <div className="panel-scroll flex-1 space-y-2 sm:space-y-3 overflow-y-auto rounded-[16px] sm:rounded-[20px] border border-[var(--border-strong)] bg-[var(--surface-soft)] p-2 sm:p-3 shadow-inner">
          {versions.map((version) => (
            <button 
              key={version.id} 
              onClick={() => onSelectVersion(version.id)}
              disabled={isFetchingVersion}
              className="flex flex-col w-full cursor-pointer justify-start rounded-[12px] sm:rounded-[14px] border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-3 py-2.5 sm:px-4 sm:py-3.5 text-left shadow-[var(--field-shadow)] transition hover:border-[var(--text-muted)] hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group/version relative overflow-hidden"
            >
              <span className="text-[0.75rem] sm:text-[0.85rem] font-bold text-[var(--text-primary)] truncate z-10 w-full">{version.label}</span>
              <span className="text-[0.55rem] sm:text-[0.65rem] uppercase font-bold text-[var(--text-muted)] mt-1 sm:mt-1.5 tracking-wider z-10">
                {new Date(version.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}
              </span>
              
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[color-mix(in_oklab,var(--text-muted)_5%,transparent)] to-transparent -translate-x-full group-hover/version:translate-x-full transition-transform duration-1000 z-0"></div>
            </button>
          ))}
          
          {versions.length === 0 && (
            <div className="flex h-full items-center justify-center p-4 text-center text-xs sm:text-sm text-[var(--text-muted)]">
              No history captured yet. Try translating something!
            </div>
          )}
       </div>
       <div className="mt-3 sm:mt-4 shrink-0">
         <Button 
           onClick={onDeleteHistory}
           disabled={isDeletingHistory || versions.length === 0}
           variant="ghost" 
           className="w-full rounded-xl border border-rose-200/50 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-400 dark:hover:bg-rose-950/60 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm h-9 sm:h-10"
         >
           {isDeletingHistory ? "Deleting History..." : "Delete History"}
         </Button>
       </div>
    </div>
  );
}
