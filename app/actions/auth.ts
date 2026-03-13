"use server";

import { db } from "@/lib/db";
import { appUsers } from "@/drizzle/schema";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function upsertAppUserFromAuth(args: {
  userId: string;
  email: string;
  displayName: string;
  avatarUrl?: string | null;
}) {
  await db
    .insert(appUsers)
    .values({
      id: args.userId,
      displayName: args.displayName,
      email: args.email,
      avatarUrl: args.avatarUrl ?? null,
    })
    .onConflictDoUpdate({
      target: appUsers.id,
      set: {
        displayName: args.displayName,
        email: args.email,
        avatarUrl: args.avatarUrl ?? null,
        updatedAt: new Date(),
      },
    });
}

export async function signInWithPasswordAction(
  email: string,
  password: string
): Promise<{ error?: string }> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { error: "Supabase public env is not configured. Restart dev server after setting .env." };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  const user = data.user;
  if (!user?.id) {
    return { error: "Unable to load user account." };
  }

  const userEmail = user.email ?? email;
  const metaName =
    (typeof user.user_metadata?.display_name === "string" && user.user_metadata.display_name) ||
    (typeof user.user_metadata?.name === "string" && user.user_metadata.name) ||
    userEmail.split("@")[0] ||
    "User";

  await upsertAppUserFromAuth({
    userId: user.id,
    displayName: metaName,
    email: userEmail,
    avatarUrl: typeof user.user_metadata?.avatar_url === "string" ? user.user_metadata.avatar_url : null,
  });

  return {};
}

export async function signUpWithPasswordAction(args: {
  fullName: string;
  email: string;
  password: string;
}): Promise<{ error?: string; requiresEmailConfirm?: boolean }> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { error: "Supabase public env is not configured. Restart dev server after setting .env." };
  }

  const normalizedEmail = args.email.trim().toLowerCase();
  const fullName = args.fullName.trim();
  if (!fullName) {
    return { error: "Full name is required." };
  }

  if (args.password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const { data, error } = await supabase.auth.signUp({
    email: normalizedEmail,
    password: args.password,
    options: {
      data: {
        display_name: fullName,
        name: fullName,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.user?.id) {
    await upsertAppUserFromAuth({
      userId: data.user.id,
      displayName: fullName,
      email: data.user.email ?? normalizedEmail,
      avatarUrl:
        typeof data.user.user_metadata?.avatar_url === "string"
          ? data.user.user_metadata.avatar_url
          : null,
    });
  }

  if (!data.session) {
    return { requiresEmailConfirm: true };
  }

  return {};
}

export async function signOutAction(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return;
  await supabase.auth.signOut();
}
