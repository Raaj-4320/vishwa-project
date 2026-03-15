# API SPEC (v1)

Base: `/api/v1`

## Auth
- `POST /auth/register`
- `POST /auth/session`
- `POST /auth/forgot-password`

## Users
- `GET /users/me`
- `PATCH /users/me`
- `POST /users/me/addresses`

## Locations
- `GET /locations/master`
- `POST /locations/match-stores`

## Pharmacies
- `POST /pharmacies` (seller)
- `GET /pharmacies/discover` (customer)
- `GET /pharmacies/:id`
- `PATCH /pharmacies/:id/service-areas` (seller)

## Medicines & Inventory
- `GET /medicines/search`
- `POST /seller/medicines`
- `POST /inventory/batches`
- `PATCH /inventory/batches/:id`

## Cart & Orders
- `GET /cart`
- `POST /cart/items`
- `POST /orders`
- `GET /orders`
- `GET /orders/:id`
- `PATCH /orders/:id/status`

## Prescriptions
- `POST /prescriptions/upload`
- `PATCH /prescriptions/:id/review`

## Delivery
- `GET /delivery/assigned`
- `PATCH /delivery/:id/status`

## Admin
- `GET /admin/dashboard`
- `PATCH /admin/sellers/:id/verification`
- `GET /admin/audit-logs`
