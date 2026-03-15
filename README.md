# Location-Based Smart Medical Shop Platform

Production-oriented monorepo for a multi-role pharmacy marketplace and operations platform (no maps, no AI), powered by React + Express + Firebase.

## Monorepo Structure

- `frontend/` React SPA with role-aware routing, dashboards, design system, and dynamic data flows.
- `backend/` Express API with Firebase Auth verification, RBAC, validation, audit logging hooks, and module-based route architecture.
- Root docs:
  - `PROJECT_BLUEPRINT.md`
  - `SECURITY_ARCHITECTURE.md`
  - `DATABASE_SCHEMA.md`
  - `API_SPEC.md`
  - `UI_UX_GUIDELINES.md`
  - `DEPLOYMENT_NOTES.md`

## Quick Start

### 1) Prerequisites
- Node.js 20+
- Firebase project with Firestore, Auth, Storage
- Service account credentials for backend

### 2) Backend setup
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### 3) Frontend setup
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Environment Variables
See `backend/.env.example` and `frontend/.env.example`.

## Testing Strategy
- Unit tests for validators, reducers, utilities.
- Integration tests for route modules and auth middleware.
- E2E tests for critical flows: search → cart → prescription upload → order lifecycle.
- Security tests for RBAC, ownership checks, and upload constraints.

## Production Hardening Checklist
- Enable Firebase App Check and strict Firestore Rules.
- Configure rate limits, WAF, logging pipeline, SIEM alerts.
- Enable secret manager and rotate keys.
- Add SAST/DAST + dependency scanning in CI.


## Developer Setup
See `SETUP.md` for exact local setup commands and env configuration.
