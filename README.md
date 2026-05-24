# Veena Traders

A full-stack grocery e-commerce project with:

- React + Vite + Tailwind frontend
- Node.js + Express REST API
- PostgreSQL database through Prisma
- JWT login/register, product browsing, cart, checkout, order history, and admin product CRUD

## Project Structure

```text
backend/
  prisma/
    schema.prisma
    seed.js
  src/
    controllers/
    middleware/
    routes/
    prisma.js
    server.js
frontend/
  src/
    components/
    context/
    pages/
    services/
```

## Local Setup

Create a PostgreSQL database named `grocery_db`.

Copy environment examples:

```bash
copy backend\.env.example backend\.env
copy frontend\.env.example frontend\.env
```

Edit `backend\.env` and replace `YOUR_PASSWORD` with your PostgreSQL password.

Install and prepare the backend:

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
```

On Windows, if `node` or `npm` is not found, open a new terminal or add this folder to PATH:

```text
C:\Program Files\nodejs
```

Install and run the frontend in another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

Seed admin login:

```text
admin@grocery.test
admin123
```

## One-command Local Run

From Git Bash, WSL, or any Bash terminal:

```bash
bash run-local.sh
```

The first run creates missing `.env` files and stops if `backend/.env` still has `YOUR_PASSWORD`. After you add your PostgreSQL password, run the script again. It will install dependencies if needed, generate Prisma Client, apply migrations, seed the database, and start both servers.

## Deployment Notes

- Frontend: deploy `frontend` to Vercel or Netlify.
- Backend: deploy `backend` to Render, Railway, or a VPS.
- Database: use Railway PostgreSQL, Neon, Supabase, or any hosted PostgreSQL.
- Set production environment variables:
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `CLIENT_URL`
  - `VITE_API_URL`

Run Prisma migrations on the host before starting the backend.
