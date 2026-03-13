import { relations, sql } from "drizzle-orm";
import {
  boolean,
  char,
  check,
  date,
  index,
  integer,
  jsonb,
  numeric,
  pgSchema,
  pgTable,
  smallint,
  text,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

const auth = pgSchema("auth");

export const authUsers = auth.table("users", {
  id: uuid("id").primaryKey(),
});

export const workspaces = pgTable(
  "workspaces",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    timezone: text("timezone").notNull().default("Asia/Manila"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("workspaces_slug_key").on(table.slug)]
);

export const appUsers = pgTable(
  "app_users",
  {
    id: uuid("id")
      .primaryKey()
      .references(() => authUsers.id, { onDelete: "cascade" }),
    displayName: text("display_name").notNull(),
    email: text("email").notNull(),
    avatarUrl: text("avatar_url"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    check("app_users_email_format", sql`position('@' in ${table.email}) > 1`),
    uniqueIndex("uq_app_users_email_lower").on(sql`lower(${table.email})`),
  ]
);

export const roles = pgTable(
  "roles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    code: text("code").notNull(),
    label: text("label").notNull(),
    description: text("description"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("roles_code_key").on(table.code)]
);

export const workspaceMemberships = pgTable(
  "workspace_memberships",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => appUsers.id, { onDelete: "cascade" }),
    membershipStatus: text("membership_status").notNull().default("active"),
    title: text("title"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    check(
      "workspace_memberships_status_check",
      sql`${table.membershipStatus} in ('active', 'invited', 'suspended')`
    ),
    unique("uq_workspace_memberships_workspace_user").on(table.workspaceId, table.userId),
    index("idx_workspace_memberships_workspace_user_active").on(table.workspaceId, table.userId, table.isActive),
  ]
);

export const userRoleAssignments = pgTable(
  "user_role_assignments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => appUsers.id, { onDelete: "cascade" }),
    roleId: uuid("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_user_role_assignments").on(table.workspaceId, table.userId, table.roleId),
    index("idx_user_role_assignments_workspace_user").on(table.workspaceId, table.userId),
  ]
);

export const jobStatuses = pgTable(
  "job_statuses",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    code: text("code").notNull(),
    label: text("label").notNull(),
    isTerminal: boolean("is_terminal").notNull().default(false),
    displayOrder: integer("display_order").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("job_statuses_code_key").on(table.code)]
);

export const pipelineStageCatalog = pgTable(
  "pipeline_stage_catalog",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    code: text("code").notNull(),
    label: text("label").notNull(),
    isTerminal: boolean("is_terminal").notNull().default(false),
    displayOrder: integer("display_order").notNull(),
    colorHex: text("color_hex").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("pipeline_stage_catalog_code_key").on(table.code),
    check("pipeline_stage_catalog_color_hex_check", sql`${table.colorHex} ~ '^#[0-9A-Fa-f]{6}$'`),
  ]
);

export const applicationStatuses = pgTable(
  "application_statuses",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    code: text("code").notNull(),
    label: text("label").notNull(),
    isTerminal: boolean("is_terminal").notNull().default(false),
    displayOrder: integer("display_order").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("application_statuses_code_key").on(table.code)]
);

export const candidateSources = pgTable(
  "candidate_sources",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    code: text("code").notNull(),
    label: text("label").notNull(),
    displayOrder: integer("display_order").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("candidate_sources_code_key").on(table.code)]
);

export const talentStatuses = pgTable(
  "talent_statuses",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    code: text("code").notNull(),
    label: text("label").notNull(),
    displayOrder: integer("display_order").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("talent_statuses_code_key").on(table.code)]
);

export const availabilityStatuses = pgTable(
  "availability_statuses",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    code: text("code").notNull(),
    label: text("label").notNull(),
    displayOrder: integer("display_order").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("availability_statuses_code_key").on(table.code)]
);

export const automationTriggerTypes = pgTable(
  "automation_trigger_types",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    code: text("code").notNull(),
    label: text("label").notNull(),
    description: text("description"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("automation_trigger_types_code_key").on(table.code)]
);

