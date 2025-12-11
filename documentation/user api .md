# User API Documentation

## Overview

The User Router handles all user-related operations including registration, login, email verification, and account management for travelers on the BatioBhai platform.

**Base URL:** `/api/v1/user`

**User Role:** `TRAVELER` (default)

**Route File:** `/src/routes/user.routes.ts`

**Controller File:** `/src/controllers/user.controller.ts`

**Middleware:** `/src/middlewares/auth.middleware.ts`

**Validation:** `/src/validators/user.validator.ts`

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
POST /api/v1/user/register
```

### Description

Allows a new user to register with fullName, email, and password. The system creates a user account, generates a verification token, and sends a verification email.

### Request Headers

```
Content-Type: application/json
```

### Request Body

```json
{
  "fullName": "John Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

### Request Body Validation

| Field    | Type   | Required | Rules                              | Notes                           |
| -------- | ------ | -------- | ---------------------------------- | ------------------------------- |
| fullName | string | Yes      | Must be provided                   | User's full name                |
| email    | string | Yes      | Valid email format, must be unique | Used for login and verification |
| password | string | Yes      | Minimum 6 characters               | Will be hashed with bcrypt      |

### Success Response

**Status Code:** `201 Created`

```json
{
  "success": true,
  "statusCode": 201,
  "data": null,
  "message": "User registered successfully, kindly verify your email"
}
```

### Error Responses

#### 1. Validation Error - Invalid Email Format

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "statusCode": 400,
  "data": null,
  "message": "Enter a valid email address",
  "errors": ["Email validation failed"]
}
```

#### 2. Validation Error - Password Too Short

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

#### 3. Email Already Exists

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "statusCode": 400,
  "data": null,
  "message": "User email already exist, try another email or login",
  "errors": ["Email is already registered"]
}
```

#### 4. Missing Required Fields

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "statusCode": 400,
  "data": null,
  "message": "User's full name is required",
  "errors": ["fullName is required"]
}
```

#### 5. Internal Server Error - Email Sending Failed

**Status Code:** `500 Internal Server Error`

```json
{
  "success": false,
  "statusCode": 500,
  "data": null,
  "message": "Internal server error while sending the verification mail"
}
```

### Data Flow

```
1. User submits registration form
   ↓
2. Validate input data with Zod schema
   ↓
3. Check if email already exists in database
   ↓ (if exists)
   └─→ Return error: "Email already exist"
   ↓ (if not exists)
4. Hash password using bcrypt (10 salt rounds)
   ↓
5. Create user record in database with:
   - fullName
   - email
   - hashed password
   - role: "TRAVELER" (default)
   - emailVerified: false
   ↓
6. Generate verification token (JWT)
   ↓
7. Store verification token in user record
   ↓
8. Send verification email with link
   ↓
9. Generate access and refresh tokens
   ↓
10. Set tokens in HTTP-only cookies
    ↓
