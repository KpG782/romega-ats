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
