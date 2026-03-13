# Tasks: ATS Full-Stack Wiring
**Feature ID:** ats-fullstack-wiring  
**Created:** 2026-03-13  
**Status:** In Progress

Legend: ✅ Done | 🔲 Open | 🚧 In Progress

---

## Phase 0 — Supabase Client Infrastructure

- ✅ **T001** — Install `@supabase/ssr` and `@supabase/supabase-js` packages via pnpm
- ✅ **T002** — Create `lib/supabase/client.ts` with `createBrowserClient()` singleton
- ✅ **T003** — Create `lib/supabase/server.ts` with `createServerClient()` using `next/headers` cookies
- ✅ **T004** — Create `lib/db.ts` with Drizzle `postgres-js` connection using `DATABASE_URL`
- ✅ **T005** — Install `postgres` package (postgres-js driver for Drizzle) if not already present
- ✅ **T006** — Verify all required env vars are present in `.env` and `.env.example`

---

## Phase 1 — Auth: Replace Mock with Supabase Auth

- ✅ **T010** — Rewrite `lib/auth-context.tsx`: `login()` calls `supabase.auth.signInWithPassword()`
- ✅ **T011** — Rewrite `logout()` in auth context to call `supabase.auth.signOut()`
- ✅ **T012** — Load `user` state from `supabase.auth.getUser()` + workspace_members + roles query on mount
- ✅ **T013** — Keep exported `User` type, `useAuth()` hook, `AuthProvider` interface identical (no page changes needed)
- ✅ **T014** — Update `middleware.ts` to use `@supabase/ssr` session refresh pattern (refresh token on every request)
- ✅ **T015** — Create `app/actions/auth.ts` server action wrapping sign-in for the login form
- ✅ **T016** — Wire `app/(auth)/login/page.tsx` form to `signIn` server action (remove mock submit handler)
- ✅ **T017** — Create DB trigger or server action to auto-insert `app_users` row on first Supabase Auth sign-up
- 🔲 **T018** — Smoke test: sign in with a real Supabase user → redirects to `/dashboard` with no mock data

---

## Phase 2 — Workspace Provisioning & Onboarding

- ✅ **T020** — Create `lib/queries/workspace.ts` with `getUserWorkspace(userId)` Drizzle query
- ✅ **T021** — Create `app/actions/workspace.ts` server action: `createWorkspace(name, timezone)`
- ✅ **T022** — `createWorkspace` action inserts `workspaces`, `workspace_members` (admin role), seeds `internal_tools` defaults
- ✅ **T023** — Create `app/(auth)/onboarding/page.tsx` form (company name + timezone fields only)
- ✅ **T024** — Update `middleware.ts`: if authenticated but no workspace → redirect to `/onboarding`
- ✅ **T025** — Add `WorkspaceProvider` to `app/(dashboard)/layout.tsx` supplying `workspaceId` from session
- 🔲 **T026** — Smoke test: new user sign-in → lands on `/onboarding` → creates workspace → redirects to `/dashboard`

---

## Phase 3 — Jobs CRUD

- 🔲 **T030** — Create `lib/queries/jobs.ts`: `getJobs(workspaceId)` Drizzle query (join departments, job_statuses, count applications per stage)
- 🔲 **T031** — Create `lib/queries/jobs.ts`: `getJob(id, workspaceId)` single job query
- 🔲 **T032** — Create `lib/queries/departments.ts`: `getDepartments(workspaceId)` Drizzle query
- 🔲 **T033** — Create `app/actions/jobs.ts`: `createJob(data)` — inserts `jobs`, upserts `departments`
- 🔲 **T034** — Create `app/actions/jobs.ts`: `updateJob(id, data)` — updates `jobs` row
- 🔲 **T035** — Create `app/actions/jobs.ts`: `changeJobStatus(id, statusCode)` — updates `jobs.status_id`
- 🔲 **T036** — Create `app/actions/jobs.ts`: `duplicateJob(id)` — clones `jobs` row with `draft` status
- 🔲 **T037** — Create `app/actions/jobs.ts`: `archiveJob(id)` — sets `jobs.archived_at = NOW()`
- 🔲 **T038** — Convert `app/(dashboard)/jobs/page.tsx` to server component for initial data load
- 🔲 **T039** — Remove `INITIAL_JOBS` const; wire job list to `getJobs()` result
- 🔲 **T040** — Wire `JobModal` create path to `createJob` server action + `revalidatePath('/jobs')`
- 🔲 **T041** — Wire `JobModal` edit path to `updateJob` server action
- 🔲 **T042** — Wire context menu actions (status change, duplicate, delete) to server actions
- 🔲 **T043** — Smoke test: create job → persists after hard refresh

