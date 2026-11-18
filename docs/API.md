# API.md: Flowrest

> Legacy blueprint for a planned Supabase backend. The current MVP has no API or auth. See `PRD.md`.

## 1. Authentication & Authorization

Flowrest is offline-first (DEC-001); all endpoints below require an authenticated **registered** session and are used only when cloud sync is enabled. Guests operate entirely against local storage and never call the API.

- **Method:** Supabase Auth issues a JWT (HS256). The client attaches it as `Authorization: Bearer <access_token>` on every request.
- **Token refresh:** Supabase client refreshes silently; expired tokens yield `401` and the client retries once after refresh.
- **Authorization:** All routes run under Supabase Row-Level Security. `user_id` is derived from `auth.uid()` server-side — never trusted from the request body.
- **Admin scope:** `GET /api/admin/metrics` additionally requires `app_metadata.role = "admin"` (FR-13); otherwise `403`.

## 2. Standard Response & Pagination

Success responses return the resource object directly with a `2xx` status. Errors return `{ "error": { "code": string, "message": string, "details"?: object } }`. List endpoints use cursor pagination: `?limit=<1-100>&cursor=<opaque>` returning `{ "data": [...], "nextCursor": string|null }`.

## 3. API Endpoints

### 3.1 Sync Focus Session (with optional mood + flower)

**`POST /api/sync/sessions`** — Auth: Registered. Upserts a completed/aborted session, its mood entry, and the planted flower atomically. Conflict resolution is last-write-wins per record keyed on client `updatedAt` (FR-11, DEC-001, DEC-002).

Request:
```json
{
  "session": {
    "id": "3f9c2a1e-...",
    "focusMinutes": 25,
    "breakMinutes": 5,
    "status": "completed",
    "startedAt": "2025-06-01T09:00:00Z",
    "completedAt": "2025-06-01T09:25:00Z",
    "updatedAt": "2025-06-01T09:25:03Z"
  },
  "mood": {
    "emotion": "calm",
    "intensity": 4,
    "note": "Deep work felt smooth.",
    "reflected": true
  },
  "flower": {
    "species": "daisy",
    "variant": "common",
    "bloomStage": 4
  }
}
```
Response `201`:
```json
{
  "sessionId": "3f9c2a1e-...",
  "moodId": "a1b2...",
  "flowerId": "c3d4...",
  "streak": { "currentStreak": 8, "longestStreak": 12, "lastSessionDate": "2025-06-01" }
}
```
Status: `201` created · `200` updated (LWW winner) · `400` validation (`focusMinutes` 1–180, `breakMinutes` 0–60, `intensity` 1–5, `note` ≤500) · `401` · `409` stale record rejected (server copy newer).

### 3.2 Pull Synced Garden

**`GET /api/sync/garden`** — Auth: Registered. Returns all flowers (with session/mood join) for the caller, cursor-paginated for large gardens (FR-07, FR-08).

Query: `?limit=100&cursor=<opaque>&since=<ISO8601>`

Response `200`:
```json
{
  "data": [
    {
      "id": "c3d4...",
      "sessionId": "3f9c2a1e-...",
      "species": "daisy",
      "variant": "common",
      "bloomStage": 4,
      "plantedAt": "2025-06-01T09:25:00Z",
      "mood": { "emotion": "calm", "intensity": 4, "note": "Deep work felt smooth." }
    }
  ],
  "nextCursor": null
}
```
Status: `200` · `401` · `403` sync paused (`sync_status='paused'`).

### 3.3 Weekly Stats & Streak

**`GET /api/stats/weekly`** — Auth: Registered. Aggregates focus minutes, completed sessions, mood distribution, average intensity, and streak (FR-09).

Query: `?weekStart=2025-06-01` (ISO date; defaults to current ISO week).

Response `200`:
```json
{
  "weekStart": "2025-06-01",
  "weekEnd": "2025-06-07",
  "focusMinutes": 320,
  "completedSessions": 12,
  "abortedSessions": 1,
  "moodDistribution": { "calm": 5, "focused": 4, "tired": 2, "anxious": 1 },
  "averageIntensity": 3.6,
  "reflectedRate": 0.83,
  "streak": { "currentStreak": 8, "longestStreak": 12 }
}
```
Status: `200` · `400` invalid date · `401`.

### 3.4 Export Personal Data

**`GET /api/export`** — Auth: Registered. Streams the caller's full dataset as a downloadable file (FR-12).

Query: `?format=json|csv` (default `json`).

Response `200` (`format=json`):
```json
{
  "exportedAt": "2025-06-07T12:00:00Z",
  "profile": { "displayName": "Aria" },
  "sessions": [ { "id": "...", "focusMinutes": 25, "status": "completed", "startedAt": "..." } ],
  "moods": [ { "sessionId": "...", "emotion": "calm", "intensity": 4, "note": "..." } ],
  "flowers": [ { "sessionId": "...", "species": "daisy", "variant": "common", "bloomStage": 4 } ],
  "streak": { "currentStreak": 8, "longestStreak": 12 }
}
```
Headers: `Content-Disposition: attachment; filename="flowrest-export-<date>.json"`.
Status: `200` · `400` unsupported format · `401`.

### 3.5 Admin Aggregate Metrics

**`GET /api/admin/metrics`** — Auth: Admin. Returns anonymized platform metrics only; never individual mood notes (FR-13, PRD constraint).

Query: `?from=2025-05-01&to=2025-06-01`.

Response `200`:
```json
{
  "range": { "from": "2025-05-01", "to": "2025-06-01" },
  "activeUsers": 4210,
  "avgSessionsPerDay": 2.4,
  "moodTrend": { "calm": 0.34, "focused": 0.28, "tired": 0.19, "happy": 0.11, "anxious": 0.05, "sad": 0.03 },
  "topRareVariants": [ { "variant": "legendary", "count": 42 }, { "variant": "epic", "count": 310 } ],
  "syncErrorRate": 0.004
}
```
Status: `200` · `401` · `403` non-admin.

> Timer presets, streak thresholds, and bloom rules (FR-14) are managed via Supabase admin config tables, not a public endpoint in MVP; admin mutation path is `TBD`.