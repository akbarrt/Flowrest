# DESIGN.md: Flowrest

> Legacy blueprint. Use its palette and typography as visual direction only. Ignore its stack, user roles, and features outside `PRD.md`.

## 1. Design Read (Evidence-Based)

- **Product:** Flowrest — offline-first Pomodoro timer with a mood garden; each completed session plants a flower whose appearance reflects mood and streak (DEC-001, DEC-002, DEC-003).
- **Target Audience:** Students, remote workers, wellness-focused individuals who reject punitive gamification (PRD).
- **Product Type:** SaaS Application (web-first PWA).
- **Primary User Goal:** Run a focus session → reflect on mood → see the garden grow (FR-01, FR-03, FR-04).
- **User Roles & Workflows:**
  - *Guest:* Timer → Mood form → Garden view → Local stats (no sync).
  - *Registered:* All guest flows + sync toggle, weekly stats, reminders, export.
  - *Admin:* Config panel for presets/streak thresholds + aggregate metrics (FR-13, FR-14).
- **Brand / Aesthetic Direction:** Botanical, organic, semi-realistic (DEC-005). Warm paper neutrals, deep moss greens, muted petal accents. Calm, unhurried, tactile — a living companion, not a dashboard.
- **Key Personality Traits:** *Gentle*, *Grounding*, *Deliberate*.

## 2. Design Dials (Context-Specific)

| Dial | Value | Rationale |
|:---|:---:|:---|
| DESIGN_VARIANCE | 4 | Garden view is asymmetric/organic; timer and stats must remain predictable and scannable. Variance lives in the garden canvas, not the chrome. |
| MOTION_INTENSITY | 6 | Botanical bloom animations are core to the value prop (DEC-005, FR-05), but must respect `prefers-reduced-motion`. Chrome motion stays ≤200ms. |
| VISUAL_DENSITY | 4 | Timer is a single-focus surface; stats are weekly, not real-time. Low density keeps the wellness tone; admin panel is the only dense screen. |

## 3. Visual Identity & Product-Type Adaptation

Flowrest is a **SaaS app whose primary surface is a single-purpose timer and a scrollable garden**. Priority order: (1) timer legibility at arm's length, (2) garden as the emotional payoff, (3) stats as secondary reflection. Distinctiveness comes from **typographic warmth + botanical illustration**, not gradients or glass. Hairline dividers (`--color-border`) replace card shadows. The garden canvas is the *only* place where illustration, texture, and multi-color composition are permitted.

## 4. Semantic Color System

```css
:root {
  --color-primary:   #3F5D3A; /* moss — timer ring, primary CTA */
  --color-secondary: #7A8B6F; /* sage — secondary actions, streak chip */
  --color-accent:    #C97B5A; /* terracotta petal — rare bloom, active streak */
  --color-success:   #6B8E4E;
  --color-warning:   #C99A3F;
  --color-danger:    #A84A3F;
  --color-bg:        #F6F2EA; /* warm paper */
  --color-surface:   #FBF8F2;
  --color-fg:        #23281F;
  --color-muted:     #6E7268;
  --color-border:    #DDD6C7; /* hairline */
}
```

**Usage rules:** Neutrals cover ≥90% of chrome. `--color-primary` is reserved for the running timer ring, the single primary CTA, and current nav item. `--color-accent` appears **only** on rare-variant blooms and streak milestones (7/30/100, DEC-002). `--color-success/warning/danger` are for status text and sync state — never decorative. **Prohibited:** blue/purple neon gradients, glowing mesh backgrounds, frosted glass.

## 5. Typography & Type Scale

- **Display / Headings:** *Fraunces* (variable serif) — botanical, editorial warmth; distinguishes Flowrest from utilitarian timer apps.
- **Body / UI:** *Inter* (variable) — chosen for the dense mood form and stats table where legibility at 13–14px matters (DEC-003).
- **Numerals (timer):** *Fraunces* tabular figures at large size for the countdown.