---

## Phase 4 — Job Pipeline (Kanban)

- 🔲 **T050** — Create `lib/queries/pipeline.ts`: `getJobPipeline(jobId, workspaceId)` — job + stages + applications + persons
- 🔲 **T051** — Create `app/actions/pipeline.ts`: `moveApplicationStage(applicationId, newStageId)` — calls `app.transition_application_stage()` RPC
- 🔲 **T052** — Create `app/actions/pipeline.ts`: `addCandidateToJob(jobId, stageId, personData)` — creates `persons` + `candidates` + `applications`
- 🔲 **T053** — Create `app/actions/pipeline.ts`: `scheduleInterview(applicationId, interviewData)` — inserts `interviews`
- 🔲 **T054** — Convert `app/(dashboard)/jobs/[id]/page.tsx` to server component for initial load
- 🔲 **T055** — Remove `INITIAL_STAGES` / `JOB_DATA` constants; wire to `getJobPipeline()` result
- 🔲 **T056** — Implement optimistic UI update on drag: update local state immediately, then call `moveApplicationStage`; rollback on error
- 🔲 **T057** — Wire "Add candidate" modal to `addCandidateToJob` action
- 🔲 **T058** — Wire interview schedule form to `scheduleInterview` action
- 🔲 **T059** — Smoke test: drag card to new stage → stage persists after refresh

---

## Phase 5 — Candidates CRUD

- 🔲 **T060** — Create `lib/queries/candidates.ts`: `getCandidates(workspaceId)` — persons + candidates + latest application
- 🔲 **T061** — Create `lib/queries/candidates.ts`: `getCandidate(id, workspaceId)` — full candidate detail
- 🔲 **T062** — Create `app/actions/candidates.ts`: `createCandidate(data)` — inserts `persons` + `candidates`
- 🔲 **T063** — Create `app/actions/candidates.ts`: `updateCandidate(id, data)` — updates `persons` + `candidates`
- 🔲 **T064** — Create `app/actions/candidates.ts`: `archiveCandidate(id)` — soft-delete `candidates.archived_at`
- 🔲 **T065** — Create `app/actions/candidates.ts`: `moveCandidateStage(applicationId, stageId)` — delegates to transition function
- 🔲 **T066** — Convert `app/(dashboard)/candidates/page.tsx` to server component initial load
- 🔲 **T067** — Remove `INITIAL_CANDIDATES`; wire list to real query result
- 🔲 **T068** — Wire add/edit modals to server actions
- 🔲 **T069** — Wire profile drawer to real `getCandidate()` data
- 🔲 **T070** — Smoke test: add candidate → appears in list after refresh

---

## Phase 6 — Talent Pool CRUD

- 🔲 **T075** — Create `lib/queries/talent-pool.ts`: `getTalentPool(workspaceId)` Drizzle query
- 🔲 **T076** — Create `app/actions/talent-pool.ts`: `addToPool(personData)`, `updatePoolMember(id, data)`, `archivePoolMember(id)`
- 🔲 **T077** — Create `app/actions/talent-pool.ts`: `promoteToCandidate(poolMemberId, jobId)` — creates `candidates` + `applications`, sets `promoted_at`
- 🔲 **T078** — Convert `app/(dashboard)/talent-pool/page.tsx` to server component initial load
- 🔲 **T079** — Remove `INITIAL_TALENT`; wire to real query
- 🔲 **T080** — Wire add/edit modals and promote action to server actions
- 🔲 **T081** — Smoke test: add talent pool member → persists; promote → appears in candidates

---

## Phase 7 — Dashboard + Analytics

- 🔲 **T085** — Create `lib/queries/dashboard.ts`: query `v_dashboard_summary` + last 10 `application_stage_events`
- 🔲 **T086** — Create `lib/queries/analytics.ts`: query `v_pipeline_metrics_daily` with date range param
- 🔲 **T087** — Convert `app/(dashboard)/dashboard/page.tsx` to server component; replace mock KPI values
- 🔲 **T088** — Convert `app/(dashboard)/analytics/page.tsx` to server component initial load; charts stay client-side
- 🔲 **T089** — Wire date range filter in analytics to trigger re-fetch (server action or URL search params)
- 🔲 **T090** — Smoke test: dashboard shows real counts that change when data changes

---

## Phase 8 — Departments CRUD