export const automationActionTypes = pgTable(
  "automation_action_types",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    code: text("code").notNull(),
    label: text("label").notNull(),
    description: text("description"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("automation_action_types_code_key").on(table.code)]
);

export const internalToolCategories = pgTable(
  "internal_tool_categories",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    code: text("code").notNull(),
    label: text("label").notNull(),
    displayOrder: integer("display_order").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("internal_tool_categories_code_key").on(table.code)]
);

export const departments = pgTable(
  "departments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    code: text("code"),
    hiringManagerUserId: uuid("hiring_manager_user_id").references(() => appUsers.id, { onDelete: "set null" }),
    createdByUserId: uuid("created_by_user_id").references(() => appUsers.id, { onDelete: "set null" }),
    updatedByUserId: uuid("updated_by_user_id").references(() => appUsers.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
  },
  (table) => [
    unique("uq_departments_workspace_name").on(table.workspaceId, table.name),
    index("idx_departments_workspace_name").on(table.workspaceId, table.name),
  ]
);

export const departmentMembers = pgTable(
  "department_members",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    departmentId: uuid("department_id")
      .notNull()
      .references(() => departments.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => appUsers.id, { onDelete: "cascade" }),
    membershipType: text("membership_type").notNull().default("member"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    check(
      "department_membership_type_check",
      sql`${table.membershipType} in ('member', 'manager', 'viewer')`
    ),
    unique("uq_department_members").on(table.workspaceId, table.departmentId, table.userId),
    index("idx_department_members_workspace_department").on(table.workspaceId, table.departmentId),
  ]
);

export const jobs = pgTable(
  "jobs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    departmentId: uuid("department_id")
      .notNull()
      .references(() => departments.id, { onDelete: "restrict" }),
    statusId: uuid("status_id")
      .notNull()
      .references(() => jobStatuses.id, { onDelete: "restrict" }),
    title: text("title").notNull(),
    employmentType: text("employment_type"),
    location: text("location"),
    workSetup: text("work_setup"),
    description: text("description"),
    headcount: integer("headcount").notNull().default(1),
    createdByUserId: uuid("created_by_user_id").references(() => appUsers.id, { onDelete: "set null" }),
    updatedByUserId: uuid("updated_by_user_id").references(() => appUsers.id, { onDelete: "set null" }),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    closedAt: timestamp("closed_at", { withTimezone: true }),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    check("jobs_headcount_check", sql`${table.headcount} > 0`),
    index("idx_jobs_workspace_status").on(table.workspaceId, table.statusId),
    index("idx_jobs_workspace_department").on(table.workspaceId, table.departmentId),
  ]
);

export const jobPipelineStages = pgTable(
  "job_pipeline_stages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    jobId: uuid("job_id")
      .notNull()
      .references(() => jobs.id, { onDelete: "cascade" }),
    stageId: uuid("stage_id")
      .notNull()
      .references(() => pipelineStageCatalog.id, { onDelete: "restrict" }),
    displayOrder: integer("display_order").notNull(),
    isEnabled: boolean("is_enabled").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_job_pipeline_stages_stage").on(table.jobId, table.stageId),
    unique("uq_job_pipeline_stages_order").on(table.jobId, table.displayOrder),
    index("idx_job_pipeline_stages_job_order").on(table.jobId, table.displayOrder),
  ]
);

export const people = pgTable(
  "people",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    fullName: text("full_name").notNull(),
    email: text("email"),
    phone: text("phone"),
    location: text("location"),
    headline: text("headline"),
    summary: text("summary"),
    linkedinUrl: text("linkedin_url"),
    portfolioUrl: text("portfolio_url"),
    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
    createdByUserId: uuid("created_by_user_id").references(() => appUsers.id, { onDelete: "set null" }),
    updatedByUserId: uuid("updated_by_user_id").references(() => appUsers.id, { onDelete: "set null" }),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("uq_people_workspace_email_active")
      .on(table.workspaceId, sql`lower(${table.email})`)
      .where(sql`${table.email} is not null and ${table.archivedAt} is null`),
    index("idx_people_workspace_name").on(table.workspaceId, table.fullName),
  ]
);

