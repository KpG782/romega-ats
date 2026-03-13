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
