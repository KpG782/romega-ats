# Implementation Plan: ATS Full-Stack Wiring
**Feature ID:** ats-fullstack-wiring  
**Created:** 2026-03-13  
**Status:** Draft

---

## Guiding Principles

1. **Server-first** — Every initial data load is a React Server Component. Client components handle mutations and interactivity only.
2. **Server Actions for mutations** — No API routes. All writes go through `"use server"` functions co-located in `app/actions/` files.
3. **Drizzle as the query layer** — All SQL goes through Drizzle. No raw `supabase.from()` calls in page code.
4. **One domain at a time** — Auth → Workspace → Jobs → Job Pipeline → Candidates → Talent Pool → Dashboard → Analytics → Departments → Automations → Settings.
5. **Never break the UI** — Each step leaves the app in a working state. Mock data is replaced incrementally, not all at once.

---

## Architecture Decisions

### Auth Stack
- Package: `@supabase/ssr` (cookie-based session for Next.js App Router)
- Client factory: `lib/supabase/client.ts` (browser), `lib/supabase/server.ts` (server component / action)
- Session flow: Supabase Auth cookie → `middleware.ts` reads session → redirects unauthenticated users
- Role lookup: After auth, load `workspace_members` → `roles.code` → store in React Context (client)
- **Replace:** `lib/auth-context.tsx` mock → real Supabase auth hooks

### Data Fetching Pattern

```
Page (Server Component)
  ├── calls lib/queries/[domain].ts  (Drizzle select, server-only)
  └── passes data as props to Client Components

Client Component (form / kanban / modal)
  └── calls app/actions/[domain].ts  (Server Actions, "use server")
        └── Drizzle insert/update → revalidatePath()
```

### Workspace Context
- After login, a `WorkspaceProvider` (client context) holds `workspaceId`
- All queries and actions receive `workspaceId` from session — never from client URL params
- RLS double-enforces this — even if client sends wrong workspace_id, Supabase blocks it

### File Uploads
- Browser → Supabase Storage (signed upload URL via server action)
- Server action returns the public URL → saved to `candidates.resume_url`
- Bucket: `resumes`, folder: `{workspaceId}/{candidateId}/`

### Email (Resend)
- Resend SDK in `lib/email/send.ts`
- Triggered from server actions after mutations (fire-and-forget, not awaited)
- Templates in `lib/email/templates/` as plain React function components

---

## Dependency Map

```
Phase 0 (Supabase Client Setup)
  └──► Phase 1 (Auth + Middleware)
         └──► Phase 2 (Workspace Provisioning)
                └──► Phase 3 (Jobs CRUD)
                       └──► Phase 4 (Job Pipeline / Kanban)
                              └──► Phase 5 (Candidates CRUD)
Phase 2 ──► Phase 6 (Talent Pool)
Phase 4 ──► Phase 7 (Dashboard + Analytics) [needs real app data]
Phase 3 ──► Phase 8 (Departments CRUD)
Phase 2 ──► Phase 9 (Automations CRUD)
Phase 2 ──► Phase 10 (Settings)
Phase 5 ──► Phase 11 (File Uploads)
Phase 2 ──► Phase 12 (Email Notifications)
```

---

## Phase Details

---

### Phase 0 — Supabase Client Infrastructure
**Goal:** Set up the two Supabase client factories and Drizzle connection that every other phase depends on.

**Deliverables:**
- Install `@supabase/ssr`, `@supabase/supabase-js` (if not already present)
- `lib/supabase/client.ts` — `createBrowserClient()` singleton for client components
- `lib/supabase/server.ts` — `createServerClient()` using `next/headers` cookies for server components + actions
- `lib/db.ts` — Drizzle `postgres-js` connection using `process.env.DATABASE_URL`
- Verify env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `DATABASE_URL`

**Files touched:** `lib/supabase/`, `lib/db.ts`, `package.json`

---

### Phase 1 — Auth: Replace Mock Login with Supabase Auth
**Goal:** Real sign-in/sign-out flow. Mock users gone.

**Deliverables:**
- Rewrite `lib/auth-context.tsx`:
  - `login()` → `supabase.auth.signInWithPassword()`
  - `logout()` → `supabase.auth.signOut()`
  - `user` state → loaded from `supabase.auth.getUser()` + workspace_members query
  - Keep same exported interface (`User`, `useAuth()`, `AuthProvider`) so no page changes needed
- Update `middleware.ts` to use `@supabase/ssr` session refresh pattern
- `app/actions/auth.ts` — server action for sign-in (called from login form)
- `app/(auth)/login/page.tsx` — wire form to real server action

**Files touched:** `lib/auth-context.tsx`, `middleware.ts`, `app/actions/auth.ts`, `app/(auth)/login/page.tsx`

---

### Phase 2 — Workspace Provisioning & Onboarding
**Goal:** First-login users get a workspace created; all subsequent sessions know their workspace_id.

