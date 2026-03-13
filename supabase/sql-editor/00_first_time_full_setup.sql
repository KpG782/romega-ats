]633;E;;ed2e3359-c26d-4768-a6e9-fa42fe51193f]633;C-- Supabase SQL Editor Bundle: First-Time ATS 3NF Setup
-- Generated: 2026-03-13
-- Run this whole file in SQL Editor for initial setup.

-- ===== 202603130001_ats_3nf_foundation.sql =====
BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE SCHEMA IF NOT EXISTS app;

-- Shared trigger helper for mutable tables.
CREATE OR REPLACE FUNCTION app.touch_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TABLE IF NOT EXISTS workspaces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  timezone text NOT NULL DEFAULT 'Asia/Manila',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS app_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  email text NOT NULL,
  avatar_url text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),
  CONSTRAINT app_users_email_format CHECK (position('@' IN email) > 1)
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_app_users_email_lower
ON app_users (LOWER(email));

CREATE TABLE IF NOT EXISTS roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  label text NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workspace_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  membership_status text NOT NULL DEFAULT 'active',
  title text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),
  CONSTRAINT workspace_memberships_status_check CHECK (membership_status IN ('active', 'invited', 'suspended')),
  CONSTRAINT uq_workspace_memberships_workspace_user UNIQUE (workspace_id, user_id)
);

CREATE TABLE IF NOT EXISTS user_role_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  role_id uuid NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_user_role_assignments UNIQUE (workspace_id, user_id, role_id)
);

CREATE TABLE IF NOT EXISTS job_statuses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  label text NOT NULL,
  is_terminal boolean NOT NULL DEFAULT false,
  display_order integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pipeline_stage_catalog (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  label text NOT NULL,
  is_terminal boolean NOT NULL DEFAULT false,
  display_order integer NOT NULL,
  color_hex text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),
  CONSTRAINT pipeline_stage_catalog_color_hex_check CHECK (color_hex ~ '^#[0-9A-Fa-f]{6}$')
);

CREATE TABLE IF NOT EXISTS application_statuses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  label text NOT NULL,
  is_terminal boolean NOT NULL DEFAULT false,
  display_order integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS candidate_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  label text NOT NULL,
  display_order integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS talent_statuses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  label text NOT NULL,
  display_order integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS availability_statuses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  label text NOT NULL,
  display_order integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS automation_trigger_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  label text NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS automation_action_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  label text NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS internal_tool_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  label text NOT NULL,
  display_order integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name text NOT NULL,
  code text,
  hiring_manager_user_id uuid REFERENCES app_users(id) ON DELETE SET NULL,
  created_by_user_id uuid REFERENCES app_users(id) ON DELETE SET NULL,
  updated_by_user_id uuid REFERENCES app_users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),
  archived_at timestamptz,
  CONSTRAINT uq_departments_workspace_name UNIQUE (workspace_id, name)
);

CREATE TABLE IF NOT EXISTS department_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  department_id uuid NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  membership_type text NOT NULL DEFAULT 'member',
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),
  CONSTRAINT department_membership_type_check CHECK (membership_type IN ('member', 'manager', 'viewer')),
  CONSTRAINT uq_department_members UNIQUE (workspace_id, department_id, user_id)
);

CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  department_id uuid NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
  status_id uuid NOT NULL REFERENCES job_statuses(id) ON DELETE RESTRICT,
  title text NOT NULL,
  employment_type text,
  location text,
  work_setup text,
  description text,
  headcount integer NOT NULL DEFAULT 1,
  created_by_user_id uuid REFERENCES app_users(id) ON DELETE SET NULL,
  updated_by_user_id uuid REFERENCES app_users(id) ON DELETE SET NULL,
  published_at timestamptz,
  closed_at timestamptz,
  archived_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),
  CONSTRAINT jobs_headcount_check CHECK (headcount > 0)
);

