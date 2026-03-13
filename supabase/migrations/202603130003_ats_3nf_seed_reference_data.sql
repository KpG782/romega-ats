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
