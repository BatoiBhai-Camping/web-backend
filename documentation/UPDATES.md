# Documentation Update Summary - April 2026

Complete documentation update with recent database schema, routes, and system changes.

**Last Updated:** April 1, 2026  
**Documentation Version:** 2.0

---

## Overview

Comprehensive documentation overhaul covering:

- New database schema documentation
- Complete API endpoint listing with all routes
- Review system implementation details
- Payment verification workflow updates
- System architecture overview

---

## What's New

### 1. ✨ Database Schema Documentation (`database-schema.md`)

**New comprehensive guide covering:**

#### Enums (19 total)

- User roles and account statuses
- Booking and payment statuses
- Package approval and cancellation tracking
- Address types and document classifications
- Transport modes and meal types
- Review and payment method types

#### Models (17 total)

**User & Profile Models:**

- `Bb_user` - Core user with multi-role support
- `Bb_agentProfile` - Agent company profile with documents
- `Bb_address` - Flexible address management
- `Bb_optionalPhone` - Verified phone numbers

**Package & Travel Models:**

- `Bb_travelPackage` - Complete package with pricing and status tracking
- `Bb_itineraryDay` - Day-by-day itinerary organization
- `Bb_image` - Cloudinary-integrated image management

**Booking & Payment Models:**

- `Bb_booking` - Smart booking with price snapshots
- `Bb_payment` - Flexible payment tracking (supports retries, partial, refunds)

**Review System Models:** ✨

- `Bb_platformReview` - Platform feedback (1 per user)
- `Bb_agentReview` - Agent feedback (1 per user per agent)
- `Bb_packageReview` - Package feedback (1 per user per package)

**System Models:**

- `Bb_notification` - User notifications system
- `Bb_document` - Agent document verification

#### Relationships

- Complete one-to-one, one-to-many mappings
- Cascade delete configurations
- Unique constraint definitions
- Database indexes for performance

---

### 2. 📋 API Documentation Updates

#### Payment API (`payment-api.md`) - No changes needed

- ✅ `POST /create-order` - Razorpay order creation
- ✅ `POST /verify-payment` - Payment signature verification
- **Status:** Complete with full verification workflow

#### User API (`user-api.md`) - Complete

- ✅ Authentication (register, login, logout, verify)
- ✅ Profile management (get, update, delete)
- ✅ Bookings management
- ✅ **Review System:** Platform, Agent, Package reviews
- ✅ **Delete Operations:** Review deletion endpoints
- **Total Endpoints:** 15

#### Agent API (`agent-api.md`) - Complete

- ✅ Authentication (register, login, verify)
- ✅ Package management (publish, update, list)
- ✅ Booking management (view bookings per package)
- ✅ Profile management (get, update)
- ✅ Account management
- **Total Endpoints:** 13

#### Admin API (`admin-api.md`) - Complete

- ✅ Admin registration and authentication
- ✅ Agent approval/rejection
- ✅ Package approval/rejection
- ✅ System listings (agents, users, packages, payments)
- ✅ Profile management
- ✅ Account management
- **Total Endpoints:** 14

#### Root Admin API (`root-admin-api.md`) - Complete

- ✅ Root admin registration and authentication
- ✅ Sub-admin management (approve/reject)
- ✅ Agent management (approve/reject)
- ✅ Package management (approve/reject)
- ✅ Comprehensive system listings
- ✅ Profile management
- ✅ **Unique:** Single root admin constraint
- **Total Endpoints:** 20

#### Public API (`public-api.md`) - No changes needed

- ✅ Health check endpoint
- ✅ Public package listing
- ✅ Asset upload

---

## System Architecture

### 17 Database Models

```
User Management Layer
├── Bb_user (core account)
├── Bb_agentProfile (agent extended)
├── Bb_address (flexible addresses)
├── Bb_optionalPhone (additional contacts)
└── Bb_document (verification docs)

Package & Travel Layer
├── Bb_travelPackage (tour offerings)
├── Bb_itineraryDay (day-by-day details)
└── Bb_image (Cloudinary integration)

Booking & Payment Layer
├── Bb_booking (trip reservations)
└── Bb_payment (transaction tracking)

Review & Feedback Layer ✨
├── Bb_platformReview (platform feedback)
├── Bb_agentReview (agent feedback)
└── Bb_packageReview (package feedback)

System Layer
├── Bb_notification (alerts)
└── Enumeration types (19 enum values)
```

### API Routes (67 Endpoints)

```
Public Routes (2)
├── GET /api/v1/health-status
└── GET /api/v1/get-all-pkg

User Routes (15)
├── Auth: register, login, logout, verify-account, send-verification-link
├── Profile: get-profile, update-profile, delete-acc
├── Bookings: get-all-bookings
└── Reviews: platform-review, delete-platform-review, agent-review,
            delete-agent-review, package-review, delete-package-review

Agent Routes (13)
├── Auth: register, login, logout, verify-account, send-verification-link
├── Packages: publish-package, update-package, get-all-packages
├── Bookings: get-all-bookings, get-package-bookings
└── Profile: get-profile, update-profile, delete-acc

Admin Routes (14)
├── Auth: register, login, logout, verify-account, send-verification-link
├── Approvals: approve-agent, approve-pkg, reject-pkg
├── Listings: get-all-agent, get-all-user, get-all-pkg, get-agent-pkg
├── Payments: get-all-payments
└── Profile: get-profile, update-profile, delete-acc

Root Admin Routes (20)
├── Auth: register, login, logout, verify-account, send-verification-link
├── Approvals: approve-sub-admin, reject-sub-admin, approve-agent,
              approve-pkg, reject-pkg
├── Listings: get-all-agent, get-all-sub-admin, get-all-user,
             get-all-pkg, get-agent-pkg
├── Payments: get-all-payments
└── Profile: get-profile, update-profile, delete-acc

Asset Routes (1)
└── POST /api/v1/assets/upload-file

Payment Routes (2)
├── POST /api/v1/payment/create-order
└── POST /api/v1/payment/verify-payment
```