CREATE TABLE IF NOT EXISTS job_pipeline_stages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  job_id uuid NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  stage_id uuid NOT NULL REFERENCES pipeline_stage_catalog(id) ON DELETE RESTRICT,
  display_order integer NOT NULL,
  is_enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_job_pipeline_stages_stage UNIQUE (job_id, stage_id),
  CONSTRAINT uq_job_pipeline_stages_order UNIQUE (job_id, display_order)
);

CREATE TABLE IF NOT EXISTS people (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text,
  phone text,
  location text,
  headline text,
  summary text,
  linkedin_url text,
  portfolio_url text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by_user_id uuid REFERENCES app_users(id) ON DELETE SET NULL,
  updated_by_user_id uuid REFERENCES app_users(id) ON DELETE SET NULL,
  archived_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_people_workspace_email_active
ON people (workspace_id, LOWER(email))
WHERE email IS NOT NULL AND archived_at IS NULL;

CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_tags_workspace_slug UNIQUE (workspace_id, slug)
);

CREATE TABLE IF NOT EXISTS person_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  person_id uuid NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_person_tags UNIQUE (workspace_id, person_id, tag_id)
);

CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  job_id uuid NOT NULL REFERENCES jobs(id) ON DELETE RESTRICT,
  person_id uuid NOT NULL REFERENCES people(id) ON DELETE RESTRICT,
  candidate_source_id uuid REFERENCES candidate_sources(id) ON DELETE RESTRICT,
  status_id uuid NOT NULL REFERENCES application_statuses(id) ON DELETE RESTRICT,
  current_stage_id uuid REFERENCES pipeline_stage_catalog(id) ON DELETE RESTRICT,
  owner_user_id uuid REFERENCES app_users(id) ON DELETE SET NULL,
  score smallint,
  rating smallint,
  summary text,
  notes text,
  applied_at timestamptz NOT NULL DEFAULT NOW(),
  last_activity_at timestamptz,
  created_by_user_id uuid REFERENCES app_users(id) ON DELETE SET NULL,
  updated_by_user_id uuid REFERENCES app_users(id) ON DELETE SET NULL,
  archived_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),
  CONSTRAINT applications_score_check CHECK (score IS NULL OR (score >= 0 AND score <= 100)),
  CONSTRAINT applications_rating_check CHECK (rating IS NULL OR (rating >= 0 AND rating <= 5))
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_applications_active_person_job
ON applications (workspace_id, person_id, job_id)
WHERE archived_at IS NULL;

CREATE TABLE IF NOT EXISTS application_stage_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  application_id uuid NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  from_stage_id uuid REFERENCES pipeline_stage_catalog(id) ON DELETE RESTRICT,
  to_stage_id uuid NOT NULL REFERENCES pipeline_stage_catalog(id) ON DELETE RESTRICT,
  transition_reason text,
  transition_metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  moved_by_user_id uuid REFERENCES app_users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS talent_pool_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  person_id uuid NOT NULL REFERENCES people(id) ON DELETE RESTRICT,
  talent_status_id uuid NOT NULL REFERENCES talent_statuses(id) ON DELETE RESTRICT,
  availability_status_id uuid NOT NULL REFERENCES availability_statuses(id) ON DELETE RESTRICT,
  desired_role text,
  desired_department_id uuid REFERENCES departments(id) ON DELETE SET NULL,
  expected_salary numeric(12, 2),
  currency_code char(3) NOT NULL DEFAULT 'PHP',
  score smallint,
  rating smallint,
  notes text,
  last_contacted_at timestamptz,
  promoted_application_id uuid REFERENCES applications(id) ON DELETE SET NULL,
  created_by_user_id uuid REFERENCES app_users(id) ON DELETE SET NULL,
  updated_by_user_id uuid REFERENCES app_users(id) ON DELETE SET NULL,
  archived_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),
  CONSTRAINT talent_pool_score_check CHECK (score IS NULL OR (score >= 0 AND score <= 100)),
  CONSTRAINT talent_pool_rating_check CHECK (rating IS NULL OR (rating >= 0 AND rating <= 5))
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_talent_pool_active_person
ON talent_pool_entries (workspace_id, person_id)
WHERE archived_at IS NULL;