export const tags = pgTable(
  "tags",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_tags_workspace_slug").on(table.workspaceId, table.slug),
    index("idx_tags_workspace_name").on(table.workspaceId, table.name),
  ]
);

export const personTags = pgTable(
  "person_tags",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    personId: uuid("person_id")
      .notNull()
      .references(() => people.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_person_tags").on(table.workspaceId, table.personId, table.tagId),
    index("idx_person_tags_workspace_person").on(table.workspaceId, table.personId),
  ]
);

export const applications = pgTable(
  "applications",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    jobId: uuid("job_id")
      .notNull()
      .references(() => jobs.id, { onDelete: "restrict" }),
    personId: uuid("person_id")
      .notNull()
      .references(() => people.id, { onDelete: "restrict" }),
    candidateSourceId: uuid("candidate_source_id").references(() => candidateSources.id, { onDelete: "restrict" }),
    statusId: uuid("status_id")
      .notNull()
      .references(() => applicationStatuses.id, { onDelete: "restrict" }),
    currentStageId: uuid("current_stage_id").references(() => pipelineStageCatalog.id, { onDelete: "restrict" }),
    ownerUserId: uuid("owner_user_id").references(() => appUsers.id, { onDelete: "set null" }),
    score: smallint("score"),
    rating: smallint("rating"),
    summary: text("summary"),
    notes: text("notes"),
    appliedAt: timestamp("applied_at", { withTimezone: true }).notNull().defaultNow(),
    lastActivityAt: timestamp("last_activity_at", { withTimezone: true }),
    createdByUserId: uuid("created_by_user_id").references(() => appUsers.id, { onDelete: "set null" }),
    updatedByUserId: uuid("updated_by_user_id").references(() => appUsers.id, { onDelete: "set null" }),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    check("applications_score_check", sql`${table.score} is null or (${table.score} >= 0 and ${table.score} <= 100)`),
    check("applications_rating_check", sql`${table.rating} is null or (${table.rating} >= 0 and ${table.rating} <= 5)`),
    uniqueIndex("uq_applications_active_person_job")
      .on(table.workspaceId, table.personId, table.jobId)
      .where(sql`${table.archivedAt} is null`),
    index("idx_applications_workspace_stage").on(table.workspaceId, table.currentStageId),
    index("idx_applications_workspace_job").on(table.workspaceId, table.jobId),
    index("idx_applications_workspace_person").on(table.workspaceId, table.personId),
  ]
);

export const applicationStageEvents = pgTable(
  "application_stage_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    applicationId: uuid("application_id")
      .notNull()
      .references(() => applications.id, { onDelete: "cascade" }),
    fromStageId: uuid("from_stage_id").references(() => pipelineStageCatalog.id, { onDelete: "restrict" }),
    toStageId: uuid("to_stage_id")
      .notNull()
      .references(() => pipelineStageCatalog.id, { onDelete: "restrict" }),
    transitionReason: text("transition_reason"),
    transitionMetadata: jsonb("transition_metadata").notNull().default(sql`'{}'::jsonb`),
    movedByUserId: uuid("moved_by_user_id").references(() => appUsers.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_application_stage_events_workspace_application_created").on(
      table.workspaceId,
      table.applicationId,
      table.createdAt
    ),
    index("idx_application_stage_events_workspace_created").on(table.workspaceId, table.createdAt),
  ]
);