---

## Key Features

### 1. Multi-Role System

- **TRAVELER** - Browse packages, make bookings, write reviews
- **AGENT** - Create packages, manage bookings, view stats
- **ADMIN** - Approve agents and packages, system oversight
- **ROOTADMIN** - Manage all admins, final approvals, system control

### 2. Review System ✨

- **Platform Reviews:** Users rate overall platform (1 per user)
- **Agent Reviews:** Users rate agents (1 per user per agent)
- **Package Reviews:** Users rate packages (1 per user per package)
- **Features:** 1-5 star ratings, optional comments, edit/delete support
- **Integrity:** Unique constraints prevent duplicate reviews

### 3. Smart Booking System

- **Price Snapshots:** All pricing stored at booking time
- **Flexible Status:** PENDING → CONFIRMED → COMPLETED (or CANCELLED → REFUNDED)
- **Refund Support:** Tracks refundable amounts and reasons
- **Seat Management:** Real-time availability tracking

### 4. Flexible Payment System

- **Multiple Attempts:** Supports payment retries
- **Partial Payments:** Can record partial or full refunds
- **Provider Tracking:** Razorpay integration with signature verification
- **Metadata Storage:** Store provider-specific data

### 5. Image Management

- **Cloudinary Integration:** External image storage
- **File ID Tracking:** Preserve Cloudinary file IDs for deletion
- **Multiple Images:** Support for banner + gallery images
- **Soft Deletes:** Non-destructive deletion tracking

---

## Authentication & Security

### JWT-Based Authentication

- **Access Token:** 3 days expiry
- **Refresh Token:** 10 days expiry
- **Cookie Storage:** httpOnly, sameSite: "none", secure: true
- **Role-Based Access Control:** Middleware validates role, email verification, approval status

### Middleware Chain

```
authMiddleware (all authenticated requests)
↓
├── agentMiddleware (agent-only routes)
├── adminMiddlewareOperation (approve, list operations)
├── adminMiddlewareSelfOperation (self operations)
└── rootAdminMiddleware (root admin operations)
```

---

## Data Persistence Features

### Soft Deletes

- `isDeleted` flag on `Bb_user` and `Bb_travelPackage`
- Allows account/package recovery
- Maintains referential integrity

### Audit Trail

- `createdAt` - Immutable creation timestamp
- `updatedAt` - Auto-updating modification timestamp
- Present on all major models

### Price Snapshots

- Booking captures price, tax, discount at time of booking
- Protects against price changes
- Enables accurate refund calculations

---

## Integration Endpoints

### Razorpay Payment Gateway

- **Order Creation:** `/payment/create-order`
- **Verification:** `/payment/verify-payment` (HMAC-SHA256 signature verification)
- **Currency:** INR (Indian Rupees)
- **Amount:** Stored in smallest unit (paise)

### Cloudinary Image Service

- **Upload:** `/assets/upload-file`
- **Storage:** Profile images, package banners, gallery images
- **Tracking:** fileId preservation for future deletion

### Nodemailer Email Service

- **Verification:** Account email verification links
- **Approvals:** Role approval notifications
- **Updates:** Booking and payment notifications

---

## Documentation Files

| File                   | Purpose                   | Models              | Endpoints |
| ---------------------- | ------------------------- | ------------------- | --------- |
| `database-schema.md`   | Prisma ORM schema         | 17 models, 19 enums | -         |
| `user-api.md`          | Traveler routes           | -                   | 15        |
| `agent-api.md`         | Agent routes              | -                   | 13        |
| `admin-api.md`         | Sub-admin routes          | -                   | 14        |
| `root-admin-api.md`    | Root admin routes         | -                   | 20        |
| `payment-api.md`       | Payment routes            | -                   | 2         |
| `public-api.md`        | Public routes             | -                   | 2         |
| `package-payloads.md`  | Package creation payloads | -                   | -         |
| `http-status-codes.md` | HTTP status conventions   | -                   | -         |

---

## Recent Changes Summary

### Database

- ✅ Added review system (3 new models)
- ✅ Enhanced booking model with refund tracking
- ✅ Flexible payment model supporting multiple attempts
- ✅ Complete schema documentation

### API

- ✅ All endpoints documented with full request/response examples
- ✅ Error responses documented with status codes
- ✅ Side effects and middleware requirements clearly stated
- ✅ 67 total endpoints across 7 route groups

### Documentation

- ✅ Complete database schema reference
- ✅ API organization by user role
- ✅ Integration examples for external services
- ✅ Architecture overview diagram

---

## Getting Started With Documentation

1. **System Overview:** Start with README.md
2. **Database Design:** Read database-schema.md for complete data model
3. **Your Role:** Find your API document (user/agent/admin/root-admin)
4. **Implementation:** Check package-payloads.md for complex request bodies
5. **Integration:** Reference payment-api.md for Razorpay workflow

---

## Version History

| Version | Date        | Changes                                                             |
| ------- | ----------- | ------------------------------------------------------------------- |
| 2.0     | Apr 1, 2026 | Complete overhaul with database schema, review system, 67 endpoints |
| 1.0     | Earlier     | Initial API documentation                                           |

---

## Support

For questions about:

- **Database design:** See `database-schema.md`
- **Specific endpoints:** See corresponding API file (`user-api.md`, etc.)
- **Payment flow:** See `payment-api.md` and `package-payloads.md`
- **Package structure:** See `package-payloads.md`
