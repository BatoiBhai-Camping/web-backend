# BatoiBhai API Documentation (v1)

## Overview

BatoiBhai is a travel package marketplace backend built with **Express.js** (TypeScript), **Prisma ORM** (PostgreSQL), and integrated with **Razorpay** for payments and **Cloudinary** for file uploads.

**Base URL:** `/api/v1`

## Authentication

All authenticated endpoints use **JWT tokens** stored in HTTP-only cookies.

- **Cookie name:** `accesstoken`
- **Cookie format:** `Bearer <jwt_token>`
- **Access token expiry:** 3 days
- **Refresh token expiry:** 10 days
- Cookies are set with `httpOnly`, `sameSite: "none"`, and `secure: true` flags.

## User Roles

| Role | Description |
|------|-------------|
| `TRAVELER` | Regular user who can browse packages and make bookings |
| `AGENT` | Travel agent who can create and manage packages |
| `ADMIN` | Sub-admin who can approve agents and packages |
| `ROOTADMIN` | Super admin with full system access |

## Role Status

| Status | Description |
|--------|-------------|
| `PENDING` | Account awaiting approval |
| `APPROVED` | Account approved and active |
| `REJECTED` | Account rejected by admin |

## Standard Response Format

### Success Response

```json
{
  "statusCode": 200,
  "data": { ... },
  "message": "Success message"
}
```

### Error Response

```json
{
  "statusCode": 400,
  "message": "Error description",
  "issues": []
}
```

## API Documents

| File | Description |
|------|-------------|
| [public-api.md](public-api.md) | Health check, public package listing, and asset upload |
| [user-api.md](user-api.md) | Traveler registration, login, profile, bookings, and reviews |
| [agent-api.md](agent-api.md) | Agent registration, profile, package management, and bookings |
| [admin-api.md](admin-api.md) | Sub-admin registration and management operations |
| [root-admin-api.md](root-admin-api.md) | Root admin operations including agent/admin/package approval |
| [payment-api.md](payment-api.md) | Razorpay order creation and payment verification |
| [package-payloads.md](package-payloads.md) | Detailed package publish/update payload reference |
| [http-status-codes.md](http-status-codes.md) | HTTP status code conventions |

## Route Mount Map

From `src/app.ts`:

| Prefix | Routes |
|--------|--------|
| `/api/v1` | Health + public routes |
| `/api/v1/user` | User/Traveler routes |
| `/api/v1/agent` | Agent routes |
| `/api/v1/assets` | Asset upload routes |
| `/api/v1/admin` | Admin routes |
| `/api/v1/root-admin` | Root admin routes |
| `/api/v1/payment` | Payment routes |

## Middleware Reference

| Middleware | Description |
|-----------|-------------|
| `authMiddleware` | Validates JWT from `accesstoken` cookie, sets `req.userId` and `req.userEmail` |
| `agentMiddleware` | Extends auth: checks `role=AGENT`, `emailVerified=true`, `roleStatus=APPROVED`, sets `req.agentId` |
| `adminMiddlewareOperation` | Extends auth: checks role in `[ADMIN, ROOTADMIN]`, verified email, approved status |
| `adminMiddlewareSelfOperation` | Extends auth: checks role in `[ADMIN, ROOTADMIN]` (no approval check) |
| `rootAdminMiddleware` | Extends auth: checks `role=ROOTADMIN`, approved, email matches `ROOT_ADMIN_GMAIL` env var |
| `multer (upload.single)` | Handles `multipart/form-data` file upload, stores to `./public/temp` |

## External Integrations

- **Razorpay** - Payment gateway
- **Cloudinary** - File/image upload and storage
- **Nodemailer** - Email notifications (verification, approval)
- **PostgreSQL** - Primary database via Prisma ORM
