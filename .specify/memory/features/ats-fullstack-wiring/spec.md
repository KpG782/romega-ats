# Feature Spec: ATS Full-Stack Wiring
**Feature ID:** ats-fullstack-wiring  
**Created:** 2026-03-13  
**Status:** Draft  
**Depends on:** supabase-ats-3nf-schema (schema must be applied to Supabase first)

---

## Overview

The romega-ats UI is fully built with hardcoded mock data. The Supabase 3NF schema with 32 tables, RLS policies, seed data, and Drizzle ORM schema are all ready. This feature replaces every mock/hardcoded data source with real Supabase database reads and writes, and replaces the mock auth system with real Supabase Auth.

---

## Functional Requirements

### FR-1 — Authentication
- Replace `lib/auth-context.tsx` mock login with Supabase Auth (`@supabase/ssr`)
- Support email + password sign-in
- Session persists across page refreshes via Supabase cookie-based session
- Middleware enforces auth on all `/dashboard/*` routes (already partially wired in `middleware.ts`)
- Role is read from `workspace_members.role_id` → `roles.code` after sign-in
- Logout clears Supabase session

### FR-2 — Workspace Provisioning
- After first login, if the user has no `workspace_members` row, redirect to `/onboarding`
- Onboarding creates: `workspaces` row, `workspace_members` row with `admin` role, then seeds `internal_tools` defaults for the new workspace
- All subsequent data queries are scoped to the user's active `workspace_id`

### FR-3 — Dashboard Page (`/dashboard`)
- Real-time KPI tiles: open jobs count, total candidates, interviews this week, time-to-hire average
- Data sourced from `v_dashboard_summary` view
- Activity feed from `application_stage_events` (last 10, most recent first)

### FR-4 — Jobs Page (`/jobs`)
- List jobs from `jobs` table joined to `departments`
- Stage pipeline bar uses counts from `applications` grouped by `current_stage_id`
- Create job → inserts into `jobs` (dept auto-creates in `departments` if not exists)
- Edit job → updates `jobs` row
- Change status (open/draft/on_hold/closed/filled) → updates `jobs.status_id`
- Duplicate job → inserts new `jobs` row with same fields + `draft` status
- Delete job → soft-delete via `jobs.archived_at = NOW()` (not hard delete)
- Search + filter + sort all work client-side on fetched data

### FR-5 — Job Detail / Pipeline Page (`/jobs/[id]`)
- Load job + pipeline stages from `pipeline_stages` (workspace-scoped)
- Load candidates in kanban columns from `applications` joined to `persons`
- Drag-and-drop stage move → calls `app.transition_application_stage()` via RPC
- Add candidate to stage → creates `persons` + `candidates` + `applications` row
- Candidate profile drawer → reads from `persons`, `candidates`, `applications`, `application_stage_events`
- Schedule interview → inserts into `interviews`

### FR-6 — Candidates Page (`/candidates`)
- List all candidates across all jobs from `persons` + `candidates` + latest `applications` row
- Search, filter by stage/source, sort by score/activity/name all work on fetched data
- Add candidate → creates `persons` + `candidates` row
- Edit candidate → updates `persons` + `candidates`
- Delete candidate → soft-delete `candidates.archived_at`
- Move to stage → calls `app.transition_application_stage()`
- View profile drawer → full candidate detail

### FR-7 — Talent Pool Page (`/talent-pool`)
- List from `talent_pool_members` joined to `persons`
- Add to pool → creates `persons` + `talent_pool_members`
- Edit → updates `persons` + `talent_pool_members`
- Delete → soft-delete `talent_pool_members.archived_at`
- Promote to pipeline → creates `candidates` + `applications` row, marks `talent_pool_members.promoted_at`
- AI shortlist filter → client-side filter on `fit_score >= 80`

### FR-8 — Analytics Page (`/analytics`)
- Source data from `v_pipeline_metrics_daily` view
- Pipeline funnel chart: stage counts aggregated over date range
- Conversion rates: stage → stage drop-off
- Time-to-hire distribution from `application_stage_events`
- Date range filter (last 7d / 30d / 90d / custom)

### FR-9 — Departments Page (`/departments`)
- List from `departments` table (workspace-scoped)
- Create → insert `departments` row
- Edit → update `departments.name`
- Delete → only allowed if no active jobs reference this department (enforce check)

