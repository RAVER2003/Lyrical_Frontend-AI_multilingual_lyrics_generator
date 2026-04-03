import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type HomeWelcomeProps = {
  userName: string;
  onNewChat: () => void;
};

export function HomeWelcome({ userName, onNewChat }: HomeWelcomeProps) {
  return (
    <div className="flex h-[80dvh] max-h-[80dvh] min-h-0 flex-1 flex-col items-center justify-center p-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="text-center space-y-8 max-w-xl w-full select-none">
        
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[32px] bg-[linear-gradient(135deg,var(--surface-raised),var(--surface-soft))] border border-[var(--border-strong)] shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_15px_30px_rgba(0,0,0,0.08)] mb-8 transition-transform hover:scale-105 duration-300">
             <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-strong)] shadow-[0_0_20px_var(--accent-soft)]"></div>
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-[var(--text-primary)] md:text-5xl drop-shadow-sm">
          Welcome back, {userName}
        </h1>
        <p className="text-[1.1rem] text-[var(--text-secondary)] leading-relaxed">
          Create a new workspace to begin translating, editing, and mapping your lyrics dynamically.
        </p>
        
        <div className="pt-8 flex justify-center">
          <Button 
            onClick={onNewChat}
            className="group relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-strong)] px-10 py-7 text-[1.1rem] font-bold tracking-wide text-white shadow-[0_12px_28px_color-mix(in_oklab,var(--accent-strong)_30%,transparent)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_35px_color-mix(in_oklab,var(--accent-strong)_40%,transparent)] active:scale-95"
          >
            <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100 mix-blend-overlay"></div>
            <span className="flex items-center gap-3 relative z-10">
              <Plus className="h-6 w-6" strokeWidth={2.5} />
              Create new chat
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
