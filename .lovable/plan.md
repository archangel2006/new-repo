# Triage — Project and Verification Plan

Updated: 11 October 2026

## Product goal

Give a team one place to report bugs, assign responsibility, discuss the problem, and track the fix. Allow the same routine actions from Claude without creating a separate source of truth.

## Existing scope

The project includes sign-in, a dashboard, bug creation and detail pages, comments and activity, analytics, team settings, and a Claude connection guide. The MCP server defines tools to list, read, create, update, and comment on bugs.

These are existing features, not a declaration that every flow has automated coverage or has passed a fresh hosted test.

## This documentation update

- [x] Explain the product, the problem it solves, and a typical team workflow.
- [x] Expand setup instructions, commands, technical overview, and deployment caveats.
- [x] Add restrained badges without implying build status or coverage.
- [x] Describe Claude setup and the five supported tools.
- [x] Separate existing test coverage from proposed test files.
- [x] Link the detailed test plan and the roadmap.

## Next implementation phases — proposed, not started

### 1. Establish useful automated coverage

Replace the starter assertion with focused tests for access guards, authentication state, reporting a bug, reading details, updating status, and the Claude setup page. Add mocked MCP tool tests for input validation and user-scoped execution.

**Acceptance:** tests assert observable behavior, include failure cases, run independently, and do not require real credentials. See [test plan](../docs/test-plan.md) for the proposed files.

### 2. Verify hosted access and collaboration

Check the actual deployed permissions with separate ordinary-user and administrator accounts. Verify private settings and invitations, role changes, team-member visibility, bug access, and comment access against the intended shared-team policy.

**Acceptance:** allowed actions succeed and disallowed actions fail at the backend, not merely through hidden buttons. Record the accounts' roles and results without storing their credentials.

### 3. Verify the Claude connection end to end

Connect Claude to the hosted MCP server, complete authorization, and exercise all five tools against dedicated test reports. Check invalid IDs, expired authorization, and denied access as well as successful requests.

**Acceptance:** changes made in chat appear in Triage, reads return the intended report, and unauthorized requests cannot access data. Document any account or connector limitation encountered.

### 4. Prepare for team use

Run the automated suite, check the hosted app's main workflows, and review desktop and narrow-screen layouts in both themes. Confirm deployment routing and authorization redirects before sharing the app with a team.

**Acceptance:** report the checks actually performed and any remaining gaps; do not treat a successful frontend build as proof of permission or OAuth correctness.

## Previous security plan — retained context

The earlier plan targeted owner-only company settings, inviter/admin invitation visibility, restricted role visibility, a controlled `get_team_members()` function, and leaked-password protection. Earlier work reported those changes as applied.

This documentation update does not reapply those changes or independently certify their current hosted state. Recheck the policies, function permissions, and auth setting during phase 2. In particular, do not dismiss broad read access as safe without confirming the intended collaboration boundary.

## Technical details

- Keep the current React/Vite frontend and Lovable Cloud integration; this plan proposes no migration or new backend.
- Use the existing Vitest and React Testing Library setup for unit/component tests.
- Keep tests next to the behavior they cover; reserve `src/test/` for shared setup and helpers.
- Run browser workflows separately from Vitest and backend permission checks against an isolated test environment or explicitly designated test records.
- Do not modify generated integration files, store tokens in fixtures, or use administrator credentials to make ordinary-user permission tests pass.
- Keep all proposed tests marked pending until their files exist and their checks pass.

## Not included in this update

No application behavior, schema, permissions, auth configuration, or deployment changes. The planned test files are not created by this documentation task.

