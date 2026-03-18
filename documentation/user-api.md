# User API

**Base URL:** `/api/v1/user`

All authenticated endpoints use `authMiddleware` which requires a valid JWT in the `accesstoken` cookie.

---

## Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | No | Register a traveler account |
| POST | `/login` | No | Login user account |
| DELETE | `/logout` | Yes | Logout current account |
| POST | `/verify-account` | Yes | Verify account using email token |
| POST | `/send-verification-link` | Yes | Re-send account verification email |
| GET | `/get-profile` | Yes | Get current user profile |
| POST | `/update-profile` | Yes | Update user profile and addresses |
| DELETE | `/delete-acc` | Yes | Delete current account |
| GET | `/get-all-bookings` | Yes | Get all bookings made by current user |
| POST | `/platform-review` | Yes | Add a platform review |
| POST | `/delete-platform-review` | Yes | Delete a platform review |
| POST | `/agent-review` | Yes | Add an agent review |
| POST | `/delete-agent-review` | Yes | Delete an agent review |
| POST | `/package-review` | Yes | Add a package review |
| POST | `/delete-package-review` | Yes | Delete a package review |

---

## POST `/register`

Register a new traveler account.

### Request Body

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `fullName` | string | Yes | Non-empty |
| `email` | string | Yes | Valid email format |
| `password` | string | Yes | Minimum 6 characters |

```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

### Success Response

**Status:** `200 OK`

```json
{
  "statusCode": 200,
  "data": null,
  "message": "User registerd success fully kindly verify your email"
}
```

### Side Effects

- Sets `accesstoken` cookie (httpOnly, 3 days expiry)
- Sets `refreshtoken` cookie (httpOnly, 10 days expiry)
- Sends verification email to registered address

### Error Responses

| Status | Condition |
|--------|-----------|
| 400 | Email already exists |
| 400 | Invalid request body |

---

## POST `/login`

Login an existing user account.

### Request Body

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `email` | string | Yes | Valid email format |
| `password` | string | Yes | Minimum 6 characters |

```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

### Success Response

**Status:** `200 OK`

```json
{
  "statusCode": 200,
  "data": null,
  "message": "User loggedin successfully"
}
```

### Side Effects

- Sets `accesstoken` and `refreshtoken` cookies

### Error Responses

| Status | Condition |
|--------|-----------|
| 400 | User not found |
| 400 | Password mismatch |
| 400 | Not registered as normal user (wrong role) |

---

## DELETE `/logout`

Logout the currently authenticated user.

### Request Body

None

### Success Response

**Status:** `200 OK`

```json
{
  "statusCode": 200,
  "data": null,
  "message": "User logged out successfully"
}
```

### Side Effects

- Clears `accesstoken` and `refreshtoken` cookies
- Nullifies `refreshToken` in database

---

## POST `/verify-account`

Verify user email account using the token received via email.

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `verifyToken` | string | Yes | Token received in verification email |

```json
{
  "verifyToken": "token-from-email"
}
```

### Success Response

**Status:** `200 OK`

```json
{
  "statusCode": 200,
  "data": "User account verifyed successfully",
  "message": "User account verifyed successfully"
}
```

### Error Responses

| Status | Condition |
|--------|-----------|
| 400 | Account already verified |
| 400 | Invalid or expired token |
| 400 | Token payload mismatch |
| 404 | User not found |

---

## POST `/send-verification-link`

Re-send the account verification email.

### Request Body

