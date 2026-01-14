# Agent API Documentation

## Overview

The Agent Router handles all agent-related operations including registration, login, email verification, and account management for travel agents on the BatioBhai platform.

**Base URL:** `/api/v1/agent`

**User Role:** `AGENT`

**Status:** `PENDING` (awaiting approval from admin/root admin)

**Route File:** `/src/routes/agent.routes.ts`

**Controller File:** `/src/controllers/agent.controller.ts`

**Middleware:** `/src/middlewares/auth.middleware.ts`

---

## Table of Contents

1. [Registration](#registration)
2. [Login](#login)
3. [Account Verification](#account-verification)
4. [Resend Verification Link](#resend-verification-link)

---

## Registration

### Endpoint

```
POST /api/v1/agent/register
```

### Description

Allows a travel agent to register with company details, personal information, and government IDs. Creates a comprehensive agent profile with database transaction for data consistency.

### Request Headers

```
Content-Type: application/json
```

### Request Body

```json
{
  "fullName": "Agent Name",
  "email": "agent@example.com",
  "password": "securePassword123",
  "phone": "+1234567890",
  "profileImageUrl": "https://cloudinary.com/image.jpg",
  "profileImageFileId": "cloudinary_file_id_123",
  "companyName": "Travel Company",
  "description": "Professional travel agency specializing in adventure tours",
  "aadharNumber": "123456789012",
  "panNumber": "ABCDE1234F",
  "gstNumber": "27ABCDE1234F1Z5",
  "bannerImageUrl": "https://cloudinary.com/banner.jpg",
  "bannerImageFileId": "banner_file_id_456",
  "addressType": "PERMANENT",
  "country": "India",
  "state": "Maharashtra",
  "district": "Mumbai",
  "pin": "400001",
  "city": "Mumbai",
  "longitude": "72.8777",
  "latitude": "19.0760",
  "aadharDocumentUrl": "https://cloudinary.com/aadhar.pdf",
  "aadharDocumentFileId": "aadhar_doc_789",
  "panDocumentUrl": "https://cloudinary.com/pan.pdf",
  "panDocumentFileId": "pan_doc_101"
}
```

### Request Body Validation

| Field                | Type   | Required | Rules                      | Notes                            |
| -------------------- | ------ | -------- | -------------------------- | -------------------------------- |
| fullName             | string | Yes      | Must be provided           | Agent's full name                |
| email                | string | Yes      | Valid email, unique        | Used for login and communication |
| password             | string | Yes      | Minimum 6 characters       | Hashed before storage            |
| phone                | string | No       | Valid phone format         | Contact number                   |
| profileImageUrl      | string | Yes      | Valid URL                  | Cloudinary image URL             |
| profileImageFileId   | string | Yes      | Cloudinary file ID         | For deletion tracking            |
| companyName          | string | Yes      | Must be provided           | Travel company name              |
| description          | string | No       | Any description            | Company description              |
| aadharNumber         | string | Yes      | 12 digits                  | Government ID for verification   |
| panNumber            | string | No       | Valid PAN format           | Tax ID                           |
| gstNumber            | string | No       | Valid GST format           | Tax registration number          |
| bannerImageUrl       | string | Yes      | Valid URL                  | Cloudinary banner image          |
| bannerImageFileId    | string | Yes      | Cloudinary file ID         | For deletion tracking            |
| addressType          | string | Yes      | PERMANENT\|CURRENT\|TRAVEL | Address classification           |
| country              | string | Yes      | Country name               | Agent's location                 |
| state                | string | Yes      | State name                 | Agent's location                 |
| district             | string | Yes      | District name              | Agent's location                 |
| pin                  | string | Yes      | Postal code                | Agent's location                 |
| city                 | string | Yes      | City name                  | Agent's location                 |
| longitude            | string | No       | GPS longitude              | Location coordinates             |
| latitude             | string | No       | GPS latitude               | Location coordinates             |
| aadharDocumentUrl    | string | Yes      | Valid URL                  | Aadhar document proof            |
| aadharDocumentFileId | string | Yes      | Cloudinary file ID         | For deletion tracking            |
| panDocumentUrl       | string | No       | Valid URL                  | PAN document proof               |
| panDocumentFileId    | string | No       | Cloudinary file ID         | For deletion tracking            |

### Success Response

**Status Code:** `201 Created`

```json
{
  "success": true,
  "statusCode": 201,
  "data": {
    "user": {
      "id": "clz1a2b3c4d5e6f7g8h9i0j1",
      "email": "agent@example.com",
      "fullName": "Agent Name",
      "role": "AGENT"
    },
    "agentProfile": {
      "id": "clz1a2b3c4d5e6f7g8h9i0j2",
      "companyName": "Travel Company",
      "status": "PENDING",
      "aadharNumber": "123456789012",
      "createdAt": "2025-12-07T10:30:00Z"
    },
    "address": {
      "id": "clz1a2b3c4d5e6f7g8h9i0j3",
      "city": "Mumbai",
      "country": "India",
      "state": "Maharashtra"
    }
  },
  "message": "Agent registered successfully and is pending for approval"
}
```

### Error Responses

#### 1. Email Already Registered

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "statusCode": 400,
  "data": null,
  "message": "Email already registered",
  "errors": ["This email is already in use"]
}
```

#### 2. Validation Error - Missing Required Field

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "statusCode": 400,
  "data": null,
  "message": "Company name is required",
  "errors": ["companyName cannot be empty"]
}
```

#### 3. Validation Error - Invalid Email

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "statusCode": 400,
  "data": null,
  "message": "Enter a valid email address",
  "errors": ["Email format is invalid"]
}
```

#### 4. Password Too Short

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "statusCode": 400,
  "data": null,
  "message": "Password is too short",
  "errors": ["Password must be at least 6 characters"]
}
```

#### 5. Database Transaction Failed

**Status Code:** `500 Internal Server Error`

```json
{
  "success": false,
  "statusCode": 500,
  "data": null,
  "message": "Internal server error during agent registration"
}
```

### Data Flow

```
1. Agent submits registration form
   ↓
2. Validate input data with Zod schema
   ↓ (if validation fails)
   └─→ Return validation error
   ↓ (if validation passes)
3. Check if email already exists
   ↓ (if exists)
   └─→ Return error: "Email already registered"
   ↓ (if not exists)
4. Hash password using bcrypt (10 salt rounds)
   ↓
5. START DATABASE TRANSACTION
   ↓
6. Create user record with:
   - fullName, email, hashed password
   - role: "AGENT"
   - phone
   - emailVerified: false
   ↓
7. Create address record with:
   - userId (from created user)
   - addressType, country, state, district, pin, city
   - longitude, latitude (if provided)
   ↓
8. Create profile image record
   - imageUrl, fileId
   ↓
9. Update user with profileImageId
   ↓
10. Create agent profile record with:
    - userId, companyName, description
    - aadharNumber, panNumber, gstNumber
    - status: "PENDING"
    ↓
11. Create banner image record
    - imageUrl, fileId
    ↓
12. Update agent profile with bannerImageId
    ↓
13. Create Aadhar document record
    - documentType: "AADHAR"
    - documentUrl, documentFileId, agentId
    ↓
14. Create PAN document record (if provided)
    - documentType: "PAN"
    - documentUrl, documentFileId, agentId
    ↓
15. COMMIT TRANSACTION
    ↓
16. Generate verification token (JWT)
    ↓
17. Update user with verifyToken
    ↓
18. Send verification email
    ↓
19. Generate access & refresh tokens
    ↓
20. Set tokens in HTTP-only cookies
    ↓
21. Return success response with created data
```

### Database Operations - Transaction

**Primary Tables:** `Bb_user`, `Bb_agentProfile`, `Bb_address`, `Bb_image`, `Bb_document`

**Prisma Schema:** `/src/prisma/schema.prisma`

**Database Client:** `/src/config/database.ts`

**Transaction Handler:** `/src/utils/transaction.helper.ts`

#### Step 1: Create User

```sql
INSERT INTO "Bb_user" (
  id, "fullName", email, password, role, phone,
  "emailVerified", "createdAt", "updatedAt"
) VALUES (
  GENERATED_CUID, 'Agent Name', 'agent@example.com',
  '$2a$10$hashed_password', 'AGENT', '+1234567890',
  false, NOW(), NOW()
);
```

#### Step 2: Create Address

```sql
INSERT INTO "Bb_address" (
  id, "userId", "addressType", country, state, district, pin, city,
  longitude, latitude
) VALUES (
  GENERATED_CUID, 'user_id', 'PERMANENT', 'India', 'Maharashtra',
  'Mumbai', '400001', 'Mumbai', '72.8777', '19.0760'
);
```

#### Step 3: Create Profile Image

```sql
INSERT INTO "Bb_image" (
  id, "imageUrl", "fileId", "createdAt"
) VALUES (
  GENERATED_CUID, 'https://cloudinary.com/image.jpg',
  'cloudinary_file_id_123', NOW()
);
```

#### Step 4: Update User with Profile Image

```sql
UPDATE "Bb_user"
SET "profileImageId" = 'image_id'
WHERE id = 'user_id';
```

#### Step 5: Create Agent Profile

```sql
INSERT INTO "Bb_agentProfile" (
  id, "userId", "companyName", description, "aadharNumber",
  "panNumber", "gstNumber", status, "createdAt", "updatedAt"
) VALUES (
  GENERATED_CUID, 'user_id', 'Travel Company',
  'Professional travel agency', '123456789012', 'ABCDE1234F',
  '27ABCDE1234F1Z5', 'PENDING', NOW(), NOW()
);
```

#### Step 6: Create Banner Image

```sql
INSERT INTO "Bb_image" (
  id, "imageUrl", "fileId", "createdAt"
) VALUES (
  GENERATED_CUID, 'https://cloudinary.com/banner.jpg',
  'banner_file_id_456', NOW()
);
```

#### Step 7: Update Agent Profile with Banner

```sql
UPDATE "Bb_agentProfile"
SET "bannerImageId" = 'banner_image_id'
WHERE id = 'agent_id';
```

#### Step 8: Create Aadhar Document

```sql
INSERT INTO "Bb_document" (
  id, "documentType", "documentUrl", "documentFileId", "agentId"
) VALUES (
  GENERATED_CUID, 'AADHAR', 'https://cloudinary.com/aadhar.pdf',
  'aadhar_doc_789', 'agent_id'
);
```

#### Step 9: Create PAN Document (Optional)

```sql
INSERT INTO "Bb_document" (
  id, "documentType", "documentUrl", "documentFileId", "agentId"
) VALUES (
  GENERATED_CUID, 'PAN', 'https://cloudinary.com/pan.pdf',
  'pan_doc_101', 'agent_id'
);
```

### Database State After Registration

```typescript
// Bb_user Table
{
  id: "clz1a2b3c4d5e6f7g8h9i0j1",
  fullName: "Agent Name",
  email: "agent@example.com",
  password: "$2a$10$...",
  emailVerified: false,
  role: "AGENT",
  phone: "+1234567890",
  profileImageId: "clz1a2b3c4d5e6f7g8h9i0j4",
  refreshToken: "eyJhbGciOiJIUzI1NiIs...",
  verifyToken: "eyJhbGciOiJIUzI1NiIs...",
  createdAt: "2025-12-07T10:30:00Z"
}

// Bb_agentProfile Table
{
  id: "clz1a2b3c4d5e6f7g8h9i0j2",
  userId: "clz1a2b3c4d5e6f7g8h9i0j1",
  companyName: "Travel Company",
  description: "Professional travel agency...",
  aadharNumber: "123456789012",
  panNumber: "ABCDE1234F",
  gstNumber: "27ABCDE1234F1Z5",
  bannerImageId: "clz1a2b3c4d5e6f7g8h9i0j6",
  status: "PENDING", // Awaiting admin approval
  createdAt: "2025-12-07T10:30:00Z"
}

// Bb_address Table
{
  id: "clz1a2b3c4d5e6f7g8h9i0j3",
  userId: "clz1a2b3c4d5e6f7g8h9i0j1",
  addressType: "PERMANENT",
  country: "India",
  state: "Maharashtra",
  district: "Mumbai",
  pin: "400001",
  city: "Mumbai",
  longitude: "72.8777",
  latitude: "19.0760"
}

// Bb_image Table (Profile & Banner)
{
  id: "clz1a2b3c4d5e6f7g8h9i0j4",
  imageUrl: "https://cloudinary.com/image.jpg",
  fileId: "cloudinary_file_id_123"
},
{
  id: "clz1a2b3c4d5e6f7g8h9i0j6",
  imageUrl: "https://cloudinary.com/banner.jpg",
  fileId: "banner_file_id_456"
}

// Bb_document Table (Aadhar & PAN)
{
  id: "clz1a2b3c4d5e6f7g8h9i0j7",
  documentType: "AADHAR",
  documentUrl: "https://cloudinary.com/aadhar.pdf",
  documentFileId: "aadhar_doc_789",
  agentId: "clz1a2b3c4d5e6f7g8h9i0j2"
},
{
  id: "clz1a2b3c4d5e6f7g8h9i0j8",
  documentType: "PAN",
  documentUrl: "https://cloudinary.com/pan.pdf",
  documentFileId: "pan_doc_101",
  agentId: "clz1a2b3c4d5e6f7g8h9i0j2"
}
```

### Email Sent

**To:** agent's email
**Subject:** For email/account verification with BatioBhai
**Content:** Verification link with verification token embedded

### Payment Model

**Important:** Each booking has a **single payment record** (one-to-one relationship). When a booking is created, a corresponding payment record is automatically created with status `PENDING`.

**Payment Relationship:**

- One booking → One payment
- Payment status tracks the overall transaction state
- Refunds are handled by updating the same payment record with `isRefund: true`

**Payment Lifecycle:**

1. Booking created → Payment created with `PENDING` status
2. Payment successful → Payment status updated to `SUCCESS`
3. Payment failed → Payment status updated to `FAILED`
4. Refund initiated → Payment `isRefund` set to `true`, status becomes `REFUNDED`

**Database Schema:**

```typescript
// Bb_booking Table
{
  id: "booking_id",
  bookingCode: "BK-2025-001",
  userId: "user_id",
  packageId: "package_id",
  numberOfTravelers: 2,
  status: "CONFIRMED",
  paymentStatus: "SUCCESS",
  baseAmount: 50000,
  taxAmount: 2500,
  discountAmount: 5000,
  totalAmount: 47500,
  payments: { // One-to-one relation
    id: "payment_id",
    // ...payment details
  }
}

// Bb_payment Table (One payment per booking)
{
  id: "payment_id",
  bookingId: "booking_id", // unique constraint
  type: "BOOKING",
  status: "SUCCESS",
  amount: 47500,
  currency: "INR",
  provider: "RAZORPAY",
  providerRef: "pay_xyz123",
  isRefund: false
}
```

### Cookies Set

```
accesstoken: "Bearer eyJhbGciOiJIUzI1NiIs..." (httpOnly, 3 days expiry)
refreshtoken: "Bearer eyJhbGciOiJIUzI1NiIs..." (httpOnly, 10 days expiry)
```

---

## Login

### Endpoint

```
POST /api/v1/agent/login
```

### Description

Authenticates an agent using email and password. Uses the same login function as user registration but is restricted to AGENT role accounts.

### Request Headers

```
Content-Type: application/json
```

### Request Body

```json
{
  "email": "agent@example.com",
  "password": "securePassword123"
}
```

### Request Body Validation

| Field    | Type   | Required | Rules                | Notes                      |
| -------- | ------ | -------- | -------------------- | -------------------------- |
| email    | string | Yes      | Valid email format   | Must exist in database     |
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

#### 1. Email Not Found

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "statusCode": 400,
  "data": null,
  "message": "Provided email is not found kindly register or try with another email"
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
  "message": "Email is required"
}
```

### Data Flow

```
1. Agent submits login form
   ↓
2. Validate email and password format
   ↓ (if invalid)
   └─→ Return validation error
   ↓ (if valid)
3. Search database for user by email
   ↓ (if not found)
   └─→ Return error: "Email not found"
   ↓ (if found)
4. Compare provided password with stored hash using bcrypt
   ↓ (if mismatch)
   └─→ Return error: "Password does not match"
   ↓ (if match)
5. Generate new access token (JWT, 3 days expiry)
   ↓
6. Generate new refresh token (JWT, 10 days expiry)
   ↓
7. Update agent record with new refresh token
   ↓
8. Set tokens in HTTP-only cookies
   ↓
9. Return success response
```

### Database Operations

**Primary Table:** `Bb_user`

#### Find Agent by Email

```sql
SELECT id, email, password, role, "emailVerified"
FROM "Bb_user"
WHERE email = 'agent@example.com' AND role = 'AGENT';
```

#### Update Refresh Token

```sql
UPDATE "Bb_user"
SET "refreshToken" = 'new_jwt_refresh_token'
WHERE id = 'agent_id';
```

### Cookies Set

```
accesstoken: Bearer eyJhbGciOiJIUzI1NiIs... (3 days)
refreshtoken: Bearer eyJhbGciOiJIUzI1NiIs... (10 days)
```

---

## Account Verification

### Endpoint

```
POST /api/v1/agent/verify-account
```

### Description

Verifies an agent's email account using the verification token sent during registration. Same process as user verification.

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
  "message": "Account verified successfully"
}
```

### Error Responses

#### 1. Already Verified

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "statusCode": 400,
  "data": null,
  "message": "User is already verified"
}
```

#### 2. Invalid Token

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "statusCode": 400,
  "data": null,
  "message": "Invalid verification token"
}
```