**Deliverables:**
- `app/(auth)/onboarding/page.tsx` — minimal form: company name + timezone
- `app/actions/workspace.ts` — server action: create `workspaces` + `workspace_members` + seed `internal_tools`
- `lib/queries/workspace.ts` — `getUserWorkspace(userId)` Drizzle query
- `middleware.ts` update — if logged in but no workspace, redirect to `/onboarding`
- `WorkspaceProvider` added to `app/(dashboard)/layout.tsx` — provides `workspaceId` to all dashboard pages

**Files touched:** `app/(auth)/onboarding/`, `app/actions/workspace.ts`, `lib/queries/workspace.ts`, `app/(dashboard)/layout.tsx`

---

### Phase 3 — Jobs CRUD
**Goal:** Jobs page reads from and writes to the real `jobs` + `departments` tables.

**Deliverables:**
- `lib/queries/jobs.ts` — `getJobs(workspaceId)`, `getJob(id)` Drizzle queries
- `lib/queries/departments.ts` — `getDepartments(workspaceId)` 
- `app/actions/jobs.ts` — `createJob()`, `updateJob()`, `changeJobStatus()`, `duplicateJob()`, `archiveJob()`
- `app/(dashboard)/jobs/page.tsx` — convert to server component for initial load; keep client component for modals/menus
- Remove `INITIAL_JOBS` constant; wire `JobModal` to call `createJob` server action
- `revalidatePath('/jobs')` after every mutation

**Files touched:** `lib/queries/jobs.ts`, `lib/queries/departments.ts`, `app/actions/jobs.ts`, `app/(dashboard)/jobs/page.tsx`

---

### Phase 4 — Job Pipeline (Kanban)
**Goal:** Drag-and-drop stage transitions call the real Postgres transition function.

**Deliverables:**
- `lib/queries/pipeline.ts` — `getJobPipeline(jobId, workspaceId)` — job + stages + applications + persons
- `app/actions/pipeline.ts` — `moveApplicationStage()` → calls `app.transition_application_stage()` via Drizzle `sql` template; `addCandidateToJob()`, `scheduleInterview()`
- `app/(dashboard)/jobs/[id]/page.tsx` — server component for initial load
- Kanban drag-and-drop uses optimistic update then server action
- Interview scheduling form wires to `interviews` table insert

**Files touched:** `lib/queries/pipeline.ts`, `app/actions/pipeline.ts`, `app/(dashboard)/jobs/[id]/page.tsx`

---

### Phase 5 — Candidates CRUD
**Goal:** Candidates page reads/writes real person + candidate + application records.

**Deliverables:**
- `lib/queries/candidates.ts` — `getCandidates(workspaceId)`, `getCandidate(id)`
- `app/actions/candidates.ts` — `createCandidate()`, `updateCandidate()`, `archiveCandidate()`, `moveCandidateStage()`
- `app/(dashboard)/candidates/page.tsx` — server component initial load; remove `INITIAL_CANDIDATES`
- Candidate add/edit modal wires to server actions
- Profile drawer wires to real data

**Files touched:** `lib/queries/candidates.ts`, `app/actions/candidates.ts`, `app/(dashboard)/candidates/page.tsx`

---

### Phase 6 — Talent Pool CRUD
**Goal:** Talent pool page reads/writes real `talent_pool_members` + `persons` records.

**Deliverables:**
- `lib/queries/talent-pool.ts` — `getTalentPool(workspaceId)`
- `app/actions/talent-pool.ts` — `addToPool()`, `updatePoolMember()`, `archivePoolMember()`, `promoteToCandidate()`
- `app/(dashboard)/talent-pool/page.tsx` — server component initial load; remove `INITIAL_TALENT`
- Promote to pipeline action creates `candidates` + `applications` rows

**Files touched:** `lib/queries/talent-pool.ts`, `app/actions/talent-pool.ts`, `app/(dashboard)/talent-pool/page.tsx`

---

### Phase 7 — Dashboard + Analytics
**Goal:** KPI tiles and analytics charts show real data from views.

**Deliverables:**
- `lib/queries/dashboard.ts` — reads `v_dashboard_summary`, `application_stage_events` (last 10)
- `lib/queries/analytics.ts` — reads `v_pipeline_metrics_daily` with date range filter
- `app/(dashboard)/dashboard/page.tsx` — server component, replace mock KPI values
- `app/(dashboard)/analytics/page.tsx` — server component initial load, charts stay client-side
- Date range filter state kept client-side; triggers server action re-fetch

**Files touched:** `lib/queries/dashboard.ts`, `lib/queries/analytics.ts`, `app/(dashboard)/dashboard/page.tsx`, `app/(dashboard)/analytics/page.tsx`

---

### Phase 8 — Departments CRUD
**Goal:** Departments page manages real `departments` rows.

**Deliverables:**
- `lib/queries/departments.ts` — expand existing with `getDepartmentsWithJobCounts(workspaceId)`
- `app/actions/departments.ts` — `createDepartment()`, `renameDepartment()`, `deleteDepartment()` (check: no active jobs)
- `app/(dashboard)/departments/page.tsx` — wire to real data; remove any mock

