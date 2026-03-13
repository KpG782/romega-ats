# Reporting Refresh Strategy

Last updated: March 13, 2026

## Current Reporting Objects
- v_pipeline_metrics_daily (view)
- v_dashboard_summary (view)

Both are standard views and refresh automatically at query time.

## Strategy
1. Keep views as default while data volume is moderate.
2. If query latency increases, convert to materialized views and schedule refresh jobs.
3. Use off-peak refresh cadence first (every 15-30 minutes), then tune.

## Suggested Materialized View Path (if needed)
- Create mv_pipeline_metrics_daily and mv_dashboard_summary.
- Add indexes on workspace_id and metric_date.
- Refresh policy:
  - frequent dashboards: every 15 minutes
  - low-priority analytics: hourly

## Operational Guardrails
- Keep transactional tables as source of truth.
- Rebuild materialized views after major backfills.
- Record refresh lag in monitoring to detect stale metrics.
