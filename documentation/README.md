# API Documentation (v1)

All APIs in this backend are mounted under the same version prefix:

- **Base prefix:** `/api/v1`

This folder was normalized to remove mixed formats and naming drift (for example, docs now consistently use `/api/v1/...` paths).

## Documents

- `public-api.md` — Health and public package listing endpoints.
- `user-api.md` — Traveler/user endpoints.
- `agent-api.md` — Agent authentication, profile, package, and booking endpoints.
- `admin-api.md` — Sub-admin/admin endpoints.
- `root-admin-api.md` — Root admin endpoints.
- `payment-api.md` — Razorpay order and verification endpoints.
- `package-payloads.md` — Reference payloads for package publish/update.
- `http-status-codes.md` — Status code conventions used in this project.

## Route Mount Map

From `src/app.ts`:

- `/api/v1` → health + public routes
- `/api/v1/user` → user routes
- `/api/v1/agent` → agent routes
- `/api/v1/assets` → asset upload routes
- `/api/v1/root-admin` → root admin routes
- `/api/v1/admin` → admin routes
- `/api/v1/payment` → payment routes