**Files touched:** `lib/queries/departments.ts`, `app/actions/departments.ts`, `app/(dashboard)/departments/page.tsx`

---

### Phase 9 — Automations CRUD
**Goal:** Automations page manages real `automation_rules` rows.

**Deliverables:**
- `lib/queries/automations.ts` — `getAutomations(workspaceId)` joined to `automation_types`
- `app/actions/automations.ts` — `createAutomation()`, `toggleAutomation()`, `deleteAutomation()`
- `app/(dashboard)/automations/page.tsx` — wire to real data

**Files touched:** `lib/queries/automations.ts`, `app/actions/automations.ts`, `app/(dashboard)/automations/page.tsx`

---

### Phase 10 — Settings
**Goal:** Settings page reads/writes user profile, workspace info, members, and internal tools.

**Deliverables:**
- `lib/queries/settings.ts` — `getUserProfile()`, `getWorkspaceMembers(workspaceId)`, `getInternalTools(workspaceId)`
- `app/actions/settings.ts` — `updateProfile()`, `updateWorkspace()`, `inviteMember()`, `changeMemberRole()`, `removeMember()`, `addInternalTool()`, `removeInternalTool()`
- `app/(dashboard)/settings/page.tsx` — wire all sections to real data
- Invite member uses `supabase.auth.admin.inviteUserByEmail()` (service-role key, server only)

**Files touched:** `lib/queries/settings.ts`, `app/actions/settings.ts`, `app/(dashboard)/settings/page.tsx`

---

### Phase 11 — File Uploads (Resume)
**Goal:** PDF resume upload to Supabase Storage, URL saved to DB.

**Deliverables:**
- Supabase Storage bucket `resumes` created (public or signed URL config)
- `app/actions/uploads.ts` — `getResumeUploadUrl(candidateId)` returns signed upload URL
- Resume upload component (small, reusable) in `components/ui/resume-upload.tsx`
- Wire into candidate add/edit modal and talent pool add/edit modal
- Store final URL in `candidates.resume_url` / `talent_pool_members.resume_url`

**Files touched:** `app/actions/uploads.ts`, `components/ui/resume-upload.tsx`, modals in jobs/[id] and candidates pages

---

### Phase 12 — Email Notifications (Resend)
**Goal:** Key events trigger real transactional emails.

**Deliverables:**
- Install `resend` package
- `lib/email/send.ts` — `sendEmail(to, subject, reactComponent)` wrapper
- `lib/email/templates/new-application.tsx` — "New application received" template
- `lib/email/templates/interview-scheduled.tsx` — "Interview confirmed" template
- `lib/email/templates/offer-sent.tsx` — "Offer letter" template
- Wire `sendEmail()` calls inside relevant server actions (non-blocking)

**Files touched:** `lib/email/`, relevant server actions

---

## New File Structure (after all phases)

```
lib/
  supabase/
    client.ts          ← browser Supabase client
    server.ts          ← server Supabase client (cookies)
  db.ts                ← Drizzle postgres-js connection
  queries/
    workspace.ts
    jobs.ts
    departments.ts
    pipeline.ts
    candidates.ts
    talent-pool.ts
    dashboard.ts
    analytics.ts
    automations.ts
    settings.ts
  email/
    send.ts
    templates/
      new-application.tsx
      interview-scheduled.tsx
      offer-sent.tsx
  auth-context.tsx     ← rewritten (same interface, real Supabase auth)
  utils.ts             ← unchanged

app/
  actions/
    auth.ts
    workspace.ts
    jobs.ts
    pipeline.ts
    candidates.ts
    talent-pool.ts
    departments.ts
    automations.ts
    settings.ts
    uploads.ts
  (auth)/
    onboarding/
      page.tsx         ← new
```

---

## Risk & Mitigation

| Risk | Mitigation |
|---|---|
| RLS blocks queries that should work | Verify `app_users` row is created on first login (auth trigger or server action) |
| Drizzle `db.ts` can't connect via pooler | Use `pgbouncer=true` in DATABASE_URL, ensure `DIRECT_URL` used for migrations only |
| Supabase Storage bucket doesn't exist | Create `resumes` bucket before Phase 11 (SQL or Supabase dashboard) |
| `auth.admin.inviteUserByEmail` requires service-role key | Store in `SUPABASE_SERVICE_ROLE_KEY` env var (never expose to client) |
| Workspaces table empty on first run | Onboarding gate in middleware catches this; no workspace = forced to `/onboarding` |

---

## Definition of Done

- All 11 dashboard pages load real data with no mock constants visible in code
- Auth uses real Supabase credentials (no MOCK_USERS array)
- All mutations persist after hard refresh
- RLS blocks cross-workspace queries (manual test in Supabase SQL Editor)
- Resumes upload and display correctly
- At least one email template sends successfully via Resend
