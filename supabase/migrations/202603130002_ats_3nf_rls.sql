BEGIN;

ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_role_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_pipeline_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE people ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE person_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_stage_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent_pool_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE internal_tools ENABLE ROW LEVEL SECURITY;

-- Workspace-level visibility and write access where membership is active.
CREATE POLICY workspaces_select_policy
ON workspaces
FOR SELECT
USING (app.user_in_workspace(id));

CREATE POLICY app_users_select_self_policy
ON app_users
FOR SELECT
USING (id = auth.uid());

CREATE POLICY app_users_update_self_policy
ON app_users
FOR UPDATE
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

CREATE POLICY workspace_memberships_select_policy
ON workspace_memberships
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY workspace_memberships_insert_self_policy
ON workspace_memberships
FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY workspace_memberships_update_self_policy
ON workspace_memberships
FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY user_role_assignments_select_policy
ON user_role_assignments
FOR SELECT
USING (app.user_in_workspace(workspace_id));

CREATE POLICY user_role_assignments_insert_policy
ON user_role_assignments
FOR INSERT
WITH CHECK (app.user_in_workspace(workspace_id));

CREATE POLICY user_role_assignments_update_policy
ON user_role_assignments
FOR UPDATE
USING (app.user_in_workspace(workspace_id))
WITH CHECK (app.user_in_workspace(workspace_id));

CREATE POLICY departments_select_policy
ON departments
FOR SELECT
USING (app.user_in_workspace(workspace_id));

CREATE POLICY departments_insert_policy
ON departments
FOR INSERT
WITH CHECK (app.user_in_workspace(workspace_id));

CREATE POLICY departments_update_policy
ON departments
FOR UPDATE
USING (app.user_in_workspace(workspace_id))
WITH CHECK (app.user_in_workspace(workspace_id));

CREATE POLICY department_members_select_policy
ON department_members
FOR SELECT
USING (app.user_in_workspace(workspace_id));

CREATE POLICY department_members_insert_policy
ON department_members
FOR INSERT
WITH CHECK (app.user_in_workspace(workspace_id));

CREATE POLICY department_members_update_policy
ON department_members
FOR UPDATE
USING (app.user_in_workspace(workspace_id))
WITH CHECK (app.user_in_workspace(workspace_id));

CREATE POLICY jobs_select_policy
ON jobs
FOR SELECT
USING (app.user_in_workspace(workspace_id));

CREATE POLICY jobs_insert_policy
ON jobs
FOR INSERT
WITH CHECK (app.user_in_workspace(workspace_id));

CREATE POLICY jobs_update_policy
ON jobs
FOR UPDATE
USING (app.user_in_workspace(workspace_id))
WITH CHECK (app.user_in_workspace(workspace_id));

CREATE POLICY job_pipeline_stages_select_policy
ON job_pipeline_stages
FOR SELECT
USING (app.user_in_workspace(workspace_id));

CREATE POLICY job_pipeline_stages_insert_policy
ON job_pipeline_stages
FOR INSERT
WITH CHECK (app.user_in_workspace(workspace_id));

CREATE POLICY job_pipeline_stages_update_policy
ON job_pipeline_stages
FOR UPDATE
USING (app.user_in_workspace(workspace_id))
WITH CHECK (app.user_in_workspace(workspace_id));

CREATE POLICY people_select_policy
ON people
FOR SELECT
USING (app.user_in_workspace(workspace_id));

CREATE POLICY people_insert_policy
ON people
FOR INSERT
WITH CHECK (app.user_in_workspace(workspace_id));

CREATE POLICY people_update_policy
ON people
FOR UPDATE
USING (app.user_in_workspace(workspace_id))
WITH CHECK (app.user_in_workspace(workspace_id));

CREATE POLICY tags_select_policy
ON tags
FOR SELECT
USING (app.user_in_workspace(workspace_id));

CREATE POLICY tags_insert_policy
ON tags
FOR INSERT
WITH CHECK (app.user_in_workspace(workspace_id));

CREATE POLICY tags_update_policy
ON tags
FOR UPDATE
USING (app.user_in_workspace(workspace_id))
WITH CHECK (app.user_in_workspace(workspace_id));

CREATE POLICY person_tags_select_policy
ON person_tags
FOR SELECT
USING (app.user_in_workspace(workspace_id));

CREATE POLICY person_tags_insert_policy
ON person_tags
FOR INSERT
WITH CHECK (app.user_in_workspace(workspace_id));

CREATE POLICY person_tags_update_policy
ON person_tags
FOR UPDATE
USING (app.user_in_workspace(workspace_id))
WITH CHECK (app.user_in_workspace(workspace_id));

CREATE POLICY applications_select_policy
ON applications
FOR SELECT
USING (app.user_in_workspace(workspace_id));

CREATE POLICY applications_insert_policy
ON applications
FOR INSERT
WITH CHECK (app.user_in_workspace(workspace_id));