11. Return success response
```

### Database Operations

**Primary Table:** `Bb_user`

**Prisma Schema:** `/src/prisma/schema.prisma`

**Database Client:** `/src/config/database.ts`

**Email Service:** `/src/services/email.service.ts`

**Token Service:** `/src/utils/token.helper.ts`

#### Create User Record

```sql
INSERT INTO "Bb_user" (
  id,
  "fullName",
  email,
  password,
  role,
  "emailVerified",
  "createdAt",
  "updatedAt"
) VALUES (
  GENERATED_CUID,
  'John Doe',
  'john.doe@example.com',
  '$2a$10$hashedPasswordHere',
  'TRAVELER',
  false,
  NOW(),
  NOW()
);
```

#### Update User with Verification Token

```sql
UPDATE "Bb_user"
SET "verifyToken" = 'jwt_token_here'
WHERE id = 'user_id_here';
```

#### Update User with Refresh Token

```sql
UPDATE "Bb_user"
SET "refreshToken" = 'jwt_refresh_token_here'
WHERE id = 'user_id_here';
```

### Database State After Registration

```typescript
// User Record Created
{
  id: "clz1a2b3c4d5e6f7g8h9i0j1", // Auto-generated CUID
  fullName: "John Doe",
  email: "john.doe@example.com",
  password: "$2a$10$...", // Hashed password
  emailVerified: false,
  role: "TRAVELER",
  phone: null,
  profileImageId: null,
  refreshToken: "eyJhbGciOiJIUzI1NiIs...", // JWT token
  verifyToken: "eyJhbGciOiJIUzI1NiIs...", // JWT verification token
  createdAt: "2025-12-07T10:30:00Z",
  updatedAt: "2025-12-07T10:30:00Z",
  isDeleted: false
}
```

### Email Sent

**To:** user's email
**Subject:** For email/account verification with BatioBhai
**Content:** Verification link with verification token embedded

### Cookies Set

```
accesstoken: "Bearer eyJhbGciOiJIUzI1NiIs..." (httpOnly, 3 days expiry)
refreshtoken: "Bearer eyJhbGciOiJIUzI1NiIs..." (httpOnly, 10 days expiry)
```

### Postman Testing

```
Method: POST
URL: http://localhost:3000/api/v1/user/register
Headers:
  Content-Type: application/json
Body:
{
  "fullName": "Test User",
  "email": "test@example.com",
  "password": "password123"
}

Expected Files Structure:
- /src/routes/user.routes.ts (handles routing)
- /src/controllers/user.controller.ts (handles logic)
- /src/services/user.service.ts (handles business logic)
- /src/validators/user.validator.ts (Zod schemas)
```

---

## Login

### Endpoint

```
POST /api/v1/user/login
```

### Description

Authenticates a user using email and password. Returns access and refresh tokens that are stored in HTTP-only cookies.

### Request Headers

```
Content-Type: application/json
```

### Request Body

```json
{
  "email": "john.doe@example.com",
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
  "message": "Email is required",
  "errors": ["Email validation failed"]
}
```

### Data Flow

```
1. User submits login form
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
7. Update user record with new refresh token
   ↓
8. Set tokens in HTTP-only cookies
   ↓
9. Return success response
```

### Database Operations

**Primary Table:** `Bb_user`

#### Find User by Email

```sql
SELECT id, email, password, role, "emailVerified"
FROM "Bb_user"
WHERE email = 'john.doe@example.com';
```

#### Update Refresh Token

```sql
UPDATE "Bb_user"
SET "refreshToken" = 'new_jwt_refresh_token'
WHERE id = 'user_id';
```

### Database State During Login

```typescript
// Before Login
{
  refreshToken: "old_token_or_null",
  // ... other fields
}

// After Login
{
  refreshToken: "eyJhbGciOiJIUzI1NiIs...", // Updated
  // ... other fields
}
```

### Cookies Set

```
accesstoken: Bearer eyJhbGciOiJIUzI1NiIs... (3 days)
refreshtoken: Bearer eyJhbGciOiJIUzI1NiIs... (10 days)
```

### Postman Testing

```
Method: POST
URL: http://localhost:3000/api/v1/user/login
Headers:
  Content-Type: application/json
Body:
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

---

## Account Verification

### Endpoint

```
POST /api/v1/user/verify-account
```

### Description

Verifies a user's email account using the verification token sent during registration. User must be authenticated (have valid access token).

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

### Request Body Validation

| Field       | Type   | Required | Rules            | Notes                         |
| ----------- | ------ | -------- | ---------------- | ----------------------------- |
| verifyToken | string | Yes      | Valid JWT format | Token from verification email |

### Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "statusCode": 200,
  "data": null,
  "message": "User account verified successfully"
}
```

### Error Responses

#### 1. User Already Verified

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "statusCode": 400,
  "data": null,
  "message": "User is already verified"
}
```

