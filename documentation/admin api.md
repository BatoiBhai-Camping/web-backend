# Admin API Documentation

## Overview

The Admin Router handles administrative operations including admin registration, authentication, and agent approval management. Admins can be created by RootAdmin and manage agents at the platform level.

**Base URL:** `/api/v1/admin`

**User Role:** `ADMIN`

**Role Status:** `PENDING` (awaiting RootAdmin approval)

**Route File:** `/src/routes/admin.routes.ts`

**Controller File:** `/src/controllers/admin.controller.ts`

---

## Table of Contents

1. [Registration](#registration)
2. [Login](#login)
3. [Approve Agent](#approve-agent)
4. [Delete Account](#delete-account)

---

## Registration

### Endpoint

```
POST /api/v1/admin/register
```

### Description

Creates a new admin account. This endpoint is typically called by RootAdmin to create sub-admins. The admin will be in PENDING status until approved by RootAdmin.

### Request Headers

```
Content-Type: application/json
```

### Request Body

```json
{
  "fullName": "Admin Name",
  "email": "admin@example.com",
  "password": "securePassword123"
}
```

### Request Body Validation

| Field    | Type   | Required | Rules                      | Notes                 |
| -------- | ------ | -------- | -------------------------- | --------------------- |
| fullName | string | Yes      | Must be provided           | Admin's full name     |
| email    | string | Yes      | Valid email format, unique | Used for login        |
| password | string | Yes      | Minimum 6 characters       | Hashed before storage |

### Success Response

**Status Code:** `201 Created`

```json
{
  "success": true,
  "statusCode": 201,
  "data": null,
  "message": "Admin registered successfully, kindly verify your email"
}
```

### Error Responses

#### 1. Email Already Exists

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "statusCode": 400,
  "data": null,
  "message": "User email already exist, try another email or login"
}
```

#### 2. Validation Error - Invalid Email

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "statusCode": 400,
  "data": null,
  "message": "Enter a valid email address"
}
```

#### 3. Password Too Short

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "statusCode": 400,
  "data": null,
  "message": "Password is too short"
}
```

#### 4. Email Sending Failed

**Status Code:** `500 Internal Server Error`

```json
{
  "success": false,
  "statusCode": 500,
  "data": null,
  "message": "Internal server error while sending verification email"
}
```

### Data Flow

```
1. RootAdmin submits admin registration form
   ↓
2. Validate input data with Zod schema
   ↓ (if validation fails)
   └─→ Return validation error
   ↓ (if validation passes)
3. Check if email already exists
   ↓ (if exists)
   └─→ Return error: "Email already exist"
   ↓ (if not exists)
4. Hash password using bcrypt (10 salt rounds)
   ↓
5. Create admin user record with:
   - fullName, email, hashed password
   - role: "ADMIN"
   - roleStatus: "PENDING"
   - emailVerified: false
   ↓
6. Generate verification token (JWT)
   ↓
7. Store verification token in database
   ↓
8. Send verification email
   ↓
9. Generate access & refresh tokens
   ↓
10. Set tokens in HTTP-only cookies
    ↓
11. Return success response
```

### Database Operations

**Primary Table:** `Bb_user`

**Prisma Schema:** `/src/prisma/schema.prisma`

**Database Client:** `/src/config/database.ts`

#### Create Admin User

```sql
INSERT INTO "Bb_user" (
  id,
  "fullName",
  email,
  password,
  role,
  "roleStatus",
  "emailVerified",
  "createdAt",
  "updatedAt"
) VALUES (
  GENERATED_CUID,
  'Admin Name',
  'admin@example.com',
  '$2a$10$hashed_password',
  'ADMIN',
  'PENDING',
  false,
  NOW(),
  NOW()
);
```

#### Update with Verification Token

```sql
UPDATE "Bb_user"
SET "verifyToken" = 'jwt_verification_token'
WHERE id = 'admin_id';
```

#### Update with Refresh Token

```sql
UPDATE "Bb_user"
SET "refreshToken" = 'jwt_refresh_token'
WHERE id = 'admin_id';
```

### Database State After Registration

```typescript
{
  id: "clz2a2b3c4d5e6f7g8h9i0j1",
  fullName: "Admin Name",
  email: "admin@example.com",
  password: "$2a$10$...",
  role: "ADMIN",
  roleStatus: "PENDING", // Awaiting RootAdmin approval
  emailVerified: false,
  phone: null,
  profileImageId: null,
  refreshToken: "eyJhbGciOiJIUzI1NiIs...",
  verifyToken: "eyJhbGciOiJIUzI1NiIs...",
  createdAt: "2025-12-07T10:30:00Z",
  updatedAt: "2025-12-07T10:30:00Z",
  isDeleted: false
}
```

### Email Sent

**To:** admin's email
**Subject:** For email/account verification with BatioBhai
**Content:** Verification link with verification token

### Cookies Set

```
accesstoken: Bearer eyJhbGciOiJIUzI1NiIs... (3 days)
refreshtoken: Bearer eyJhbGciOiJIUzI1NiIs... (10 days)
```

---

## Login

### Endpoint

```
POST /api/v1/admin/login
```

### Description

Authenticates an admin user using email and password. The user must have ADMIN or ROOTADMIN role.

### Request Headers

```
Content-Type: application/json
```

### Request Body

```json
{
  "email": "admin@example.com",
  "password": "securePassword123"
}
```

### Request Body Validation

| Field    | Type   | Required | Rules                | Notes                      |
| -------- | ------ | -------- | -------------------- | -------------------------- |
| email    | string | Yes      | Valid email format   | Must be ADMIN or ROOTADMIN |
| password | string | Yes      | Minimum 6 characters | Will be compared with hash |

### Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "statusCode": 200,
  "data": null,
  "message": "User logged in successfully"
}
```

### Error Responses

#### 1. Email Not Found or Not Admin

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "statusCode": 400,
  "data": null,
  "message": "Provided email is not found or this is not an admin email"
}
```

#### 2. Incorrect Password

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "statusCode": 400,
  "data": null,
  "message": "Provided password is not match"
}
```

#### 3. Validation Error

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "statusCode": 400,
  "data": null,
  "message": "Provided data field are invalid"
}
```

### Data Flow

```
1. Admin submits login form
   ↓