CREATE TABLE IF NOT EXISTS interviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  application_id uuid NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  interviewer_user_id uuid REFERENCES app_users(id) ON DELETE SET NULL,
  scheduler_user_id uuid REFERENCES app_users(id) ON DELETE SET NULL,
  interview_type text NOT NULL DEFAULT 'technical',
  status text NOT NULL DEFAULT 'scheduled',
  starts_at timestamptz NOT NULL,
  ends_at timestamptz,
  location text,
  meeting_url text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),
  CONSTRAINT interviews_status_check CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
  CONSTRAINT interviews_time_check CHECK (ends_at IS NULL OR ends_at > starts_at)
);

CREATE TABLE IF NOT EXISTS interview_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  interview_id uuid NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
  reviewer_user_id uuid NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  score smallint,
  recommendation text,
  notes text,
  submitted_at timestamptz NOT NULL DEFAULT NOW(),
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),
  CONSTRAINT interview_feedback_score_check CHECK (score IS NULL OR (score >= 0 AND score <= 100)),
  CONSTRAINT interview_feedback_recommendation_check CHECK (recommendation IS NULL OR recommendation IN ('strong_yes', 'yes', 'no', 'strong_no')),
  CONSTRAINT uq_interview_feedback_review UNIQUE (interview_id, reviewer_user_id)
);

CREATE TABLE IF NOT EXISTS offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  application_id uuid NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'draft',
  version integer NOT NULL DEFAULT 1,
  salary_amount numeric(12, 2),
  currency_code char(3) NOT NULL DEFAULT 'PHP',
  start_date date,
  expires_at timestamptz,
  sent_at timestamptz,
  accepted_at timestamptz,
  declined_at timestamptz,
  is_current boolean NOT NULL DEFAULT true,
  notes text,
  created_by_user_id uuid REFERENCES app_users(id) ON DELETE SET NULL,
  updated_by_user_id uuid REFERENCES app_users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),
  CONSTRAINT offers_status_check CHECK (status IN ('draft', 'sent', 'accepted', 'declined', 'withdrawn', 'expired')),
  CONSTRAINT uq_offers_application_version UNIQUE (application_id, version)
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_offers_current_per_application
ON offers (application_id)
WHERE is_current = true;

CREATE TABLE IF NOT EXISTS automations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  trigger_type_id uuid NOT NULL REFERENCES automation_trigger_types(id) ON DELETE RESTRICT,
  action_type_id uuid NOT NULL REFERENCES automation_action_types(id) ON DELETE RESTRICT,
  trigger_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  action_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_by_user_id uuid REFERENCES app_users(id) ON DELETE SET NULL,
  updated_by_user_id uuid REFERENCES app_users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_automations_workspace_name UNIQUE (workspace_id, name)
);

CREATE TABLE IF NOT EXISTS automation_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  automation_id uuid NOT NULL REFERENCES automations(id) ON DELETE CASCADE,
  application_id uuid REFERENCES applications(id) ON DELETE SET NULL,
  status text NOT NULL,
  error_message text,
  started_at timestamptz,
  finished_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  CONSTRAINT automation_runs_status_check CHECK (status IN ('queued', 'running', 'success', 'failed', 'skipped'))
);

CREATE TABLE IF NOT EXISTS workspace_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  default_timezone text NOT NULL DEFAULT 'Asia/Manila',
  notifications_enabled boolean NOT NULL DEFAULT true,
  settings_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_workspace_settings_workspace UNIQUE (workspace_id)
);

