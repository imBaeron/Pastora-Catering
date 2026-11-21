# Pastora's Catering

Catering booking system: React (Vite) frontend, Express API, PostgreSQL database.

```
React (Vite)  ->  Express API (server/)  ->  PostgreSQL
 localhost:5173      localhost:4000           localhost:5432
```

## What you need installed
- [Node.js](https://nodejs.org) 18 or newer
- [PostgreSQL](https://www.postgresql.org/download/) 14 or newer (pgAdmin comes with it)
- Git

## First-time setup (each teammate does this on their own PC)

Each person has their **own local database**. The data is not shared through GitHub, only the SQL files that build it.

### 1. Get the code
```bash
git clone <repo-url> 
cd Pastora-Catering
npm install
```
or `git pull` to update an existing local copy

### 2. Create the database
In pgAdmin, right-click **Databases > Create > Database** and name it `pastora-catering`.
(Or: `psql -U postgres -c 'CREATE DATABASE "pastora-catering"'`)

### 3. Create the tables and starter data
locate this files inside the project folder and Run **in order**, **once each**, against `pastora-catering`.
In pgAdmin: right-click the database > Query Tool > open the file or paste the sql code > press F5 (Execute script).

```bash
database/01_schema.sql
database/02_rules_and_seed.sql
database/03_menu_and_dates.sql
```

### 4. Set up the API
```bash
cd server
npm install
cp .env.example .env
```
Open `server/.env` and fill in **your own** PostgreSQL password and any long random `JWT_SECRET`:
```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/pastora-catering
JWT_SECRET=any-long-random-string
PORT=4000
CLIENT_ORIGIN=http://localhost:5173
```
Then create the demo accounts and sample bookings:
```bash
npm run seed
```

### 5. Run the project (two terminals)
```bash
# Terminal 1: API (inside server/)
npm run dev

# Terminal 2: React (project root)
npm run dev
```
Open http://localhost:5173.

Quick check that the API works: http://localhost:4000/api/catalog should show JSON.

## Demo logins
| Role | Email | Password |
|---|---|---|
| Admin | admin@pastoras.com | admin123 |
| Client | client@pastoras.com | client123 |

These are for local development only. Change them before any real deployment.

## Project layout
```
database/   SQL files: tables, rules + starter data, menu dishes
server/     Express API (index.js), DB connection (db.js), demo data (seed-demo.js)
src/        React app. api.js talks to the API; CatalogContext.jsx loads menu, rates and add-ons
```

## Changing the database
Do not edit tables by hand in pgAdmin only. Put the change in a new numbered SQL file
(e.g. `database/04_add_something.sql`), commit it, and tell the team to run it.
Prices and menu items can be changed with normal `UPDATE` / `INSERT` statements on `pricing_rate`, `add_on` and `menu_item`.

## Starting over (wipes your local data)
```sql
DROP SCHEMA public CASCADE; CREATE SCHEMA public;
```
Then repeat steps 3 and 4 (`npm run seed`).

## Troubleshooting
| Problem | Fix |
|---|---|
| "Cannot reach the server" on the website | The API is not running. Start it in `server/` with `npm run dev`. |
| `password authentication failed` | Wrong password in `server/.env`. |
| `database "pastora-catering" does not exist` | Do step 2, and check the name in `DATABASE_URL`. |
| `relation "booking" does not exist` | You skipped step 3, or ran the files in the wrong order. |
| `already exists` errors when running SQL | The files were already run. Use "Starting over" above. |
| Login fails right after setup | Run `npm run seed` inside `server/`. |
| Port 4000 or 5173 already in use | Change `PORT` in `server/.env` (and `VITE_API_URL` for the frontend). |

## Never commit
`server/.env` (your password) and `node_modules/`. Both are already in `.gitignore`.
