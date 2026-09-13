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

2. Install the server dependencies:

   ```bash
   cd server
   npm install
   ```

3. Install the client dependencies:

   ```bash
   cd ../client
   npm install
   ```

4. Create the required environment files. For example, create `server/.env`:

   ```env
   PORT=5000
   NODE_ENV=development
   ```

   If the React app needs the API URL, add the variable expected by your build tool to the client's environment file. For Vite, create `client/.env` with:

   ```env
   VITE_API_URL=http://localhost:5000
   ```

5. Start the Express server:

   ```bash
   cd server
   npm run dev
   ```

6. In another terminal, start the React development server:

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
