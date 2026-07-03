# varsity-spotlight

Full‑stack monorepo with an Express API and a React (Vite) client. Shared DTOs live in a top‑level shared package for consistent typing across the stack.

## Stack

- API: Express + TypeScript + Mongoose
- Client: React 19 + Vite + Tailwind
- Shared: TypeScript DTOs

## Structure

- express/ — backend API and services
- react/ — frontend app
- shared/ — shared DTOs used by both apps

## Getting started

Install dependencies from the repo root (Yarn workspaces):

```bash
yarn
```

### Run the API (Express)

```bash
yarn workspace varsity-spotlight-express dev
```

### Run the client (React)

```bash
yarn workspace varsity-spotlight-react dev
```

## Scripts

Root:

- lint: lint both apps
- lint:fix: lint and fix both apps

Express:

- dev: run API in watch mode with type‑checking
- build: typecheck + build
- start: run compiled server
- lint: lint API source

React:

- dev: run Vite + TS watch
- typecheck: TS typecheck only
- build: typecheck + build
- preview: preview production build
- lint / lint:fix: lint client
- prettier / prettier:fix / format: formatting helpers

## Environment variables

Create a .env file in express/ for backend configuration and a .env (or .env.local) in react/ for client configuration. Add only non‑secret public values to the client environment. Do not commit secrets.

## Notes

- API routes and modules live under express/src/modules.
- Shared DTOs live under shared/dtos.