export const talentPoolEntries = pgTable(
  "talent_pool_entries",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    personId: uuid("person_id")
      .notNull()
      .references(() => people.id, { onDelete: "restrict" }),
    talentStatusId: uuid("talent_status_id")
      .notNull()
      .references(() => talentStatuses.id, { onDelete: "restrict" }),
    availabilityStatusId: uuid("availability_status_id")
      .notNull()
      .references(() => availabilityStatuses.id, { onDelete: "restrict" }),
    desiredRole: text("desired_role"),
    desiredDepartmentId: uuid("desired_department_id").references(() => departments.id, { onDelete: "set null" }),
    expectedSalary: numeric("expected_salary", { precision: 12, scale: 2 }),
    currencyCode: char("currency_code", { length: 3 }).notNull().default("PHP"),
    score: smallint("score"),
    rating: smallint("rating"),
    notes: text("notes"),
    lastContactedAt: timestamp("last_contacted_at", { withTimezone: true }),
    promotedApplicationId: uuid("promoted_application_id").references(() => applications.id, { onDelete: "set null" }),
    createdByUserId: uuid("created_by_user_id").references(() => appUsers.id, { onDelete: "set null" }),
    updatedByUserId: uuid("updated_by_user_id").references(() => appUsers.id, { onDelete: "set null" }),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    check("talent_pool_score_check", sql`${table.score} is null or (${table.score} >= 0 and ${table.score} <= 100)`),
    check("talent_pool_rating_check", sql`${table.rating} is null or (${table.rating} >= 0 and ${table.rating} <= 5)`),
    uniqueIndex("uq_talent_pool_active_person")
      .on(table.workspaceId, table.personId)
      .where(sql`${table.archivedAt} is null`),
    index("idx_talent_pool_workspace_status").on(table.workspaceId, table.talentStatusId),
    index("idx_talent_pool_workspace_availability").on(table.workspaceId, table.availabilityStatusId),
  ]
);

export const interviews = pgTable(
  "interviews",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    applicationId: uuid("application_id")
      .notNull()
      .references(() => applications.id, { onDelete: "cascade" }),
    interviewerUserId: uuid("interviewer_user_id").references(() => appUsers.id, { onDelete: "set null" }),
    schedulerUserId: uuid("scheduler_user_id").references(() => appUsers.id, { onDelete: "set null" }),
    interviewType: text("interview_type").notNull().default("technical"),
    status: text("status").notNull().default("scheduled"),
    startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
    endsAt: timestamp("ends_at", { withTimezone: true }),
    location: text("location"),
    meetingUrl: text("meeting_url"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    check("interviews_status_check", sql`${table.status} in ('scheduled', 'completed', 'cancelled', 'no_show')`),
    check("interviews_time_check", sql`${table.endsAt} is null or ${table.endsAt} > ${table.startsAt}`),
    index("idx_interviews_workspace_application").on(table.workspaceId, table.applicationId),
  ]
);

export const interviewFeedback = pgTable(
  "interview_feedback",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    interviewId: uuid("interview_id")
      .notNull()
      .references(() => interviews.id, { onDelete: "cascade" }),
    reviewerUserId: uuid("reviewer_user_id")
      .notNull()
      .references(() => appUsers.id, { onDelete: "cascade" }),
    score: smallint("score"),
    recommendation: text("recommendation"),
    notes: text("notes"),
    submittedAt: timestamp("submitted_at", { withTimezone: true }).notNull().defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    check("interview_feedback_score_check", sql`${table.score} is null or (${table.score} >= 0 and ${table.score} <= 100)`),
    check(
      "interview_feedback_recommendation_check",
      sql`${table.recommendation} is null or ${table.recommendation} in ('strong_yes', 'yes', 'no', 'strong_no')`
    ),
    unique("uq_interview_feedback_review").on(table.interviewId, table.reviewerUserId),
  ]
);

export const offers = pgTable(
  "offers",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    applicationId: uuid("application_id")
      .notNull()
      .references(() => applications.id, { onDelete: "cascade" }),
    status: text("status").notNull().default("draft"),
    version: integer("version").notNull().default(1),
    salaryAmount: numeric("salary_amount", { precision: 12, scale: 2 }),
    currencyCode: char("currency_code", { length: 3 }).notNull().default("PHP"),
    startDate: date("start_date"),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    sentAt: timestamp("sent_at", { withTimezone: true }),
    acceptedAt: timestamp("accepted_at", { withTimezone: true }),
    declinedAt: timestamp("declined_at", { withTimezone: true }),
    isCurrent: boolean("is_current").notNull().default(true),
    notes: text("notes"),
    createdByUserId: uuid("created_by_user_id").references(() => appUsers.id, { onDelete: "set null" }),
    updatedByUserId: uuid("updated_by_user_id").references(() => appUsers.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    check("offers_status_check", sql`${table.status} in ('draft', 'sent', 'accepted', 'declined', 'withdrawn', 'expired')`),
    unique("uq_offers_application_version").on(table.applicationId, table.version),
    uniqueIndex("uq_offers_current_per_application").on(table.applicationId).where(sql`${table.isCurrent} = true`),
    index("idx_offers_workspace_application").on(table.workspaceId, table.applicationId),
  ]
);

