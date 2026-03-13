import { and, asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { workspaceMemberships, workspaces } from "@/drizzle/schema";

export async function getUserWorkspace(userId: string) {
  const [record] = await db
    .select({
      workspaceId: workspaceMemberships.workspaceId,
      workspaceName: workspaces.name,
      workspaceSlug: workspaces.slug,
      timezone: workspaces.timezone,
    })
    .from(workspaceMemberships)
    .innerJoin(workspaces, eq(workspaceMemberships.workspaceId, workspaces.id))
    .where(
      and(
        eq(workspaceMemberships.userId, userId),
        eq(workspaceMemberships.isActive, true),
        eq(workspaceMemberships.membershipStatus, "active")
      )
    )
    .orderBy(asc(workspaceMemberships.createdAt))
    .limit(1);

  return record ?? null;
}
