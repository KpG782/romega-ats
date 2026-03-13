# Drizzle Consistency Check

Last updated: March 13, 2026

## Objective
Validate that SQL migrations and Drizzle schema use equivalent naming and table semantics.

## Verification Summary
- Drizzle entrypoint exists: drizzle/schema/index.ts
- Main schema exists: drizzle/schema/ats.ts
- Config exists: drizzle.config.ts

## Table Mapping Check
- All major transactional tables in migration 202603130001 are represented in drizzle/schema/ats.ts.
- All lookup/reference tables in migration 202603130001 are represented in drizzle/schema/ats.ts.
- Workspace-owned internal_tools model is represented in drizzle/schema/ats.ts.

## Enum Strategy Check
- SQL uses normalized lookup tables (roles, statuses, sources, trigger/action types).
- Drizzle mirrors these as tables, not inline TS enums.
- This keeps SQL and Drizzle aligned with the 3NF/reference-table approach.

## Constraint and Index Coverage
- Drizzle schema includes core unique constraints and key indexes matching migration intent.
- Trigger functions, RLS, and policies remain SQL-only and are intentionally maintained in SQL migrations.

## Follow-up Validation in Environment
- Run db:generate and db:check against target DB once DATABASE_URL is configured.
- Confirm no drift and resolve if any generated diff appears.
