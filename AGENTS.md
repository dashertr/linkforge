# Repository Guidelines

## Project Structure & Module Organization

LinkForge is intended to be a full-stack Node.js application. The planned layout is:

- `client/` — React user interface and browser-side assets.
- `server/` — Express API and server-side functionality.
- `readme.md` — setup and deployment notes.

The current repository is a scaffold containing only `readme.md`; add new client and server code under those directories rather than placing application files at the repository root. Keep tests close to the code they cover or in a clearly named `tests/` directory within the relevant app.

## Build, Test, and Development Commands

Run commands from the relevant directory after installing dependencies:

```bash
cd server && npm install
cd ../client && npm install
cd ../server && npm run dev   # Start the Express development server
cd ../client && npm run dev   # Start the React development server
cd ../client && npm run build # Create the production client build
```

Use `npm test` when a directory defines a test script, and `npm start` for its production server. Check each directory's `package.json` before relying on a script; no package manifests or executable tests are currently committed.

## Coding Style & Naming Conventions

Follow the formatter and linter configured by each app once those tools are added. Use two-space indentation, semicolons where the project formatter requires them, PascalCase for React components, camelCase for JavaScript variables and functions, and lowercase or kebab-case file names for general modules. Keep API routes and client API calls organized by feature.

## Testing Guidelines

Add unit or integration tests alongside each new feature and name them with the convention required by the chosen framework, commonly `*.test.js` or `*.spec.js`. At minimum, cover changed API behavior and important client interactions. Run the applicable `npm test` command before opening a pull request.

## Commit & Pull Request Guidelines

The Git history currently contains only `Initial commit`, so no established message convention can be inferred. Use concise imperative subjects, such as `Add link creation endpoint`, and keep each commit focused. Pull requests should explain the user-visible change, identify affected client/server areas, include test commands and results, link related issues, and attach screenshots or recordings for UI changes.

## Security & Configuration Tips

Use Node.js 18 or newer. Store local settings in `server/.env` and, when applicable, `client/.env` (for example, `VITE_API_URL`); never commit secrets or `.env` files. Document new environment variables and provide safe development defaults where possible.
