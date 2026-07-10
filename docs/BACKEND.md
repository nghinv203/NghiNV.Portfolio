# Backend integration guide

The frontend already talks to a real `HttpClient` (`PortfolioApiService`). While
`environment.useMock` is `true`, the `mockBackendInterceptor` answers `/api/*`
requests from local data. Pointing the app at a real backend is a configuration
change, not a code change.

## Steps

1. **Implement the endpoints** below on your backend (any stack).
2. Set `useMock: false` in `src/environments/environment.ts` (and `.prod.ts`).
3. Set `apiBaseUrl` to your backend base (e.g. `https://api.example.com/api`).
4. Optionally delete `src/app/mock/**` and remove `mockBackendInterceptor` from
   `app.config.ts` once the real backend is live.

That's it — components, services and models are unchanged.

## Contract

All responses use the shared envelope from `src/app/models/api.model.ts`:

- single resource → `{ "data": T }`
- collection → `{ "data": T[], "total": number }`

| Method | Path                     | Response                         |
| ------ | ------------------------ | -------------------------------- |
| GET    | `/api/profile`           | `ApiResponse<Profile>`           |
| GET    | `/api/skills`            | `ApiListResponse<Skill>`         |
| GET    | `/api/experience`        | `ApiListResponse<Experience>`    |
| GET    | `/api/projects`          | `ApiListResponse<Project>`       |
| GET    | `/api/projects/:slug`    | `ApiResponse<ProjectDetail>` (404 if missing) |
| GET    | `/api/certificates`      | `ApiListResponse<Certificate>`   |
| GET    | `/api/education`         | `ApiListResponse<Education>`     |
| POST   | `/api/contact`           | `ApiResponse<ContactResult>` — body `{ name, email, message }` |

Field shapes are defined in `src/app/models/`. Text that varies by language uses
`LocalizedString` = `{ vi: string; en: string; ja: string }`.

## Adapters

If the backend's field names differ from the models, add the mapping in
`PortfolioApiService` (the single place that unwraps responses) — keep the rest of
the app depending only on the `models/` types so drift is isolated to one file.

## Simulating states during development

While mocking, append a query flag to any endpoint to exercise UI states:

- `?mock=error` → 500 response (drives the error/retry UI)
- `?mock=empty` → empty collection / null resource (drives the empty UI)

Latency is controlled by `environment.mockDelayMs` (so skeletons are visible).
