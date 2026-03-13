# Rollback and Backfill Notes

Last updated: March 13, 2026

## Rollback Principles
- Avoid destructive rollback in production unless absolutely required.
- Prefer forward-fix migrations when possible.
- If rollback is required, do it in reverse migration order and only after backup.

## Migration Order
1. 202603130001_ats_3nf_foundation.sql
2. 202603130002_ats_3nf_rls.sql
3. 202603130003_ats_3nf_seed_reference_data.sql
4. 202603130004_ats_3nf_reporting_views.sql
5. 202603130005_ats_3nf_smoke_checks.sql (non-destructive test script)

## Rollback Notes by Layer
- Reporting views: safe to drop/recreate.
- Seed data: generally keep; if needed, delete only inserted rows with precise WHERE clauses.
- RLS policies: can be dropped and recreated if policy logic changes.
- Foundation tables: rolling back requires data export/backup strategy first.

## Backfill Guidance
- If legacy candidate and talent records exist in separate stores, backfill into people first.
- Then backfill applications and talent_pool_entries linking to people IDs.
- Derive application current_stage_id from latest application_stage_events where possible.
- Recompute reporting views after major backfill operations.