#### 2. Missing Verification Token

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "statusCode": 400,
  "data": null,
  "message": "No verify token is provided"
}
```

#### 3. Invalid/Expired Token

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "statusCode": 400,
  "data": null,
  "message": "Invalid verification token, token is expired or invalid"
}
```

#### 4. Token Payload Mismatch

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "statusCode": 400,
  "data": null,
  "message": "Invalid verification token, token payload does not match"
}
```

#### 5. Unauthorized - Missing Token

**Status Code:** `401 Unauthorized`

```json
{
  "success": false,
  "statusCode": 401,
  "data": null,
  "message": "Unauthorized - Access token is required"
}
```

### Data Flow

```
1. User submits verification token
   ↓
2. Verify user authentication via middleware
   ↓ (if not authenticated)
   └─→ Return error: "Unauthorized"
   ↓ (if authenticated)
3. Check if user is already verified
   ↓ (if verified)
   └─→ Return error: "User already verified"
   ↓ (if not verified)
4. Validate verification token format
   ↓ (if invalid)
   └─→ Return validation error
   ↓ (if valid)
5. Verify JWT signature using VERIFY_TOKEN_SECRET
   ↓ (if invalid/expired)
   └─→ Return error: "Invalid or expired token"
   ↓ (if valid)
6. Extract email from token payload
   ↓
7. Compare token email with user email
   ↓ (if mismatch)
   └─→ Return error: "Token payload does not match"
   ↓ (if match)
8. Update user record:
   - Set emailVerified = true
   - Clear verifyToken = null
   ↓
9. Return success response
```

### Database Operations

**Primary Table:** `Bb_user`

#### Check if User Verified

```sql
SELECT id, "emailVerified", "verifyToken"
FROM "Bb_user"
WHERE id = 'user_id' AND "emailVerified" = true;
```

#### Update User Verification Status

```sql
UPDATE "Bb_user"
SET "emailVerified" = true,
    "verifyToken" = null
WHERE id = 'user_id';
```

### Database State After Verification

```typescript
// Before Verification
{
  emailVerified: false,
  verifyToken: "eyJhbGciOiJIUzI1NiIs...",
  // ... other fields
}

// After Verification
{
  emailVerified: true,
  verifyToken: null,
  // ... other fields
}
```

### Postman Testing

```
Method: POST
URL: http://localhost:3000/api/v1/user/verify-account
Headers:
  Authorization: Bearer <access_token>
  Content-Type: application/json
  Cookie: accesstoken=<token>
Body:
{
  "verifyToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## Resend Verification Link

### Endpoint

```
POST /api/v1/user/send-verification-link
```

### Description

Resends the verification email to the user's registered email address. User must be authenticated but not yet verified.

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

(Empty body - all information comes from authenticated user)

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

### Error Responses

#### 1. User Already Verified

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "statusCode": 400,
  "data": null,
  "message": "User account is already verified"
}
```

#### 2. User Not Found

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "statusCode": 400,
  "data": null,
  "message": "No user is found kindly register"
}
```

#### 3. Email Sending Failed

**Status Code:** `500 Internal Server Error`

```json
{
  "success": false,
  "statusCode": 500,
  "data": null,
  "message": "Internal server error while sending verification email"
}
```

#### 4. Unauthorized

**Status Code:** `401 Unauthorized`

```json
{
  "success": false,
  "statusCode": 401,
  "data": null,
  "message": "Unauthorized - Access token is required"
}
```

### Data Flow

```
1. User requests verification link resend
   ↓
2. Verify user authentication via middleware
   ↓ (if not authenticated)
   └─→ Return error: "Unauthorized"
   ↓ (if authenticated)
3. Check if user is already verified
   ↓ (if verified)
   └─→ Return error: "User already verified"
   ↓ (if not verified)
4. Retrieve user data from database
   ↓ (if not found)
   └─→ Return error: "User not found"
   ↓ (if found)
5. Generate new verification token (JWT)
   ↓
6. Update user record with new verification token
   ↓
7. Send verification email with new token
   ↓ (if email sending fails)
   └─→ Return error: "Failed to send email"
   ↓ (if successful)
8. Return success response
```

