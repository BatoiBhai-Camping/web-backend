# Root Admin API Documentation

## Overview

The RootAdmin Router handles platform-level administrative operations including admin management, agent approval, and high-level access control. RootAdmin is the highest level of authority on the platform.

**Base URL:** `/api/v1/root-admin`

**User Role:** `ROOTADMIN`

**Status:** `APPROVED` (platform initialized with RootAdmin)

**Route File:** `/src/routes/rootAdmin.routes.ts`

**Controller File:** `/src/controllers/rootAdmin.controller.ts`

**Middleware:** `/src/middlewares/rootAdmin.middleware.ts`

---

## Table of Contents

1. [Registration](#registration)
2. [Login](#login)
3. [Account Verification](#account-verification)
4. [Resend Verification Link](#resend-verification-link)
5. [Approve Sub-Admin](#approve-sub-admin)
6. [Reject Sub-Admin](#reject-sub-admin)
7. [Approve Agent](#approve-agent)
8. [Approve Package](#approve-package)
9. [Reject Package](#reject-package)
10. [Get All Sub-Admins](#get-all-sub-admins)
11. [Get All Agents](#get-all-agents)
12. [Get All Users](#get-all-users)
13. [Get All Packages](#get-all-packages)
14. [Get Agent Packages](#get-agent-packages)
15. [Get All Payments](#get-all-payments)
16. [Get RootAdmin Profile](#get-rootadmin-profile)
17. [Update Profile](#update-profile)
18. [Logout](#logout)
19. [Delete Account](#delete-account)

---

## Registration

### Endpoint

```
POST /api/v1/root-admin/register
```

### Description

Creates a new sub-admin or secondary RootAdmin account. This endpoint uses the same registration logic as admin registration but allows RootAdmin to create accounts with elevated privileges.

### Request Headers

```
Content-Type: application/json
```

### Request Body

```json
{
  "fullName": "Sub Admin Name",
  "email": "subadmin@example.com",
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

#### 2. Validation Error

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "statusCode": 400,
  "data": null,
  "message": "Enter a valid email address"
}
```

---

## Login

### Endpoint

```
POST /api/v1/root-admin/login
```

### Description

Authenticates a RootAdmin or Admin user using email and password. Provides full platform access with tokens.

### Request Headers

```
Content-Type: application/json
```

### Request Body

```json
{
  "email": "rootadmin@example.com",
  "password": "securePassword123"
}
```

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
  "message": "Provided email is not found or this is not a admin email"
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

---

## Account Verification

### Endpoint

```
POST /api/v1/root-admin/verify-account
```

### Description

Verifies a RootAdmin's email account using the verification token sent during registration.

**Authorization:** Requires authentication

### Request Headers

```
Authorization: Bearer <access_token>
Content-Type: application/json
Cookie: accesstoken=<token>
```

### Request Body

```json
{
  "verifyToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "statusCode": 200,
  "data": null,
  "message": "RootAdmin account verified successfully"
}
```

---

## Resend Verification Link

### Endpoint

```
POST /api/v1/root-admin/send-verification-link
```

### Description

Resends the email verification link to the RootAdmin's registered email address.

**Authorization:** Requires authentication

### Request Headers

```
Authorization: Bearer <access_token>
Content-Type: application/json
Cookie: accesstoken=<token>
```

### Request Body

No request body required.

### Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "statusCode": 200,
  "data": null,
  "message": "Verification email sent successfully"
}
```

---

## Approve Sub-Admin

### Endpoint

```
POST /api/v1/root-admin/approve-sub-admin
```

### Description

RootAdmin approves a pending admin account, granting them full admin access. This changes the admin's roleStatus from PENDING to APPROVED.

**Authorization:** Requires RootAdmin authentication

### Request Headers

```
Authorization: Bearer <access_token>
Content-Type: application/json
Cookie: accesstoken=<token>
```

### Request Body

```json
{
  "adminId": "clz2a2b3c4d5e6f7g8h9i0j1"
}
```

### Request Body Validation

| Field   | Type   | Required | Rules         | Notes                           |
| ------- | ------ | -------- | ------------- | ------------------------------- |
| adminId | string | Yes      | Valid user ID | ID from Bb_user with ADMIN role |

### Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "adminId": "clz2a2b3c4d5e6f7g8h9i0j1",
    "email": "admin@example.com",
    "fullName": "Admin Name",
    "roleStatus": "APPROVED",
    "updatedAt": "2025-12-07T10:45:00Z"
  },
  "message": "Admin approved successfully"
}
```

### Error Responses

#### 1. Unauthorized

**Status Code:** `401 Unauthorized`

```json
{
  "success": false,
  "statusCode": 401,
  "data": null,
  "message": "Unauthorized - RootAdmin access required"
}
```

#### 2. Admin Not Found

**Status Code:** `404 Not Found`

```json
{
  "success": false,
  "statusCode": 404,
  "data": null,
  "message": "Admin user not found"
}
```

#### 3. Admin Already Approved

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "statusCode": 400,
  "data": null,
  "message": "Admin is already approved"
}
```

#### 4. Missing Admin ID

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "statusCode": 400,
  "data": null,
  "message": "Admin ID is required"
}
```

### Data Flow

```
1. RootAdmin submits approval request with adminId
   ↓
2. Verify RootAdmin authentication via middleware
   ↓ (if not authenticated)
   └─→ Return error: "Unauthorized"
   ↓ (if authenticated)
3. Validate adminId format
   ↓ (if invalid)
   └─→ Return validation error
   ↓ (if valid)
4. Search database for admin by ID
   ↓ (if not found)
   └─→ Return error: "Admin not found"
   ↓ (if found)
5. Check current roleStatus
   ↓ (if already APPROVED or REJECTED)
   └─→ Return error: "Admin already has status"
   ↓ (if PENDING)
6. Update admin record:
   - Set roleStatus = "APPROVED"
   - Update updatedAt
   ↓
7. Send approval notification to admin
   ↓
8. Return success response
```

### Database Operations

**Primary Table:** `Bb_user`

**Prisma Schema:** `/src/prisma/schema.prisma`

**Database Client:** `/src/config/database.ts`

#### Find Admin

```sql
SELECT id, "fullName", email, role, "roleStatus"
FROM "Bb_user"
WHERE id = 'admin_id' AND role = 'ADMIN';
```

#### Update Admin Status to APPROVED

```sql
UPDATE "Bb_user"
SET "roleStatus" = 'APPROVED',
    "updatedAt" = NOW()
WHERE id = 'admin_id' AND role = 'ADMIN';
```

### Database State After Approval

```typescript
// Before Approval
{
  id: "clz2a2b3c4d5e6f7g8h9i0j1",
  role: "ADMIN",
  roleStatus: "PENDING",
  updatedAt: "2025-12-07T10:30:00Z"
}

// After Approval
{
  id: "clz2a2b3c4d5e6f7g8h9i0j1",
  role: "ADMIN",
  roleStatus: "APPROVED", // Changed
  updatedAt: "2025-12-07T10:45:00Z" // Updated
}
```

---

## Reject Sub-Admin

### Endpoint

```
POST /api/v1/root-admin/reject-sub-admin
```

### Description

RootAdmin rejects a pending admin account. This changes the admin's roleStatus to REJECTED and prevents them from accessing the platform.

**Authorization:** Requires RootAdmin authentication

### Request Headers

```
Authorization: Bearer <access_token>
Content-Type: application/json
Cookie: accesstoken=<token>
```

### Request Body

```json
{
  "adminId": "clz2a2b3c4d5e6f7g8h9i0j1",
  "reason": "Did not meet verification requirements"
}
```

### Request Body Validation

| Field   | Type   | Required | Rules         | Notes                           |
| ------- | ------ | -------- | ------------- | ------------------------------- |
| adminId | string | Yes      | Valid user ID | ID from Bb_user with ADMIN role |
| reason  | string | No       | Any text      | Reason for rejection            |

### Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "adminId": "clz2a2b3c4d5e6f7g8h9i0j1",
    "email": "admin@example.com",
    "roleStatus": "REJECTED",
    "reason": "Did not meet verification requirements",
    "updatedAt": "2025-12-07T10:45:00Z"
  },
  "message": "Admin rejected successfully"
}
```

### Error Responses

#### 1. Unauthorized

**Status Code:** `401 Unauthorized`

```json
{
  "success": false,
  "statusCode": 401,
  "data": null,
  "message": "Unauthorized - RootAdmin access required"
}
```

#### 2. Admin Not Found

**Status Code:** `404 Not Found`

```json
{
  "success": false,
  "statusCode": 404,
  "data": null,
  "message": "Admin user not found"
}
```

#### 3. Admin Already Processed

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "statusCode": 400,
  "data": null,
  "message": "Admin status cannot be changed"
}
```

### Data Flow

```
1. RootAdmin submits rejection request
   ↓
2. Verify RootAdmin authentication
   ↓ (if not authenticated)
   └─→ Return error: "Unauthorized"
   ↓ (if authenticated)
3. Find admin by ID
   ↓ (if not found)
   └─→ Return error: "Admin not found"
   ↓ (if found)
4. Check if status can be changed
   ↓ (if already processed)
   └─→ Return error: "Cannot change status"
   ↓ (if PENDING)
5. Update admin status to REJECTED
   ↓
6. Store rejection reason (optional)
   ↓
7. Send rejection notification
   ↓
8. Return success response
```

### Database Operations

**Primary Table:** `Bb_user`

**Prisma Schema:** `/src/prisma/schema.prisma`

**Database Client:** `/src/config/database.ts`

#### Update Admin Status to REJECTED

```sql
UPDATE "Bb_user"
SET "roleStatus" = 'REJECTED',
    "updatedAt" = NOW()
WHERE id = 'admin_id' AND role = 'ADMIN';
```

---

## Approve Agent

### Endpoint

```
POST /api/v1/root-admin/approve-agent
```

### Description

RootAdmin approves a pending agent's registration. This updates the agent's status from PENDING to APPROVED, enabling them to create travel packages and manage bookings.

**Authorization:** Requires RootAdmin authentication

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
    "userId": "clz1a2b3c4d5e6f7g8h9i0j1",
    "status": "APPROVED",
    "aadharNumber": "123456789012",
    "updatedAt": "2025-12-07T10:50:00Z"
  },
  "message": "Agent approved successfully"
}
```

### Error Responses

#### 1. Unauthorized

**Status Code:** `401 Unauthorized`

```json
{
  "success": false,
  "statusCode": 401,
  "data": null,
  "message": "Unauthorized - RootAdmin access required"
}
```

#### 2. Agent Not Found

**Status Code:** `404 Not Found`

```json
{
  "success": false,
  "statusCode": 404,
  "data": null,
  "message": "Agent profile not found"
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

### Data Flow

```
1. RootAdmin submits agent approval
   ↓
2. Verify RootAdmin authentication
   ↓ (if not authenticated)
   └─→ Return error: "Unauthorized"
   ↓ (if authenticated)
3. Find agent profile by agentId
   ↓ (if not found)
   └─→ Return error: "Agent not found"
   ↓ (if found)
4. Check current agent status
   ↓ (if not PENDING)
   └─→ Return error: "Agent status already changed"
   ↓ (if PENDING)
5. Update agent status to APPROVED
   ↓
6. Send approval notification to agent
   ↓
7. Return success response
```

### Database Operations

**Primary Table:** `Bb_agentProfile`

**Prisma Schema:** `/src/prisma/schema.prisma`

**Database Client:** `/src/config/database.ts`

#### Find Agent

```sql
SELECT id, "userId", "companyName", status, "aadharNumber"
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

---

## Approve Package

### Endpoint

```
POST /api/v1/root-admin/approve-pkg
```

### Description

Approves a pending travel package submitted by an agent. Changes package status from PENDING to APPROVED, making it visible to users.

**Authorization:** Requires RootAdmin authentication

### Request Headers

```
Authorization: Bearer <access_token>
Content-Type: application/json
Cookie: accesstoken=<token>
```

### Request Body

```json
{
  "packageId": "clz3a2b3c4d5e6f7g8h9i0j1"
}
```

### Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "statusCode": 200,
  "data": null,
  "message": "Package approved successfully"
}
```

---

## Reject Package

### Endpoint

```
POST /api/v1/root-admin/reject-pkg
```

### Description

Rejects a pending travel package. Changes package status from PENDING to REJECTED.

**Authorization:** Requires RootAdmin authentication

### Request Headers

```
Authorization: Bearer <access_token>
Content-Type: application/json
Cookie: accesstoken=<token>
```

### Request Body

```json
{
  "packageId": "clz3a2b3c4d5e6f7g8h9i0j1"
}
```

### Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "statusCode": 200,
  "data": null,
  "message": "Package rejected successfully"
}
```

---

## Get All Sub-Admins

### Endpoint

```
GET /api/v1/root-admin/get-all-sub-admin
```

### Description

Retrieves a list of all admin accounts in the system, including their profile information and addresses.

**Authorization:** Requires RootAdmin authentication

### Request Headers

```
Authorization: Bearer <access_token>
Cookie: accesstoken=<token>
```

### Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "statusCode": 200,
  "data": [
    {
      "id": "clz2a2b3c4d5e6f7g8h9i0j1",
      "fullName": "Admin Name",
      "email": "admin@example.com",
      "role": "ADMIN",
      "roleStatus": "APPROVED",
      "emailVerified": true,
      "createdAt": "2026-02-15T10:30:00.000Z",
      "updatedAt": "2026-02-20T14:20:00.000Z",
      "address": [
        {
          "id": "clz2a2b3c4d5e6f7g8h9i0j2",
          "addressType": "PERMANENT",
          "country": "India",
          "state": "Maharashtra",
          "district": "Mumbai",
          "pin": "400001",
          "city": "Mumbai"
        }
      ],
      "profileImage": {
        "id": "clz2a2b3c4d5e6f7g8h9i0j3",
        "imageUrl": "https://cloudinary.com/profile.jpg"
      }
    }
  ],
  "message": "Successfully get all the sub admins"
}
```

---

## Get All Agents

### Endpoint

```
GET /api/v1/root-admin/get-all-agent
```

### Description

Retrieves a list of all agent accounts in the system.

**Authorization:** Requires RootAdmin authentication

### Request Headers

```
Authorization: Bearer <access_token>
Cookie: accesstoken=<token>
```

### Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "statusCode": 200,
  "data": [
    {
      "id": "clz1a2b3c4d5e6f7g8h9i0j1",
      "fullName": "Agent Name",
      "email": "agent@example.com",
      "role": "AGENT",
      "roleStatus": "APPROVED",
      "emailVerified": true,
      "createdAt": "2026-02-10T09:15:00.000Z",
      "updatedAt": "2026-02-15T11:45:00.000Z"
    }
  ],
  "message": "Successfully get all the agents"
}
```

---

## Get All Users

### Endpoint

```
GET /api/v1/root-admin/get-all-user
```

### Description

Retrieves a list of all traveler accounts (users with TRAVELER role).

**Authorization:** Requires RootAdmin authentication

### Request Headers

```
Authorization: Bearer <access_token>
Cookie: accesstoken=<token>
```

### Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "statusCode": 200,
  "data": [
    {
      "id": "clz4a2b3c4d5e6f7g8h9i0j1",
      "fullName": "User Name",
      "email": "user@example.com",
      "role": "TRAVELER",
      "emailVerified": true,
      "createdAt": "2026-03-01T10:30:00.000Z",
      "updatedAt": "2026-03-02T14:20:00.000Z"
    }
  ],
  "message": "Successfully get all the users"
}
```

---

## Get All Packages

### Endpoint

```
GET /api/v1/root-admin/get-all-pkg
```

### Description

Retrieves all travel packages in the system, regardless of status (PENDING, APPROVED, REJECTED).

**Authorization:** Requires RootAdmin authentication

### Request Headers

```
Authorization: Bearer <access_token>
Cookie: accesstoken=<token>
```

### Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "statusCode": 200,
  "data": [
    {
      "id": "clz3a2b3c4d5e6f7g8h9i0j1",
      "agentId": "clz1a2b3c4d5e6f7g8h9i0j2",
      "title": "Manali Adventure Tour",
      "description": "Experience the breathtaking beauty of Manali",
      "pricePerPerson": 15000,
      "packageApprovedStatus": "APPROVED",
      "destination": "Manali, Himachal Pradesh",
      "durationDays": 5,
      "isBookingActive": true,
      "isDeleted": false,
      "createdAt": "2026-02-15T10:30:00.000Z",
      "updatedAt": "2026-03-01T14:20:00.000Z"
    }
  ],
  "message": "Successfully get all the users"
}
```

---

## Get Agent Packages

### Endpoint

```
POST /api/v1/root-admin/get-agent-pkg
```

### Description

Retrieves all travel packages created by a specific agent.

**Authorization:** Requires RootAdmin authentication

### Request Headers

```
Authorization: Bearer <access_token>
Content-Type: application/json
Cookie: accesstoken=<token>
```

### Request Body

```json
{
  "id": "clz1a2b3c4d5e6f7g8h9i0j2"
}
```

### Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "statusCode": 200,
  "data": [
    {
      "id": "clz3a2b3c4d5e6f7g8h9i0j1",
      "agentId": "clz1a2b3c4d5e6f7g8h9i0j2",
      "title": "Manali Adventure Tour",
      "description": "Experience the breathtaking beauty of Manali",
      "pricePerPerson": 15000,
      "packageApprovedStatus": "PENDING",
      "destination": "Manali, Himachal Pradesh",
      "durationDays": 5
    }
  ],
  "message": "Successfully get all the agent packages"
}
```

---

## Get All Payments

### Endpoint

```
GET /api/v1/root-admin/get-all-payments
```

### Description

Retrieves all payment transactions in the system.

**Authorization:** Requires RootAdmin authentication

### Request Headers

```
Authorization: Bearer <access_token>
Cookie: accesstoken=<token>
```

### Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "statusCode": 200,
  "data": [
    {
      "id": "clz5a2b3c4d5e6f7g8h9i0j7",
      "bookingId": "clz5a2b3c4d5e6f7g8h9i0j6",
      "type": "BOOKING",
      "status": "SUCCESS",
      "amount": 28350,
      "currency": "INR",
      "provider": "RAZORPAY",
      "providerRef": "order_NXR8J9HDk2L3Mn",
      "isRefund": false,
      "createdAt": "2026-03-04T10:30:00.000Z",
      "updatedAt": "2026-03-04T10:32:15.000Z"
    }
  ],
  "message": "Successfully get all the payments"
}
```

---

## Get RootAdmin Profile

### Endpoint

```
GET /api/v1/root-admin/get-profile
```

### Description

Retrieves the authenticated RootAdmin's profile information including addresses and profile image.

**Authorization:** Requires RootAdmin authentication

### Request Headers

```
Authorization: Bearer <access_token>
Cookie: accesstoken=<token>
```

### Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "id": "clz3a3b4c5d6e7f8g9h0i1j2",
    "fullName": "RootAdmin Name",
    "email": "rootadmin@example.com",
    "role": "ROOTADMIN",
    "roleStatus": "APPROVED",
    "emailVerified": true,
    "phone": "+919876543210",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-02-15T10:45:00.000Z",
    "address": [
      {
        "id": "clz3a3b4c5d6e7f8g9h0i1j3",
        "addressType": "PERMANENT",
        "country": "India",
        "state": "Maharashtra",
        "district": "Mumbai",
        "pin": "400001",
        "city": "Mumbai"
      }
    ],
    "profileImage": {
      "userProfile": {
        "id": "clz3a3b4c5d6e7f8g9h0i1j4",
        "imageUrl": "https://cloudinary.com/rootadmin-profile.jpg"
      }
    }
  },
  "message": "successfully get the root admin profile"
}
```

---

## Update Profile

### Endpoint

```
POST /api/v1/root-admin/update-profile
```

### Description

Updates the authenticated RootAdmin's profile information.

**Authorization:** Requires RootAdmin authentication

### Request Headers

```
Authorization: Bearer <access_token>
Content-Type: application/json
Cookie: accesstoken=<token>
```

### Request Body

```json
{
  "fullName": "Updated RootAdmin Name",
  "phone": "+919876543210"
}
```

### Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "statusCode": 200,
  "data": null,
  "message": "Profile updated successfully"
}
```

---

## Logout

### Endpoint

```
DELETE /api/v1/root-admin/logout
```

### Description

Logs out the authenticated RootAdmin by clearing authentication cookies and refresh token.

**Authorization:** Requires authentication

### Request Headers

```
Authorization: Bearer <access_token>
Cookie: accesstoken=<token>
```

### Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "statusCode": 200,
  "data": null,
  "message": "User logged out successfully"
}
```

---

## Delete Account

### Endpoint

```
DELETE /api/v1/root-admin/delete-acc
```

### Description

Allows a RootAdmin to delete their account. This operation performs a soft delete by setting the `isDeleted` flag to true, clears all authentication tokens, and removes cookies.

**⚠️ WARNING:** This is a critical operation. Deleting a RootAdmin account should be done with extreme caution as it affects platform administration capabilities.

**Authorization:** Requires RootAdmin authentication

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
  "message": "Unauthorized - RootAdmin access required"
}
```

#### 2. RootAdmin Not Found

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "statusCode": 400,
  "data": null,
  "message": "RootAdmin account not found"
}
```

### Data Flow

```
1. RootAdmin requests account deletion
   ↓
2. Verify RootAdmin authentication via middleware
   ↓ (if not authenticated)
   └─→ Return error: "Unauthorized"
   ↓ (if authenticated)
3. Update RootAdmin user record:
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

#### Soft Delete RootAdmin Account

```sql
UPDATE "Bb_user"
SET "isDeleted" = true,
    "updatedAt" = NOW()
WHERE id = 'rootadmin_id' AND role = 'ROOTADMIN';
```

#### Clear Refresh Token

```sql
UPDATE "Bb_user"
SET "refreshToken" = null
WHERE id = 'rootadmin_id';
```

### Database State After Deletion

```typescript
// Before Deletion
{
  id: "clz3a3b4c5d6e7f8g9h0i1j2",
  role: "ROOTADMIN",
  roleStatus: "APPROVED",
  isDeleted: false,
  refreshToken: "eyJhbGciOiJIUzI1NiIs...",
  updatedAt: "2025-12-07T10:30:00Z"
}

// After Deletion
{
  id: "clz3a3b4c5d6e7f8g9h0i1j2",
  role: "ROOTADMIN",
  roleStatus: "APPROVED",
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

#### Critical Operation Warning

⚠️ **This is a highly sensitive operation:**

- Deleting a RootAdmin account affects platform administration
- Ensure at least one active RootAdmin exists
- Consider the impact on pending admin/agent approvals
- All administrative actions will be logged

#### Soft Delete Behavior

- **User Account:** Soft deleted (`isDeleted: true`)
- **Role & Permissions:** Retained for audit trail
- **Historical Actions:** All admin actions remain logged
- **Email:** Can be reused for new RootAdmin if needed

#### What Happens After Deletion

- Cannot login to RootAdmin account
- Cannot approve/reject admins or agents
- Cannot perform any administrative operations
- All historical administrative actions remain in logs

#### Platform Impact

After RootAdmin deletion:

- Other RootAdmins (if any) can continue operations
- Pending admin approvals require another RootAdmin
- Platform operations continue normally
- May need to create a new RootAdmin if this was the only one

#### Recovery

- Requires direct database access
- May need server administrator intervention
- Can manually set `isDeleted: false` in database
- Contact system administrator for recovery

#### Best Practices

1. **Verify Multiple RootAdmins:** Ensure at least 2 active RootAdmins exist
2. **Document Reason:** Keep record of why deletion occurred
3. **Notify Team:** Inform other administrators
4. **Backup Data:** Ensure all critical data is backed up
5. **Alternative:** Consider role downgrade instead of deletion

### Postman Testing

```
Method: DELETE
URL: http://localhost:3000/api/v1/root-admin/delete-acc
Headers:
  Authorization: Bearer <access_token>
  Cookie: accesstoken=<token>
Body: {}
```

---

## RootAdmin Workflow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                 ROOTADMIN OPERATIONS                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. PLATFORM INITIALIZATION                                 │
│     RootAdmin account created during setup                  │
│     └─→ role: ROOTADMIN, status: APPROVED                  │
│                                                             │
│  2. ADMIN MANAGEMENT                                         │
│     Register new ADMIN accounts                             │
│     ├─ POST /register (creates ADMIN with PENDING status)  │
│     ├─ POST /approve-sub-admin (PENDING → APPROVED)        │
│     └─ POST /reject-sub-admin (PENDING → REJECTED)         │
│                                                             │
│  3. AGENT MANAGEMENT                                         │
│     Review and approve agent registrations                  │
│     ├─ Review agent documents (Aadhar, PAN)                │
│     ├─ POST /approve-agent (PENDING → APPROVED)            │
│     └─ Agents can then create packages                      │
│                                                             │
│  4. PLATFORM OVERSIGHT                                       │
│     Monitor all activities:                                 │
│     ├─ Admin activities                                     │
│     ├─ Agent registrations                                  │
│     ├─ Booking activities                                   │
│     └─ User complaints/reports                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## RootAdmin Authority Hierarchy

```
ROOTADMIN (Highest Authority)
│
├─→ Can CREATE & MANAGE ADMINS
│   ├─ Register new admin accounts
│   ├─ Approve pending admins
│   ├─ Reject pending admins
│   ├─ Modify admin permissions
│   └─ Delete admin accounts
│
├─→ Can MANAGE AGENTS
│   ├─ Review agent documents
│   ├─ Approve agent applications
│   ├─ Reject agent applications
│   ├─ Suspend agent accounts
│   └─ Monitor agent activities
│
├─→ Can MANAGE USERS
│   ├─ View all user accounts
│   ├─ Resolve user disputes
│   ├─ Monitor user activities
│   └─ Handle complaints
│
├─→ PLATFORM ADMINISTRATION
│   ├─ System settings
│   ├─ Payment configurations
│   ├─ Commission management
│   ├─ Report generation
│   └─ Security management
│
└─→ CANNOT
    ├─ Be approved/rejected by anyone
    ├─ Have role status changed
    └─ Be deleted through normal operations
```

---

## Approval Workflow

```
AGENT REGISTRATION
├─→ Agent submits registration
├─→ Documents verified
├─→ Status: PENDING
├─→ RootAdmin reviews
│  ├─→ Approve? → Status: APPROVED
│  │              Agent can now:
│  │              • Create packages
│  │              • Accept bookings
│  │              • Manage itineraries
│  │
│  └─→ Reject? → Status: REJECTED
│                 Agent cannot access platform
│
└─→ Agent notified of decision

ADMIN CREATION
├─→ RootAdmin creates admin
├─→ Admin registers email
├─→ Status: PENDING
├─→ RootAdmin reviews
│  ├─→ Approve? → Status: APPROVED
│  │              Admin can now:
│  │              • Approve agents
│  │              • Manage users
│  │              • Access admin features
│  │
│  └─→ Reject? → Status: REJECTED
│                 Admin account disabled
│
└─→ Admin notified of decision
```

---

## Summary Table

| Operation         | Endpoint             | Method | Auth Required | Role            |
| ----------------- | -------------------- | ------ | ------------- | --------------- |
| Register Admin    | `/register`          | POST   | No            | ADMIN           |
| Login             | `/login`             | POST   | No            | ROOTADMIN/ADMIN |
| Approve Sub-Admin | `/approve-sub-admin` | POST   | Yes           | ROOTADMIN       |
| Reject Sub-Admin  | `/reject-sub-admin`  | POST   | Yes           | ROOTADMIN       |
| Approve Agent     | `/approve-agent`     | POST   | Yes           | ROOTADMIN       |
| Delete Account    | `/delete-acc`        | DELETE | Yes           | ROOTADMIN       |

---

## Important Notes

### RootAdmin Account

- Created during platform initialization
- Cannot be deleted through API
- Has role: "ROOTADMIN"
- Status is always: "APPROVED"
- Cannot be suspended or deactivated

### Admin Status Progression

```
PENDING (Initial)
  ↓
Reviewed by RootAdmin
  ↓
  ├─→ APPROVED (Can perform admin duties)
  └─→ REJECTED (No platform access)
```

### Agent Status Progression

```
PENDING (After registration)
  ↓
Documents reviewed
  ↓
  ├─→ APPROVED (Can create packages)
  └─→ REJECTED (No platform access)
```

### Access Control

RootAdmin operations are protected by `rootAdminMiddleware` which verifies:

1. Valid access token
2. User role is ROOTADMIN
3. Token not expired
4. User not deleted

### Notification System

When status changes are made:

- Approval → Email notification sent
- Rejection → Email with rejection reason sent
- The user is informed of next steps

### Security Considerations

- All admin operations are logged
- RootAdmin cannot perform self-approval operations
- All data modifications tracked with timestamps
- Token expiration enforced for sensitive operations