```html
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

| Level | Size | Weight | Line-H | Tracking | Rationale |
|:---|:---|:---:|:---:|:---|:---|
| h1 | 2.5rem | 600 | 1.15 | -0.02em | Page titles (Garden, Stats) |
| h2 | 1.75rem | 600 | 1.2 | -0.01em | Section heads |
| h3 | 1.25rem | 600 | 1.3 | 0 | Card titles (rare) |
| Timer | 5rem | 600 | 1 | -0.03em | Countdown, tabular |
| body | 0.9375rem | 400 | 1.6 | 0 | Forms, notes |
| caption | 0.8125rem | 500 | 1.4 | 0.01em | Mood labels, timestamps |

## 6. Layout Strategy & Anti-Repetition Rules

- **Timer screen:** Split-pane on desktop (timer 60% / session context 40%); stacked on mobile. No hero.
- **Mood form:** Single-column form (max 480px), emotion as a 6-item radio row, intensity as a 5-step segmented control, note as a textarea.
- **Garden:** Full-bleed scrollable canvas; flowers positioned by date; tap opens a **side drawer** (desktop) / **bottom sheet** (mobile) — never a modal-over-modal.
- **Stats:** Comparison **table** + single sparkline; not a card grid.
- **Admin:** Master/detail with a fixed left rail.
- **Grid:** 12-col, gutter 24px desktop / 16px tablet / 12px mobile; vertical rhythm on 8px baseline. Max content width 1200px (chrome), garden canvas unbounded zoom.

## 7. Anti-AI-Slop Rules

| Avoid | Prefer |
|:---|:---|
| Three-card feature grid | Table, timeline, or asymmetric split |
| Everything in rounded cards | Hairline dividers + whitespace |
| Purple/blue gradients, mesh blobs | Flat paper neutrals + one semantic accent |
| Decorative badges/icons | Typographic hierarchy + status labels |
| Decorative motion | Bloom animation (garden only) + 120–200ms interaction feedback |

## 8. Card & Container Discipline

Cards are **allowed only** for: garden flower popovers (drawer), admin metric tiles, and the rare-variant unlock notice. Cards are **forbidden** for: mood form fields, stats table rows, settings groups, and any list. **No card nesting.** Use `--color-border` hairlines and 24px spacing for grouping.

## 9. Component Rules & Action Hierarchy

- **Primary:** Solid `--color-primary`, white text, 44px min height — one per viewport (e.g., "Start focus").
- **Secondary:** Outline on `--color-surface` with `--color-border`.
- **Tertiary:** Text-only, `--color-muted` → `--color-fg` on hover.
- **States:** Hover = 6% overlay; Focus = 2px `--color-primary` ring + 2px offset; Disabled = 45% opacity + `cursor:not-allowed`; Selected (emotion) = filled `--color-primary` chip with check icon; Active (streak) = `--color-accent` underline. All states meet WCAG AA contrast (fg on bg ≥ 7:1).

## 10. Behavioral Responsive Design

| Breakpoint | Behavior |
|:---|:---|
| < 640px (mobile) | Timer full-height; nav → bottom bar (Timer / Garden / Stats / Profile); garden drawer = bottom sheet; stats table hides "note" column |
| 640–1024px (tablet) | Split-pane collapses to stacked; garden drawer = right 40% panel |
| ≥ 1024px (desktop) | Split-pane active; top nav; garden drawer = right 360px |

## 11. States (Loading, Empty, Error)

- **Loading:** Timer skeleton = static ring outline + `--` numerals; garden skeleton = 3 ghost flower silhouettes at real coordinates; stats = table rows with hairline placeholders. **No spinners.**
- **Empty:** Garden empty → "Your first bloom awaits. Start a focus session." + primary CTA. Stats empty → "Complete a session to see your week."
- **Error:** Sync failure → inline banner above garden: "Sync paused. Your data is safe locally." + Retry. Mood save failure → inline form error, note preserved.

## 12. Accessibility & Inclusivity (WCAG 2.1 AA)

- Full keyboard operation: Tab order timer → mood → garden; `Space`/`Enter` activates; `Esc` closes drawers.
- Focus ring: 2px `--color-primary` + 2px offset, always visible.
- ARIA: timer as `role="timer"` with `aria-live="polite"` (announce at 5min/1min/0); mood emotion as `role="radiogroup"`; streak chip `aria-label="7-day streak"`.
- Touch targets ≥ 44×44px.
- Streak/rare-variant status communicated via **text + icon**, never color alone.
- `prefers-reduced-motion`: bloom becomes 200ms opacity fade; no parallax.

## 13. Design Rationale

The split-pane timer keeps the running ring legible while mood context sits adjacent, directly serving FR-01/FR-04. The garden as a scrollable canvas (not a card grid) honors DEC-005's semi-realistic botanical direction and makes flower tap-to-inspect (FR-08) natural. A stats *table* rather than tiles supports comparison across weeks (FR-09). Terracotta accent is rationed to rare variants so streak milestones (DEC-002) feel earned, not decorative. Offline-first (DEC-001) is surfaced through a persistent sync status chip, never a blocking modal.

## 14. NO Invented Design Content Rule

No fabricated testimonials, user counts, logos, or screenshots. All copy derives from FR-01–FR-14 and DEC-001–DEC-005. Mock data (flower names, sample moods) must map to real fields (`emotion`, `intensity`, `note`). Streak thresholds 7/30/100 are provisional (DEC-002) and rendered from config, never hardcoded in UI copy.

## 15. Design Pre-Flight Checklist

- [ ] Design is derived from PRD/project context.
- [ ] Design Read is specific.
- [ ] Design dials are intentional.
- [ ] Visual direction is justified.
- [ ] Color hierarchy is intentional.
- [ ] Typography is intentional.
- [ ] Cards are not overused.
- [ ] Layouts are not repetitive.
- [ ] No generic AI aesthetic was introduced without justification.
- [ ] Motion has a purpose.
- [ ] Responsive behavior is defined.
- [ ] Loading states are defined where relevant.
- [ ] Empty states are defined where relevant.
- [ ] Error states are defined where relevant.
- [ ] Accessibility is defined.
- [ ] No fake content was invented.
- [ ] Design feels specific to the product.
- [ ] A coding agent can implement the design without inventing major visual decisions.
- [ ] Design System is cohesive and reusable.