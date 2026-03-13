# Implementation Plan: Supabase ATS 3NF Data Model

## Status
Draft (March 13, 2026)

## Planning Decision Summary

### Decision 1: Should Drizzle be added now or later?
Recommendation: Add Drizzle schema management now (even if app usage comes later).

Reason:
- Prevents schema drift between manual SQL and TypeScript models.
- Locks naming conventions and relations early.
- Makes future API work faster and safer with typed queries.

Practical approach:
- Keep migration SQL as the deploy artifact for Supabase.
- Keep Drizzle schema files in sync in the same feature branch/PR.
- Do not allow ad-hoc SQL-only changes without updating Drizzle schema.

### Decision 2: Primary model strategy
Use a person-centric 3NF model:
- people stores unique person identity/contact profile per workspace.
- applications stores person-to-job records and pipeline state.
- talent_pool_entries stores pre-application records linked to people.

This avoids duplicate person rows across candidates/talent pool.

### Decision 3: Key strategy
Use uuid primary keys (default gen_random_uuid()) for app tables.
- Aligns with Supabase auth ecosystem.
- Works cleanly with distributed systems and Drizzle.

## Target Schema (3NF)

## A) Tenant, Identity, and Access
1. workspaces
2. app_users (FK to auth.users.id)
3. roles
4. user_role_assignments
5. workspace_memberships

## B) Organization Structure
6. departments
7. department_members

## C) Jobs and Pipeline Definitions
8. job_statuses (reference)
9. jobs
10. pipeline_stage_catalog (reference)
11. job_pipeline_stages (job-specific ordered stages)
12. application_statuses (reference)

## D) People, Applications, Tags
13. people
14. candidate_sources (reference)
15. tags
16. person_tags (join)
17. applications (person <-> job)
18. application_stage_events (append-only transition log)

## E) Talent Pool
19. talent_statuses (reference)
20. availability_statuses (reference)
21. talent_pool_entries (linked to people)

## F) Interviews and Offers
22. interviews
23. interview_feedback
24. offers

## G) Automations and Settings
25. automation_trigger_types (reference)
26. automation_action_types (reference)
27. automations
28. automation_runs
29. workspace_settings
30. workspace_integrations

## H) Internal Tools
31. internal_tool_categories (reference)
32. internal_tools

## I) Optional Reporting Layer (not source of truth)
33. v_pipeline_metrics_daily (view/materialized view)
34. v_dashboard_summary (view/materialized view)

## Core Relationship Rules
- workspace owns nearly all tenant data tables.
- app_users can be members of workspace via workspace_memberships.
- department belongs to workspace.
- job belongs to workspace + department.
- application links person and job (unique person_id + job_id + workspace_id as needed by business rules).
- current application stage is represented by applications.current_stage_id, while full history is in application_stage_events.
- talent_pool_entries link to people and may later map to applications.

## Page-to-Table Coverage Plan

1. Login: auth.users, app_users, workspace_memberships, user_role_assignments.
2. Dashboard: jobs, applications, application_stage_events, offers, automations/automation_runs.
3. Candidates: people, applications, candidate_sources, person_tags, tags, application_stage_events.
4. Jobs: jobs, job_statuses, departments, job_pipeline_stages, applications.
5. Job Detail: applications, job_pipeline_stages, application_stage_events, people.
6. Departments: departments, department_members, app_users.
7. Talent Pool: people, talent_pool_entries, talent_statuses, availability_statuses.
8. Analytics: application_stage_events, applications, jobs, offers (plus reporting views).
9. Automations: automations, automation_runs, automation_trigger_types, automation_action_types.
10. Settings: workspace_settings, workspace_integrations, roles/user_role_assignments.
11. Internal Tools: internal_tool_categories, internal_tools.

## Supabase + Drizzle Best-Practice Workflow

1. Source-of-truth policy
- Preferred: Drizzle schema + generated SQL migrations committed in git.
- Supabase SQL Editor should execute committed migration SQL, not one-off hand-written statements.

2. Folder policy
- drizzle/schema/*.ts for table definitions.
- supabase/migrations/*.sql for executable migrations.
- Keep migration IDs ordered and immutable after deployment.

3. Change policy
- Every schema change must include:
  - SQL migration
  - Drizzle schema update
  - data backfill script (if needed)
  - rollback notes

4. Environment policy
- Local/dev: run migrations first, then validate with Drizzle queries.
- Staging/prod: apply same migration files in order.

## Performance Baseline Plan

Indexes to include in initial migrations:
- applications(workspace_id, current_stage_id)
- applications(workspace_id, job_id)
- applications(workspace_id, person_id)
- people(workspace_id, email) unique
- jobs(workspace_id, status_id)
- application_stage_events(workspace_id, application_id, created_at desc)
- talent_pool_entries(workspace_id, talent_status_id)
- automations(workspace_id, is_active)

## Security Baseline Plan

1. Enable RLS on tenant tables.
2. Add workspace-scoped select/insert/update policies.
3. Restrict integration secret fields with minimal access policies.
4. Add audit fields: created_by, updated_by where useful.

## Delivery Phases

### Phase 1: Reference + Tenant Foundation
- Create reference tables and tenant identity tables.
- Seed baseline data (roles, statuses, default stages).

### Phase 2: Recruiting Core
- Create jobs, people, applications, job pipeline stage tables.
- Add stage event log table and constraints.

### Phase 3: Talent, Interviews, Offers
- Create talent pool, interview, feedback, and offer tables.

### Phase 4: Automations + Settings + Internal Tools
- Create automation/settings/integration/internal-tool tables.

### Phase 5: Indexes, RLS, and Validation
- Add performance indexes.
- Add RLS policies.
- Validate page-level query scenarios.

## Quality Gates

1. 3NF review completed for every table group.
2. No duplicate person identity across candidate/talent modules.
3. Page coverage matrix fully satisfied.
4. Migration runs cleanly on fresh database.
5. Drizzle schema compiles and matches database.
6. RLS policies pass tenant-isolation tests.

## Risks and Mitigations

1. Risk: schema drift between SQL and Drizzle.
- Mitigation: enforce dual-update PR checklist.

2. Risk: over-normalization hurting query speed.
- Mitigation: keep transactional source tables normalized, add targeted indexes and reporting views.

3. Risk: pipeline logic ambiguity per job.
- Mitigation: use job_pipeline_stages for explicit per-job stage ordering.

## Next Commands (Spec Kit)

1. /speckit.tasks
- Generate actionable implementation checklist from this plan.

2. /speckit.analyze (optional but recommended)
- Validate consistency between spec and plan before coding.

3. /speckit.implement
- Execute schema creation and migration files.
