# 3NF Compliance Checklist

Last updated: March 13, 2026

## First Normal Form (1NF)
- [x] No repeating groups in single columns.
- [x] Multi-valued tags normalized into tags and person_tags.
- [x] Reference values normalized into lookup tables.

## Second Normal Form (2NF)
- [x] Non-key attributes depend on full key in join tables.
- [x] Join tables use unique constraints for full key semantics.

## Third Normal Form (3NF)
- [x] No transitive dependency in transactional tables for status/source labels.
- [x] Labels and descriptors stored in reference tables instead of duplicated text columns.
- [x] Person identity centralized in people and reused by applications and talent_pool_entries.

## Audit and Event Model
- [x] Stage transition history kept in append-only application_stage_events.
- [x] Current stage maintained in applications for efficient reads.
- [x] Guard trigger enforces event-driven transition workflow.

## Remaining Verification During DB Deployment
- [ ] Validate all constraints in live Supabase environment.
- [ ] Validate RLS behavior against tenant isolation test cases.
- [ ] Validate query plans for high-frequency dashboard filters.
