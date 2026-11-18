# Blueprint Guide: Flowrest

> Legacy blueprint. The reading order below applies to the archived plan only. For current work read `PRD.md`, `FEATURES.md`, `plan/`, `package.json`, and `src/`. `SPEC.md` and `TASKS.md` were merged into those files.

## Reading order for AI agents

1. Read `DECISIONS.md` for the user's answers. Do not change an explicit decision without clarification.
2. Read `PRD.md` for product goals and scope, then `FEATURES.md` for behavior and acceptance criteria.
3. Read `DATABASE.md`, `API.md`, and other available technical documents before implementing related features.
4. Work through `plan/m<n>-<nama>.md` in numeric order. Verify each acceptance check and record unfinished work.

## Conflict resolution

- Explicit user answers in `DECISIONS.md` have the highest priority. Option descriptions provide context; examples are not automatically final decisions.
- `TBD` means a decision is missing. Do not silently turn it into a final value or behavior.
- Use `API.md` for endpoint contracts, `DATABASE.md` for data structures, and `USER_FLOW.md` for user journeys. If any conflicts with an explicit user answer, pause the affected work and request clarification.
- Locked or failed documents are not ready for implementation.

## Available files

- [PRD.md](PRD.md)
- [DESIGN.md](DESIGN.md)
- [DATABASE.md](DATABASE.md)
- [API.md](API.md)
- [FEATURES.md](FEATURES.md)
- [DECISIONS.md](DECISIONS.md)
- [plan/](plan/)

`REQUIREMENTS.md` is unavailable in this package; use acceptance criteria in `FEATURES.md` if present.
