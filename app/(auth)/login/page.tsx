"use client";

import { Suspense, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Eye, EyeOff, LogIn, Loader2 } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const _next = searchParams.get("next") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await login(email, password);
      if (result.error) setError(result.error);
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-105">
        {/* Logo / Brand */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex items-center justify-center">
            <Image
              src="/public/images/navbar-company-logo.svg"
              alt="Roméga Solutions"
              width={180}
              height={48}
              className="object-contain"
              priority
            />
          </div>
          <h1
            className="text-xl font-bold leading-tight"
            style={{
              fontFamily: "var(--font-serif), serif",
              color: "var(--color-foreground)",
            }}
          >
            Applicant Tracking System
          </h1>
          <p className="mt-1.5 text-sm" style={{ color: "var(--color-foreground-muted)" }}>
            Sign in to your hiring platform
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl border bg-white p-8"
          style={{
            borderColor: "var(--color-border)",
            boxShadow: "var(--shadow-elevated)",
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error banner */}
            {error && (
              <div
                className="flex items-start gap-2.5 rounded-lg border px-3.5 py-3 text-sm"
                style={{
                  background: "#fef2f2",
                  borderColor: "#fca5a5",
                  color: "#991b1b",
                }}
              >
                <span className="mt-px shrink-0 text-base leading-none">⚠</span>
                {error}
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-sm font-medium"
                style={{ color: "var(--color-foreground)" }}
              >
                Work email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@romega.com"
                disabled={isPending}
                className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition-all"
                style={{
                  borderColor: "var(--color-border)",
                  color: "var(--color-foreground)",
                  backgroundColor: "var(--color-surface)",
                }}
                onFocus={(e) =>
                  (e.target.style.boxShadow = `0 0 0 3px color-mix(in srgb, var(--color-primary) 20%, transparent)`)
                }
                onBlur={(e) => (e.target.style.boxShadow = "none")}
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-sm font-medium"
                style={{ color: "var(--color-foreground)" }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isPending}
                  className="w-full rounded-lg border py-2.5 pl-3.5 pr-10 text-sm outline-none transition-all"
                  style={{
                    borderColor: "var(--color-border)",
                    color: "var(--color-foreground)",
                    backgroundColor: "var(--color-surface)",
                  }}
                  onFocus={(e) =>
                    (e.target.style.boxShadow = `0 0 0 3px color-mix(in srgb, var(--color-primary) 20%, transparent)`)
                  }
                  onBlur={(e) => (e.target.style.boxShadow = "none")}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 transition-colors"
                  style={{ color: "var(--color-foreground-subtle)" }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all"
              style={{
                background: isPending
                  ? "var(--color-primary-hover)"
                  : "var(--color-primary)",
                color: "var(--color-primary-foreground)",
                opacity: isPending ? 0.85 : 1,
                cursor: isPending ? "not-allowed" : "pointer",
              }}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Sign in
                </>
              )}
            </button>
          </form>

          {/* Demo hint */}
          <div
            className="mt-6 rounded-lg border p-3.5 text-xs"
            style={{
              background: "var(--color-primary-muted)",
              borderColor: "var(--color-primary-subtle)",
              color: "var(--color-foreground-muted)",
            }}
          >
            <p className="font-semibold mb-1" style={{ color: "var(--color-foreground)" }}>
              Demo credentials
            </p>
            <div className="space-y-0.5">
              <p>
                <span className="font-medium">Admin:</span> ken@romega.com / admin123
              </p>
              <p>
                <span className="font-medium">Recruiter:</span> sarah@romega.com / recruiter123
              </p>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs" style={{ color: "var(--color-foreground-subtle)" }}>
          © {new Date().getFullYear()} Romega Solutions. Internal use only.
        </p>
      </div>
    </div>
  );
}
