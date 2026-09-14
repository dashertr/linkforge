# Testing Guide

LinkForge uses separate test suites for the Vite React client and the Express API. Run commands from the repository root unless a subproject-specific command is clearer.

## Commands

```bash
npm test
```

Runs all workspace test scripts that exist.

```bash
npm run test --workspace client
npm run test --workspace server
```

Runs one side of the application.

```bash
npm run test:watch --workspace client
npm run test:watch --workspace server
```

Starts Vitest in watch mode while developing.

## Client Tests

Place browser-facing tests near the related components or pages, using names like `*.test.jsx` or `*.spec.jsx`. Prefer React Testing Library queries that match user-visible labels, roles, and text. Mock API calls at the network boundary so form behavior can be tested without a running backend.

Recommended coverage:

- URL submission form validation.
- Successful short-link creation and display.
- Error states returned by the API.
- Copy-to-clipboard behavior when supported by the browser.

## Server Tests

Place API tests under `server/tests/` or beside route modules with names like `*.test.js`. Use Supertest to exercise Express routes through the app instance. Keep route handlers exportable without starting a listening server so tests can import the app directly.

Recommended coverage:

- `POST /api/links` creates a short URL from a valid destination.
- Invalid, missing, or unsafe URLs return `400`.
- Duplicate destinations or aliases have deterministic behavior.
- `GET /:code` redirects to the stored destination or returns `404`.

## Integration Notes

Tests should not depend on production services. Use an in-memory repository or a temporary test database, and load test-only settings from safe defaults. Do not commit `.env` files or real analytics, database, or deployment credentials.
