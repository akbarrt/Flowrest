# AGENTS

## Source of truth

- Single npm package (`flowrest`, private, ESM); no workspaces.
- `docs/PRD.md` defines the current MVP scope. `docs/FEATURES.md` holds behavior and task slices. `package.json` and `src/` are the executable truth.
- `docs/API.md`, `docs/DATABASE.md`, and `docs/DECISIONS.md` are a legacy blueprint for a different stack (Next.js, IndexedDB, Supabase, Playwright). Do not implement that stack or its features. Use `docs/DESIGN.md` only for visual direction.
- Deferred, do not implement unless asked: backend/auth, cloud sync, reminders, weekly stats, PWA, Framer Motion.
- UI copy is Indonesian (`index.html` uses `lang="id"`).

## Commands

- `npm run dev` — Vite dev server.
- `npm run build` — `tsc -b && vite build`; this is the only typecheck path.
- `npm run lint` — oxlint, not ESLint; config is `.oxlintrc.json`.
- `npm test` — Vitest run; focus one file with `npm test -- src/core/__tests__/timer.test.ts`.
- No `typecheck`, `check`, or `format` script exists. Verify with `npm run lint && npm run build && npm test`.

## Architecture

- `src/core/` is pure TS: no React, browser APIs, or imports from `ui/`, `hooks/`, or `storage/`.
- `src/storage/` must not import from `ui/` or `hooks/`. All persistence goes through the async `SessionStorage` interface in `src/storage/storage.ts`; the localStorage implementation uses key `flowrest.sessions`.
- React code belongs in `src/hooks/` and `src/ui/`; use named exports only.
- Most feature files (`core/{timer,garden,stats}.ts`, hooks, UI components/pages) are empty placeholders — only `types.ts` and `storage/*` are implemented. Do not assume logic exists.

## Toolchain gotchas

- `tsconfig.app.json` sets `verbatimModuleSyntax` and `erasableSyntaxOnly`: use `import type` for types; no enums or parameter properties.
- Tailwind v4 is wired via `@tailwindcss/vite` and `@import "tailwindcss"` in `src/index.css`; there is no Tailwind config file.
- Vitest has no separate config and no jsdom/testing-library installed; tests are pure TS by default.

## Planning workflow

- `docs/plan/` holds the active todo: one `m<n>-<nama-pekerjaan>.md` per task, numbered `m1`, `m2`, and so on. Names are lowercase Indonesian words joined by hyphens.
- For a multi-step build request, create the plan files before editing code. Work on exactly one task, the lowest number whose status is not `done`. Report when it is done and wait before starting the next.
- Each plan file has `Status: todo|doing|done`, `Tujuan`, `Langkah`, `Selesai ketika`, and `Verifikasi`. Update the status in the file. Do not batch tasks or renumber existing files.
- `docs/plan/` is the active task list. `docs/FEATURES.md` holds behavior and task slices. Base work on `docs/PRD.md` and the current `src/`.

## Working rules

- Do not add dependencies without asking first.
- Do not implement features outside `docs/PRD.md` or the current task.

<!-- antislop:start -->
## antislop
For UI, copy, people, mobile layout, or code comments work, read these installed skill files directly (use these paths even if a same-named global skill exists):
- Core filter, always on: `antislop`: `.agents/skills/antislop/SKILL.md`
- UI / visual: `antislop-ui`: `.agents/skills/antislop-ui/SKILL.md`
- Copy & text: `antislop-copywriting`: `.agents/skills/antislop-copywriting/SKILL.md`
- People: `antislop-human`: `.agents/skills/antislop-human/SKILL.md`
- Mobile / responsive: `antislop-layoutmobile`: `.agents/skills/antislop-layoutmobile/SKILL.md`
- Code comments: `antislop-code`: `.agents/skills/antislop-code/SKILL.md`
Before starting, follow the core's "Two Usage Modes" section in strict order: explicit session instruction first, then global preference, then ask. A session instruction always wins. For a resolved mode, say `antislop active: <mode> (session override).` or `antislop active: <mode> (global preference).` once before presenting findings or making edits, using the actual mode and source. Acknowledging the user's request without naming the source does not replace this notice.
Only an explicit choice of antislop during or after selects a session mode. A request to review, audit, or avoid file edits does not select a mode; read the global preference in that case. Another skill's mode does not select antislop's mode.
If the mode is unresolved, ask during/after and end the response; wait for the answer before any UI review, planning, or concept. For read-only tasks, put the active-mode notice only at the start of the final answer, never in progress messages. For editing tasks, announce before the first edit and omit it from the final answer.
To update antislop later: `npx antislop-ai --update`, or run `npx antislop-ai` and pick Overwrite them.
<!-- antislop:end -->
