"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  signInWithPasswordAction,
  signOutAction,
  signUpWithPasswordAction,
} from "@/app/actions/auth";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Recruiter" | "Hiring Manager";
  avatar?: string;
  workspaceId?: string;
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, nextPath?: string) => Promise<{ error?: string }>;
  signup: (args: {
    fullName: string;
    email: string;
    password: string;
    nextPath?: string;
  }) => Promise<{ error?: string; requiresEmailConfirm?: boolean }>;
  logout: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

function mapRole(code: string | null | undefined): User["role"] {
  if (code === "admin") return "Admin";
  if (code === "hiring_manager") return "Hiring Manager";
  return "Recruiter";
}

async function loadAuthenticatedUser(): Promise<User | null> {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) return null;

  const {
    data: { user: authUser },
    error,
  } = await supabase.auth.getUser();

  if (error || !authUser) {
    return null;
  }

  const [{ data: appUser }, { data: membership }] = await Promise.all([
    supabase
      .from("app_users")
      .select("display_name,email,avatar_url")
      .eq("id", authUser.id)
      .maybeSingle(),
    supabase
      .from("workspace_memberships")
      .select("workspace_id")
      .eq("user_id", authUser.id)
      .eq("is_active", true)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle(),
  ]);

  const workspaceId = membership?.workspace_id ?? undefined;

  let roleCode: string | null = null;
  if (workspaceId) {
    const { data: assignment } = await supabase
      .from("user_role_assignments")
      .select("role_id")
      .eq("workspace_id", workspaceId)
      .eq("user_id", authUser.id)
      .limit(1)
      .maybeSingle();

    if (assignment?.role_id) {
      const { data: role } = await supabase
        .from("roles")
        .select("code")
        .eq("id", assignment.role_id)
        .maybeSingle();

      roleCode = role?.code ?? null;
    }
  }

  const email = appUser?.email ?? authUser.email ?? "";
  const fallbackName =
    (typeof authUser.user_metadata?.display_name === "string" && authUser.user_metadata.display_name) ||
    (typeof authUser.user_metadata?.name === "string" && authUser.user_metadata.name) ||
    email.split("@")[0] ||
    "User";

  return {
    id: authUser.id,
    name: appUser?.display_name ?? fallbackName,
    email,
    role: mapRole(roleCode),
    avatar: appUser?.avatar_url ?? undefined,
    workspaceId,
  };
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const hasBrowserSupabase = !!createSupabaseBrowserClient();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(hasBrowserSupabase);

  const refreshUser = useCallback(async () => {
    const nextUser = await loadAuthenticatedUser();
    setUser(nextUser);
    return nextUser;
  }, []);

  useEffect(() => {
    let mounted = true;
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      return;
    }

    const bootstrap = async () => {
      const nextUser = await loadAuthenticatedUser();
      if (!mounted) return;
      setUser(nextUser);
      setIsLoading(false);
    };

    bootstrap();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async () => {
      const nextUser = await loadAuthenticatedUser();
      if (!mounted) return;
      setUser(nextUser);
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(
    async (email: string, password: string, nextPath = "/dashboard"): Promise<{ error?: string }> => {
      setIsLoading(true);

      const result = await signInWithPasswordAction(email, password);
      if (result.error) {
        setIsLoading(false);
        return result;
      }

      const nextUser = await refreshUser();
      setIsLoading(false);

      const safeNext = nextPath.startsWith("/") ? nextPath : "/dashboard";
      router.push(nextUser?.workspaceId ? safeNext : "/onboarding");
      return {};
    },
    [refreshUser, router]
  );

  const signup = useCallback(
    async (args: {
      fullName: string;
      email: string;
      password: string;
      nextPath?: string;
    }): Promise<{ error?: string; requiresEmailConfirm?: boolean }> => {
      setIsLoading(true);

      const result = await signUpWithPasswordAction({
        fullName: args.fullName,
        email: args.email,
        password: args.password,
      });

      if (result.error) {
        setIsLoading(false);
        return result;
      }

      if (result.requiresEmailConfirm) {
        setIsLoading(false);
        return { requiresEmailConfirm: true };
      }

      const nextUser = await refreshUser();
      setIsLoading(false);

      const targetPath = args.nextPath?.startsWith("/") ? args.nextPath : "/dashboard";
      router.push(nextUser?.workspaceId ? targetPath : "/onboarding");
      return {};
    },
    [refreshUser, router]
  );

  const logout = useCallback(async () => {
    setIsLoading(true);

    try {
      await signOutAction();
    } catch {
      // Continue client-side cleanup even if server signout fails.
    }

    try {
      const supabase = createSupabaseBrowserClient();
      if (supabase) {
        await supabase.auth.signOut();
      }
    } catch {
      // Continue local cleanup and redirect on any client signout error.
    }

    setUser(null);
    setIsLoading(false);
    router.replace("/login");
    router.refresh();
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
