# AGENTS

## Source of truth

- Single npm package (`flowrest`, private, ESM); no workspaces.
- If sources conflict, priority is: `src/` and `package.json` > `docs/plan/` > `docs/PRD.md` > `docs/FEATURES.md`.
- `docs/PRD.md` defines the MVP scope. `docs/FEATURES.md` holds behavior details. `docs/DESIGN.md` is for visual direction only.
- Never read or follow `docs/archive/`. It is an old blueprint for a different stack (Next.js, IndexedDB, Supabase, Playwright). Do not implement that stack.
- Deferred, do not implement unless asked: backend/auth, cloud sync, reminders, weekly stats, PWA, Framer Motion.
- UI copy is Indonesian (`index.html` uses `lang="id"`).

## Commands

- `npm run dev`: Vite dev server.
- `npm run build`: `tsc -b && vite build`; this is the only typecheck path.
- `npm run lint`: oxlint, not ESLint; config is `.oxlintrc.json`.
- `npm test`: Vitest run; focus one file with `npm test -- src/core/__tests__/timer.test.ts`.
- No `typecheck`, `check`, or `format` script exists.
- Before saying a task is done, run `npm run lint && npm run build && npm test` and report the results.

## Architecture

- `src/core/` is pure TS: no React, no browser APIs, no imports from `ui/`, `hooks/`, or `storage/`.
- `src/storage/` must not import from `ui/` or `hooks/`. All persistence goes through the async `SessionStorage` interface in `src/storage/storage.ts`; the localStorage implementation uses key `flowrest.sessions`.
- React code belongs in `src/hooks/` and `src/ui/`. Use named exports only and functional components.
- Check a file's actual contents before assuming logic exists; some files may still be empty placeholders.

## Toolchain gotchas

- `tsconfig.app.json` sets `verbatimModuleSyntax` and `erasableSyntaxOnly`: use `import type` for types; no enums or parameter properties.
- Tailwind v4 is wired via `@tailwindcss/vite` and `@import "tailwindcss"` in `src/index.css`; there is no Tailwind config file. Do not create one.
- Vitest has no separate config and no jsdom/testing-library; tests are pure TS by default. Do not add a test environment without asking.

## Planning workflow

- `docs/plan/` holds the active task list: one `m<n>-<nama-pekerjaan>.md` per task, numbered `m1`, `m2`, and so on. Names are lowercase Indonesian words joined by hyphens.
- Work on exactly one task: the lowest number whose status is not `done`. When finished, report and wait before starting the next.
- Each plan file has `Status: todo|doing|done`, `Tujuan`, `Langkah`, `Selesai ketika`, and `Verifikasi`. Update the status in the file as you go.
- Do not batch tasks, skip ahead, or renumber existing plan files.
- For a multi-step build request, create the plan files before editing code.

## Working rules

- Do not add dependencies without asking first.
- Do not implement features outside `docs/PRD.md` or the current task.
- Make small, focused changes. Show the plan first for any change touching more than a few files.
- Use explicit TypeScript types; avoid `any`.
- Do not run git commands (commit, push, reset, checkout). The user commits manually.
- Never print, log, or write secrets or API keys into files.

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