2. Validate email and password format
   ↓ (if invalid)
   └─→ Return validation error
   ↓ (if valid)
3. Search database for user by email with role ADMIN or ROOTADMIN
   ↓ (if not found)
   └─→ Return error: "Email not found or not admin email"
   ↓ (if found)
4. Compare provided password with stored hash using bcrypt
   ↓ (if mismatch)
   └─→ Return error: "Password does not match"
   ↓ (if match)
5. Generate new access token (JWT, 3 days expiry)
   ↓
6. Generate new refresh token (JWT, 10 days expiry)
   ↓
7. Update admin record with new refresh token
   ↓
8. Set tokens in HTTP-only cookies
   ↓
9. Return success response
```

### Database Operations

**Primary Table:** `Bb_user`

**Prisma Schema:** `/src/prisma/schema.prisma`

**Database Client:** `/src/config/database.ts`

#### Find Admin by Email

```sql
SELECT id, email, password, role, "roleStatus"
FROM "Bb_user"
WHERE email = 'admin@example.com'
  AND role IN ('ADMIN', 'ROOTADMIN');
```

#### Update Refresh Token

```sql
UPDATE "Bb_user"
SET "refreshToken" = 'new_jwt_refresh_token'
WHERE id = 'admin_id';
```

---

## Approve Agent

### Endpoint

```
POST /api/v1/admin/approve-agent
```

### Description

Admin approves a pending agent's registration. This updates the agent's status from PENDING to APPROVED, allowing them to create travel packages.

**Authorization:** Requires Admin authentication

### Request Headers

```
Authorization: Bearer <access_token>
Content-Type: application/json
Cookie: accesstoken=<token>
```

### Request Body

```json
{
  "agentId": "clz1a2b3c4d5e6f7g8h9i0j2"
}
```

### Request Body Validation

| Field   | Type   | Required | Rules          | Notes                   |
| ------- | ------ | -------- | -------------- | ----------------------- |
| agentId | string | Yes      | Valid agent ID | ID from Bb_agentProfile |

### Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "agentId": "clz1a2b3c4d5e6f7g8h9i0j2",
    "companyName": "Travel Company",
    "status": "APPROVED",
    "updatedAt": "2025-12-07T10:40:00Z"
  },
  "message": "Agent approved successfully"
}
```

### Error Responses

#### 1. Unauthorized - Missing Admin Role

**Status Code:** `401 Unauthorized`

```json
{
  "success": false,
  "statusCode": 401,
  "data": null,
  "message": "Unauthorized - Admin access required"
}
```

#### 2. Agent Not Found

**Status Code:** `404 Not Found`

```json
{
  "success": false,
  "statusCode": 404,
  "data": null,
  "message": "Agent not found"
}
```

