# PROJECT BLUEPRINT

## Step 1: Product Summary
A location-driven, map-free pharmacy commerce and operations platform where customer visibility is constrained by seller-defined service areas (country/state/city/area/locality/pincode/landmark), with strict RBAC for customer, seller, pharmacist, delivery, admin, and super-admin-ready governance.

## Step 2: Assumptions & Scope Boundaries
- Payments are architecture-ready; payment gateway integration is out-of-scope for this iteration.
- OTP delivery handoff uses pluggable provider abstraction.
- Firebase is source of truth for identity/data/files.
- No geospatial maps: all discovery and checkout validation rely on discrete location attributes.
- Multi-country ready but seeded for one region by default.

## Step 3: Final Architecture
- **Frontend**: React + Context/Reducer + feature modules + role layouts + protected route guards.
- **Backend**: Express v1 APIs with controller/service/repository-style separation and centralized middleware.
- **Data**: Firestore collections, subcollections for event timelines, denormalized read models where query efficiency matters.
- **Storage**: Firebase Storage for prescriptions/licensing documents with ownership and MIME restrictions.
- **Security**: Firebase token verification, RBAC middleware, ownership checks, schema validation, rate limiting.

## Step 4: Firestore Data Model
See `DATABASE_SCHEMA.md`.

## Step 5: API Modules and Routes
See `API_SPEC.md`.

## Step 6: UI Sitemap
See `UI_UX_GUIDELINES.md`.

## Step 7: Component & Design Strategy
- Design tokens, table primitives, form controls, badge and card components.
- Feature-first pages with shared shell components.
- Accessible patterns: keyboard support, aria labels, clear validation messages.

## Step 8: Folder Structure
Implemented in `frontend/` and `backend/` with module boundaries.

## Step 9: Module-by-Module Build
- Foundation: auth, routes, middleware, configuration, design system.
- Customer: location/store/product/cart/order flow.
- Seller: inventory/batches/orders/prescriptions/service areas.
- Delivery/Admin: assignment tracking, governance dashboards.

## Step 10: Dynamic & Production-minded Choices
- Location matching is revalidated server-side at order placement.
- Order state machine and audit trails included.
- Inventory supports reservation and deduction lifecycle hooks.
