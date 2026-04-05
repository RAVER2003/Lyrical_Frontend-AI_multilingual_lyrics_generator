import { Button } from "@/components/ui/button";
import type { EditingContext } from "@/components/workspace/types";

type EditLyricsTabProps = {
  editingContext: EditingContext;
  editWordInput: string;
  setEditWordInput: (val: string) => void;
  onCancelEdit: () => void;
  onConfirmEdit: (newWord: string) => void;
};

export function EditLyricsTab({
  editingContext,
  editWordInput,
  setEditWordInput,
  onCancelEdit,
  onConfirmEdit,
}: EditLyricsTabProps) {
  return (
    <div className="flex h-full flex-col px-1 animate-in fade-in slide-in-from-right-2">
       <div className="flex flex-1 flex-col justify-between rounded-[22px] border border-[var(--border-strong)] bg-[var(--surface-soft)] p-5 shadow-sm">
         <div className="space-y-4">
           <p className="text-[0.8rem] font-bold uppercase tracking-widest text-[var(--text-muted)] border-b border-[var(--border-subtle)] pb-2">
             Edit View
           </p>
           <div className="flex flex-wrap items-center gap-x-2 gap-y-3 text-sm text-[var(--text-primary)] leading-loose">
             {editingContext.prevWords.split(" ").filter(Boolean).map((word: string, i: number) => (
               <span key={`prev-${i}`} className="cursor-not-allowed opacity-60">{word}</span>
             ))}
             
             <input 
               type="text" 
               className="flex items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--input-bg)] px-2 py-1 text-center font-bold text-[var(--text-primary)] shadow-[var(--field-shadow)] outline-none transition-all focus:shadow-[var(--field-focus-shadow)] min-w-[80px]"
               value={editWordInput}
               onChange={(e) => setEditWordInput(e.target.value)}
             />
             
             {editingContext.nextWords.split(" ").filter(Boolean).map((word: string, i: number) => (
               <span key={`next-${i}`} className="cursor-not-allowed opacity-60">{word}</span>
             ))}
           </div>
         </div>

         <div className="flex gap-3 pt-6 shrink-0 mt-auto">
           <Button onClick={onCancelEdit} variant="outline" className="flex-1 rounded-full border border-[var(--border-strong)] bg-transparent">
             Cancel
           </Button>
           <Button onClick={() => onConfirmEdit(editWordInput)} className="flex-1 rounded-full">
             Confirm
           </Button>
         </div>
       </div>
    </div>
  );
}
