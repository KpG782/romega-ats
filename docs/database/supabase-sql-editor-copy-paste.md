# Supabase SQL Editor Copy-Paste Guide

Last updated: March 13, 2026

## Files Prepared
1. supabase/sql-editor/00_first_time_full_setup.sql
2. supabase/sql-editor/01_post_apply_checks.sql

## Run Order
1. Open Supabase SQL Editor.
2. Copy all contents of supabase/sql-editor/00_first_time_full_setup.sql and run once.
3. After success, copy all contents of supabase/sql-editor/01_post_apply_checks.sql and run.

## What Each Script Does

### 00_first_time_full_setup.sql
- Creates full ATS 3NF foundation schema
- Adds stage-transition guard and transition function
- Enables RLS and creates workspace-scoped policies
- Seeds reference data
- Seeds internal tools:
  - Romega Email Signature Generator
  - Romega Certificate Generator
- Creates reporting views

### 01_post_apply_checks.sql
- Runs table/view existence checks
- Runs seed verification queries
- Provides commented stage-transition function test
- Provides unauthorized operation test outline

## Notes
- These scripts are generated from ordered migration files to prevent manual copy errors.
- Use these bundles as execution scripts only; keep schema source of truth in repository migrations plus Drizzle schema.
- For production, prefer applying the same migration files in controlled deploy flow.
