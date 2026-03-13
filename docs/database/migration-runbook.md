# Supabase + Drizzle Migration Runbook

Last updated: March 13, 2026

## Source of Truth Policy
- Drizzle schema files and committed SQL migrations in this repository are source of truth.
- Supabase SQL Editor is an execution surface, not the source of truth.

## Current Migration Order
1. supabase/migrations/202603130001_ats_3nf_foundation.sql
2. supabase/migrations/202603130002_ats_3nf_rls.sql
3. supabase/migrations/202603130003_ats_3nf_seed_reference_data.sql
4. supabase/migrations/202603130004_ats_3nf_reporting_views.sql

## Recommended Apply Workflow
1. Review migration SQL in git.
2. Apply migrations in order (CLI preferred; SQL Editor acceptable if using committed SQL as-is).
3. Validate key tables, indexes, and RLS policies.
4. Confirm Drizzle schema remains aligned.

## Drizzle Workflow
- Config file: drizzle.config.ts
- Schema entry: drizzle/schema/index.ts
- Main schema: drizzle/schema/ats.ts

## Emergency SQL Hotfix Rule
If a direct SQL Editor hotfix is applied:
1. create matching migration file in repo,
2. update drizzle schema,
3. commit both in one PR,
4. document backfill/rollback notes.

## Smoke Checks (manual)
- Can select workspace-owned rows only within active membership.
- Direct updates to applications.current_stage_id are blocked.
- app.transition_application_stage() inserts audit events.
- Seeded internal tools include email signature and certificate generator links.
