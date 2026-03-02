import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const base =
  "flex h-9 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-foreground-subtle)] transition-colors focus-visible:outline-none focus-visible:border-[var(--color-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20 disabled:cursor-not-allowed disabled:opacity-50";

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, leftIcon, rightIcon, ...props }, ref) => {
    if (leftIcon || rightIcon) {
      return (
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="pointer-events-none absolute left-3 text-[var(--color-foreground-subtle)]">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(base, leftIcon ? "pl-9" : "", rightIcon ? "pr-9" : "", className)}
            {...props}
          />
          {rightIcon && (
            <div className="pointer-events-none absolute right-3 text-[var(--color-foreground-subtle)]">
              {rightIcon}
            </div>
          )}
        </div>
      );
    }

    return <input ref={ref} className={cn(base, className)} {...props} />;
  }
);

Input.displayName = "Input";
export { Input };
