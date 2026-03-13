]633;E;;ed2e3359-c26d-4768-a6e9-fa42fe51193f]633;C-- Supabase SQL Editor Bundle: Post-Apply Checks
-- Generated: 2026-03-13
-- Run after the first-time setup script succeeds.

-- ===== Smoke Checks =====
-- Manual smoke-check script for local/staging verification.
-- Run after migrations 0001-0004.

-- 1) Reference data available
SELECT code FROM roles ORDER BY code;
SELECT code FROM pipeline_stage_catalog ORDER BY display_order;
SELECT code FROM internal_tool_categories ORDER BY display_order;

-- 2) Basic table availability
SELECT to_regclass('public.workspaces') AS workspaces_table;
SELECT to_regclass('public.applications') AS applications_table;
SELECT to_regclass('public.application_stage_events') AS application_stage_events_table;

-- 3) View availability
SELECT to_regclass('public.v_pipeline_metrics_daily') AS v_pipeline_metrics_daily_view;
SELECT to_regclass('public.v_dashboard_summary') AS v_dashboard_summary_view;

-- 4) Stage transition guard should block direct mutation (expected failure if row exists and stage changes directly)
-- UPDATE applications
-- SET current_stage_id = (SELECT id FROM pipeline_stage_catalog ORDER BY display_order LIMIT 1)
-- WHERE id = '00000000-0000-0000-0000-000000000000';

-- 5) Function-based transition (replace IDs before execution)
-- SELECT app.transition_application_stage(
--   '00000000-0000-0000-0000-000000000000',
--   '00000000-0000-0000-0000-000000000000',
--   'Smoke test transition',
--   '{"source":"smoke"}'::jsonb
-- );

-- 6) Internal tools seed check
SELECT name, url
FROM internal_tools
WHERE name IN (
  'Romega Email Signature Generator',
  'Romega Certificate Generator'
)
ORDER BY name;

-- ===== Unauthorized Operation Test Outline =====
-- Unauthorized operation test outline for RLS validation.
-- Execute in an authenticated user context that is NOT a member of target workspace.

-- Expect: no rows returned
-- SELECT * FROM jobs WHERE workspace_id = '00000000-0000-0000-0000-000000000000';

-- Expect: insert blocked
-- INSERT INTO jobs (workspace_id, department_id, status_id, title)
-- VALUES ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', 'Unauthorized Job');

-- Expect: update blocked
-- UPDATE applications
-- SET notes = 'unauthorized edit'
-- WHERE workspace_id = '00000000-0000-0000-0000-000000000000';

-- Expect: delete blocked due to missing DELETE policies
-- DELETE FROM people
-- WHERE workspace_id = '00000000-0000-0000-0000-000000000000';