### Database Operations

**Primary Table:** `Bb_user`

#### Check User Verification Status

```sql
SELECT id, "fullName", email, "emailVerified"
FROM "Bb_user"
WHERE id = 'user_id' AND "emailVerified" = true;
```

#### Update with New Verification Token

```sql
UPDATE "Bb_user"
SET "verifyToken" = 'new_jwt_verification_token'
WHERE id = 'user_id';
```

### Database State After Resend

```typescript
// Before Resend
{
  verifyToken: "old_token",
  // ... other fields
}

// After Resend
{
  verifyToken: "eyJhbGciOiJIUzI1NiIs..." // New token
  // ... other fields
}
```

### Email Resent

**To:** user's email
**Subject:** For email/account verification with BatioBhai
**Content:** New verification link with new token

### Postman Testing

```
Method: POST
URL: http://localhost:3000/api/v1/user/send-verification-link
Headers:
  Authorization: Bearer <access_token>
  Content-Type: application/json
  Cookie: accesstoken=<token>
Body:
{}
```

---

## Authentication Flow Summary

```
┌─────────────────────────────────────────────────────────────┐
│                    USER JOURNEY                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. REGISTRATION                                            │
│     POST /user/register                                     │
│     └─→ Create user, generate tokens, send email           │
│     └─→ Cookies set: accesstoken, refreshtoken             │
│                                                             │
│  2. EMAIL VERIFICATION                                      │
│     POST /user/verify-account                              │
│     └─→ Verify with token from email                       │
│     └─→ Set emailVerified = true                           │
│                                                             │
│  3. LOGIN                                                   │
│     POST /user/login                                        │
│     └─→ Authenticate with email/password                   │
│     └─→ New tokens generated                               │
│     └─→ Cookies set: accesstoken, refreshtoken             │
│                                                             │
│  4. PROTECTED REQUESTS                                      │
│     Any request requiring auth                              │
│     └─→ accesstoken from cookies used                      │
│     └─→ User info extracted from token                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Summary Table

| Operation      | Endpoint                  | Method | Auth Required | Validation                |
| -------------- | ------------------------- | ------ | ------------- | ------------------------- |
| Register       | `/register`               | POST   | No            | Email, Password, FullName |
| Login          | `/login`                  | POST   | No            | Email, Password           |
| Verify Account | `/verify-account`         | POST   | Yes           | Verification Token        |
| Resend Link    | `/send-verification-link` | POST   | Yes           | None                      |

---

## Common Issues & Solutions

### Issue 1: "User email already exist"

**Cause:** Email is already registered
**Solution:** Use a different email or login with existing account

### Issue 2: "Password is too short"

**Cause:** Password less than 6 characters
**Solution:** Use password with minimum 6 characters

### Issue 3: "Invalid verification token"

**Cause:** Token expired or tampered with
**Solution:** Request new verification link via resend endpoint

### Issue 4: "Unauthorized"

**Cause:** Missing or invalid access token
**Solution:** Ensure accesstoken cookie is sent with request

---

## Token Details

### Access Token

- **Type:** JWT (JSON Web Token)
- **Expiry:** 3 days (259200 seconds)
- **Storage:** HTTP-only Cookie (secure in production)
- **Contains:** userId, email, issued at (iat), expiry (exp)

### Refresh Token

- **Type:** JWT
- **Expiry:** 10 days (864000 seconds)
- **Storage:** HTTP-only Cookie + Database
- **Purpose:** Generate new access token when old one expires

### Verification Token

- **Type:** JWT
- **Expiry:** Depends on configuration (usually 24 hours)
- **Contains:** User email
- **Used for:** Email verification only
