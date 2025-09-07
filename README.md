## Clarity – Ramp Policy AI Clone (Copy That SaaS)

Clarity is a faithful clone of Ramp’s Policy AI Agent built for the “Copy That SaaS” hackathon, with a few enhancements (AI policy suggestions, modern UI):

- Real‑time transaction inbox with grouping, filtering, and detail view
- AI policy analysis and suggestions (OpenAI + Toolhouse)
- Live updates via WebSocket
- Mock storage (JSON files) — no external DB required

Note: This is an independent clone for educational/demo purposes. No affiliation with Ramp. Trademarks belong to their respective owners.

This repository contains a Node.js backend and a React + TypeScript frontend.

### Monorepo layout

- `backend/` – Express server, JSON storage, AI endpoints, WebSocket
- `frontend/` – React + Vite app, TypeScript UI

### Prerequisites

- Node.js 18+ and npm 9+

### Quick start

1) Backend

```bash
cd backend
npm install

# Copy env template if needed (optional)
# cp .env.example .env

npm start
# Server: http://localhost:3038 (WebSocket on ws://localhost:3038)
```

2) Frontend

```bash
cd ../frontend
npm install
npm run dev
# App: http://localhost:5173
```

The frontend is configured to call the backend on `http://localhost:3038`.

### Environment variables (backend)

Create a `.env` file in `backend/` (optional). Supported vars:

- `OPENAI_API_KEY` – Enables GPT policy analysis and receipt parsing
- `TOOLHOUSE_AGENT_URL` – Toolhouse agent endpoint for policy suggestions
- `PORT` – Server port (default: `3038`)

The app gracefully degrades if AI variables are not set (you’ll see placeholder behavior and “pending” statuses).

### Scripts

Backend:

- `npm start` – start server

Frontend:

- `npm run dev` – start Vite dev server
- `npm run build` – production build
- `npm run preview` – preview built app

### API summary

- `GET /api/transactions`
- `POST /api/transactions`
- `DELETE /api/transactions/:id`
- `GET /api/policies`
- `POST /api/policies`
- `POST /api/analyze-transaction`
- `POST /api/reanalyze-transaction/:id`
- `POST /api/suggest-policy`
- `GET /api/transactions/:id/policy-suggestion` (use `?force=true` to bypass cache)

WebSocket events (server → client):

- `transaction:new`, `transaction:updated`, `transaction:deleted`, `policies:updated`

### Data and caching

Data is stored locally:

- `backend/data/transactions.json`
- `backend/data/policies.json`

AI output is cached on the transaction objects:

- GPT recommendation → `approvalReason`
- Toolhouse suggestion → `policySuggestion` (content + timestamp, 24h cache)

You can clear caches via the provided script in `backend/`:

```bash
node clear-cache.js            # Clear all
node clear-cache.js --gpt      # Clear GPT only
node clear-cache.js --toolhouse # Clear Toolhouse only
node clear-cache.js --id=<ID>  # Clear for a specific transaction
```

### Development notes

- Frontend is written in TypeScript with strict settings enabled.
- Shared domain types are defined in `frontend/src/types2.ts`.
- API client lives in `frontend/src/services/api.ts`.
- Real‑time updates are handled by `WebSocketClient` in the same module.

### Troubleshooting

- If the UI shows a loading state indefinitely, confirm the backend is running on `http://localhost:3038` and that no proxy/firewall blocks WebSocket `ws://localhost:3038`.
- If receipt parsing fails, ensure `OPENAI_API_KEY` is set and that the model listed in `backend/server.js` is available to your account.
- If policy suggestions return placeholders, set `TOOLHOUSE_AGENT_URL`.

### License

MIT