#### 3. Agent Already Approved

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "statusCode": 400,
  "data": null,
  "message": "Agent is already approved"
}
```

#### 4. Missing Agent ID

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "statusCode": 400,
  "data": null,
  "message": "Agent ID is required"
}
```

### Data Flow

```
1. Admin submits approve request with agentId
   ↓
2. Verify admin authentication via middleware
   ↓ (if not authenticated)
   └─→ Return error: "Unauthorized"
   ↓ (if authenticated)
3. Validate agentId format
   ↓ (if invalid)
   └─→ Return validation error
   ↓ (if valid)
4. Search database for agent profile by agentId
   ↓ (if not found)
   └─→ Return error: "Agent not found"
   ↓ (if found)
5. Check current agent status
   ↓ (if already APPROVED or REJECTED)
   └─→ Return error: "Agent already has status"
   ↓ (if PENDING)
6. Update agent profile:
   - Set status = "APPROVED"
   - Update updatedAt
   ↓
7. Optionally send notification to agent
   ↓
8. Return success response with updated data
```

### Database Operations

**Primary Table:** `Bb_agentProfile`

**Prisma Schema:** `/src/prisma/schema.prisma`

**Database Client:** `/src/config/database.ts`

#### Find Agent Profile

```sql
SELECT id, "userId", "companyName", status, "createdAt", "updatedAt"
FROM "Bb_agentProfile"
WHERE id = 'agent_id';
```

#### Update Agent Status to APPROVED

```sql
UPDATE "Bb_agentProfile"
SET status = 'APPROVED',
    "updatedAt" = NOW()
WHERE id = 'agent_id';
```

### Database State After Approval

```typescript
// Before Approval
{
  id: "clz1a2b3c4d5e6f7g8h9i0j2",
  status: "PENDING",
  updatedAt: "2025-12-07T10:30:00Z"
}

// After Approval
{
  id: "clz1a2b3c4d5e6f7g8h9i0j2",
  status: "APPROVED", // Changed
  updatedAt: "2025-12-07T10:40:00Z" // Updated
}
```

### Postman Testing

```
Method: POST
URL: http://localhost:3000/api/v1/admin/approve-agent
Headers:
  Authorization: Bearer <access_token>
  Content-Type: application/json
  Cookie: accesstoken=<token>
Body:
{
  "agentId": "clz1a2b3c4d5e6f7g8h9i0j2"
}
```

---

## Delete Account

### Endpoint

```
DELETE /api/v1/admin/delete-acc
```

### Description

Allows an admin to permanently delete their account. This operation performs a soft delete by setting the `isDeleted` flag to true, clears all authentication tokens, and removes cookies.

**Authorization:** Requires Admin authentication

### Request Headers

```
Authorization: Bearer <access_token>
Content-Type: application/json
Cookie: accesstoken=<token>
```

### Request Body

```json
{}
```

(Empty body - user information comes from authentication token)

### Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "statusCode": 200,
  "data": null,
  "message": "Account deleted successfully"
}
```

### Error Responses

#### 1. Unauthorized - Missing Token

**Status Code:** `401 Unauthorized`

```json
{
  "success": false,
  "statusCode": 401,
  "data": null,
  "message": "Unauthorized - Admin access required"
}
```

#### 2. Admin Not Found

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "statusCode": 400,
  "data": null,
  "message": "Admin account not found"
}
```

### Data Flow

```
1. Admin requests account deletion
   ↓
2. Verify admin authentication via middleware
   ↓ (if not authenticated)
   └─→ Return error: "Unauthorized"
   ↓ (if authenticated)
3. Update admin user record:
   - Set isDeleted = true
   ↓
4. Clear refresh token from database
   - Set refreshToken = null
   ↓
5. Clear authentication cookies:
   - Clear accesstoken cookie
   - Clear refreshtoken cookie
   ↓
6. Return success response
```

### Database Operations

**Primary Table:** `Bb_user`

**Prisma Schema:** `/src/prisma/schema.prisma`

**Database Client:** `/src/config/database.ts`

#### Soft Delete Admin Account

```sql
UPDATE "Bb_user"
SET "isDeleted" = true,
    "updatedAt" = NOW()
WHERE id = 'admin_id';
```

#### Clear Refresh Token

```sql
UPDATE "Bb_user"
SET "refreshToken" = null
WHERE id = 'admin_id';
```

### Database State After Deletion

