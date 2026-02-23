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
5. [Publish Travel Package](#publish-travel-package)
6. [Get All Packages](#get-all-packages)
7. [Update Package](#update-package)
8. [Get Agent Profile](#get-agent-profile)
9. [Update Agent Profile](#update-agent-profile)
10. [Logout](#logout)
11. [Delete Account](#delete-account)

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

## Publish Travel Package

### Endpoint

```
POST /api/v1/agent/publish-package
```

### Description

Allows an approved agent to publish a new travel package with complete itinerary, hotel stays, transport, meals, and visiting places. Creates a comprehensive package with database transaction for data consistency.

### Request Headers

```
Authorization: Bearer <access_token>
Content-Type: application/json
Cookie: accesstoken=<token>
```

### Request Body

```json
{
  "title": "Luxury 5-Day Goa Beach Paradise",
  "description": "Experience the best of Goa with luxury accommodations, guided tours, and authentic cuisine.",
  "pricePerPerson": 25000,
  "totalSeats": 30,
  "discountAmount": 2000,
  "discountPercentage": 8,
  "withTax": true,
  "taxPercentage": 5,
  "destination": "Goa",
  "durationDays": 5,
  "startDate": "2025-04-10T00:00:00Z",
  "endDate": "2025-04-15T00:00:00Z",
  "bookingActiveFrom": "2025-01-15T00:00:00Z",
  "bookingEndAt": "2025-04-05T23:59:59Z",
  "packagePolicies": "1. Valid ID proof required. 2. Children below 5 travel free.",
  "cancellationPolicies": "Full refund if cancelled 15+ days before travel.",
  "bannerImageUrl": "https://example.com/goa-banner.jpg",
  "bannerImageFileId": "file_goa_banner_001",
  "packageImages": [
    {
      "imageUrl": "https://example.com/goa-beach1.jpg",
      "fileId": "file_goa_img_001"
    }
  ],
  "itineraryDays": [
    {
      "dayNumber": 1,
      "title": "Day 1: Arrival in Goa & Beach Sunset",
      "description": "Welcome to Goa!",
      "hotelStay": {
        "hotelName": "Taj Exotica Resort & Spa",
        "checkIn": "2025-04-10T14:00:00Z",
        "checkOut": "2025-04-11T11:00:00Z",
        "address": "Calwaddo, Benaulim, Goa",
        "wifi": true,
        "tv": true,
        "attachWashroom": true,
        "acRoom": true,
        "kitchen": false
      },
      "transports": [
        {
          "fromLocation": "Goa Airport",
          "toLocation": "Hotel",
          "mode": "CAR",
          "startTime": "2025-04-10T11:00:00Z",
          "endTime": "2025-04-10T12:30:00Z"
        }
      ],
      "visits": [
        {
          "name": "Calangute Beach",
          "address": "Calangute, Goa",
          "description": "Famous beach for sunset",
          "visitTime": "17:00"
        }
      ],
      "meals": [
        {
          "type": "LUNCH",
          "mealDescription": "Welcome lunch buffet"
        },
        {
          "type": "DINNER",
          "mealDescription": "Beach BBQ dinner"
        }
      ]
    }
  ]
}
```

### Request Body Validation

| Field                | Type    | Required | Rules                              | Notes                             |
| -------------------- | ------- | -------- | ---------------------------------- | --------------------------------- |
| title                | string  | Yes      | Must be provided                   | Package title                     |
| description          | string  | Yes      | Must be provided                   | Detailed package description      |
| pricePerPerson       | number  | Yes      | Greater than 0                     | Base price per traveler           |
| totalSeats           | number  | Yes      | Minimum 1                          | Total available seats             |
| discountAmount       | number  | No       | Non-negative                       | Fixed discount amount             |
| discountPercentage   | number  | No       | 0-100                              | Percentage-based discount         |
| withTax              | boolean | No       | true/false                         | Whether tax is included           |
| taxPercentage        | number  | No       | 0-100                              | Tax percentage if withTax is true |
| destination          | string  | Yes      | Must be provided                   | Primary destination               |
| durationDays         | number  | Yes      | Minimum 1                          | Number of days for the trip       |
| startDate            | string  | No       | ISO 8601 format                    | Package start date                |
| endDate              | string  | No       | ISO 8601 format                    | Package end date                  |
| bookingActiveFrom    | string  | Yes      | ISO 8601 format                    | When booking opens                |
| bookingEndAt         | string  | Yes      | ISO 8601 format                    | When booking closes               |
| packagePolicies      | string  | No       | Any text                           | General package policies          |
| cancellationPolicies | string  | No       | Any text                           | Cancellation and refund policies  |
| bannerImageUrl       | string  | Yes      | Valid URL                          | Main package banner image         |
| bannerImageFileId    | string  | Yes      | Cloudinary file ID                 | For deletion tracking             |
| packageImages        | array   | No       | Array of image objects             | Additional package images         |
| itineraryDays        | array   | Yes      | Minimum 1 day, see itinerary below | Complete day-by-day itinerary     |

### Itinerary Day Schema

| Field       | Type   | Required | Rules                              | Notes                              |
| ----------- | ------ | -------- | ---------------------------------- | ---------------------------------- |
| dayNumber   | number | Yes      | Minimum 1, unique per package      | Sequential day number              |
| title       | string | Yes      | Must be provided                   | Day title (e.g., "Day 1: Arrival") |
| description | string | No       | Any text                           | Detailed day description           |
| hotelStay   | object | No       | See hotel schema below             | Accommodation details              |
| transports  | array  | Yes      | Minimum 1 transport                | All transports for the day         |
| visits      | array  | Yes      | Minimum 1 visit                    | Places to visit                    |
| meals       | array  | No       | 0-3 meals (breakfast/lunch/dinner) | Meal plan for the day              |

### Hotel Stay Schema

| Field          | Type    | Required | Rules            | Notes               |
| -------------- | ------- | -------- | ---------------- | ------------------- |
| hotelName      | string  | Yes      | Must be provided | Hotel/resort name   |
| checkIn        | string  | No       | ISO 8601 format  | Check-in date/time  |
| checkOut       | string  | No       | ISO 8601 format  | Check-out date/time |
| address        | string  | No       | Any text         | Hotel address       |
| wifi           | boolean | No       | true/false       | WiFi availability   |
| tv             | boolean | No       | true/false       | TV availability     |
| attachWashroom | boolean | No       | true/false       | Attached bathroom   |
| acRoom         | boolean | No       | true/false       | AC room             |
| kitchen        | boolean | No       | true/false       | Kitchen/kitchenette |

### Transport Schema

| Field        | Type   | Required | Rules                                | Notes                |
| ------------ | ------ | -------- | ------------------------------------ | -------------------- |
| fromLocation | string | Yes      | Must be provided                     | Starting location    |
| toLocation   | string | Yes      | Must be provided                     | Destination location |
| mode         | string | Yes      | BUS/TRAIN/CAR/FLIGHT/BOAT/WALK/OTHER | Transport type       |
| startTime    | string | Yes      | ISO 8601 format                      | Departure time       |
| endTime      | string | Yes      | ISO 8601 format                      | Arrival time         |

### Visit Place Schema

| Field       | Type   | Required | Rules            | Notes                  |
| ----------- | ------ | -------- | ---------------- | ---------------------- |
| name        | string | Yes      | Must be provided | Place name             |
| address     | string | No       | Any text         | Place address          |
| description | string | No       | Any text         | Place description      |
| visitTime   | string | No       | Time format      | Recommended visit time |

### Meal Schema

| Field           | Type   | Required | Rules                  | Notes        |
| --------------- | ------ | -------- | ---------------------- | ------------ |
| type            | string | Yes      | BREAKFAST/LUNCH/DINNER | Meal type    |
| mealDescription | string | No       | Any text               | Meal details |

### Success Response

**Status Code:** `201 Created`

```json
{
  "success": true,
  "message": "Package published successfully",
  "packageId": "clz1a2b3c4d5e6f7g8h9i0j1"
}
```

### Error Responses

#### 1. Validation Error - Missing Required Field

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "statusCode": 400,
  "data": null,
  "message": "Validation error: title is required",
  "errors": ["title cannot be empty"]
}
```

#### 2. Validation Error - Invalid Itinerary

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "statusCode": 400,
  "data": null,
  "message": "Validation error: itineraryDays must have at least 1 day",
  "errors": ["Minimum 1 itinerary day required"]
}
```

#### 3. Database Transaction Failed

**Status Code:** `500 Internal Server Error`

```json
{
  "success": false,
  "statusCode": 500,
  "data": null,
  "message": "Internal server error during package creation"
}
```

### Data Flow

```
1. Agent submits package data
   ↓
2. Validate input with Zod schema
   ↓ (if validation fails)
   └─→ Return validation error
   ↓ (if validation passes)
3. START DATABASE TRANSACTION
   ↓
4. Create banner image record
   - imageUrl, fileId
   ↓
5. Create main package record
   - agentId, title, description, pricing
   - totalSeats, seatsAvailable = totalSeats
   - seatBooked = 0
   - tax & discount settings
   - booking dates, policies
   - packageBannerImageId
   - packageApprovedStatus: PENDING
   ↓
6. Create additional package images (if provided)
   - Link to travelPackageId
   ↓
7. FOR EACH itinerary day:
   ├─ Create itinerary day record
   │  - dayNumber, title, description, packageId
   │
   ├─ Create hotel stay (if provided)
   │  - hotelName, checkIn/Out, amenities
   │  - Link to itineraryDayId
   │
   ├─ Create all transports
   │  - fromLocation, toLocation, mode, times
   │  - Link to itineraryDayId
   │
   ├─ Create all visiting places
   │  - name, address, description, visitTime
   │  - Link to itineraryDayId
   │
   └─ Create meal plan (if meals provided)
      ├─ Create meal plan record
      │  - Link to itineraryDayId
      │
      └─ Create individual meals
         - type, mealDescription
         - Link to mealPlanId
   ↓
8. COMMIT TRANSACTION
   ↓
9. Return success response with packageId
```

### Database Operations - Transaction

**Primary Tables:** `Bb_travelPackage`, `Bb_image`, `Bb_itineraryDay`, `Bb_hotelStay`, `Bb_transport`, `Bb_visitPlace`, `Bb_mealPlan`, `Bb_meal`

#### Step 1: Create Banner Image

```sql
INSERT INTO "Bb_image" (
  id, "imageUrl", "fileId", "createdAt"
) VALUES (
  GENERATED_CUID, 'https://example.com/banner.jpg',
  'file_banner_001', NOW()
);
```

#### Step 2: Create Package

```sql
INSERT INTO "Bb_travelPackage" (
  id, "agentId", title, description, "pricePerPerson",
  "totalSeats", "seatsAvailable", "seatBooked",
  "discountAmount", "discountPercentage",
  "withTax", "taxPercentage",
  destination, "durationDays", "startDate", "endDate",
  "bookingActiveFrom", "bookingEndAt",
  "packagePolicies", "cancellationPolicies",
  "packageBannerImageId", "packageApprovedStatus",
  "createdAt", "updatedAt"
) VALUES (
  GENERATED_CUID, 'agent_id', 'Luxury Goa Package', '...',
  25000, 30, 30, 0,
  2000, 8,
  true, 5,
  'Goa', 5, '2025-04-10', '2025-04-15',
  '2025-01-15', '2025-04-05',
  '...', '...',
  'banner_image_id', 'PENDING',
  NOW(), NOW()
);
```

#### Step 3: Create Itinerary Day

```sql
INSERT INTO "Bb_itineraryDay" (
  id, "dayNumber", title, description, "packageId", "createdAt"
) VALUES (
  GENERATED_CUID, 1, 'Day 1: Arrival', '...',
  'package_id', NOW()
);
```

#### Step 4: Create Hotel Stay

```sql
INSERT INTO "Bb_hotelStay" (
  id, "hotelName", "checkIn", "checkOut", address,
  wifi, tv, "attachWashroom", "acRoom", kitchen,
  "itineraryDayId"
) VALUES (
  GENERATED_CUID, 'Taj Exotica', '2025-04-10 14:00', '2025-04-11 11:00',
  'Benaulim, Goa',
  true, true, true, true, false,
  'itinerary_day_id'
);
```

#### Step 5: Create Transports

```sql
INSERT INTO "Bb_transport" (
  id, "fromLocation", "toLocation", mode,
  "startTime", "endTime", "itineraryDayId"
) VALUES (
  GENERATED_CUID, 'Goa Airport', 'Hotel', 'CAR',
  '2025-04-10 11:00', '2025-04-10 12:30',
  'itinerary_day_id'
);
```

#### Step 6: Create Visiting Places

```sql
INSERT INTO "Bb_visitPlace" (
  id, name, address, description, "visitTime",
  "itineraryDayId"
) VALUES (
  GENERATED_CUID, 'Calangute Beach', 'Calangute, Goa',
  'Famous beach', '17:00',
  'itinerary_day_id'
);
```

#### Step 7: Create Meal Plan & Meals

```sql
-- Create meal plan
INSERT INTO "Bb_mealPlan" (
  id, "itineraryDayId"
) VALUES (
  GENERATED_CUID, 'itinerary_day_id'
);

-- Create meals
INSERT INTO "Bb_meal" (
  id, type, "mealDescription", "mealPlanId"
) VALUES
  (GENERATED_CUID, 'LUNCH', 'Welcome lunch buffet', 'meal_plan_id'),
  (GENERATED_CUID, 'DINNER', 'Beach BBQ dinner', 'meal_plan_id');
```

### Database State After Package Creation

```typescript
// Bb_travelPackage Table
{
  id: "pkg_001",
  agentId: "agent_id",
  title: "Luxury 5-Day Goa Beach Paradise",
  pricePerPerson: 25000,
  totalSeats: 30,
  seatsAvailable: 30,
  seatBooked: 0,
  discountAmount: 2000,
  discountPercentage: 8,
  withTax: true,
  taxPercentage: 5,
  destination: "Goa",
  durationDays: 5,
  packageApprovedStatus: "PENDING", // Awaiting admin approval
  isBookingActive: true,
  createdAt: "2025-12-07T10:30:00Z"
}

// Bb_itineraryDay Table
{
  id: "itinerary_001",
  dayNumber: 1,
  title: "Day 1: Arrival in Goa & Beach Sunset",
  description: "Welcome to Goa!",
  packageId: "pkg_001",
  createdAt: "2025-12-07T10:30:00Z"
}

// Bb_hotelStay Table
{
  id: "hotel_001",
  hotelName: "Taj Exotica Resort & Spa",
  checkIn: "2025-04-10T14:00:00Z",
  checkOut: "2025-04-11T11:00:00Z",
  wifi: true,
  tv: true,
  attachWashroom: true,
  acRoom: true,
  kitchen: false,
  itineraryDayId: "itinerary_001"
}

// Bb_transport Table
{
  id: "transport_001",
  fromLocation: "Goa Airport",
  toLocation: "Hotel",
  mode: "CAR",
  startTime: "2025-04-10T11:00:00Z",
  endTime: "2025-04-10T12:30:00Z",
  itineraryDayId: "itinerary_001"
}

// Bb_visitPlace Table
{
  id: "visit_001",
  name: "Calangute Beach",
  address: "Calangute, Goa",
  description: "Famous beach for sunset",
  visitTime: "17:00",
  itineraryDayId: "itinerary_001"
}

// Bb_mealPlan Table
{
  id: "mealplan_001",
  itineraryDayId: "itinerary_001"
}

// Bb_meal Table
{
  id: "meal_001",
  type: "LUNCH",
  mealDescription: "Welcome lunch buffet",
  mealPlanId: "mealplan_001"
},
{
  id: "meal_002",
  type: "DINNER",
  mealDescription: "Beach BBQ dinner",
  mealPlanId: "mealplan_001"
}
```

### Package Approval Workflow

```
1. Agent publishes package → Status: PENDING
   ↓
2. Admin/RootAdmin reviews package
   ↓
3. Admin approves/rejects
   ├─ APPROVED → Package visible to travelers
   └─ REJECTED → Package hidden, agent notified
   ↓
4. If APPROVED:
   - Travelers can browse and book
   - Booking creates single payment record
   - Seats are managed automatically
```

### Payment Model Integration

When a traveler books this package:

1. **Booking Creation:**
   - `numberOfTravelers` × `pricePerPerson` = `baseAmount`
   - Apply `taxPercentage` → `taxAmount`
   - Apply `discountAmount` or `discountPercentage` → `discountAmount`
   - Calculate `totalAmount` = `baseAmount` + `taxAmount` - `discountAmount`

2. **Single Payment Record:**
   - One booking → One payment (one-to-one relationship)
   - Payment status: `PENDING` → `SUCCESS`/`FAILED`
   - Payment provider: `RAZORPAY`/`STRIP`/`OTHER`
   - For refunds: same payment record, `isRefund: true`

**Example Calculation:**

```
2 travelers book Goa package:
- Base: 25000 × 2 = 50000
- Tax (5%): 50000 × 0.05 = 2500
- Discount: 2000 (fixed) or 8% (4000)
- Total: 50000 + 2500 - 2000 = 50500
→ Creates booking with totalAmount: 50500
→ Creates single payment record with amount: 50500
```

### Important Notes

#### Package Status

- **PENDING** - Initial status, awaiting approval
- **APPROVED** - Admin approved, visible to travelers
- **REJECTED** - Admin rejected, hidden from travelers

#### Seat Management

- `totalSeats` - Total capacity
- `seatsAvailable` - Decrements on booking
- `seatBooked` - Increments on booking
- Automatic seat updates on booking/cancellation

#### Image Management

- Banner image: Required, one per package
- Package images: Optional, multiple supported
- All images tracked with Cloudinary fileId for deletion

#### Booking Windows

- `bookingActiveFrom` - When booking opens
- `bookingEndAt` - When booking closes
- `startDate`/`endDate` - Actual trip dates (optional)

---

## Get All Packages

### Endpoint

```
GET /api/v1/agent/get-all-packages
```

or

```
GET /api/v1/agent/get-all-pkgs
```

### Description

Retrieves all travel packages created by the authenticated agent with complete details including itinerary, pricing, and approval status.

**Authorization:** Requires Agent authentication (AGENT role with APPROVED status and verified email)

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
  "data": [
    {
      "packageId": "pkg_123",
      "title": "Goa Beach Paradise",
      "description": "Experience the best beaches of Goa",
      "pricePerPerson": 15000,
      "totalSeats": 20,
      "bookedSeats": 5,
      "destination": "Goa",
      "durationDays": 5,
      "approveStatus": "APPROVED",
      "bannerImage": {
        "imageUrl": "https://cloudinary.com/banner.jpg",
        "fileId": "banner_123"
      },
      "bookingActiveFrom": "2025-12-01T00:00:00Z",
      "bookingEndAt": "2025-12-25T23:59:59Z",
      "createdAt": "2025-11-20T10:30:00Z",
      "updatedAt": "2025-11-22T14:20:00Z"
    }
  ],
  "message": "Packages retrieved successfully"
}
```

### Error Responses

#### 1. Unauthorized - Not Agent or Not Approved

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "statusCode": 400,
  "data": null,
  "message": "Access denied, authenication required as agent",
  "errors": [
    {
      "field": "Invalid user token",
      "message": "Provided token data is not found in db with the constrains, id, email , emailVerified, role, rolestatus"
    }
  ]
}
```

#### 2. Email Not Verified

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "statusCode": 400,
  "data": null,
  "message": "Access denied, authenication required as agent"
}
```

### Postman Testing

```
Method: GET
URL: http://localhost:3000/api/v1/agent/get-all-packages
Headers:
  Authorization: Bearer <access_token>
  Cookie: accesstoken=<token>
```

---

## Update Package

### Endpoint

```
POST /api/v1/agent/update-package
```

### Description

Allows an authenticated agent to update their existing travel package. All fields except packageId are optional - only send fields that need to be updated. Supports updating nested items (itinerary days, transports, visits, meals) by providing their IDs, and deleting items using delete ID arrays.

**Authorization:** Requires Agent authentication (AGENT role with APPROVED status and verified email)

### Request Headers

```
Authorization: Bearer <access_token>
Content-Type: application/json
Cookie: accesstoken=<token>
```

### Request Body

```json
{
  "packageId": "pkg_clz2a2b3c4d5e6f7g8h9i0j1",
  "title": "Updated Goa Beach Paradise",
  "pricePerPerson": 18000,
  "totalSeats": 25,
  "discountPercentage": 10,
  "bookingActiveFrom": "2025-12-05T00:00:00Z",
  "bannerImageUrl": "https://cloudinary.com/new-banner.jpg",
  "bannerImageFileId": "new_banner_456",
  "itineraryDays": [
    {
      "id": "day_existing_123",
      "title": "Updated Beach Day",
      "description": "Relaxing day at the beach",
      "transports": [
        {
          "id": "transport_existing_456",
          "mode": "CAR",
          "startTime": "09:00 AM"
        }
      ],
      "deleteVisitIds": ["visit_old_789"]
    }
  ],
  "deleteImageIds": ["img_old_321"],
  "deleteItineraryDayIds": ["day_old_654"]
}
```

### Request Body Validation

| Field                     | Type    | Required | Rules                                                | Notes                               |
| ------------------------- | ------- | -------- | ---------------------------------------------------- | ----------------------------------- |
| packageId                 | string  | Yes      | Valid package ID                                     | Required to identify which package  |
| title                     | string  | No       | Any string                                           | Package title                       |
| description               | string  | No       | Any string                                           | Package description                 |
| pricePerPerson            | number  | No       | Positive number                                      | Price per person                    |
| totalSeats                | number  | No       | Min 1                                                | Total available seats               |
| discountAmount            | number  | No       | Positive number                                      | Fixed discount amount               |
| discountPercentage        | number  | No       | 0-100                                                | Percentage discount                 |
| withTax                   | boolean | No       | true/false                                           | Whether price includes tax          |
| taxPercentage             | number  | No       | 0-100                                                | Tax percentage                      |
| destination               | string  | No       | Any string                                           | Destination name                    |
| durationDays              | number  | No       | Min 1                                                | Duration in days                    |
| startDate                 | string  | No       | ISO date string                                      | Trip start date                     |
| endDate                   | string  | No       | ISO date string                                      | Trip end date                       |
| bookingActiveFrom         | string  | No       | ISO date string                                      | Booking opens date                  |
| bookingEndAt              | string  | No       | ISO date string                                      | Booking closes date                 |
| packagePolicies           | string  | No       | Any string                                           | Package policies text               |
| cancellationPolicies      | string  | No       | Any string                                           | Cancellation policies text          |
| bannerImageUrl            | string  | No       | Valid URL                                            | New banner image URL                |
| bannerImageFileId         | string  | No       | Any string                                           | Cloudinary file ID                  |
| packageImages             | array   | No       | Array of image objects                               | Update/add package images           |
| packageImages[].id        | string  | No       | Valid image ID                                       | If provided, updates existing image |
| packageImages[].imageUrl  | string  | Yes      | Valid URL                                            | Image URL                           |
| packageImages[].fileId    | string  | No       | Any string                                           | Cloudinary file ID                  |
| itineraryDays             | array   | No       | Array of day objects                                 | Update/add itinerary days           |
| itineraryDays[].id        | string  | No       | Valid day ID                                         | If provided, updates existing day   |
| itineraryDays[].dayNumber | number  | No       | Min 1                                                | Day number                          |
| deleteImageIds            | array   | No       | Array of image ID strings                            | Image IDs to delete                 |
| deleteItineraryDayIds     | array   | No       | Array of day ID strings                              | Itinerary day IDs to delete         |
| deleteTransportIds        | array   | No       | Array of transport ID strings (within itineraryDays) | Transport IDs to delete             |
| deleteVisitIds            | array   | No       | Array of visit ID strings (within itineraryDays)     | Visit place IDs to delete           |
| deleteMealIds             | array   | No       | Array of meal ID strings (within itineraryDays)      | Meal IDs to delete                  |

### Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "packageId": "pkg_clz2a2b3c4d5e6f7g8h9i0j1",
    "title": "Updated Goa Beach Paradise",
    "pricePerPerson": 18000,
    "totalSeats": 25,
    "updatedAt": "2025-12-08T15:30:00Z"
  },
  "message": "Package updated successfully"
}
```

### Error Responses

#### 1. Unauthorized - Not Agent

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "statusCode": 400,
  "data": null,
  "message": "Access denied, authenication required as agent"
}
```

#### 2. Package Not Found or Not Owned

**Status Code:** `404 Not Found`

```json
{
  "success": false,
  "statusCode": 404,
  "data": null,
  "message": "Package not found or you don't have permission to update it"
}
```

#### 3. Validation Error

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "statusCode": 400,
  "data": null,
  "message": "Validation failed",
  "errors": [
    {
      "field": "totalSeats",
      "message": "Total seats must be at least 1"
    }
  ]
}
```

### Postman Testing

```
Method: POST
URL: http://localhost:3000/api/v1/agent/update-package
Headers:
  Authorization: Bearer <access_token>
  Content-Type: application/json
  Cookie: accesstoken=<token>
Body:
{
  "packageId": "pkg_clz2a2b3c4d5e6f7g8h9i0j1",
  "title": "Updated Goa Beach Paradise",
  "pricePerPerson": 18000
}
```

---

## Get Agent Profile

### Endpoint

```
GET /api/v1/agent/get-profile
```

### Description

Retrieves the authenticated agent's complete profile information including company details, addresses, documents, and status.

**Authorization:** Requires Agent authentication (AGENT role with APPROVED status and verified email)

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
  "data": {
    "id": "agent_123",
    "userId": "user_456",
    "fullName": "Agent Name",
    "email": "agent@example.com",
    "phone": "+1234567890",
    "emailVerified": true,
    "profileImage": {
      "imageUrl": "https://cloudinary.com/profile.jpg",
      "fileId": "profile_123"
    },
    "agentProfile": {
      "id": "profile_789",
      "companyName": "Travel Company Ltd",
      "description": "Professional travel services",
      "aadharNumber": "123456789012",
      "panNumber": "ABCDE1234F",
      "gstNumber": "27ABCDE1234F1Z5",
      "status": "APPROVED",
      "bannerImage": {
        "imageUrl": "https://cloudinary.com/banner.jpg",
        "fileId": "banner_456"
      }
    },
    "addresses": [
      {
        "id": "addr_321",
        "addressType": "PERMANENT",
        "country": "India",
        "state": "Maharashtra",
        "district": "Mumbai",
        "city": "Mumbai",
        "pin": "400001"
      }
    ],
    "documents": [
      {
        "id": "doc_111",
        "documentType": "AADHAR",
        "documentUrl": "https://cloudinary.com/aadhar.pdf",
        "documentFileId": "aadhar_file_111"
      }
    ],
    "createdAt": "2025-12-01T10:30:00Z"
  },
  "message": "Agent profile retrieved successfully"
}
```

### Error Responses

#### 1. Unauthorized

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "statusCode": 400,
  "data": null,
  "message": "Access denied, authenication required as agent"
}
```

### Postman Testing

```
Method: GET
URL: http://localhost:3000/api/v1/agent/get-profile
Headers:
  Authorization: Bearer <access_token>
  Cookie: accesstoken=<token>
```

---

## Update Agent Profile

### Endpoint

```
POST /api/v1/agent/update-profile
```

### Description

Allows an authenticated agent to update their profile including personal information, company details, images, and addresses. All fields are optional - only send fields that need to be updated.

**Authorization:** Requires Agent authentication (AGENT role with APPROVED status and verified email)

### Request Headers

```
Authorization: Bearer <access_token>
Content-Type: application/json
Cookie: accesstoken=<token>
```

### Request Body

```json
{
  "fullName": "Updated Agent Name",
  "phone": "+9876543210",
  "profileImageUrl": "https://cloudinary.com/new-profile.jpg",
  "profileFileId": "new_profile_123",
  "companyName": "Updated Travel Company Ltd",
  "description": "Leading travel service provider",
  "aadharNumber": "987654321012",
  "panNumber": "ZYXWV9876E",
  "gstNumber": "29ZYXWV9876E1Z8",
  "bannerImageUrl": "https://cloudinary.com/new-banner.jpg",
  "bannerFileId": "new_banner_456",
  "addresses": [
    {
      "id": "addr_existing_123",
      "addressType": "CURRENT",
      "country": "India",
      "state": "Karnataka",
      "city": "Bangalore",
      "pin": "560001"
    }
  ]
}
```

### Request Body Validation

| Field           | Type   | Required | Rules                                     | Notes                                 |
| --------------- | ------ | -------- | ----------------------------------------- | ------------------------------------- |
| fullName        | string | No       | Min 2 chars, Max 100 chars                | Agent's updated full name             |
| phone           | string | No       | Min 10 digits, Max 15 digits, valid chars | Contact number                        |
| profileImageUrl | string | No       | Valid URL                                 | Cloudinary profile image URL          |
| profileFileId   | string | No       | Any string                                | Cloudinary file ID                    |
| companyName     | string | No       | Min 2 chars, Max 200 chars                | Travel company name                   |
| description     | string | No       | Max 2000 chars                            | Company description                   |
| aadharNumber    | string | No       | 12 digits only                            | Aadhar card number                    |
| panNumber       | string | No       | 10 chars, format: AAAAA9999A              | PAN card number                       |
| gstNumber       | string | No       | Any string                                | GST registration number               |
| bannerImageUrl  | string | No       | Valid URL                                 | Cloudinary banner image URL           |
| bannerFileId    | string | No       | Any string                                | Cloudinary file ID for banner         |
| addresses       | array  | No       | Array of address objects                  | Agent's addresses                     |
| addresses[].id  | string | No       | Valid address ID                          | If provided, updates existing address |
| addressType     | enum   | No       | PERMANENT\|CURRENT\|TRAVEL                | Type of address                       |
| country         | string | No       | Any string                                | Country name                          |
| state           | string | No       | Any string                                | State name                            |
| district        | string | No       | Any string                                | District name                         |
| pin             | string | No       | Min 6 characters                          | Postal code                           |
| city            | string | No       | Any string                                | City name                             |

### Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "id": "agent_123",
    "fullName": "Updated Agent Name",
    "phone": "+9876543210",
    "companyName": "Updated Travel Company Ltd",
    "updatedAt": "2025-12-08T15:45:00Z"
  },
  "message": "Agent profile updated successfully"
}
```

### Error Responses

#### 1. Unauthorized

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "statusCode": 400,
  "data": null,
  "message": "Access denied, authenication required as agent"
}
```

