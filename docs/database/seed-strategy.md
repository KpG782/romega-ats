# ATS Seed Strategy

Last updated: March 13, 2026

## Objective
Provide deterministic baseline data required for first-run functionality in every environment.

## Seed Layers
1. Global reference seeds (always required)
- roles
- job_statuses
- pipeline_stage_catalog
- application_statuses
- candidate_sources
- talent_statuses
- availability_statuses
- automation_trigger_types
- automation_action_types
- internal_tool_categories

2. Workspace-scoped seeds (conditional on workspace rows)
- internal_tools default launcher links per workspace
- workspace_settings default rows (optional follow-up migration if desired)

## Seed Idempotency Rules
- Use ON CONFLICT DO NOTHING for reference rows.
- Use deterministic unique keys (code for refs, workspace_id + name/provider for scoped rows).
- Keep seed scripts safe to run multiple times.

## Internal Tools Decision
- Ownership scope is workspace-owned.
- Seed strategy inserts both default tools into each workspace:
  - Romega Email Signature Generator
  - Romega Certificate Generator

## Operational Guidance
- Seed migration runs after foundation and RLS migrations.
- For existing environments, rerun seed migration only if new reference values are added.
