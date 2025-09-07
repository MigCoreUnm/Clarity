## Clarity Frontend

React + TypeScript app powered by Vite.

### Run

```bash
npm install
npm run dev
# http://localhost:5173
```

The app expects the backend at `http://localhost:3001` for REST and `ws://localhost:3001` for WebSocket.

### Build

```bash
npm run build
npm run preview
```

### Code structure

- `src/services/api.ts` – API client and WebSocket client
- `src/types2.ts` – shared domain types
- `src/pages` – top‑level pages
- `src/components` – UI components

For repo‑wide details, see the root `README.md`.
