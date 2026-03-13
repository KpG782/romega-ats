# ATS 3NF Implementation Notes

Last updated: March 13, 2026

## What Was Implemented
- Supabase SQL migrations for:
  - foundation schema
  - RLS policies
  - seed reference data and internal tool defaults
  - reporting views
  - smoke-check script
- Drizzle schema mirror under drizzle/schema.
- Database documentation artifacts for inventory, matrix, runbook, seed, rollback, and normalization checks.

## Stage Transition Rule
- Direct updates to applications.current_stage_id are blocked.
- Use app.transition_application_stage(...) to mutate stage and write audit events.

## Internal Tools Page Integration Data
- Seed includes:
  - https://romega-email-signature.vercel.app/
  - https://romega-certificate-creator-71vj.vercel.app/

## Known Follow-up
- RLS membership policies may be tightened further when invitation/admin workflows are finalized.
- Add CI checks for migration ordering and schema drift detection.
- Add app-layer repositories/server actions using Drizzle models.
