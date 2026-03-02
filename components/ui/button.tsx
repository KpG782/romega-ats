import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, disabled, children, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/50 focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--color-background)] disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer whitespace-nowrap";

    const variants = {
      primary:
        "bg-[#007bff] hover:bg-[#0056b3] text-white border border-[#007bff] shadow-[0_4px_14px_0_rgba(0,123,255,0.39)]",
      secondary:
        "bg-[var(--rs-primary-100)] text-[var(--rs-primary-600)] border-2 border-[var(--rs-primary-600)] hover:bg-[#007bff] hover:text-white hover:border-[#007bff]",
      ghost:
        "hover:bg-[var(--color-surface-elevated)] text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)]",
      danger:
        "bg-[var(--color-danger)] hover:bg-red-600 text-white shadow-sm",
      outline:
        "border border-[var(--color-border)] hover:bg-[var(--color-surface-elevated)] text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)]",
    };

    const sizes = {
      sm:   "h-10 px-4 text-sm",
      md:   "h-12 px-5 text-base",
      lg:   "h-14 px-8 text-lg",
      icon: "h-9 w-9",
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            {children}
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
export { Button };