#### 2. Validation Error - Invalid PAN Format

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "statusCode": 400,
  "data": null,
  "message": "Validation failed",
  "errors": [
    {
      "field": "panNumber",
      "message": "Invalid PAN number format"
    }
  ]
}
```

#### 3. Validation Error - Invalid Aadhar

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "statusCode": 400,
  "data": null,
  "message": "Validation failed",
  "errors": [
    {
      "field": "aadharNumber",
      "message": "Aadhar number must contain only digits"
    }
  ]
}
```

### Postman Testing

```
Method: POST
URL: http://localhost:3000/api/v1/agent/update-profile
Headers:
  Authorization: Bearer <access_token>
  Content-Type: application/json
  Cookie: accesstoken=<token>
Body:
{
  "fullName": "Updated Agent Name",
  "companyName": "Updated Travel Company Ltd"
}
```

---

## Logout

### Endpoint

```
DELETE /api/v1/agent/logout
```

### Description

Logs out the authenticated agent by clearing their authentication tokens and cookies.

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
  "message": "Agent logged out successfully"
}
```

### Error Responses

#### 1. Unauthorized

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "statusCode": 400,
  "data": null,
  "message": "Access denied, authenication required"
}
```

### Postman Testing

```
Method: DELETE
URL: http://localhost:3000/api/v1/agent/logout
Headers:
  Authorization: Bearer <access_token>
  Cookie: accesstoken=<token>
```