CREATE POLICY applications_update_policy
ON applications
FOR UPDATE
USING (app.user_in_workspace(workspace_id))
WITH CHECK (app.user_in_workspace(workspace_id));

CREATE POLICY application_stage_events_select_policy
ON application_stage_events
FOR SELECT
USING (app.user_in_workspace(workspace_id));

CREATE POLICY application_stage_events_insert_policy
ON application_stage_events
FOR INSERT
WITH CHECK (app.user_in_workspace(workspace_id));

CREATE POLICY talent_pool_entries_select_policy
ON talent_pool_entries
FOR SELECT
USING (app.user_in_workspace(workspace_id));

CREATE POLICY talent_pool_entries_insert_policy
ON talent_pool_entries
FOR INSERT
WITH CHECK (app.user_in_workspace(workspace_id));

CREATE POLICY talent_pool_entries_update_policy
ON talent_pool_entries
FOR UPDATE
USING (app.user_in_workspace(workspace_id))
WITH CHECK (app.user_in_workspace(workspace_id));

CREATE POLICY interviews_select_policy
ON interviews
FOR SELECT
USING (app.user_in_workspace(workspace_id));

CREATE POLICY interviews_insert_policy
ON interviews
FOR INSERT
WITH CHECK (app.user_in_workspace(workspace_id));

CREATE POLICY interviews_update_policy
ON interviews
FOR UPDATE
USING (app.user_in_workspace(workspace_id))
WITH CHECK (app.user_in_workspace(workspace_id));

CREATE POLICY interview_feedback_select_policy
ON interview_feedback
FOR SELECT
USING (app.user_in_workspace(workspace_id));

CREATE POLICY interview_feedback_insert_policy
ON interview_feedback
FOR INSERT
WITH CHECK (app.user_in_workspace(workspace_id));

CREATE POLICY interview_feedback_update_policy
ON interview_feedback
FOR UPDATE
USING (app.user_in_workspace(workspace_id))
WITH CHECK (app.user_in_workspace(workspace_id));

CREATE POLICY offers_select_policy
ON offers
FOR SELECT
USING (app.user_in_workspace(workspace_id));

CREATE POLICY offers_insert_policy
ON offers
FOR INSERT
WITH CHECK (app.user_in_workspace(workspace_id));

CREATE POLICY offers_update_policy
ON offers
FOR UPDATE
USING (app.user_in_workspace(workspace_id))
WITH CHECK (app.user_in_workspace(workspace_id));

CREATE POLICY automations_select_policy
ON automations
FOR SELECT
USING (app.user_in_workspace(workspace_id));

CREATE POLICY automations_insert_policy
ON automations
FOR INSERT
WITH CHECK (app.user_in_workspace(workspace_id));

CREATE POLICY automations_update_policy
ON automations
FOR UPDATE
USING (app.user_in_workspace(workspace_id))
WITH CHECK (app.user_in_workspace(workspace_id));

CREATE POLICY automation_runs_select_policy
ON automation_runs
FOR SELECT
USING (app.user_in_workspace(workspace_id));

CREATE POLICY automation_runs_insert_policy
ON automation_runs
FOR INSERT
WITH CHECK (app.user_in_workspace(workspace_id));

CREATE POLICY workspace_settings_select_policy
ON workspace_settings
FOR SELECT
USING (app.user_in_workspace(workspace_id));

CREATE POLICY workspace_settings_insert_policy
ON workspace_settings
FOR INSERT
WITH CHECK (app.user_in_workspace(workspace_id));

CREATE POLICY workspace_settings_update_policy
ON workspace_settings
FOR UPDATE
USING (app.user_in_workspace(workspace_id))
WITH CHECK (app.user_in_workspace(workspace_id));

CREATE POLICY workspace_integrations_select_policy
ON workspace_integrations
FOR SELECT
USING (app.user_in_workspace(workspace_id));

CREATE POLICY workspace_integrations_insert_policy
ON workspace_integrations
FOR INSERT
WITH CHECK (app.user_in_workspace(workspace_id));

CREATE POLICY workspace_integrations_update_policy
ON workspace_integrations
FOR UPDATE
USING (app.user_in_workspace(workspace_id))
WITH CHECK (app.user_in_workspace(workspace_id));

CREATE POLICY internal_tools_select_policy
ON internal_tools
FOR SELECT
USING (app.user_in_workspace(workspace_id));

CREATE POLICY internal_tools_insert_policy
ON internal_tools
FOR INSERT
WITH CHECK (app.user_in_workspace(workspace_id));

CREATE POLICY internal_tools_update_policy
ON internal_tools
FOR UPDATE
USING (app.user_in_workspace(workspace_id))
WITH CHECK (app.user_in_workspace(workspace_id));

-- Delete strategy: block user-initiated hard deletes by not creating DELETE policies.

COMMIT;
