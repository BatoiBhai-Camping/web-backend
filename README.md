# BatoiBhai Web Backend — Run Locally

This repository contains the backend for the BatoiBhai  platform (TypeScript + Express + Prisma + PostgreSQL adn nodejs as run time). The instructions below explain how to run the project locally, including setting up the database with Prisma.

## Prerequisites

- Node.js (recommended v18 or newer)
- npm (bundled with Node.js) or a compatible package manager(yarn recomended)
- PostgreSQL (local installation) or a hosted Postgres-compatible database (Neon, Supabase, RDS, etc.)
- Git (to clone the repo)

Optional (for faster developer feedback):
- `npx` (comes with npm) for running CLI tools without installing globally

## Quick overview of important files

- `package.json` — npm scripts (build, start, migrate, dbclient)
- `prisma/schema.prisma` — Prisma schema and models
- `prisma.config.ts` — Prisma config (reads `DATABASE_URL` from env)
- `src/` — TypeScript source. Entry point: `src/index.ts`
- `src/db/db.ts` — Prisma client initialization (reads `DATABASE_URL`)

## Environment variables

Create a `.env` file in the project root (same level as `package.json`) with at least the following variable:

```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
PORT=3001
NODE_ENV=development
```

- Replace `USER`, `PASSWORD`, `HOST`, `PORT`, and `DATABASE` with your database values.
- ex, "postgresql://postgres:755049@localhost:5432/batoibhai?schema=public"
- Example for a local Postgres: `postgresql://postgres:password@localhost:5432/batoibhai_db?schema=public`

## Install dependencies

From the project root:

```bash
yarn install or npm install
```

This installs runtime and dev dependencies including `@prisma/client` and `prisma`.

## Run migrations (create / apply DB schema)

The repository contains a migration in `prisma/migrations/`. To apply migrations and create/update your database schema, run:

```bash
yarn migrate or npm run migrate
# this runs `npx prisma migrate dev`
```
## Generate Prisma client

After installing dependencies (or whenever the Prisma schema changes) generate the Prisma client:

```bash
yarn dbclient or npm run dbclient
# this runs `npx prisma generate`
```

If you see TypeScript errors pointing to generated Prisma files, ensure this step completed successfully.



## Build and start the server

This project uses TypeScript. Build and run with these commands:

```bash
yarn build or npm run build
yarn start or npm start
```

- `npm run build` runs `tsc -b` which compiles TypeScript into the `dist/` folder.
- `npm start` runs `node ./dist/index.js` and starts the server.

The server prints the health route URL on startup, for example:

```
http://localhost:3001/api/v1/health-status
```



## Useful scripts

- `yarn build or npm run build` — compile TypeScript
- `yarn start or npm run start` — run compiled app
- `yarn dbclient or npm run dbclient` — `npx prisma generate` (generate Prisma client)
- `yarn migrate or npm run migrate` — `npx prisma migrate dev` (apply migrations)
- `yarn format or npm run format` — format source with `prettier`


## Quick start (summary)

1. Clone repo and change directory
	```bash
	git clone <repo-url>
	cd web-backend
	```
2. Install dependencies
	```bash
	yar install or npm install
	```
3. Create `.env` with Reqired fields
4. Run migrations
	```bash
	yarn migrate or npm run migrate
	```
5. Generate Prisma client
	```bash
	yarn dbclient or npm run dbclient
	```
6. Build and start the server
	```bash
	npm run build
	npm start
	```