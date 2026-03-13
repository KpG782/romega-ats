# Analysis: Supabase ATS 3NF Data Model

## Status
Completed (March 13, 2026)

## Inputs Reviewed
- spec.md
- plan.md
- tasks.md

## Overall Result
Pass.

The three artifacts are aligned and cover the full ATS domain (pages, pipeline, 3NF focus, Supabase, Drizzle). No hard blocker was found. Recommended task refinements were applied.

## Consistency Check Summary

### Coverage
- Feature scope in spec is reflected in plan table groups.
- Plan table groups are represented in tasks phases.
- Page coverage listed in spec and plan is represented in validation phase tasks.

### Requirement Traceability
- FR-1 to FR-12: covered.
- NFR-1 to NFR-5: covered.
- Acceptance criteria AC-1 and AC-2: explicitly covered in updated tasks.

## Findings (Resolved)

### High
None.

### Medium (resolved by task updates)
1. AC-1 gap: tasks do not explicitly require producing a formal table inventory artifact with PK, FK, unique constraints, and relationship cardinality.
   - Impact: acceptance criterion can be interpreted as incomplete even if schema exists.
   - Suggested fix: add a task to generate and version a schema inventory document.

2. AC-2 gap: tasks verify page-to-table coverage but do not explicitly require creating a matrix artifact.
   - Impact: verification may be subjective and not auditable.
   - Suggested fix: add a task to publish a page-to-table matrix document or SQL metadata export.

3. Convention gap: plan requires uuid primary keys and timestamptz audit columns, but tasks do not explicitly enforce this for all mutable tables.
   - Impact: schema inconsistency risk and possible Drizzle drift.
   - Suggested fix: add a dedicated schema-convention checklist task before migration completion.

4. Seed-data completeness risk: tasks call for seed baselines but do not explicitly enumerate all reference tables.
   - Impact: missing defaults may break first-run environment behavior.
   - Suggested fix: add explicit seed tasks for each reference table set.

5. Security scope gap: RLS tasks mention select and write policies but do not explicitly include delete policy decisions and deny-path testing.
   - Impact: incomplete tenant-hardening posture.
   - Suggested fix: add tasks for delete policy strategy and unauthorized action tests.

### Low (resolved by task updates)
1. FR-1 versus internal tools ownership ambiguity.
   - Observation: FR-1 says tenant tables should include workspace_id unless global reference, while internal_tools ownership is not explicitly stated as tenant-scoped or global.
   - Suggested fix: decide if internal_tools is global catalog or workspace-owned and reflect consistently in plan and tasks.

2. Stage transition governance is implied but not explicitly constrained.
   - Observation: plan and tasks suggest syncing applications.current_stage_id from events but do not explicitly require blocking direct stage mutation paths.
   - Suggested fix: add a constraint or function-level policy task to enforce event-driven transitions.

## Recommended Amendments to tasks.md

Add the following tasks:
- Add task: publish schema inventory artifact with PK/FK/unique/cardinality mapping.
- Add task: publish page-to-table matrix artifact as implementation evidence.
- Add task: enforce uuid and timestamptz conventions across all mutable tables.
- Add task: seed all reference tables explicitly (roles, statuses, sources, trigger/action types, categories).
- Add task: define and test delete policies under RLS deny-by-default model.
- Add task: decide and document internal_tools scope (global or workspace-owned).
- Add task: enforce event-driven stage transitions and block direct inconsistent updates.

## Readiness Decision
Ready to proceed after minor task refinements above.

## Post-Analysis Update
The recommended amendments were applied to tasks.md.

Resolved by task additions:
- Schema convention enforcement for uuid PK and timestamptz audit columns.
- Internal tools ownership-scope decision task.
- Explicit reference-table seed completeness task.
- Event-driven stage transition enforcement task.
- RLS delete-policy and unauthorized operation test tasks.
- Formal schema inventory artifact task.
- Formal page-to-table matrix artifact task.

Updated readiness: Ready to proceed to implementation.
