# Tasks: Supabase ATS 3NF Data Model

## Status
In progress (March 13, 2026)

## Execution Rules
- Keep SQL migrations as deploy artifacts for Supabase.
- Keep Drizzle schema in sync for every migration.
- Enforce 3NF and workspace-level tenant isolation across all business tables.

## Phase 0: Setup and Guardrails
- [x] T001 Create migration scaffolding folders for Supabase and Drizzle schema mapping.
- [x] T002 Define migration naming standard and apply it consistently.
- [x] T003 Enable required Postgres extensions (uuid and crypto helpers) in first migration.
- [x] T004 Create a seed strategy document for reference tables and default records.
- [x] T005 Define and document schema conventions: uuid PKs and timestamptz audit columns for mutable tables.
- [x] T006 Decide internal_tools ownership scope (global catalog or workspace-owned) and record the decision.

## Phase 1: Reference and Tenant Foundation
- [x] T010 Create reference tables: roles, job_statuses, pipeline_stage_catalog, application_statuses.
- [x] T011 Create reference tables: candidate_sources, talent_statuses, availability_statuses.
- [x] T012 Create reference tables: automation_trigger_types, automation_action_types, internal_tool_categories.
- [x] T013 Create workspaces table with audit fields and uniqueness constraints.
- [x] T014 Create app_users table linked to auth.users with profile and active status fields.
- [x] T015 Create workspace_memberships table to map users to workspaces.
- [x] T016 Create user_role_assignments table for normalized role mapping.
- [x] T017 Seed baseline role rows and workflow status rows.
- [x] T018 Seed default pipeline stage rows with display order and terminal flags.
- [x] T019 Seed remaining reference rows: candidate sources, talent and availability statuses, automation types, internal tool categories.

## Phase 2: Organization, Jobs, and Pipeline Definitions
- [x] T020 Create departments table with workspace ownership and manager linkage.
- [x] T021 Create department_members join table for normalized team membership.
- [x] T022 Create jobs table with department linkage, status linkage, owner fields, and lifecycle timestamps.
- [x] T023 Create job_pipeline_stages table for job-specific stage ordering and overrides.
- [x] T024 Add constraints to prevent duplicate stage ordering per job.
- [x] T025 Add indexes for job listing and filtering: workspace_id plus status_id, department_id.

## Phase 3: People, Applications, Tags, and Stage Events
- [x] T030 Create people table for reusable person identity and contact profile per workspace.
- [x] T031 Create tags and person_tags tables for normalized many-to-many tagging.
- [x] T032 Create applications table linking people to jobs with current_stage and status references.
- [x] T033 Add uniqueness constraints for duplicate-application prevention policy.
- [x] T034 Create application_stage_events append-only table with from_stage, to_stage, actor, reason, timestamp.
- [x] T035 Add indexes for kanban and funnel queries: workspace_id plus current_stage_id, job_id, person_id.
- [x] T036 Add indexes for stage history and analytics on application_stage_events created_at.
- [x] T037 Implement trigger or function strategy to keep applications.current_stage_id synchronized from events.
- [x] T038 Enforce event-driven stage transitions by blocking inconsistent direct stage updates outside approved workflow functions.

## Phase 4: Talent Pool, Interviews, Feedback, and Offers
- [x] T040 Create talent_pool_entries linked to people with status and availability references.
- [x] T041 Add promotion linkage from talent_pool_entries to applications.
- [x] T042 Create interviews table with scheduler, interviewer, timing, and status fields.
- [x] T043 Create interview_feedback table with scoring and narrative feedback fields.
- [x] T044 Create offers table with terms, status, and acceptance timestamps.
- [x] T045 Add indexes for talent pool filtering and recruiter workflow performance.

## Phase 5: Automations, Settings, Integrations, and Internal Tools
- [x] T050 Create automations table with trigger payload and action payload fields.
- [x] T051 Create automation_runs immutable log table for execution tracking and failure diagnostics.
- [x] T052 Create workspace_settings table for tenant-level defaults and behavior toggles.
- [x] T053 Create workspace_integrations table for provider metadata and activation state.
- [x] T054 Create internal_tools table with category, icon_key, url, sort_order, and active flag.
- [x] T055 Seed internal_tools with current links for email signature generator and certificate generator.
- [x] T056 Add indexes for active automation and internal tool listing queries.

## Phase 6: Security and Multi-Tenant Isolation
- [x] T060 Enable RLS on all tenant-owned transactional tables.
- [x] T061 Create workspace-scoped select and write policies for authenticated users.
- [ ] T062 Add policy exceptions for admin and service-role operations where required.
- [ ] T063 Restrict access to integration-sensitive columns with explicit policy rules.
- [ ] T064 Validate cross-workspace isolation with negative test queries.
- [x] T065 Define delete-policy strategy (hard delete vs soft delete) and add matching RLS delete rules.
- [ ] T066 Execute unauthorized operation tests for select, insert, update, and delete paths.

## Phase 7: Drizzle Alignment and Migration Integrity
- [x] T070 Implement Drizzle table definitions matching SQL names, keys, and constraints exactly.
- [x] T071 Implement Drizzle relations for all foreign keys and join tables.
- [x] T072 Validate enum strategy choice consistency between SQL and Drizzle.
- [ ] T073 Generate and compare migration artifacts to detect drift.
- [ ] T074 Resolve drift and lock migration history as immutable once applied.

## Phase 8: Reporting Views and Performance Hardening
- [x] T080 Create reporting view or materialized view for pipeline metrics daily summaries.
- [x] T081 Create reporting view for dashboard summary metrics from source-of-truth transactional tables.
- [x] T082 Add refresh strategy or scheduled recompute policy for materialized views if used.
- [ ] T083 Validate high-frequency query plans and optimize with additional indexes if needed.

## Phase 9: Validation, Coverage, and Handover
- [ ] T090 Execute SQL smoke tests for each page data scenario.
- [x] T091 Verify page-to-table coverage matrix is complete for all dashboard and auth pages.
- [x] T092 Verify 3NF compliance checklist for each domain table group.
- [ ] T093 Verify pipeline audit completeness from Applied to Hired or Rejected transitions.
- [ ] T094 Verify seed scripts produce a usable first-run tenant dataset.
- [x] T095 Document rollback guidance and data backfill notes for each migration group.
- [x] T096 Publish final implementation notes for follow-up API and UI integration work.
- [x] T097 Publish schema inventory artifact with PK, FK, unique constraints, and relationship cardinality.
- [x] T098 Publish page-to-table matrix artifact as auditable acceptance evidence.

## Completion Criteria
- [ ] C001 All tasks from T001 to T098 complete.
- [ ] C002 Supabase migrations apply cleanly in a fresh environment.
- [ ] C003 Drizzle schema compiles and matches database structure.
- [ ] C004 RLS tests pass and tenant isolation is enforced.
- [ ] C005 All pages and pipeline flows are covered by normalized tables.