---

## Delete Account

### Endpoint

```
DELETE /api/v1/agent/delete-acc
```

### Description

Allows an agent to permanently delete their account. This operation performs a soft delete by setting the `isDeleted` flag to true, clears all authentication tokens, and removes cookies. Note that this only marks the account as deleted; agent profile and package data remain for record-keeping.

**Authorization:** Requires Agent authentication

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
  "message": "Unauthorized - Agent access required"
}
```

#### 2. Agent Not Found

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "statusCode": 400,
  "data": null,
  "message": "Agent account not found"
}
```

#### 3. Agent Not Approved

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "statusCode": 400,
  "data": null,
  "message": "Access denied - Agent must be approved"
}
```

### Data Flow

```
1. Agent requests account deletion
   ↓
2. Verify agent authentication via middleware
   ↓ (if not authenticated)
   └─→ Return error: "Unauthorized"
   ↓ (if authenticated)
3. Update agent user record:
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

**Related Tables:** `Bb_agentProfile`, `Bb_travelPackage`

**Prisma Schema:** `/src/prisma/schema.prisma`

**Database Client:** `/src/config/database.ts`

#### Soft Delete Agent Account

```sql
UPDATE "Bb_user"
SET "isDeleted" = true,
    "updatedAt" = NOW()
WHERE id = 'agent_id' AND role = 'AGENT';
```