CREATE TABLE IF NOT EXISTS workspace_integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  provider_code text NOT NULL,
  display_name text NOT NULL,
  status text NOT NULL DEFAULT 'inactive',
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  secret_ref text,
  last_synced_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),
  CONSTRAINT workspace_integrations_status_check CHECK (status IN ('active', 'inactive', 'error')),
  CONSTRAINT uq_workspace_integrations_provider UNIQUE (workspace_id, provider_code)
);

CREATE TABLE IF NOT EXISTS internal_tools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES internal_tool_categories(id) ON DELETE RESTRICT,
  name text NOT NULL,
  description text,
  url text NOT NULL,
  icon_key text,
  sort_order integer NOT NULL DEFAULT 100,
  is_active boolean NOT NULL DEFAULT true,
  open_in_new_tab boolean NOT NULL DEFAULT true,
  created_by_user_id uuid REFERENCES app_users(id) ON DELETE SET NULL,
  updated_by_user_id uuid REFERENCES app_users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),
  CONSTRAINT internal_tools_url_check CHECK (url ~ '^https?://'),
  CONSTRAINT uq_internal_tools_workspace_name UNIQUE (workspace_id, name)
);

-- Workspace-scoped helper for RLS and secured functions.
CREATE OR REPLACE FUNCTION app.user_in_workspace(target_workspace_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM workspace_memberships wm
    WHERE wm.workspace_id = target_workspace_id
      AND wm.user_id = auth.uid()
      AND wm.is_active = true
  );
$$;

