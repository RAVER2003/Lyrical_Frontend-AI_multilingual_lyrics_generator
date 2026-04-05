import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

type TransliterationTabProps = {
  language: string;
  setLanguage: (lang: string) => void;
  isLangOpen: boolean;
  setIsLangOpen: (open: boolean) => void;
  hasTranslatedLyrics: boolean;
  isTransliterating: boolean;
  onTransliterate: (language: string) => void;
};

export function TransliterationTab({
  language,
  setLanguage,
  isLangOpen,
  setIsLangOpen,
  hasTranslatedLyrics,
  isTransliterating,
  onTransliterate,
}: TransliterationTabProps) {
  return (
    <div className="flex h-full flex-col gap-4 rounded-[22px] border border-[var(--border-strong)] bg-transparent p-5 animate-in fade-in">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-[var(--text-primary)]">Target Dialect</label>
        <div className="relative">
          <button
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="w-full appearance-none rounded-xl border border-[var(--border-strong)] bg-[var(--surface-raised)] pl-4 pr-10 py-3 text-left text-sm font-medium text-[var(--text-primary)] shadow-[var(--field-shadow)] outline-none transition-all hover:bg-[var(--surface-muted)] focus:border-[var(--ring-color)] focus:shadow-[var(--field-focus-shadow)] cursor-pointer"
            type="button"
          >
            {language === "english" ? "English (Default)" : language === "marathi" ? "Marathi" : "Hindi"}
          </button>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-[var(--text-muted)]">
            <ChevronDown className={`h-4 w-4 transition-transform ${isLangOpen ? "rotate-180" : ""}`} />
          </div>
          
          {isLangOpen && (
            <>
              <div 
                className="fixed inset-0 z-[80]" 
                onClick={() => setIsLangOpen(false)} 
              />
              <div className="absolute z-[90] mt-2 w-full flex flex-col gap-1 rounded-xl border border-[var(--border-strong)] bg-[color-mix(in_oklab,var(--surface-raised)_95%,white)] p-1.5 shadow-lg backdrop-blur-md dark:bg-[color-mix(in_oklab,var(--surface-raised)_95%,black)]">
                {[
                  { id: "english", label: "English (Default)" },
                  { id: "marathi", label: "Marathi" },
                  { id: "hindi", label: "Hindi" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setLanguage(opt.id);
                      setIsLangOpen(false);
                    }}
                    className={`w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                      language === opt.id 
                        ? "[background:var(--button-primary)] text-[var(--button-primary-text)] shadow-sm" 
                        : "text-[var(--text-primary)] hover:bg-[var(--surface-muted)]"
                    }`}
                    type="button"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      
      <div className="flex flex-1 flex-col gap-2 min-h-0">
        <label className="text-sm font-medium text-[var(--text-primary)]">Area for transliteration</label>
        <div className="flex flex-1 items-center justify-center rounded-[16px] border border-dashed border-[var(--border-strong)] bg-[var(--surface-soft)] p-4 text-sm text-[var(--text-muted)] overflow-y-auto">
          Transliteration Preview Area
        </div>
      </div>
      
      <Button 
        className="mt-auto h-auto w-full shrink-0 rounded-xl py-3 text-[0.85rem] font-medium tracking-wide"
        disabled={!hasTranslatedLyrics || isTransliterating}
        onClick={() => onTransliterate(language)}
      >
        {isTransliterating ? "Transliterating..." : "Perform Transliteration"}
      </Button>
    </div>
  );
}
