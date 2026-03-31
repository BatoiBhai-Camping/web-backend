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

| Role        | Description                                            |
| ----------- | ------------------------------------------------------ |
| `TRAVELER`  | Regular user who can browse packages and make bookings |
| `AGENT`     | Travel agent who can create and manage packages        |
| `ADMIN`     | Sub-admin who can approve agents and packages          |
| `ROOTADMIN` | Super admin with full system access                    |

## Role Status

| Status     | Description                 |
| ---------- | --------------------------- |
| `PENDING`  | Account awaiting approval   |
| `APPROVED` | Account approved and active |
| `REJECTED` | Account rejected by admin   |

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

| File                                         | Description                                                                     | Endpoints |
| -------------------------------------------- | ------------------------------------------------------------------------------- | --------- |
| [database-schema.md](database-schema.md)     | Complete Prisma database schema with all models, relationships, and constraints | 17 models |
| [public-api.md](public-api.md)               | Health check, public package listing, and asset upload                          | 3         |
| [user-api.md](user-api.md)                   | Traveler registration, login, profile, bookings, and reviews                    | 15        |
| [agent-api.md](agent-api.md)                 | Agent registration, profile, package management, and bookings                   | 13        |
| [admin-api.md](admin-api.md)                 | Sub-admin registration and management operations                                | 16        |
| [root-admin-api.md](root-admin-api.md)       | Root admin operations including agent/admin/package approval                    | 19        |
| [payment-api.md](payment-api.md)             | Razorpay order creation and payment verification                                | 2         |
| [package-payloads.md](package-payloads.md)   | Detailed package publish/update payload reference                               | -         |
| [http-status-codes.md](http-status-codes.md) | HTTP status code conventions                                                    | -         |

**📋 Quick Reference:**

- [COMPLETION.md](COMPLETION.md) - Complete delivery summary (69 endpoints ✅)
- [QUICK-REFERENCE.md](QUICK-REFERENCE.md) - All endpoints organized by route & method
- [VERIFICATION.md](VERIFICATION.md) - Completeness checklist & verification
- [UPDATES.md](UPDATES.md) - Change summary and architecture overview

## Route Mount Map

From `src/app.ts`:

| Prefix               | Routes                                                 | Count |
| -------------------- | ------------------------------------------------------ | ----- |
| `/api/v1`            | Health check + public package listing                  | 2     |
| `/api/v1/user`       | User/Traveler signup, auth, profile, bookings, reviews | 15    |
| `/api/v1/agent`      | Agent signup, auth, packages, bookings                 | 13    |
| `/api/v1/assets`     | File upload to Cloudinary                              | 1     |
| `/api/v1/admin`      | Sub-admin management, approvals, listings              | 14    |
| `/api/v1/root-admin` | Root admin management, approvals, system overview      | 20    |
| `/api/v1/payment`    | Razorpay order creation and verification               | 2     |

**Total Endpoints:** 67

## Middleware Reference

| Middleware                     | Description                                                                                        |
| ------------------------------ | -------------------------------------------------------------------------------------------------- |
| `authMiddleware`               | Validates JWT from `accesstoken` cookie, sets `req.userId` and `req.userEmail`                     |
| `agentMiddleware`              | Extends auth: checks `role=AGENT`, `emailVerified=true`, `roleStatus=APPROVED`, sets `req.agentId` |
| `adminMiddlewareOperation`     | Extends auth: checks role in `[ADMIN, ROOTADMIN]`, verified email, approved status                 |
| `adminMiddlewareSelfOperation` | Extends auth: checks role in `[ADMIN, ROOTADMIN]` (no approval check)                              |
| `rootAdminMiddleware`          | Extends auth: checks `role=ROOTADMIN`, approved, email matches `ROOT_ADMIN_GMAIL` env var          |
| `multer (upload.single)`       | Handles `multipart/form-data` file upload, stores to `./public/temp`                               |

---

## Database Overview

The Prisma ORM manages **17 core models** with comprehensive relationships and constraints:

### Key Models

1. **User Management**
   - `Bb_user` - Core user account (all roles)
   - `Bb_agentProfile` - Travel agent extended profile
   - `Bb_address` - User/package addresses
   - `Bb_optionalPhone` - Additional contact numbers

2. **Package & Travel**
   - `Bb_travelPackage` - Travel packages/tours
   - `Bb_itineraryDay` - Day-by-day package details
   - `Bb_image` - Package & profile images (Cloudinary)

3. **Bookings & Payments**
   - `Bb_booking` - Travel package bookings with price snapshots
   - `Bb_payment` - Payment transactions (supports retries & refunds)

4. **Reviews & Feedback** ✨ _Recent Addition_
   - `Bb_platformReview` - Platform reviews (1 per user)
   - `Bb_agentReview` - Agent reviews (1 per user per agent)
   - `Bb_packageReview` - Package reviews (1 per user per package)

5. **System**
   - `Bb_notification` - User notifications
   - `Bb_document` - Agent verification documents

### Review System Features

- **Unified rating model:** 1-5 star ratings with optional comments
- **Unique constraints:** Prevent duplicate reviews per user per resource
- **Cascade behavior:** Reviews deleted when resource is deleted
- **User-centric:** Each user limited to one review per resource

---

## External Integrations

- **Razorpay** - Payment gateway (order creation & verification)
- **Cloudinary** - Image upload and storage with file ID tracking
- **Nodemailer** - Email notifications (verification, approvals, updates)
- **PostgreSQL** - Relational database with Prisma ORM
- **PostgreSQL** - Primary database via Prisma ORM
