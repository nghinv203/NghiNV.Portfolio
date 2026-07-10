# NghiNV Portfolio

Personal developer portfolio for **Nguyen Van Nghi**, built with **Angular 19 (standalone) + SSR**.
Currently frontend-only with a **mock API layer** designed to be swapped for a real backend with minimal change.

## Features

- **SSR** (Node/Express via `@angular/ssr`) — server-rendered per request for SEO and fast first paint.
- **Light / dark theme** — follows the OS by default, manual toggle, remembered across visits (localStorage + cookie for SSR). No flash of wrong theme.
- **3 languages** (VI / EN / JP) with **Transloco** — auto-detects the browser language, falls back to English, remembered across visits, switchable at runtime without a rebuild.
- **Mock API layer** — every dynamic value flows through a service → `mockBackendInterceptor`. Simulated latency, error and empty states. Flip one flag to use a real backend.
- **Skeleton loading**, empty and error states for every data-driven section.
- Sections: Hero, About (+ education & certificates), Skills, Experience, Projects (+ detail pages), Contact form.
- SEO: per-route title/meta/Open Graph/Twitter + JSON-LD, `robots.txt`, `sitemap.xml`.
- Accessible: semantic landmarks, skip link, focus-visible rings, keyboard navigation, `prefers-reduced-motion`.

## Getting started

```bash
npm install
npm start            # dev server with SSR at http://localhost:4200
```

Build and run the production SSR server:

```bash
npm run build
node dist/nghi-nv.portfolio/server/server.mjs   # serves http://localhost:4000
```

## Project structure

```
src/
  app/
    core/         # singletons: services (theme, language, seo, profile store, api),
                  # interceptors (mock-backend, error), DI tokens, constants, utils
    shared/       # reusable presentational components + pipes (icon, skeleton,
                  # states, cards, section-header, theme/language controls, localize)
    layouts/      # main-layout (header, nav, footer)
    features/     # home (+ sections), projects (detail), not-found
    models/       # typed domain models + LocalizedString
    mock/         # mock data (from CV) + fake backend router
  environments/   # environment flags (useMock, apiBaseUrl, mockDelayMs)
  styles/         # design tokens, themes, mixins, reset, typography, buttons
  server.ts       # Express SSR entry (provides cookie/lang/origin to the app)
public/i18n/      # vi.json / en.json / ja.json
```

## Editing content

All portfolio content lives in `src/app/mock/data/*.ts` (typed against `src/app/models`).
UI chrome text (nav, labels, states) lives in `public/i18n/{vi,en,ja}.json`.

## Switching to a real backend

See [docs/BACKEND.md](docs/BACKEND.md). In short: implement the REST endpoints the
`PortfolioApiService` already calls, then set `useMock: false` in the environment.
No component changes required.
