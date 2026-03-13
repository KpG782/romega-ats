# ATS Page-to-Table Coverage Matrix

Last updated: March 13, 2026

## Coverage Goal
Ensure all current pages in the ATS app are backed by normalized tables and event sources.

| Page | Primary Tables | Supporting Tables | Notes |
|---|---|---|---|
| app/(auth)/login/page.tsx | app_users, workspace_memberships | user_role_assignments, roles, auth.users | identity, membership, and role resolution |
| app/(dashboard)/dashboard/page.tsx | jobs, applications, application_stage_events | offers, automations, automation_runs, v_dashboard_summary | summary cards and recent activity |
| app/(dashboard)/candidates/page.tsx | people, applications | candidate_sources, person_tags, tags, application_stage_events | candidate listing, filters, stage state |
| app/(dashboard)/jobs/page.tsx | jobs, job_statuses | departments, applications, job_pipeline_stages | job lifecycle and pipeline rollups |
| app/(dashboard)/jobs/[id]/page.tsx | applications, job_pipeline_stages | people, application_stage_events, interviews, offers | per-job kanban and detailed pipeline movement |
| app/(dashboard)/departments/page.tsx | departments, department_members | app_users, jobs | department ownership and role counts |
| app/(dashboard)/talent-pool/page.tsx | talent_pool_entries, people | talent_statuses, availability_statuses, applications | pre-application pool and promotion link |
| app/(dashboard)/analytics/page.tsx | application_stage_events, applications, jobs | offers, v_pipeline_metrics_daily | funnel conversion and trend metrics |
| app/(dashboard)/automations/page.tsx | automations, automation_runs | automation_trigger_types, automation_action_types, applications | automation definitions and execution status |
| app/(dashboard)/settings/page.tsx | workspace_settings, workspace_integrations | workspaces, roles, user_role_assignments | tenant-level config and integration records |
| app/(dashboard)/internal-tools/page.tsx | internal_tools, internal_tool_categories | workspaces | workspace-owned internal app launcher |

## Pipeline Flow Coverage
- Applied -> Screening -> Technical -> Final Interview -> Offer -> Hired/Rejected
- Source tables: pipeline_stage_catalog, applications.current_stage_id, application_stage_events
- Governance: stage transition function and update guard trigger

## Notes on Normalization
- people is shared by applications and talent_pool_entries to avoid duplicate identity rows.
- many-to-many tagging is normalized via tags and person_tags.
- reference values use lookup tables instead of repeated text literals in transactional rows.