export const automations = pgTable(
  "automations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    triggerTypeId: uuid("trigger_type_id")
      .notNull()
      .references(() => automationTriggerTypes.id, { onDelete: "restrict" }),
    actionTypeId: uuid("action_type_id")
      .notNull()
      .references(() => automationActionTypes.id, { onDelete: "restrict" }),
    triggerPayload: jsonb("trigger_payload").notNull().default(sql`'{}'::jsonb`),
    actionPayload: jsonb("action_payload").notNull().default(sql`'{}'::jsonb`),
    isActive: boolean("is_active").notNull().default(true),
    createdByUserId: uuid("created_by_user_id").references(() => appUsers.id, { onDelete: "set null" }),
    updatedByUserId: uuid("updated_by_user_id").references(() => appUsers.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_automations_workspace_name").on(table.workspaceId, table.name),
    index("idx_automations_workspace_active").on(table.workspaceId, table.isActive),
  ]
);

export const automationRuns = pgTable(
  "automation_runs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    automationId: uuid("automation_id")
      .notNull()
      .references(() => automations.id, { onDelete: "cascade" }),
    applicationId: uuid("application_id").references(() => applications.id, { onDelete: "set null" }),
    status: text("status").notNull(),
    errorMessage: text("error_message"),
    startedAt: timestamp("started_at", { withTimezone: true }),
    finishedAt: timestamp("finished_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    check("automation_runs_status_check", sql`${table.status} in ('queued', 'running', 'success', 'failed', 'skipped')`),
    index("idx_automation_runs_workspace_status").on(table.workspaceId, table.status),
  ]
);

