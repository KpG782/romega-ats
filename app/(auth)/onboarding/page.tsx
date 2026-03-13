"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createWorkspaceAction } from "@/app/actions/workspace";

export default function OnboardingPage() {
  const router = useRouter();
  const [workspaceName, setWorkspaceName] = useState("");
  const [timezone, setTimezone] = useState("Asia/Manila");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await createWorkspaceAction({
        name: workspaceName,
        timezone,
      });

      if (result.error) {
        setError(result.error);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-surface p-8 shadow-(--shadow-elevated)">
        <h1 className="text-xl font-semibold text-foreground">Set up your workspace</h1>
        <p className="mt-2 text-sm text-foreground-muted">
          Create your first workspace to continue to the ATS dashboard.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="workspaceName" className="block text-sm font-medium text-foreground">
              Workspace name
            </label>
            <input
              id="workspaceName"
              type="text"
              required
              value={workspaceName}
              onChange={(event) => setWorkspaceName(event.target.value)}
              placeholder="Romega Solutions"
              className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground outline-none transition-all focus-visible:border-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="timezone" className="block text-sm font-medium text-foreground">
              Timezone
            </label>
            <select
              id="timezone"
              value={timezone}
              onChange={(event) => setTimezone(event.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground outline-none transition-all focus-visible:border-primary"
            >
              <option value="Asia/Manila">Asia/Manila</option>
              <option value="Asia/Singapore">Asia/Singapore</option>
              <option value="Asia/Tokyo">Asia/Tokyo</option>
              <option value="UTC">UTC</option>
              <option value="America/Los_Angeles">America/Los_Angeles</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating workspace...
              </>
            ) : (
              "Continue to dashboard"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