```typescript
// Before Deletion
{
  id: "clz2a2b3c4d5e6f7g8h9i0j1",
  isDeleted: false,
  refreshToken: "eyJhbGciOiJIUzI1NiIs...",
  updatedAt: "2025-12-07T10:30:00Z"
}

// After Deletion
{
  id: "clz2a2b3c4d5e6f7g8h9i0j1",
  isDeleted: true, // Changed
  refreshToken: null, // Cleared
  updatedAt: "2025-12-07T10:45:00Z" // Updated
}
```

### Cookies Cleared

```
accesstoken: Cleared
refreshtoken: Cleared
```

### Important Notes

#### Soft Delete vs Hard Delete

- This is a **soft delete** operation
- The admin record remains in database with `isDeleted: true`
- Admin cannot login after deletion
- Data is retained for audit purposes

#### Post-Deletion State

- All authentication tokens invalidated
- Cannot access any admin endpoints
- Email can be reused for new registration (if needed)

#### Recovery

- Contact RootAdmin for account recovery
- May require manual database operation

### Postman Testing

```
Method: DELETE
URL: http://localhost:3000/api/v1/admin/delete-acc
Headers:
  Authorization: Bearer <access_token>
  Cookie: accesstoken=<token>
Body: {}
```

---

## Admin Workflow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    ADMIN WORKFLOW                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. ROOTADMIN CREATES ADMIN                                 │
│     POST /admin/register                                    │
│     └─→ Admin created with status: PENDING                 │
│                                                             │
│  2. ADMIN EMAIL VERIFICATION                                │
│     Verification email sent                                 │
│     └─→ Admin clicks link to verify email                  │
│                                                             │
│  3. ROOTADMIN APPROVES ADMIN                                │
│     RootAdmin approves the admin account                    │
│     └─→ Admin status changes from PENDING to APPROVED       │
│                                                             │
│  4. ADMIN LOGIN                                             │
│     POST /admin/login                                       │
│     └─→ Admin authenticated with tokens                     │
│                                                             │
│  5. MANAGE AGENTS                                           │
│     POST /admin/approve-agent                               │
│     └─→ Admin reviews and approves agent registrations      │
│                                                             │
│  6. AGENT BECOMES ACTIVE                                    │
│     When approved, agent can:                               │
│     ├─ Create travel packages                               │
│     ├─ Manage bookings                                      │
│     └─ Interact with travelers                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Admin Hierarchy

```
ROOTADMIN
  ├─ Can create ADMIN accounts
  ├─ Can approve/reject ADMIN accounts
  ├─ Can approve/reject AGENT accounts
  ├─ Can manage platform settings
  └─ Full administrative access

ADMIN (Sub-Admin)
  ├─ Created by ROOTADMIN
  ├─ Status: PENDING until approved
  ├─ Can approve AGENT accounts (once approved)
  ├─ Cannot approve other ADMIN accounts
  └─ Limited administrative access
```

---

## Admin Permissions Summary

| Action            | ROOTADMIN | ADMIN | AGENT | USER |
| ----------------- | --------- | ----- | ----- | ---- |
| Register Admin    | ✓         | ✗     | ✗     | ✗    |
| Approve Admin     | ✓         | ✗     | ✗     | ✗    |
| Approve Agent     | ✓         | ✓     | ✗     | ✗    |
| Reject Agent      | ✓         | ✓     | ✗     | ✗    |
| View Agents       | ✓         | ✓     | ✗     | ✗    |
| Manage Users      | ✓         | ✓     | ✗     | ✗    |
| Platform Settings | ✓         | ✗     | ✗     | ✗    |

---

## Summary Table

| Operation      | Endpoint         | Method | Auth Required | Role  |
| -------------- | ---------------- | ------ | ------------- | ----- |
| Register       | `/register`      | POST   | No            | ADMIN |
| Login          | `/login`         | POST   | No            | ADMIN |
| Approve Agent  | `/approve-agent` | POST   | Yes           | ADMIN |
| Delete Account | `/delete-acc`    | DELETE | Yes           | ADMIN |

---

## Important Notes

### Admin Status Progression

1. **PENDING** - Created by RootAdmin, awaiting approval
2. **APPROVED** - Can perform admin operations
3. **REJECTED** - Cannot access platform

### Admin Capabilities (After Approval)

- Approve/Reject agent registrations
- View agent documents and verification status
- Manage agent status and details
- Monitor booking activities
- Generate reports (future)

### Email Verification

Admin must verify their email before full access to admin features.

### Access Control

Admin operations are protected by `adminMiddleware` which checks:

1. Valid access token
2. User role is ADMIN or ROOTADMIN
3. User role status is APPROVED (for ADMIN)