#### Clear Refresh Token

```sql
UPDATE "Bb_user"
SET "refreshToken" = null
WHERE id = 'agent_id';
```

### Database State After Deletion

```typescript
// Before Deletion
{
  id: "clz1a2b3c4d5e6f7g8h9i0j1",
  role: "AGENT",
  isDeleted: false,
  refreshToken: "eyJhbGciOiJIUzI1NiIs...",
  updatedAt: "2025-12-07T10:30:00Z"
}

// After Deletion
{
  id: "clz1a2b3c4d5e6f7g8h9i0j1",
  role: "AGENT",
  isDeleted: true, // Changed
  refreshToken: null, // Cleared
  updatedAt: "2025-12-07T10:45:00Z" // Updated
}

// Agent Profile (Unchanged)
{
  id: "clz1a2b3c4d5e6f7g8h9i0j2",
  userId: "clz1a2b3c4d5e6f7g8h9i0j1",
  companyName: "Travel Company",
  status: "APPROVED",
  // Profile remains intact for record-keeping
}

// Travel Packages (Unchanged)
{
  id: "pkg_001",
  agentId: "clz1a2b3c4d5e6f7g8h9i0j2",
  title: "Luxury Goa Package",
  // Packages remain for booking history
}
```

### Cookies Cleared

