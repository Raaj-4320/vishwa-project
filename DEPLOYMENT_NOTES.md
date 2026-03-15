# DEPLOYMENT NOTES

## Frontend
- Build: `npm run build`
- Deploy to Firebase Hosting / Vercel.
- Env vars prefixed with `VITE_`.

## Backend
- Deploy to Cloud Run / Render / Fly.
- Use service account via secret manager.
- Ensure HTTPS-only ingress and CORS allowlist.

## Firestore & Storage
- Apply security rules from staged ruleset.
- Create composite indexes from query logs.
- Configure lifecycle policy for archived prescription files.

## Observability
- Structured logs + correlation ID middleware.
- Error tracking via Sentry-compatible hook.
