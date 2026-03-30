import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      position="bottom-right"
      richColors={false}
      theme="light"
      toastOptions={{
        classNames: {
          toast:
            "border border-[var(--border-subtle)] bg-[var(--surface-raised)] text-[var(--text-primary)] shadow-[0_18px_45px_rgba(15,23,42,0.16)]",
          description: "text-[var(--text-secondary)]",
          actionButton: "bg-[var(--button-primary)] text-[var(--button-primary-text)]",
          cancelButton: "bg-[var(--surface-muted)] text-[var(--text-primary)]",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
