# SECURITY ARCHITECTURE

## Core Controls
- Firebase ID token verification on every protected API.
- RBAC + permission-scoped middleware (`requireRole`, `requireAnyRole`).
- Input validation with Zod for params/body/query.
- Helmet, CORS allowlist, request size limits, structured safe errors.
- Express-rate-limit for auth and sensitive routes.
- Ownership validation (order, prescription, pharmacy resources).

## File Security
- Prescription upload: allow PDF/JPEG/PNG only with strict size cap.
- Store documents in role-scoped paths.
- Download APIs verify both role and owner/seller relation.

## Firestore Rules Proposal
- Deny by default.
- Users can read/write own profile; admin override via custom claims.
- Seller can manage only own pharmacy docs/products/inventory.
- Customer can access only own carts/orders/prescriptions.
- Delivery staff can access only assigned delivery docs.
- Admin can moderate cross-tenant resources with audited writes.

## Known Tradeoffs
- Firebase custom claims refresh latency requires token refresh handling.
- Complex analytics may need BigQuery export for scale.

## Hardening Checklist
- App Check, MFA for admins/sellers, secret manager, audit export, SLO alarms.
