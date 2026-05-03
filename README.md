## AppTrackr:

A full-stack developer portfolio and project tracking app built to cover the complete web development + DevSecOps stack.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, Tailwind CSS |
| Backend | Node.js, Express |
| Auth | JWT (access + refresh tokens), bcrypt |
| Primary DB | PostgreSQL |
| Activity DB | MongoDB |
| Containerization | Docker, Docker Compose |
| CI Pipeline | GitHub Actions |

## Architecture
Next.js (port 3000)
↕ REST API
Express (port 5000)
↕              ↕
PostgreSQL (5432)   MongoDB (27017)
All services containerized via Docker Compose

## Getting Started

### Run with Docker (recommended)

```bash
docker compose up --build
```

App runs at `http://localhost:3000`

### Run locally

**Backend:**
```bash
cd apptrackr-backend
npm install
npm run dev
```

**Frontend:**
```bash
cd apptrackr-frontend
npm install
npm run dev
```

## Features

- User registration and login with JWT authentication
- Access token + refresh token flow
- Create, view, and delete projects
- Every action logged to MongoDB (activity feed)
- Full Docker Compose orchestration with health checks
- GitHub Actions CI — builds and tests on every push

## CI Pipeline

On every push to `main`:
1. Installs dependencies for backend and frontend
2. Smoke tests the backend boot
3. Runs a production build of the Next.js frontend
4. Builds both Docker images to verify containerization