None (uses authenticated user's ID)

### Success Response

**Status:** `200 OK`

```json
{
  "statusCode": 200,
  "data": "verification mail is send successfully",
  "message": "verification mail is send successfully"
}
```

### Error Responses

| Status | Condition |
|--------|-----------|
| 400 | Account already verified |
| 400 | User not found |

---

## GET `/get-profile`

Get the current user's full profile.

### Request Body

None

### Success Response

**Status:** `200 OK`

```json
{
  "statusCode": 200,
  "data": {
    "id": "cuid_string",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+919999999999",
    "role": "TRAVELER",
    "roleStatus": "APPROVED",
    "emailVerified": true,
    "profileImage": {
      "id": "cuid_string",
      "imageUrl": "https://cloudinary.com/...",
      "fileId": "file_123",
      "createdAt": "2026-03-01T00:00:00.000Z"
    },
    "address": [
      {
        "id": "cuid_string",
        "addressType": "CURRENT",
        "city": "Kolkata",
        "country": "India",
        "district": "Kolkata",
        "latitude": "22.5726",
        "longitude": "88.3639",
        "pin": "700001",
        "state": "West Bengal"
      }
    ],
    "createdAt": "2026-03-01T00:00:00.000Z",
    "updatedAt": "2026-03-10T00:00:00.000Z"
  },
  "message": "Successfully get the user data"
}
```

---

## POST `/update-profile`

Update user profile fields and/or addresses. All fields are optional.

### Request Body

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `fullName` | string | No | 2-100 characters |
| `phone` | string | No | 10-15 digits |
| `profileImageUrl` | string | No | Valid URL |
| `profileFileId` | string | No | Cloudinary file ID |
| `addresses` | array | No | Array of address objects |

**Address Object:**

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `id` | string | No | Pass existing address ID to update; omit for new |
| `addressType` | enum | Yes | `PERMANENT`, `CURRENT`, or `TRAVEL` |
| `country` | string | Yes | |
| `state` | string | Yes | |
| `district` | string | Yes | |
| `pin` | string | Yes | Minimum 6 characters |
| `city` | string | Yes | |
| `longitude` | string | No | |
| `latitude` | string | No | |

```json
{
  "fullName": "John Doe",
  "phone": "9999999999",
  "profileImageUrl": "https://cloudinary.com/...",
  "profileFileId": "file_123",
  "addresses": [
    {
      "id": "existing-address-id",
      "addressType": "CURRENT",
      "country": "India",
      "state": "West Bengal",
      "district": "Kolkata",
      "pin": "700001",
      "city": "Kolkata",
      "longitude": "88.3639",
      "latitude": "22.5726"
    }
  ]
}
```

### Success Response

**Status:** `200 OK`

```json
{
  "statusCode": 200,
  "data": {
    "id": "cuid_string",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "9999999999",
    "role": "TRAVELER",
    "roleStatus": "APPROVED",
    "profileImage": {
      "id": "cuid_string",
      "imageUrl": "https://cloudinary.com/...",
      "fileId": "file_123",
      "createdAt": "2026-03-01T00:00:00.000Z"
    },
    "address": [ ... ],
    "createdAt": "2026-03-01T00:00:00.000Z",
    "updatedAt": "2026-03-10T00:00:00.000Z"
  },
  "message": "User profile updated successfully"
}
```

### Error Responses

| Status | Condition |
|--------|-----------|
| 400 | Invalid request body |
| 400 | Phone number already in use |
| 404 | User not found |

---

## DELETE `/delete-acc`

Soft-delete the current user's account.

### Request Body

None

### Success Response

**Status:** `200 OK`

```json
{
  "statusCode": 200,
  "data": null,
  "message": "Account deleted successfully"
}
```

### Side Effects

- Sets `isDeleted = true` in database
- Clears authentication cookies
- Nullifies refresh token

---

## GET `/get-all-bookings`

Get all bookings made by the current user.

### Request Body

None

### Success Response

**Status:** `200 OK`

```json
{
  "statusCode": 200,
  "data": {
    "allBookings": [
      {
        "id": "cuid_string",
        "bookingCode": "BK-1234567890",
        "packageId": "cuid_string",
        "numberOfTravelers": 2,
        "status": "CONFIRMED",
        "paymentStatus": "SUCCESS",
        "totalAmount": 10000,
        "baseAmount": 9000,
        "taxAmount": 1620,
        "discountAmount": 900,
        "createdAt": "2026-03-15T00:00:00.000Z",
        "travelPackage": {
          "id": "cuid_string",
          "title": "Goa Beach Package",
          "description": "5 days in Goa",
          "destination": "Goa",
          "durationDays": 5,
          "startDate": "2026-04-01T00:00:00.000Z",
          "endDate": "2026-04-05T00:00:00.000Z",
          "PackageBannerImage": {
            "imageUrl": "https://...",
            "fileId": "file_123"
          },
          "packagesImages": [
            { "imageUrl": "https://...", "fileId": "file_456" }
          ],
          "agent": {
            "id": "cuid_string",
            "companyName": "Travel Co.",
            "user": {
              "fullName": "Agent Name",
              "profileImage": {
                "imageUrl": "https://...",
                "fileId": "file_789"
              }
            }
          }
        }
      }
    ]
  },
  "message": "Bookings fetched successfully"
}
```

### Booking Status Values

| Status | Description |
|--------|-------------|
| `PENDING` | Booking created, awaiting payment |
| `HOLD` | Payment in progress |
| `CONFIRMED` | Payment verified, booking confirmed |
| `CANCELLED` | Booking cancelled |
| `COMPLETED` | Trip completed |
| `REFUND_PENDING` | Refund in progress |
| `REFUNDED` | Refund completed |

---

## POST `/platform-review`

Add a review for the platform.

### Request Body

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `rating` | number | Yes | 1-5 |
| `comment` | string | Yes | Non-empty |

```json
{
  "rating": 5,
  "comment": "Great platform for booking travel packages!"
}
```

### Success Response

**Status:** `200 OK`

```json
{
  "statusCode": 200,
  "data": {
    "id": "cuid_string",
    "rating": 5,
    "comment": "Great platform for booking travel packages!"
  },
  "message": "Review successfull"
}
```

---

## POST `/agent-review`

Add a review for a specific agent.

### Request Body

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `agentId` | string | Yes | Valid agent profile ID |
| `rating` | number | Yes | 1-5 |
| `comment` | string | Yes | Non-empty |

```json
{
  "agentId": "agent_profile_cuid",
  "rating": 4,
  "comment": "Very helpful agent!"
}
```

### Success Response

**Status:** `200 OK`

```json
{
  "statusCode": 200,
  "data": {
    "id": "cuid_string",
    "rating": 4,
    "comment": "Very helpful agent!"
  },
  "message": "Review successfull"
}
```

### Error Responses

| Status | Condition |
|--------|-----------|
| 400 | Invalid agent profile ID |

---

## POST `/package-review`

Add a review for a specific package.

### Request Body

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `packageId` | string | Yes | Valid package ID |
| `rating` | number | Yes | 1-5 |
| `comment` | string | Yes | Non-empty |

```json
{
  "packageId": "package_cuid",
  "rating": 5,
  "comment": "Amazing trip!"
}
```

### Success Response

**Status:** `200 OK`

```json
{
  "statusCode": 200,
  "data": {
    "id": "cuid_string",
    "rating": 5,
    "comment": "Amazing trip!"
  },
  "message": "Review successfull"
}
```

---

## POST `/delete-platform-review`

Delete a platform review by ID.

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Review ID to delete |

```json
{
  "id": "review_cuid"
}
```

### Success Response

**Status:** `200 OK`

```json
{
  "statusCode": 200,
  "data": null,
  "message": "Successfuly delete the review"
}
```

### Error Responses

| Status | Condition |
|--------|-----------|
| 400 | Review not found |
| 400 | Review does not belong to current user |

---

## POST `/delete-agent-review`

Delete an agent review by ID. Same request/response format as `/delete-platform-review`.

---

## POST `/delete-package-review`

Delete a package review by ID. Same request/response format as `/delete-platform-review`.
