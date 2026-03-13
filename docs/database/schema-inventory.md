# ATS 3NF Schema Inventory

Last updated: March 13, 2026

## Scope
This inventory documents PK/FK/uniqueness/cardinality for the Supabase ATS schema implemented in:
- supabase/migrations/202603130001_ats_3nf_foundation.sql
- supabase/migrations/202603130002_ats_3nf_rls.sql
- supabase/migrations/202603130003_ats_3nf_seed_reference_data.sql
- supabase/migrations/202603130004_ats_3nf_reporting_views.sql

## Conventions
- Primary keys: uuid, default gen_random_uuid().
- Audit columns: created_at and updated_at (timestamptz) on mutable tables.
- Tenant model: workspace-owned transactional data via workspace_id.
- Delete strategy: no user-facing DELETE policies under RLS (soft-delete preferred through archived_at where available).

## Reference Tables

| Table | PK | Unique | Notes |
|---|---|---|---|
| roles | id | code | normalized role catalog |
| job_statuses | id | code | job lifecycle statuses |
| pipeline_stage_catalog | id | code | global stage definitions |
| application_statuses | id | code | application lifecycle statuses |
| candidate_sources | id | code | source lookup |
| talent_statuses | id | code | hot/warm/cold lookup |
| availability_statuses | id | code | availability lookup |
| automation_trigger_types | id | code | automation trigger lookup |
| automation_action_types | id | code | automation action lookup |
| internal_tool_categories | id | code | internal tool grouping |

## Transactional Tables and Relationships

| Table | PK | Key FKs | Unique Constraints | Cardinality |
|---|---|---|---|---|
| workspaces | id | - | slug | 1 workspace -> many domain records |
| app_users | id (auth.users.id) | auth.users(id) | lower(email) | 1 auth user -> 1 app user profile |
| workspace_memberships | id | workspace_id -> workspaces, user_id -> app_users | workspace_id + user_id | many-to-many users <-> workspaces |
| user_role_assignments | id | workspace_id, user_id, role_id | workspace_id + user_id + role_id | many role assignments per user/workspace |
| departments | id | workspace_id, hiring_manager_user_id | workspace_id + name | 1 workspace -> many departments |
| department_members | id | workspace_id, department_id, user_id | workspace_id + department_id + user_id | many-to-many departments <-> users |
| jobs | id | workspace_id, department_id, status_id | - | 1 department -> many jobs |
| job_pipeline_stages | id | workspace_id, job_id, stage_id | job_id + stage_id, job_id + display_order | 1 job -> ordered many stages |
| people | id | workspace_id | partial unique workspace_id + lower(email) active | reusable person profile |
| tags | id | workspace_id | workspace_id + slug | tag catalog per workspace |
| person_tags | id | workspace_id, person_id, tag_id | workspace_id + person_id + tag_id | many-to-many people <-> tags |
| applications | id | workspace_id, job_id, person_id, status_id, current_stage_id | partial unique workspace_id + person_id + job_id active | person-job application records |
| application_stage_events | id | workspace_id, application_id, from_stage_id, to_stage_id | - | append-only stage audit events |
| talent_pool_entries | id | workspace_id, person_id, talent_status_id, availability_status_id | partial unique workspace_id + person_id active | person pre-application records |
| interviews | id | workspace_id, application_id | - | 1 application -> many interviews |
| interview_feedback | id | workspace_id, interview_id, reviewer_user_id | interview_id + reviewer_user_id | 1 interview -> many reviewer feedback entries |
| offers | id | workspace_id, application_id | application_id + version; partial unique current offer per application | 1 application -> versioned offers |
| automations | id | workspace_id, trigger_type_id, action_type_id | workspace_id + name | workspace automation definitions |
| automation_runs | id | workspace_id, automation_id, application_id | - | append-only automation execution logs |
| workspace_settings | id | workspace_id | workspace_id | 1 workspace -> 1 settings row |
| workspace_integrations | id | workspace_id | workspace_id + provider_code | workspace integration registrations |
| internal_tools | id | workspace_id, category_id | workspace_id + name | workspace-owned internal app launcher |

## Stage Transition Governance
- Direct updates to applications.current_stage_id are guarded by trigger function app.guard_application_stage_update().
- Stage changes are expected through app.transition_application_stage() which updates current stage and inserts application_stage_events.

## Reporting Views
| View | Purpose |
|---|---|
| v_pipeline_metrics_daily | daily stage transition counts per workspace/stage |
| v_dashboard_summary | summarized workspace-level dashboard metrics |
