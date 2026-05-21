#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js was not found. Install Node.js or add it to PATH."
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "npm was not found. Install Node.js or add npm to PATH."
  exit 1
fi

if [ ! -f "$BACKEND_DIR/.env" ]; then
  cp "$BACKEND_DIR/.env.example" "$BACKEND_DIR/.env"
  echo "Created backend/.env from .env.example."
  echo "Edit backend/.env and replace YOUR_PASSWORD before running this script again."
  exit 1
fi

if grep -q "YOUR_PASSWORD" "$BACKEND_DIR/.env"; then
  echo "backend/.env still contains YOUR_PASSWORD."
  echo "Open backend/.env and set your PostgreSQL password first."
  exit 1
fi

if [ ! -f "$FRONTEND_DIR/.env" ]; then
  cp "$FRONTEND_DIR/.env.example" "$FRONTEND_DIR/.env"
  echo "Created frontend/.env from .env.example."
fi

install_if_needed() {
  local dir="$1"
  local name="$2"

  if [ ! -d "$dir/node_modules" ]; then
    echo "Installing $name dependencies..."
    (cd "$dir" && npm install)
  fi
}

install_if_needed "$BACKEND_DIR" "backend"
install_if_needed "$FRONTEND_DIR" "frontend"

echo "Generating Prisma client..."
(cd "$BACKEND_DIR" && npx prisma generate)

echo "Applying database migrations..."
(cd "$BACKEND_DIR" && npx prisma migrate dev --name init)

echo "Seeding database..."
(cd "$BACKEND_DIR" && npm run prisma:seed)

cleanup() {
  echo
  echo "Stopping local servers..."
  if [ -n "${BACKEND_PID:-}" ]; then kill "$BACKEND_PID" 2>/dev/null || true; fi
  if [ -n "${FRONTEND_PID:-}" ]; then kill "$FRONTEND_PID" 2>/dev/null || true; fi
}

trap cleanup EXIT INT TERM

echo "Starting backend on http://localhost:5000"
(cd "$BACKEND_DIR" && npm run dev) &
BACKEND_PID=$!

echo "Starting frontend on http://localhost:5173"
(cd "$FRONTEND_DIR" && npm run dev -- --host 127.0.0.1) &
FRONTEND_PID=$!

echo
echo "FreshCart is starting."
echo "Frontend: http://localhost:5173"
echo "Backend:  http://localhost:5000/api/health"
echo
echo "Press Ctrl+C to stop both servers."

wait "$BACKEND_PID" "$FRONTEND_PID"