### Database Operations

**Primary Table:** `Bb_user`

#### Update Verification Status

```sql
UPDATE "Bb_user"
SET "emailVerified" = true,
    "verifyToken" = null
WHERE id = 'agent_id';
```

---

## Resend Verification Link

### Endpoint

```
POST /api/v1/agent/send-verification-link
```

### Description

Resends the verification email to the agent's registered email address.

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

### Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "statusCode": 200,
  "data": null,
  "message": "Verification link sent successfully"
}
```

---

## Agent Registration Workflow Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                    AGENT REGISTRATION WORKFLOW                   │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. AGENT SUBMITS REGISTRATION                                   │
│     ├─ Personal Info: fullName, email, password, phone           │
│     ├─ Company Info: companyName, description                    │
│     ├─ Address: country, state, district, city, pin              │
│     ├─ IDs: aadharNumber, panNumber, gstNumber                   │
│     └─ Documents: Aadhar & PAN file URLs                         │
│                                                                  │
│  2. VALIDATION & CHECKS                                          │
│     ├─ Validate all fields                                       │
│     ├─ Check email uniqueness                                    │
│     └─ Hash password                                             │
│                                                                  │
│  3. DATABASE TRANSACTION STARTS                                  │
│     ├─ Create Bb_user (role: AGENT, status: not verified)       │
│     ├─ Create Bb_address (agent location)                        │
│     ├─ Create Bb_image (profile & banner)                        │
│     ├─ Create Bb_agentProfile (status: PENDING)                  │
│     ├─ Create Bb_document (Aadhar & PAN)                         │
│     └─ Link all records                                          │
│                                                                  │
│  4. TOKEN GENERATION                                             │
│     ├─ Generate verification token                               │
│     ├─ Generate access token (3 days)                            │
│     └─ Generate refresh token (10 days)                          │
│                                                                  │
│  5. COMMUNICATION & SETUP                                        │
│     ├─ Send verification email                                   │
│     ├─ Set cookies with tokens                                   │
│     └─ Return success response                                   │
│                                                                  │
│  6. VERIFICATION PHASE                                           │
│     ├─ Agent clicks email verification link                      │
│     ├─ POST /verify-account with token                           │
│     └─ Set emailVerified = true                                  │
│                                                                  │
│  7. APPROVAL PHASE                                               │
│     ├─ Agent profile is PENDING                                  │
│     ├─ Admin/RootAdmin reviews documents                         │
│     ├─ Admin can APPROVE or REJECT                               │
│     └─ Agent notified of approval status                         │
│                                                                  │
│  8. AGENT ACTIVE                                                 │
│     ├─ Can create travel packages                                │
│     ├─ Can manage bookings                                       │
│     └─ Can interact with travelers                               │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Summary Table

| Operation      | Endpoint                  | Method | Auth Required | Role Status  |
| -------------- | ------------------------- | ------ | ------------- | ------------ |
| Register       | `/register`               | POST   | No            | PENDING      |
| Login          | `/login`                  | POST   | No            | Any          |
| Verify Account | `/verify-account`         | POST   | Yes           | Any          |
| Resend Link    | `/send-verification-link` | POST   | Yes           | Not Verified |

---

## Important Notes

### Status Progression

1. **PENDING** - Initial status after registration
2. **APPROVED** - Admin/RootAdmin approved documents
3. **REJECTED** - Admin/RootAdmin rejected application

### Documents Required

- **Aadhar:** Government ID (mandatory)
- **PAN:** Tax ID (optional but recommended)
- **GST:** Business tax number (optional)

### Profile Images

- **Profile Image:** Agent/company profile picture
- **Banner Image:** Company banner for listings

### Verification Process

1. Agent registers → verification email sent
2. Agent clicks email link → email verified
3. Admin reviews documents → approval status updated
4. Agent can then create packages (if approved)
