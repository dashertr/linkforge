# LinkForge

LinkForge is a full-stack web application built with React and Express.js. React provides the client-side interface, while Express.js powers the API and server-side functionality.

## Tech Stack

- React
- Express.js
- Node.js
- npm

## Project Structure

```text
linkforge/
├── client/     # React application
├── server/     # Express API
└── readme.md
```

> Update this section if your client and server use different directory names.

## Prerequisites

Install the following before running the project:

- [Node.js](https://nodejs.org/) 18 or newer
- npm (included with Node.js)

## Getting Started

1. Clone the repository and enter the project directory:

   ```bash
   git clone <repository-url>
   cd linkforge
   ```

2. Install dependencies for all workspaces:

   ```bash
   npm install
   ```

3. Create the required environment files from the examples:

   ```bash
   cp server/.env.example server/.env
   cp client/.env.example client/.env
   ```

   Update local values as needed. Do not commit `.env` files.

4. Start both development servers from the repository root:

   ```bash
   npm run dev
   ```

   You can also start each app separately.

5. Start the Express server only:

   ```bash
   cd server
   npm run dev
   ```

6. In another terminal, start the React development server only:

   ```bash
   cd client
   npm run dev
   ```

Open the local URL printed by the React development server. Vite commonly uses `http://localhost:5173`.

## Available Scripts

Run these commands from the relevant `client` or `server` directory. The exact scripts depend on each directory's `package.json`.

```bash
npm run dev      # Start a development server
npm run build    # Create a production build
npm start        # Start the production server
npm test         # Run tests
```

From the repository root, `npm test` runs all workspace test scripts that exist. See [docs/TESTING.md](docs/TESTING.md) for client and server testing guidance.

## Production

Build the React application with:

```bash
cd client
npm run build
```

Configure Express to serve the generated client files, or deploy the client and API separately. Set production environment variables through your hosting provider and do not commit `.env` files or secrets.

## Contributing

1. Create a branch for your change.
2. Make and test your changes.
3. Commit with a clear message.
4. Open a pull request.

## License

Add your project's license here.
