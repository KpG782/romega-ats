# Feature Spec: Supabase ATS 3NF Data Model

## Status
Draft (March 13, 2026)

## Why
The current ATS pages are UI-first and need a production backend schema in Supabase that:
- Covers all existing pages and workflows.
- Supports full hiring pipeline operations.
- Follows 3NF (third normal form) to reduce duplication and update anomalies.
- Is ready for Drizzle ORM use without later table/column churn.

## Scope
Create a complete relational schema spec for Supabase SQL Editor + migration files that supports:
- Authentication and workspace-level multi-tenancy
- Dashboard metrics and activity feed
- Jobs, job detail kanban, and job status lifecycle
- Candidates and stage transitions
- Talent pool and promotion to active pipeline
- Departments and team ownership
- Analytics and audit/event history
- Automations and run logs
- Settings and integrations
- Internal Tools page link registry

## Goals
1. Full page coverage: every current app page has mapped backend tables.
2. Full pipeline coverage: Applied -> Screening -> Technical -> Final -> Offer -> Hired/Rejected.
3. 3NF compliance: no repeating groups, no partial dependencies, no transitive dependencies.
4. Drizzle-ready schema from day one.
5. Supabase-ready security and performance baseline (RLS + key indexes).

## Non-Goals
- Implementing API routes, server actions, or UI wiring in this feature.
- Building final analytics dashboards beyond required source-of-truth tables.
- Building custom reporting UI.

## Functional Requirements

### FR-1 Multi-Tenant Foundation
- A workspace must isolate all business data.
- Every business-row table must include workspace_id (except global reference tables).
- Workspace isolation must be enforceable via Row Level Security policies.

### FR-2 Identity and Access
- Use Supabase auth.users as the auth identity source.
- Add app-level user profile table(s) for role, display info, and workspace membership.
- Roles/permissions must be normalized via reference and assignment tables.

### FR-3 Departments and Ownership
- Support departments and assignment of hiring managers/team members.
- Jobs must belong to departments.

### FR-4 Jobs and Status Lifecycle
- Jobs must support status lifecycle: draft/open/on_hold/filled/closed.
- Job metadata must support created_by, published_at, and closed_at timestamps.

### FR-5 People, Candidates, and Applications
- People profile data must be normalized and reusable (avoid duplicate person rows across modules).
- Candidate progression must be tracked per application (person <-> job), not as a single global stage field.
- Source and tagging must be normalized through lookup/join tables.

### FR-6 Pipeline Stage Tracking
- Pipeline stage definitions must be normalized and ordered.
- Stage movement must be append-only event logging with from_stage, to_stage, actor, reason, timestamp.
- Current stage for an application must be queryable efficiently.

### FR-7 Talent Pool
- Talent pool records must support hot/warm/cold status and availability.
- Promotion of talent pool entries to active applications must preserve referential links.

### FR-8 Interviews, Feedback, and Offers
- Support interview scheduling and interviewer feedback records.
- Support offer records and outcomes to complete the hiring funnel.

### FR-9 Automations
- Support automation definitions with trigger and action payloads.
- Support immutable automation run logs for monitoring and diagnostics.

### FR-10 Settings and Integrations
- Support workspace settings (timezone, notification defaults, etc.).
- Support integration connection records with secure configuration metadata.

### FR-11 Internal Tools
- Support a table-driven internal app launcher (name, url, icon key, category, sort_order, active flag).
- Must allow adding future internal app links without code deployment.

### FR-12 Analytics Source of Truth
- All dashboard and analytics metrics must be derivable from transactional tables and event logs.
- Optional reporting views/materialized views can be added without violating source-of-truth ownership.

## Non-Functional Requirements

### NFR-1 Normalization
- Schema must meet 3NF.
- Multi-value fields (skills/tags) must use separate tables and join tables.
- No derived aggregates stored in transactional rows unless explicitly justified.

### NFR-2 Naming and Consistency
- Use snake_case table and column names.
- Use consistent primary key strategy (uuid recommended).
- Include created_at and updated_at (timestamptz) in mutable tables.

### NFR-3 Performance
- Add indexes for high-frequency access paths:
  - workspace + status/stage filters
  - workspace + email uniqueness lookups
  - event timestamp and foreign key traversal

### NFR-4 Security
- RLS default deny, with workspace-scoped allow policies.
- Sensitive integration secrets must not be exposed in plain query paths.

### NFR-5 Drizzle Readiness
- SQL model and Drizzle schema must match one-to-one in naming and constraints.
- Enum/reference strategy must be Drizzle-friendly (lookup tables or pgEnum with clear policy).

## Page Coverage Requirements

1. Login page must map to auth identity and app user profile.
2. Dashboard page must map to jobs, applications, stage events, and activity sources.
3. Candidates page must map to people, applications, stages, sources, and tags.
4. Jobs page must map to jobs, departments, statuses, and application rollups.
5. Job detail page must map to per-job pipeline columns and stage event history.
6. Departments page must map to departments and membership/owner assignments.
7. Talent pool page must map to talent entries, status, availability, and promotion linkage.
8. Analytics page must map to stage events, offers, and job/application outcomes.
9. Automations page must map to automation definitions and run logs.
10. Settings page must map to workspace settings and integration records.
11. Internal tools page must map to internal tools registry records.

## Acceptance Criteria
1. A complete table inventory exists with PK/FK, unique constraints, and relation cardinality.
2. A page-to-table matrix demonstrates that every current page is covered.
3. Pipeline stage transition events are fully modeled and auditable.
4. Design explicitly documents 3NF choices and anti-duplication strategy.
5. SQL migration strategy is compatible with Supabase and Drizzle.
6. Required indexes and RLS baseline are defined.
7. Plan identifies seed/reference data required for first environment bootstrap.
