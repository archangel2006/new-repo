# Triage — Test Plan

Updated: 11 October 2026

## Current state

The project has Vitest, React Testing Library, jest-dom, and jsdom configured through `vitest.config.ts` and `src/test/setup.ts`.

`src/test/example.test.ts` contains one starter assertion. It passed during this documentation update, but provides no product coverage. **Every test file listed below is proposed and has not been implemented.**

## Priority 1: access and core bug workflow

| Planned file | Cases to cover |
| --- | --- |
| `src/components/ProtectedRoute.test.tsx` | Loading state while a session is checked; signed-out redirect; signed-in content; no protected content shown before the check completes. |
| `src/contexts/AuthContext.test.tsx` | Initial session loading; auth-state changes; profile fetch success/failure; sign-out clears account state; subscription cleanup. |
| `src/pages/BugCreate.test.tsx` | Required-field validation; submitted report details; loading prevents duplicate submission; successful navigation; failed save preserves input and shows feedback. |
| `src/pages/BugList.test.tsx` | Loaded rows; available search/filter behavior; empty results; loading/error states; opening the correct report. |
| `src/pages/BugDetail.test.tsx` | Read by route ID; missing report; available status/assignee actions; comment submission; failed writes; refreshed detail/activity after successful changes. |

**Boundary:** mock the client and routing for component tests. These tests can verify requests and visible results, but cannot prove that database access rules are correct.

## Priority 2: chat tools and connection guide

| Planned file | Cases to cover |
| --- | --- |
| `src/pages/McpSetup.test.tsx` | Four connection steps and three examples render; copy uses the displayed URL; success indicator appears; unavailable clipboard does not crash the page. |
| `src/lib/mcp/supabase.test.ts` | Missing token rejects client creation; verified user token is attached to requests; supported configuration fallbacks work; missing configuration gives a useful error. |
| `src/lib/mcp/tools/list-bugs.test.ts` | Supported filters and search; result limits; empty result; query failure; unauthenticated context. |
| `src/lib/mcp/tools/get-bug.test.ts` | UUID and tracking-ID lookup; comments returned with detail; unknown bug; backend error. |
| `src/lib/mcp/tools/create-bug.test.ts` | Valid report; invalid required inputs and severity; optional reproduction context; correct reporter identity; failed insert. |
| `src/lib/mcp/tools/update-bug.test.ts` | Supported status/severity/assignee changes; invalid enum values; missing bug; failed write; recorded activity where implemented. |
| `src/lib/mcp/tools/add-comment.test.ts` | Valid comment; invalid/empty input according to the schema; missing bug; correct author; backend error. |

Use the current schemas and tool interface as the contract. If a desired safeguard is missing, record it as an implementation gap rather than writing a test that silently assumes it exists.

## Priority 3: team settings, analytics, and presentation

| Planned file | Cases to cover |
| --- | --- |
| `src/pages/Settings.test.tsx` | Team fetch through the existing interface; loading/empty/error states; invitation feedback; role-dependent controls; failed changes. |
| `src/pages/Analytics.test.tsx` | Empty dataset; known fixture totals and chart values; available filters; loading and errors. Compare against the actual formulas before asserting expected values. |
| `src/components/landing/LandingSections.test.tsx` | Issue selection updates preview detail; expected content remains visible; section rendering does not depend on a signed-in session. |

Do not invent analytics formulas, tenant isolation guarantees, or role privileges for fixtures. Establish the expected behavior from the current implementation and intended access policy first.

## Browser checks — separate from Vitest

Proposed files under `e2e/` require a dedicated Playwright configuration; they are **not** discovered by the current Vitest setup.

| Planned file | Scenario |
| --- | --- |
| `e2e/auth.spec.ts` | Sign in, reach a protected screen, sign out, and verify access is removed. |
| `e2e/bug-lifecycle.spec.ts` | Create a dedicated test report, open it, assign it, update its status, and add a comment; verify persisted results. |
| `e2e/mcp-setup.spec.ts` | Reach the guide from the sidebar and confirm its instructions, URL, and copy behavior. This does not prove Claude authorization works. |
| `e2e/layout.spec.ts` | Desktop and narrow-screen layouts in both themes; no clipping, unreadable controls, or overlapping content. |

Actual Claude authorization and conversation checks need a hosted endpoint and a Claude account with connector access. Keep that as a documented manual check unless a supported automated path is established.

## Hosted permissions and integration checks

Plan a separate backend verification suite, outside `src/` and the default Vitest run. Candidate file: `tests/integration/access-policies.test.ts`, with its own explicit runner configuration.

- Check requests as a signed-out visitor, an ordinary signed-in user, and an administrator.
- Confirm the intended visibility of bugs, comments, profiles, and team members before defining denied-read cases.
- Verify company settings, invitations, and role assignments against their intended ownership/role rules.
- Test the `get_team_members()` function's grants, returned fields, and unauthenticated behavior.
- Verify MCP requests retain the caller's permissions rather than elevated privileges.
- Verify schema-generated tracking IDs and any database-side activity behavior against real writes.
- Use dedicated test records and clean up only those records. Never run destructive tests against ordinary team data.

Mocked queries are not evidence that these checks pass. Credentials must be provided securely at runtime, never stored in source or printed in test output.

## Commands

Existing commands:

```sh
npm run test
npm run test:watch
# Run one test file after it has been implemented:
npm run test -- src/pages/BugCreate.test.tsx
```

There is no configured coverage command or backend integration runner yet. Do not present planned browser files as runnable until their configuration and fixtures are added.

## Completion criteria

1. Replace the starter assertion once meaningful tests are in place.
2. Make every test deterministic, independent, and explicit about its mocked boundaries.
3. Cover errors and denied actions alongside successful paths.
4. Run changed tests and the core regression suite before merging behavior changes.
5. Record hosted verification separately, including any untested OAuth or permissions paths.
6. Update this document as tests are implemented; never describe a filename proposal as completed coverage.