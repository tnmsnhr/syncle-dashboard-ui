# syncle-dashboard-ui

Web dashboard for Syncle — view summaries created from the Chrome extension.

## Prerequisites

- `syncle-services` running with Google OAuth configured (see `syncle-services/docs/AUTH.md`)
- Same Google account on extension and dashboard

## Run

```bash
# Terminal 1
cd syncle-services && npm run dev

# Terminal 2
cd syncle-dashboard-ui
cp .env.example .env   # if needed
npm run dev
```

Open http://localhost:5174 → **Continue with Google**.

## How data flows

1. Sign in on the **Chrome extension** (popup → Sign in with Google).
2. Highlight content on any page — Syncle runs AI and saves a summary to the backend.
3. Open the dashboard (same Google account) — summaries appear under **Summary History**.

Summaries are stored in `syncle-services/data/user-data.json` (per user, no dummy seed data).

## Environment

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend URL (`http://localhost:3001`) — used for API + OAuth redirect |

On the server, set `DASHBOARD_ORIGIN=http://localhost:5174` in `syncle-services/.env`.
