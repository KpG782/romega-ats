-- Unauthorized operation test outline for RLS validation.
-- Execute in an authenticated user context that is NOT a member of target workspace.

-- Expect: no rows returned
-- SELECT * FROM jobs WHERE workspace_id = '00000000-0000-0000-0000-000000000000';

-- Expect: insert blocked
-- INSERT INTO jobs (workspace_id, department_id, status_id, title)
-- VALUES ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', 'Unauthorized Job');

-- Expect: update blocked
-- UPDATE applications
-- SET notes = 'unauthorized edit'
-- WHERE workspace_id = '00000000-0000-0000-0000-000000000000';

-- Expect: delete blocked due to missing DELETE policies
-- DELETE FROM people
-- WHERE workspace_id = '00000000-0000-0000-0000-000000000000';
