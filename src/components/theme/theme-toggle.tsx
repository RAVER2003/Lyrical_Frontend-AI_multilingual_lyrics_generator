import { Moon, SunMedium } from "lucide-react"

import { useTheme } from "@/components/theme/theme-provider"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isLight = theme === "light"

  return (
    <Button onClick={toggleTheme} type="button" variant="outline">
      {isLight ? <Moon className="h-4 w-4" /> : <SunMedium className="h-4 w-4" />}
      <span>{isLight ? "Dark mode" : "Light mode"}</span>
    </Button>
  )
}
