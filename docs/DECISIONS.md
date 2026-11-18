# Product Decisions: Flowrest

> Legacy blueprint. Some answers here were superseded by the narrower MVP in `PRD.md`. Do not treat this file as the current scope.

This document records the selected answers and supplied text. `Answered` means an option was selected; it does not settle every detail in its description. Option descriptions provide context and do not authorize invented fees, deadlines, or policies. Mark unspecified details as `TBD` in downstream specs.

## DEC-001 — How should user data persist across sessions? Should Flowrest work offline-first with local storage, or require cloud sync from day one?

**Status:** Answered

**User answer:** Offline-first with optional cloud sync: All data stored locally; users can optionally sign in to sync across devices. Best for MVP, simpler initial development.

## DEC-002 — How should the garden grow and what triggers new flowers? Should each completed Pomodoro add one flower, or should mood/consistency unlock special blooms?

**Status:** Answered

**User answer:** Hybrid: sessions + mood + streaks: Combines all three: base flower per session, mood affects appearance, streaks unlock rare variants. Most engaging but requires careful balancing.

## DEC-003 — What level of mood tracking do you want? Simple emoji selection, or more detailed emotion + intensity + optional notes?

**Status:** Answered

**User answer:** Detailed form (emotion + intensity + optional note): Full reflection: emotion, intensity, optional text note. Deeper insights but higher friction—users may skip if tired.

## DEC-004 — Should users be able to customize Pomodoro durations (e.g., 15/30/45 min focus blocks), or lock it to the standard 25/5 minute format?

**Status:** Answered

**User answer:** Fully customizable durations: Users set any focus/break duration. Maximum flexibility but adds UI complexity and makes stats/comparisons harder.

## DEC-005 — What visual mood should Flowrest have? Soft & minimalist, vibrant & playful, or nature-inspired & detailed?

**Status:** Answered

**User answer:** Nature-inspired & detailed (botanical, organic): Realistic or semi-realistic flowers, leaves, textures. Immersive garden feel but requires more design/animation work.
