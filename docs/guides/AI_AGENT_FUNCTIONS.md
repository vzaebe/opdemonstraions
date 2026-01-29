# AI Agent Function Documentation Methodology

Use this guide when adding any new function or endpoint that AI agents or automation may call (API handlers, background jobs, CLI scripts, Pinia actions, composables, etc.).

## Workflow
- Document before merging: add an entry to this file under Function Registry using the template below.
- Keep entries close to code paths (file names, route patterns) and feature flags so agents can route calls safely.
- Capture observability: what to log, how to trace calls, and how to surface errors to monitoring.
- Update related docs (`docs/PROJECT_STRUCTURE.md`, feature docs) only if structure or behavior changes; otherwise keep changes here.

## Function Registry Template
Copy the block below for each new function and fill in the fields.

```
### <function name> - <short purpose>
- Location: <file path + export / route, e.g., server/index.js > POST /api/foo>
- Owner: <team/person> | Feature flag: <flag key or "none">
- Inputs: <shape + types + required/optional> (note secrets never logged)
- Output: <shape + status codes>
- Side effects: <db tables/files touched, external calls, cache keys>
- AuthZ/AuthN: <roles, token requirements, rate limits, idempotency expectations>
- Observability:
  - Log: <fields to log on start/finish: requestId, user, method, path, payload keys, status, duration, error>
  - Metrics/telemetry: <counters/timers you emit or plan to emit>
- Error model: <error codes/messages the agent should expect; retry guidance>
- Safe defaults: <timeouts, fallbacks, validation guards>
- Tests: <unit/e2e to cover; fixtures needed>
- Agent prompt hint: <1-2 example calls/payloads + expected response shape>
```

## Expectations
- Clarity first: prefer small, explicit inputs/outputs; avoid implicit defaults.
- Safety: document validation, rate limits, and any irreversible actions.
- Traceability: every function should define how to log requestId, user (if available), and duration.
- Keep current: update entries when signatures, flags, or side effects change.

## Function Registry
Add new entries below this line using the template above.