export const workspaceSettings = pgTable(
  "workspace_settings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    defaultTimezone: text("default_timezone").notNull().default("Asia/Manila"),
    notificationsEnabled: boolean("notifications_enabled").notNull().default(true),
    settingsJson: jsonb("settings_json").notNull().default(sql`'{}'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [unique("uq_workspace_settings_workspace").on(table.workspaceId)]
);

export const workspaceIntegrations = pgTable(
  "workspace_integrations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    providerCode: text("provider_code").notNull(),
    displayName: text("display_name").notNull(),
    status: text("status").notNull().default("inactive"),
    config: jsonb("config").notNull().default(sql`'{}'::jsonb`),
    secretRef: text("secret_ref"),
    lastSyncedAt: timestamp("last_synced_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    check("workspace_integrations_status_check", sql`${table.status} in ('active', 'inactive', 'error')`),
    unique("uq_workspace_integrations_provider").on(table.workspaceId, table.providerCode),
    index("idx_workspace_integrations_workspace_provider").on(table.workspaceId, table.providerCode),
  ]
);

export const internalTools = pgTable(
  "internal_tools",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => internalToolCategories.id, { onDelete: "restrict" }),
    name: text("name").notNull(),
    description: text("description"),
    url: text("url").notNull(),
    iconKey: text("icon_key"),
    sortOrder: integer("sort_order").notNull().default(100),
    isActive: boolean("is_active").notNull().default(true),
    openInNewTab: boolean("open_in_new_tab").notNull().default(true),
    createdByUserId: uuid("created_by_user_id").references(() => appUsers.id, { onDelete: "set null" }),
    updatedByUserId: uuid("updated_by_user_id").references(() => appUsers.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    check("internal_tools_url_check", sql`${table.url} ~ '^https?://'`),
    unique("uq_internal_tools_workspace_name").on(table.workspaceId, table.name),
    index("idx_internal_tools_workspace_active_sort").on(table.workspaceId, table.isActive, table.sortOrder),
  ]
);

export const workspacesRelations = relations(workspaces, ({ many }) => ({
  memberships: many(workspaceMemberships),
  userRoles: many(userRoleAssignments),
  departments: many(departments),
  jobs: many(jobs),
  people: many(people),
  applications: many(applications),
  applicationStageEvents: many(applicationStageEvents),
  talentPoolEntries: many(talentPoolEntries),
  interviews: many(interviews),
  interviewFeedback: many(interviewFeedback),
  offers: many(offers),
  automations: many(automations),
  automationRuns: many(automationRuns),
  settings: many(workspaceSettings),
  integrations: many(workspaceIntegrations),
  internalTools: many(internalTools),
}));

export const appUsersRelations = relations(appUsers, ({ many }) => ({
  memberships: many(workspaceMemberships),
  roleAssignments: many(userRoleAssignments),
  departmentMemberships: many(departmentMembers),
  jobsOwned: many(jobs),
  applicationsOwned: many(applications),
  stageEventsMoved: many(applicationStageEvents),
  interviewsScheduled: many(interviews),
  feedbackGiven: many(interviewFeedback),
}));

export const workspaceMembershipsRelations = relations(workspaceMemberships, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [workspaceMemberships.workspaceId],
    references: [workspaces.id],
  }),
  user: one(appUsers, {
    fields: [workspaceMemberships.userId],
    references: [appUsers.id],
  }),
}));

export const userRoleAssignmentsRelations = relations(userRoleAssignments, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [userRoleAssignments.workspaceId],
    references: [workspaces.id],
  }),
  user: one(appUsers, {
    fields: [userRoleAssignments.userId],
    references: [appUsers.id],
  }),
  role: one(roles, {
    fields: [userRoleAssignments.roleId],
    references: [roles.id],
  }),
}));

export const departmentsRelations = relations(departments, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [departments.workspaceId],
    references: [workspaces.id],
  }),
  jobs: many(jobs),
  members: many(departmentMembers),
}));

export const departmentMembersRelations = relations(departmentMembers, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [departmentMembers.workspaceId],
    references: [workspaces.id],
  }),
  department: one(departments, {
    fields: [departmentMembers.departmentId],
    references: [departments.id],
  }),
  user: one(appUsers, {
    fields: [departmentMembers.userId],
    references: [appUsers.id],
  }),
}));

export const jobsRelations = relations(jobs, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [jobs.workspaceId],
    references: [workspaces.id],
  }),
  department: one(departments, {
    fields: [jobs.departmentId],
    references: [departments.id],
  }),
  status: one(jobStatuses, {
    fields: [jobs.statusId],
    references: [jobStatuses.id],
  }),
  pipelineStages: many(jobPipelineStages),
  applications: many(applications),
}));

export const jobPipelineStagesRelations = relations(jobPipelineStages, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [jobPipelineStages.workspaceId],
    references: [workspaces.id],
  }),
  job: one(jobs, {
    fields: [jobPipelineStages.jobId],
    references: [jobs.id],
  }),
  stage: one(pipelineStageCatalog, {
    fields: [jobPipelineStages.stageId],
    references: [pipelineStageCatalog.id],
  }),
}));

export const peopleRelations = relations(people, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [people.workspaceId],
    references: [workspaces.id],
  }),
  tags: many(personTags),
  applications: many(applications),
  talentPoolEntries: many(talentPoolEntries),
}));

export const tagsRelations = relations(tags, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [tags.workspaceId],
    references: [workspaces.id],
  }),
  personTags: many(personTags),
}));

export const personTagsRelations = relations(personTags, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [personTags.workspaceId],
    references: [workspaces.id],
  }),
  person: one(people, {
    fields: [personTags.personId],
    references: [people.id],
  }),
  tag: one(tags, {
    fields: [personTags.tagId],
    references: [tags.id],
  }),
}));

export const applicationsRelations = relations(applications, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [applications.workspaceId],
    references: [workspaces.id],
  }),
  job: one(jobs, {
    fields: [applications.jobId],
    references: [jobs.id],
  }),
  person: one(people, {
    fields: [applications.personId],
    references: [people.id],
  }),
  candidateSource: one(candidateSources, {
    fields: [applications.candidateSourceId],
    references: [candidateSources.id],
  }),
  status: one(applicationStatuses, {
    fields: [applications.statusId],
    references: [applicationStatuses.id],
  }),
  currentStage: one(pipelineStageCatalog, {
    fields: [applications.currentStageId],
    references: [pipelineStageCatalog.id],
  }),
  stageEvents: many(applicationStageEvents),
  interviews: many(interviews),
  offers: many(offers),
  automationRuns: many(automationRuns),
}));

export const applicationStageEventsRelations = relations(applicationStageEvents, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [applicationStageEvents.workspaceId],
    references: [workspaces.id],
  }),
  application: one(applications, {
    fields: [applicationStageEvents.applicationId],
    references: [applications.id],
  }),
  fromStage: one(pipelineStageCatalog, {
    fields: [applicationStageEvents.fromStageId],
    references: [pipelineStageCatalog.id],
    relationName: "from_stage",
  }),
  toStage: one(pipelineStageCatalog, {
    fields: [applicationStageEvents.toStageId],
    references: [pipelineStageCatalog.id],
    relationName: "to_stage",
  }),
}));

export const talentPoolEntriesRelations = relations(talentPoolEntries, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [talentPoolEntries.workspaceId],
    references: [workspaces.id],
  }),
  person: one(people, {
    fields: [talentPoolEntries.personId],
    references: [people.id],
  }),
  talentStatus: one(talentStatuses, {
    fields: [talentPoolEntries.talentStatusId],
    references: [talentStatuses.id],
  }),
  availabilityStatus: one(availabilityStatuses, {
    fields: [talentPoolEntries.availabilityStatusId],
    references: [availabilityStatuses.id],
  }),
  promotedApplication: one(applications, {
    fields: [talentPoolEntries.promotedApplicationId],
    references: [applications.id],
  }),
}));

export const interviewsRelations = relations(interviews, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [interviews.workspaceId],
    references: [workspaces.id],
  }),
  application: one(applications, {
    fields: [interviews.applicationId],
    references: [applications.id],
  }),
  feedback: many(interviewFeedback),
}));

export const interviewFeedbackRelations = relations(interviewFeedback, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [interviewFeedback.workspaceId],
    references: [workspaces.id],
  }),
  interview: one(interviews, {
    fields: [interviewFeedback.interviewId],
    references: [interviews.id],
  }),
  reviewer: one(appUsers, {
    fields: [interviewFeedback.reviewerUserId],
    references: [appUsers.id],
  }),
}));

export const offersRelations = relations(offers, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [offers.workspaceId],
    references: [workspaces.id],
  }),
  application: one(applications, {
    fields: [offers.applicationId],
    references: [applications.id],
  }),
}));

export const automationsRelations = relations(automations, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [automations.workspaceId],
    references: [workspaces.id],
  }),
  triggerType: one(automationTriggerTypes, {
    fields: [automations.triggerTypeId],
    references: [automationTriggerTypes.id],
  }),
  actionType: one(automationActionTypes, {
    fields: [automations.actionTypeId],
    references: [automationActionTypes.id],
  }),
  runs: many(automationRuns),
}));

export const automationRunsRelations = relations(automationRuns, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [automationRuns.workspaceId],
    references: [workspaces.id],
  }),
  automation: one(automations, {
    fields: [automationRuns.automationId],
    references: [automations.id],
  }),
  application: one(applications, {
    fields: [automationRuns.applicationId],
    references: [applications.id],
  }),
}));

export const workspaceSettingsRelations = relations(workspaceSettings, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [workspaceSettings.workspaceId],
    references: [workspaces.id],
  }),
}));

export const workspaceIntegrationsRelations = relations(workspaceIntegrations, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [workspaceIntegrations.workspaceId],
    references: [workspaces.id],
  }),
}));

export const internalToolsRelations = relations(internalTools, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [internalTools.workspaceId],
    references: [workspaces.id],
  }),
  category: one(internalToolCategories, {
    fields: [internalTools.categoryId],
    references: [internalToolCategories.id],
  }),
}));
