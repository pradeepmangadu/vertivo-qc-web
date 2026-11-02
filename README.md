# vertivo-qc-web

React (Vite + TypeScript) frontend for the Vertivo Delivery QC app. Independent project — it talks to
`vertivo-qc-api` over HTTPS only. It contains **no Supabase keys, no secrets, and no direct database access**.

## Run
```bash
cp .env.example .env     # VITE_API_URL=http://localhost:4000
npm install
npm run dev              # http://localhost:5173  (start vertivo-qc-api first)
npm run build            # type-check + production build into dist/
```
Sign in with a user created in Supabase Auth (see the API README).

## What it does (all features of the original HTML)
Site details · sign-off · 4 checklist tabs (147 items) · per-item qty / actual size / inspection status / remarks /
photo · search and filter · live stats and per-section progress · autosave · CSV export · backup download ·
print / save PDF — now stored securely on the server, with sign-in, instead of one browser's localStorage.

## Structure
```
src/api/         fetch client (cookies, CSRF, silent token refresh) + endpoint helpers
src/auth/        AuthProvider, LoginPage, ProtectedRoute
src/pages/       DeliveryListPage, DeliveryPage (main QC screen)
src/components/  SiteDetailsForm, StatsBar, SectionTabs, SearchFilterBar, ChecklistItemCard,
                 PhotoUploader, SignOffForm, ActionsBar, Header
src/hooks/       useAutosave (debounced, serialised, version-aware), useChecklist, useDeliveryStats
src/styles/      global.css + print.css (ported from the original HTML)
```

## Security notes
- No tokens in JavaScript: sessions are `HttpOnly` cookies set by the API. Nothing sensitive in localStorage.
- CSRF token held in memory and sent as `X-CSRF-Token`; one silent refresh on expiry, then back to login.
- React escapes all output; no `dangerouslySetInnerHTML`; no inline scripts or inline styles, so a strict CSP works.
  Production builds embed a CSP `<meta>`; also set the headers in `public/_headers` (or your host's equivalent),
  replacing `https://api.example.com` with your API origin. `frame-ancestors` only works as a header.
- Photos are shrunk to 1200px in the browser, then re-verified and stripped of EXIF/GPS by the API.
- Deploy on the **same site** as the API (e.g. `app.example.com` + `api.example.com`) over HTTPS — the API's cookies are `SameSite=Strict`.
- SPA hosting needs a fallback to `index.html` for deep links such as `/deliveries/<id>`.
- Run `npm run audit` regularly.
