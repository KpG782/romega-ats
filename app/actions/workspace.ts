"use server";

import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  appUsers,
  internalToolCategories,
  internalTools,
  roles,
  userRoleAssignments,
  workspaceMemberships,
  workspaces,
} from "@/drizzle/schema";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getUserWorkspace } from "@/lib/queries/workspace";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

async function getUniqueWorkspaceSlug(name: string) {
  const base = slugify(name) || "workspace";
  let slug = base;

  for (let i = 0; i < 10; i += 1) {
    const [existing] = await db
      .select({ id: workspaces.id })
      .from(workspaces)
      .where(eq(workspaces.slug, slug))
      .limit(1);

    if (!existing) {
      return slug;
    }

    const suffix = Math.random().toString(36).slice(2, 7);
    slug = `${base}-${suffix}`;
  }

  return `${base}-${Date.now().toString(36)}`;
}

async function ensureAdminRoleId() {
  const [existingRole] = await db
    .select({ id: roles.id })
    .from(roles)
    .where(eq(roles.code, "admin"))
    .limit(1);

  if (existingRole) {
    return existingRole.id;
  }

  const [createdRole] = await db
    .insert(roles)
    .values({
      code: "admin",
      label: "Admin",
      description: "Workspace administrator",
    })
    .returning({ id: roles.id });

  return createdRole.id;
}

export async function createWorkspaceAction(args: {
  name: string;
  timezone: string;
}): Promise<{ error?: string; workspaceId?: string }> {
  try {
    const workspaceName = args.name.trim();
    if (!workspaceName) {
      return { error: "Workspace name is required." };
    }

    const timezone = args.timezone.trim() || "Asia/Manila";

    const supabase = await createSupabaseServerClient();
    if (!supabase) {
      return { error: "Supabase public env is not configured." };
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return { error: "You must be signed in to create a workspace." };
    }

    const existingWorkspace = await getUserWorkspace(user.id);
    if (existingWorkspace) {
      return { workspaceId: existingWorkspace.workspaceId };
    }

    const email = user.email ?? `${user.id}@local.invalid`;
    const displayName =
      (typeof user.user_metadata?.display_name === "string" && user.user_metadata.display_name) ||
      (typeof user.user_metadata?.name === "string" && user.user_metadata.name) ||
      email.split("@")[0] ||
      "User";

    await db
      .insert(appUsers)
      .values({
        id: user.id,
        displayName,
        email,
        avatarUrl: typeof user.user_metadata?.avatar_url === "string" ? user.user_metadata.avatar_url : null,
      })
      .onConflictDoUpdate({
        target: appUsers.id,
        set: {
          displayName,
          email,
          avatarUrl: typeof user.user_metadata?.avatar_url === "string" ? user.user_metadata.avatar_url : null,
          updatedAt: new Date(),
        },
      });

    const slug = await getUniqueWorkspaceSlug(workspaceName);
    const adminRoleId = await ensureAdminRoleId();

    const workspaceId = await db.transaction(async (tx) => {
      const [workspace] = await tx
        .insert(workspaces)
        .values({
          name: workspaceName,
          slug,
          timezone,
        })
        .returning({ id: workspaces.id });

      await tx.insert(workspaceMemberships).values({
        workspaceId: workspace.id,
        userId: user.id,
        membershipStatus: "active",
        isActive: true,
        title: "Owner",
      });

      await tx
        .insert(userRoleAssignments)
        .values({
          workspaceId: workspace.id,
          userId: user.id,
          roleId: adminRoleId,
        })
        .onConflictDoNothing();

      const categoryRows = await tx
        .select({ id: internalToolCategories.id })
        .from(internalToolCategories)
        .orderBy(asc(internalToolCategories.displayOrder));

      const categoryId = categoryRows[0]?.id;
      if (categoryId) {
        await tx
          .insert(internalTools)
          .values([
            {
              workspaceId: workspace.id,
              categoryId,
              name: "Romega Email Signature Generator",
              description: "Generate standardized Romega email signatures.",
              url: "https://romega-email-signature.vercel.app/",
              iconKey: "mail",
              sortOrder: 10,
              isActive: true,
              openInNewTab: true,
              createdByUserId: user.id,
              updatedByUserId: user.id,
            },
            {
              workspaceId: workspace.id,
              categoryId,
              name: "Romega Certificate Generator",
              description: "Generate certificates for training and onboarding.",
              url: "https://romega-certificate-creator-71vj.vercel.app/",
              iconKey: "award",
              sortOrder: 20,
              isActive: true,
              openInNewTab: true,
              createdByUserId: user.id,
              updatedByUserId: user.id,
            },
          ])
          .onConflictDoNothing({
            target: [internalTools.workspaceId, internalTools.name],
          });
      }

      return workspace.id;
    });

    return { workspaceId };
  } catch (error) {
    console.error("createWorkspaceAction failed", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Unable to create workspace right now. Please try again." };
  }
}