### FR-10 — Automations Page (`/automations`)
- List from `automation_rules` joined to `automation_types`
- Toggle on/off → updates `automation_rules.is_active`
- Create rule → insert `automation_rules` row
- Delete rule → hard delete (no soft-delete for automations)

### FR-11 — Settings Page (`/settings`)
- Profile section: read/update `app_users` (display_name, avatar_url)
- Workspace section: read/update `workspaces` (name, timezone) — admin only
- Members section: list `workspace_members`, invite new member (creates auth invite), change role, remove member
- Internal Tools section: list/add/remove `internal_tools` for this workspace

### FR-12 — File Uploads (Resume)
- Candidates and talent pool profiles support PDF resume upload
- Files stored in Supabase Storage bucket `resumes`
- `candidates.resume_url` + `talent_pool_members.resume_url` store the public/signed URL
- Max file size: 10 MB, accept: `application/pdf`

---

## Non-Functional Requirements

### NFR-1 — Security
- All DB mutations go through server actions (never expose Supabase service-role key to client)
- Supabase anon key used only for client-side auth session management
- RLS enforces workspace isolation at the DB level — no manual tenant filtering needed in app code
- Never hard-delete persons/candidates/jobs — always soft-delete via `archived_at`

### NFR-2 — Data Loading
- Server components for initial page load (SEO + performance)
- Client components for interactive mutations (forms, drag-and-drop)
- Optimistic UI updates for kanban stage moves
- No global state library — use React `useState` + server action revalidation

### NFR-3 — Error Handling
- All server actions return `{ data, error }` shape — never throw to client
- Toast notifications for success/error on all mutations
- Loading spinners already in UI — keep them, wire to real async state

### NFR-4 — Type Safety
- All DB types come from Drizzle schema (already in `drizzle/schema/ats.ts`)
- No `any` in server actions or data-fetching code
- Use `InferSelectModel` / `InferInsertModel` from Drizzle for all table types

### NFR-5 — Email Notifications
- Use Resend (`RESEND_API_KEY` in `.env`) for transactional emails
- Events that trigger email: new candidate application, interview scheduled, offer sent
- Email templates are plain React Email components (simple, no external dependency initially)

---

## Pages Coverage

| Page | Route | Key Tables / Views |
|---|---|---|
| Login | `/login` | `auth.users` |
| Onboarding | `/onboarding` | `workspaces`, `workspace_members`, `internal_tools` |
| Dashboard | `/dashboard` | `v_dashboard_summary`, `application_stage_events` |
| Jobs | `/jobs` | `jobs`, `departments`, `job_statuses`, `applications` |
| Job Pipeline | `/jobs/[id]` | `jobs`, `pipeline_stages`, `applications`, `persons`, `interviews` |
| Candidates | `/candidates` | `persons`, `candidates`, `applications`, `candidate_sources` |
| Talent Pool | `/talent-pool` | `talent_pool_members`, `persons` |
| Analytics | `/analytics` | `v_pipeline_metrics_daily`, `application_stage_events` |
| Departments | `/departments` | `departments`, `jobs` |
| Automations | `/automations` | `automation_rules`, `automation_types` |
| Settings | `/settings` | `app_users`, `workspaces`, `workspace_members`, `internal_tools` |

---

## Acceptance Criteria

- **AC-1:** Login with a real Supabase user credential redirects to `/dashboard` with no mock data visible
- **AC-2:** Creating a job via the modal persists to Supabase and survives a page refresh
- **AC-3:** Dragging a candidate card to a new stage calls the transition function and the new stage persists
- **AC-4:** Dashboard KPI tiles reflect real counts from the database
- **AC-5:** A user from workspace A cannot see data from workspace B (RLS enforced)
- **AC-6:** Resumes upload to Supabase Storage and the URL is stored in the candidates table
- **AC-7:** Inviting a new workspace member sends a Supabase auth invite email

---

## Out of Scope (v1)
- Real-time live updates (Supabase Realtime subscriptions) — add in v2
- AI scoring / CV parsing — placeholder UI only
- Public careers portal / job board
- Bulk CSV import of candidates
- SSO / OAuth login (email+password only for v1)