```
accesstoken: Cleared
refreshtoken: Cleared
```

### Important Notes

#### Soft Delete Behavior

- **User Account:** Soft deleted (`isDeleted: true`)
- **Agent Profile:** Remains intact
- **Travel Packages:** Remain intact but may be hidden from new bookings
- **Existing Bookings:** Not affected, remain for travelers

#### What Happens After Deletion

- Cannot login to agent account
- Cannot create new packages
- Cannot manage existing bookings (access denied)
- Existing packages may continue for booked travelers
- Agent profile data retained for audit purposes

#### Data Retention

Agent-related data is retained because:

1. **Booking History:** Travelers need access to booked packages
2. **Audit Trail:** Platform needs agent activity records
3. **Financial Records:** Payment and commission tracking
4. **Legal Compliance:** Record-keeping requirements

#### Recovery

- Contact Admin/RootAdmin for account recovery
- May require verification process
- Existing packages and bookings will be restored

### Postman Testing

```
Method: DELETE
URL: http://localhost:3000/api/v1/agent/delete-acc
Headers:
  Authorization: Bearer <access_token>
  Cookie: accesstoken=<token>
Body: {}
```

---

## Summary Table

| Operation       | Endpoint                  | Method | Auth Required | Role Status  |
| --------------- | ------------------------- | ------ | ------------- | ------------ |
| Register        | `/register`               | POST   | No            | PENDING      |
| Login           | `/login`                  | POST   | No            | Any          |
| Verify Account  | `/verify-account`         | POST   | Yes           | Any          |
| Resend Link     | `/send-verification-link` | POST   | Yes           | Not Verified |
| Publish Package | `/publish-package`        | POST   | Yes           | APPROVED     |
| Delete Account  | `/delete-acc`             | DELETE | Yes           | APPROVED     |