- 🔲 **T093** — Expand `lib/queries/departments.ts`: `getDepartmentsWithJobCounts(workspaceId)`
- 🔲 **T094** — Create `app/actions/departments.ts`: `createDepartment()`, `renameDepartment()`, `deleteDepartment()` (guard: no active jobs)
- 🔲 **T095** — Convert `app/(dashboard)/departments/page.tsx` to server component; remove any mock data
- 🔲 **T096** — Smoke test: create department → appears; delete department with active jobs → blocked

---

## Phase 9 — Automations CRUD

- 🔲 **T100** — Create `lib/queries/automations.ts`: `getAutomations(workspaceId)` joined to `automation_types`
- 🔲 **T101** — Create `app/actions/automations.ts`: `createAutomation()`, `toggleAutomation()`, `deleteAutomation()`
- 🔲 **T102** — Convert `app/(dashboard)/automations/page.tsx` to server component; remove mock data
- 🔲 **T103** — Smoke test: create automation rule → appears; toggle → is_active flips

---

## Phase 10 — Settings

- 🔲 **T108** — Create `lib/queries/settings.ts`: `getUserProfile()`, `getWorkspaceMembers()`, `getInternalTools()`
- 🔲 **T109** — Create `app/actions/settings.ts`: `updateProfile()`, `updateWorkspace()`
- 🔲 **T110** — Create `app/actions/settings.ts`: `inviteMember(email, roleCode)` — uses `supabase.auth.admin.inviteUserByEmail()` (service-role key)
- 🔲 **T111** — Create `app/actions/settings.ts`: `changeMemberRole()`, `removeMember()`
- 🔲 **T112** — Create `app/actions/settings.ts`: `addInternalTool()`, `removeInternalTool()`
- 🔲 **T113** — Add `SUPABASE_SERVICE_ROLE_KEY` to `.env` and `.env.example`
- 🔲 **T114** — Convert `app/(dashboard)/settings/page.tsx` to server component; wire all sections
- 🔲 **T115** — Smoke test: update workspace name → persists; invite member → Supabase sends email

---

## Phase 11 — File Uploads (Resume)

- 🔲 **T120** — Create `resumes` Supabase Storage bucket (via Supabase dashboard or SQL)
- 🔲 **T121** — Create `app/actions/uploads.ts`: `getResumeUploadUrl(candidateId)` — returns signed URL
- 🔲 **T122** — Create `components/ui/resume-upload.tsx` — PDF upload input component
- 🔲 **T123** — Wire resume upload into candidate add/edit modal (jobs/[id] and candidates pages)
- 🔲 **T124** — Wire resume upload into talent pool add/edit modal
- 🔲 **T125** — Smoke test: upload PDF → URL saved to DB → file accessible from profile drawer

---

## Phase 12 — Email Notifications (Resend)

- 🔲 **T130** — Install `resend` package via pnpm
- 🔲 **T131** — Create `lib/email/send.ts` — `sendEmail()` wrapper using `RESEND_API_KEY`
- 🔲 **T132** — Create `lib/email/templates/new-application.tsx` — new application received template
- 🔲 **T133** — Create `lib/email/templates/interview-scheduled.tsx` — interview confirmed template
- 🔲 **T134** — Create `lib/email/templates/offer-sent.tsx` — offer letter notification template
- 🔲 **T135** — Call `sendEmail()` in `addCandidateToJob` action (non-blocking)
- 🔲 **T136** — Call `sendEmail()` in `scheduleInterview` action (non-blocking)
- 🔲 **T137** — Smoke test: schedule interview → email arrives in inbox via Resend dashboard

---

## Completion Criteria

- **C001:** `MOCK_USERS` array is deleted from `lib/auth-context.tsx`
- **C002:** All 9 dashboard pages load data with zero hardcoded arrays
- **C003:** All mutations survive a hard page refresh (data is in Supabase)
- **C004:** RLS test: user from workspace A cannot query workspace B data
- **C005:** Resumes upload end-to-end (upload → stored → displayed)
- **C006:** At least one email template delivers successfully via Resend

---

## Progress Summary (as of 2026-03-14)

- Phase 0: 6/6 tasks complete
- Phase 1: 8/9 tasks complete
- Phase 2: 6/7 tasks complete
- Phase 3: 0/13 tasks complete
- Phase 4: 0/10 tasks complete
- Phase 5: 0/11 tasks complete
- Phase 6: 0/7 tasks complete
- Phase 7: 0/6 tasks complete
- Phase 8: 0/4 tasks complete
- Phase 9: 0/4 tasks complete
- Phase 10: 0/8 tasks complete
- Phase 11: 0/6 tasks complete
- Phase 12: 0/8 tasks complete

**Total: 20 / 99 tasks complete**
