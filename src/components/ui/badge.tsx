import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--ring-color)] focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-[var(--border-subtle)] bg-[var(--surface-raised)] text-[var(--text-secondary)]",
        secondary: "border-[var(--border-subtle)] bg-[var(--surface-muted)] text-[var(--text-secondary)]",
        outline: "border-[var(--border-strong)] text-[var(--text-secondary)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
