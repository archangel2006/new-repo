# Triage

**A shared place to report bugs, decide what matters, and follow a fix through to completion.**

![React 18](https://img.shields.io/badge/React-18-333333?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5-333333?style=for-the-badge)
![Lovable Cloud](https://img.shields.io/badge/Backend-Lovable_Cloud-333333?style=for-the-badge)
![Claude MCP](https://img.shields.io/badge/Claude-MCP-333333?style=for-the-badge)

## What is Triage?

Bugs often start in a chat message, a spreadsheet, or someone's memory. That makes it hard to know whether a problem has been reported, who owns it, or whether the fix is ready to check.

Triage brings those reports into one workspace. Each bug has a description, a severity, an owner, a status, and a place for discussion. The team can see what needs attention without digging through separate conversations.

It is focused on the bug-fixing workflow rather than being a general-purpose planning suite. An optional Claude connection lets team members work with the same reports from chat, instead of switching to the app for every small update.

## How a team uses it

1. **Report the problem.** Add a title and description, then include reproduction steps, expected behavior, actual behavior, and environment details where available.
2. **Decide its priority.** Set the severity and assign someone to investigate.
3. **Track the fix.** Move the bug through the available statuses as work progresses.
4. **Keep the context together.** Add comments and review the bug's activity history.
5. **Review the workload.** Use the dashboard and analytics to understand outstanding work and resolution trends.

### Available statuses and severities

| Field | Values |
| --- | --- |
| Status | New, Assigned, In progress, Testing, Resolved, Closed |
| Severity | Critical, High, Medium, Low |

These are the supported values, not a promise that every interface enforces the same transition rules.

## Main features

| Area | What it does |
| --- | --- |
| Bug reports | Stores the issue details, reproduction context, severity, status, and assignee. |
| Bug list and detail | Lets team members browse reports and open a bug's full context. |
| Comments and activity | Keeps discussion and recorded changes alongside the report. |
| Team settings | Provides team-member and invitation management. |
| Dashboard and analytics | Presents workload summaries and bug-resolution information. |
| Claude setup | Provides a server URL, connection instructions, and example prompts. |
| Appearance | Supports light and dark themes with a restrained monochrome interface. |

## Working with bugs in Claude

Triage exposes an MCP server. MCP (Model Context Protocol) is the connection that lets Claude call the bug tracker's tools from a conversation.

### Connect

1. Sign in to Triage and open **Connect to Claude** in the sidebar (`/mcp-setup`).
2. Copy the server URL shown on that page.
3. In Claude, open **Settings → Connectors → Add custom connector** and paste the URL.
4. Complete the Triage sign-in and approval flow when prompted.
5. Start a conversation with the connector enabled.

Claude's connector availability and menu labels may vary by account and product version. Use the URL provided by your own Triage deployment; do not copy another project's endpoint.

### Example requests

> File a bug: the export button on the analytics page does nothing in Safari. Severity high.

> Show me the critical bugs with status new.

> Read BUG-1042 and show its comments.

> Mark BUG-1042 as resolved and add a comment saying the fix shipped in v2.3.

`BUG-1042` is an example: replace it with a real tracking ID. Updating a bug and posting a comment are separate tool actions.

### Available tools

| Tool | Purpose |
| --- | --- |
| `list_bugs` | Browse bugs using status, severity, or title search. |
| `get_bug` | Read a report and its comments using a tracking ID or UUID. |
| `create_bug` | File a report with its description and supporting details. |
| `update_bug` | Change status, severity, or assignee. |
| `add_comment` | Add discussion to an existing report. |

The MCP tools use the signed-in user's token and are subject to the backend's access rules. This is not an anonymous endpoint or an administrator bypass. You can disconnect the connector in Claude.

## Local development

### Requirements

- A current Node.js LTS release and npm.
- Access to this project's source code.
- The project's configured Lovable Cloud connection for sign-in and data-backed screens.

### Start the app

```sh
npm install
npm run dev
```

Open `http://localhost:8080`. The public page is at `/`; sign in or create an account at `/auth` to use the workspace.

### Backend configuration

The frontend reads the following environment variables:

| Variable | Purpose |
| --- | --- |
| `VITE_SUPABASE_URL` | Backend connection URL. |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Public client key used by the browser. |
| `VITE_SUPABASE_PROJECT_ID` | Project reference used to configure the MCP OAuth issuer. |

These names are generated integration identifiers, not instructions to set up a different backend. In Lovable, the connection and generated client files are managed for the project. For a local checkout, obtain the correct configuration through the project owner; do not invent placeholder credentials or commit private keys.

Running Vite starts the frontend only. It does not create backend tables, apply migrations, deploy the hosted MCP function, or configure OAuth. The Claude connection requires a reachable hosted server and working authorization; a frontend deployment alone is not enough.

## Development commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local development app. |
| `npm run build` | Create the production frontend in `dist/`. |
| `npm run preview` | Preview that production frontend locally. |
| `npm run lint` | Check source code with ESLint. |
| `npm run test` | Run the current Vitest tests once. |
| `npm run test:watch` | Re-run tests while developing. |

## Testing: current coverage and planned work

Vitest, React Testing Library, and a browser-like test environment are configured. The current suite contains **one starter assertion** in `src/test/example.test.ts`; it does not verify the bug workflow, permissions, or Claude connection.

The proposed test files, concrete cases, and delivery order are documented in [the test plan](docs/test-plan.md). Those files are **planned, not implemented**. Browser and backend checks will be needed in addition to mocked component tests.

## Technical overview

- **Interface:** React 18, TypeScript, and Vite 5.
- **UI:** Tailwind CSS v3 and shadcn/ui components.
- **Data fetching:** TanStack Query.
- **Charts:** Recharts.
- **Backend:** Lovable Cloud for authentication, persisted data, and hosted functions.
- **Chat integration:** `@lovable.dev/mcp-js`, OAuth, and the hosted MCP handler.

```text
src/
├── components/          Shared controls, layout, and landing-page sections
├── contexts/            Authentication state
├── hooks/               Reusable interface behavior
├── integrations/        Generated backend connections
├── lib/mcp/             MCP definition, tools, and user-scoped client
├── pages/               Public page, auth, bugs, analytics, settings, Claude setup
└── test/                Test environment and current starter test
supabase/
└── functions/           Hosted MCP handler and shared function helpers
docs/
└── test-plan.md         Proposed test files and acceptance criteria
```

## Plans and deployment

- [Project plan](.lovable/plan.md): current scope, proposed improvements, and verification gates.
- [Test plan](docs/test-plan.md): detailed coverage targets, with planned work clearly marked.
- [Roadmap](roadmap.md): a concise task checklist.

Publish through Lovable, or host the generated `dist/` directory on a static host with single-page-app route fallback. Keep the backend connection and OAuth redirect settings aligned with the deployment. Before inviting a team, verify sign-in, permissions, bug creation and updates, and the Claude connection against the hosted app.