REVOKE ALL ON FUNCTION app.user_in_workspace(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION app.user_in_workspace(uuid) TO authenticated, service_role;

-- Guard direct stage mutation to keep audit events complete.
CREATE OR REPLACE FUNCTION app.guard_application_stage_update()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.current_stage_id IS DISTINCT FROM OLD.current_stage_id
     AND COALESCE(current_setting('app.stage_transition_context', true), '') <> 'allowed' THEN
    RAISE EXCEPTION 'Use app.transition_application_stage() to change application stage';
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION app.transition_application_stage(
  p_application_id uuid,
  p_to_stage_id uuid,
  p_reason text DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_workspace_id uuid;
  v_from_stage_id uuid;
  v_event_id uuid;
BEGIN
  SELECT workspace_id, current_stage_id
  INTO v_workspace_id, v_from_stage_id
  FROM applications
  WHERE id = p_application_id
    AND archived_at IS NULL
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Application not found';
  END IF;

  IF NOT app.user_in_workspace(v_workspace_id) THEN
    RAISE EXCEPTION 'Not authorized for this workspace';
  END IF;

  IF v_from_stage_id IS NOT NULL AND v_from_stage_id = p_to_stage_id THEN
    RAISE EXCEPTION 'Application is already in the target stage';
  END IF;

  PERFORM set_config('app.stage_transition_context', 'allowed', true);

  UPDATE applications
  SET
    current_stage_id = p_to_stage_id,
    last_activity_at = NOW(),
    updated_at = NOW(),
    updated_by_user_id = auth.uid()
  WHERE id = p_application_id;

  INSERT INTO application_stage_events (
    workspace_id,
    application_id,
    from_stage_id,
    to_stage_id,
    transition_reason,
    transition_metadata,
    moved_by_user_id
  )
  VALUES (
    v_workspace_id,
    p_application_id,
    v_from_stage_id,
    p_to_stage_id,
    p_reason,
    COALESCE(p_metadata, '{}'::jsonb),
    auth.uid()
  )
  RETURNING id INTO v_event_id;

  RETURN v_event_id;
END;
$$;

REVOKE ALL ON FUNCTION app.transition_application_stage(uuid, uuid, text, jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION app.transition_application_stage(uuid, uuid, text, jsonb) TO authenticated, service_role;

CREATE TRIGGER trg_guard_application_stage_update
BEFORE UPDATE OF current_stage_id ON applications
FOR EACH ROW
EXECUTE FUNCTION app.guard_application_stage_update();

CREATE INDEX IF NOT EXISTS idx_workspace_memberships_workspace_user_active
ON workspace_memberships (workspace_id, user_id, is_active);

CREATE INDEX IF NOT EXISTS idx_user_role_assignments_workspace_user
ON user_role_assignments (workspace_id, user_id);

CREATE INDEX IF NOT EXISTS idx_departments_workspace_name
ON departments (workspace_id, name);

CREATE INDEX IF NOT EXISTS idx_department_members_workspace_department
ON department_members (workspace_id, department_id);

CREATE INDEX IF NOT EXISTS idx_jobs_workspace_status
ON jobs (workspace_id, status_id);

CREATE INDEX IF NOT EXISTS idx_jobs_workspace_department
ON jobs (workspace_id, department_id);

CREATE INDEX IF NOT EXISTS idx_job_pipeline_stages_job_order
ON job_pipeline_stages (job_id, display_order);

CREATE INDEX IF NOT EXISTS idx_people_workspace_name
ON people (workspace_id, full_name);

CREATE INDEX IF NOT EXISTS idx_tags_workspace_name
ON tags (workspace_id, name);

CREATE INDEX IF NOT EXISTS idx_person_tags_workspace_person
ON person_tags (workspace_id, person_id);

CREATE INDEX IF NOT EXISTS idx_applications_workspace_stage
ON applications (workspace_id, current_stage_id);

CREATE INDEX IF NOT EXISTS idx_applications_workspace_job
ON applications (workspace_id, job_id);

CREATE INDEX IF NOT EXISTS idx_applications_workspace_person
ON applications (workspace_id, person_id);

CREATE INDEX IF NOT EXISTS idx_application_stage_events_workspace_application_created
ON application_stage_events (workspace_id, application_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_application_stage_events_workspace_created
ON application_stage_events (workspace_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_talent_pool_workspace_status
ON talent_pool_entries (workspace_id, talent_status_id);

CREATE INDEX IF NOT EXISTS idx_talent_pool_workspace_availability
ON talent_pool_entries (workspace_id, availability_status_id);

CREATE INDEX IF NOT EXISTS idx_interviews_workspace_application
ON interviews (workspace_id, application_id);

CREATE INDEX IF NOT EXISTS idx_offers_workspace_application
ON offers (workspace_id, application_id);

CREATE INDEX IF NOT EXISTS idx_automations_workspace_active
ON automations (workspace_id, is_active);

CREATE INDEX IF NOT EXISTS idx_automation_runs_workspace_status
ON automation_runs (workspace_id, status);

CREATE INDEX IF NOT EXISTS idx_workspace_integrations_workspace_provider
ON workspace_integrations (workspace_id, provider_code);

CREATE INDEX IF NOT EXISTS idx_internal_tools_workspace_active_sort
ON internal_tools (workspace_id, is_active, sort_order);

CREATE TRIGGER trg_workspaces_updated_at
BEFORE UPDATE ON workspaces
FOR EACH ROW EXECUTE FUNCTION app.touch_updated_at();

CREATE TRIGGER trg_app_users_updated_at
BEFORE UPDATE ON app_users
FOR EACH ROW EXECUTE FUNCTION app.touch_updated_at();

CREATE TRIGGER trg_roles_updated_at
BEFORE UPDATE ON roles
FOR EACH ROW EXECUTE FUNCTION app.touch_updated_at();

CREATE TRIGGER trg_workspace_memberships_updated_at
BEFORE UPDATE ON workspace_memberships
FOR EACH ROW EXECUTE FUNCTION app.touch_updated_at();

CREATE TRIGGER trg_user_role_assignments_updated_at
BEFORE UPDATE ON user_role_assignments
FOR EACH ROW EXECUTE FUNCTION app.touch_updated_at();

CREATE TRIGGER trg_job_statuses_updated_at
BEFORE UPDATE ON job_statuses
FOR EACH ROW EXECUTE FUNCTION app.touch_updated_at();

CREATE TRIGGER trg_pipeline_stage_catalog_updated_at
BEFORE UPDATE ON pipeline_stage_catalog
FOR EACH ROW EXECUTE FUNCTION app.touch_updated_at();

CREATE TRIGGER trg_application_statuses_updated_at
BEFORE UPDATE ON application_statuses
FOR EACH ROW EXECUTE FUNCTION app.touch_updated_at();

CREATE TRIGGER trg_candidate_sources_updated_at
BEFORE UPDATE ON candidate_sources
FOR EACH ROW EXECUTE FUNCTION app.touch_updated_at();

CREATE TRIGGER trg_talent_statuses_updated_at
BEFORE UPDATE ON talent_statuses
FOR EACH ROW EXECUTE FUNCTION app.touch_updated_at();

CREATE TRIGGER trg_availability_statuses_updated_at
BEFORE UPDATE ON availability_statuses
FOR EACH ROW EXECUTE FUNCTION app.touch_updated_at();

CREATE TRIGGER trg_automation_trigger_types_updated_at
BEFORE UPDATE ON automation_trigger_types
FOR EACH ROW EXECUTE FUNCTION app.touch_updated_at();

CREATE TRIGGER trg_automation_action_types_updated_at
BEFORE UPDATE ON automation_action_types
FOR EACH ROW EXECUTE FUNCTION app.touch_updated_at();

CREATE TRIGGER trg_internal_tool_categories_updated_at
BEFORE UPDATE ON internal_tool_categories
FOR EACH ROW EXECUTE FUNCTION app.touch_updated_at();

CREATE TRIGGER trg_departments_updated_at
BEFORE UPDATE ON departments
FOR EACH ROW EXECUTE FUNCTION app.touch_updated_at();

CREATE TRIGGER trg_department_members_updated_at
BEFORE UPDATE ON department_members
FOR EACH ROW EXECUTE FUNCTION app.touch_updated_at();

CREATE TRIGGER trg_jobs_updated_at
BEFORE UPDATE ON jobs
FOR EACH ROW EXECUTE FUNCTION app.touch_updated_at();

CREATE TRIGGER trg_job_pipeline_stages_updated_at
BEFORE UPDATE ON job_pipeline_stages
FOR EACH ROW EXECUTE FUNCTION app.touch_updated_at();

CREATE TRIGGER trg_people_updated_at
BEFORE UPDATE ON people
FOR EACH ROW EXECUTE FUNCTION app.touch_updated_at();

CREATE TRIGGER trg_tags_updated_at
BEFORE UPDATE ON tags
FOR EACH ROW EXECUTE FUNCTION app.touch_updated_at();

CREATE TRIGGER trg_person_tags_updated_at
BEFORE UPDATE ON person_tags
FOR EACH ROW EXECUTE FUNCTION app.touch_updated_at();

CREATE TRIGGER trg_applications_updated_at
BEFORE UPDATE ON applications
FOR EACH ROW EXECUTE FUNCTION app.touch_updated_at();

CREATE TRIGGER trg_talent_pool_entries_updated_at
BEFORE UPDATE ON talent_pool_entries
FOR EACH ROW EXECUTE FUNCTION app.touch_updated_at();

CREATE TRIGGER trg_interviews_updated_at
BEFORE UPDATE ON interviews
FOR EACH ROW EXECUTE FUNCTION app.touch_updated_at();

CREATE TRIGGER trg_interview_feedback_updated_at
BEFORE UPDATE ON interview_feedback
FOR EACH ROW EXECUTE FUNCTION app.touch_updated_at();

CREATE TRIGGER trg_offers_updated_at
BEFORE UPDATE ON offers
FOR EACH ROW EXECUTE FUNCTION app.touch_updated_at();

CREATE TRIGGER trg_automations_updated_at
BEFORE UPDATE ON automations
FOR EACH ROW EXECUTE FUNCTION app.touch_updated_at();

CREATE TRIGGER trg_workspace_settings_updated_at
BEFORE UPDATE ON workspace_settings
FOR EACH ROW EXECUTE FUNCTION app.touch_updated_at();

CREATE TRIGGER trg_workspace_integrations_updated_at
BEFORE UPDATE ON workspace_integrations
FOR EACH ROW EXECUTE FUNCTION app.touch_updated_at();

CREATE TRIGGER trg_internal_tools_updated_at
BEFORE UPDATE ON internal_tools
FOR EACH ROW EXECUTE FUNCTION app.touch_updated_at();

COMMIT;

-- ===== 202603130002_ats_3nf_rls.sql =====
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

-- ===== 202603130003_ats_3nf_seed_reference_data.sql =====
BEGIN;

INSERT INTO roles (code, label, description)
VALUES
  ('admin', 'Admin', 'Workspace administrator with full access'),
  ('recruiter', 'Recruiter', 'Recruiting operations role'),
  ('hiring_manager', 'Hiring Manager', 'Hiring manager for departments')
ON CONFLICT (code) DO NOTHING;

INSERT INTO job_statuses (code, label, is_terminal, display_order)
VALUES
  ('draft', 'Draft', false, 10),
  ('open', 'Open', false, 20),
  ('on_hold', 'On Hold', false, 30),
  ('filled', 'Filled', true, 40),
  ('closed', 'Closed', true, 50)
ON CONFLICT (code) DO NOTHING;

INSERT INTO pipeline_stage_catalog (code, label, is_terminal, display_order, color_hex)
VALUES
  ('applied', 'Applied', false, 10, '#6366F1'),
  ('screening', 'Screening', false, 20, '#8B5CF6'),
  ('technical', 'Technical', false, 30, '#0EA5E9'),
  ('final_interview', 'Final Interview', false, 40, '#F59E0B'),
  ('offer', 'Offer', false, 50, '#10B981'),
  ('hired', 'Hired', true, 60, '#22C55E'),
  ('rejected', 'Rejected', true, 70, '#EF4444')
ON CONFLICT (code) DO NOTHING;

INSERT INTO application_statuses (code, label, is_terminal, display_order)
VALUES
  ('active', 'Active', false, 10),
  ('withdrawn', 'Withdrawn', true, 20),
  ('hired', 'Hired', true, 30),
  ('rejected', 'Rejected', true, 40)
ON CONFLICT (code) DO NOTHING;

INSERT INTO candidate_sources (code, label, display_order)
VALUES
  ('referral', 'Referral', 10),
  ('linkedin', 'LinkedIn', 20),
  ('job_board', 'Job Board', 30),
  ('direct', 'Direct Application', 40),
  ('internal', 'Internal Database', 50),
  ('manual', 'Manual Entry', 60)
ON CONFLICT (code) DO NOTHING;

INSERT INTO talent_statuses (code, label, display_order)
VALUES
  ('hot', 'Hot', 10),
  ('warm', 'Warm', 20),
  ('cold', 'Cold', 30)
ON CONFLICT (code) DO NOTHING;

INSERT INTO availability_statuses (code, label, display_order)
VALUES
  ('actively_looking', 'Actively Looking', 10),
  ('open_to_offers', 'Open to Offers', 20),
  ('not_looking', 'Not Looking', 30)
ON CONFLICT (code) DO NOTHING;

INSERT INTO automation_trigger_types (code, label, description)
VALUES
  ('stage_transition', 'Stage Transition', 'Triggered when an application changes stage'),
  ('time_elapsed', 'Time Elapsed', 'Triggered when a duration threshold is reached'),
  ('status_change', 'Status Change', 'Triggered when status fields change')
ON CONFLICT (code) DO NOTHING;

INSERT INTO automation_action_types (code, label, description)
VALUES
  ('send_email', 'Send Email', 'Send email notifications or templates'),
  ('send_notification', 'Send Notification', 'Push in-app notifications'),
  ('update_field', 'Update Field', 'Update target record fields')
ON CONFLICT (code) DO NOTHING;

INSERT INTO internal_tool_categories (code, label, display_order)
VALUES
  ('communication', 'Communication', 10),
  ('documents', 'Documents', 20),
  ('operations', 'Operations', 30)
ON CONFLICT (code) DO NOTHING;

-- Seed internal tools across existing workspaces (workspace-owned catalog decision).
INSERT INTO internal_tools (
  workspace_id,
  category_id,
  name,
  description,
  url,
  icon_key,
  sort_order,
  is_active,
  open_in_new_tab
)
SELECT
  w.id,
  c.id,
  'Romega Email Signature Generator',
  'Generate standardized Romega email signatures.',
  'https://romega-email-signature.vercel.app/',
  'mail',
  10,
  true,
  true
FROM workspaces w
CROSS JOIN internal_tool_categories c
WHERE c.code = 'communication'
ON CONFLICT (workspace_id, name) DO NOTHING;

INSERT INTO internal_tools (
  workspace_id,
  category_id,
  name,
  description,
  url,
  icon_key,
  sort_order,
  is_active,
  open_in_new_tab
)
SELECT
  w.id,
  c.id,
  'Romega Certificate Generator',
  'Create standardized certificates from Romega templates.',
  'https://romega-certificate-creator-71vj.vercel.app/',
  'award',
  20,
  true,
  true
FROM workspaces w
CROSS JOIN internal_tool_categories c
WHERE c.code = 'documents'
ON CONFLICT (workspace_id, name) DO NOTHING;

COMMIT;

-- ===== 202603130004_ats_3nf_reporting_views.sql =====
BEGIN;

CREATE OR REPLACE VIEW v_pipeline_metrics_daily AS
SELECT
  ase.workspace_id,
  DATE_TRUNC('day', ase.created_at)::date AS metric_date,
  ase.to_stage_id,
  psc.code AS to_stage_code,
  COUNT(*)::bigint AS transition_count
FROM application_stage_events ase
JOIN pipeline_stage_catalog psc
  ON psc.id = ase.to_stage_id
GROUP BY
  ase.workspace_id,
  DATE_TRUNC('day', ase.created_at)::date,
  ase.to_stage_id,
  psc.code;

CREATE OR REPLACE VIEW v_dashboard_summary AS
SELECT
  w.id AS workspace_id,
  COALESCE(j.active_jobs, 0)::bigint AS active_jobs,
  COALESCE(a.active_applications, 0)::bigint AS active_applications,
  COALESCE(t.active_talent_pool, 0)::bigint AS active_talent_pool,
  COALESCE(o.open_offers, 0)::bigint AS open_offers,
  NOW() AS refreshed_at
FROM workspaces w
LEFT JOIN (
  SELECT
    workspace_id,
    COUNT(*) FILTER (WHERE archived_at IS NULL)::bigint AS active_jobs
  FROM jobs
  GROUP BY workspace_id
) j ON j.workspace_id = w.id
LEFT JOIN (
  SELECT
    workspace_id,
    COUNT(*) FILTER (WHERE archived_at IS NULL)::bigint AS active_applications
  FROM applications
  GROUP BY workspace_id
) a ON a.workspace_id = w.id
LEFT JOIN (
  SELECT
    workspace_id,
    COUNT(*) FILTER (WHERE archived_at IS NULL)::bigint AS active_talent_pool
  FROM talent_pool_entries
  GROUP BY workspace_id
) t ON t.workspace_id = w.id
LEFT JOIN (
  SELECT
    workspace_id,
    COUNT(*) FILTER (WHERE status IN ('draft', 'sent'))::bigint AS open_offers
  FROM offers
  GROUP BY workspace_id
) o ON o.workspace_id = w.id;

COMMIT;
