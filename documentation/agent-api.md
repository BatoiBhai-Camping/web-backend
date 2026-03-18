# Agent API

**Base URL:** `/api/v1/agent`

Agent-protected routes use `agentMiddleware` which requires:
- Valid JWT token
- `role = AGENT`
- `emailVerified = true`
- `roleStatus = APPROVED`
- Sets `req.agentId` from agent profile

Auth-only routes (verify/send-verification) use `authMiddleware`.

---

## Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | No | Register an agent account with profile |
| POST | `/login` | No | Login agent account |
| DELETE | `/logout` | Yes | Logout agent account |
| POST | `/verify-account` | Yes | Verify account with email token |
| POST | `/send-verification-link` | Yes | Re-send verification email |
| POST | `/publish-package` | Agent only | Publish a new travel package |
| POST | `/update-package` | Agent only | Update an existing package |
| GET | `/get-all-packages` | Agent only | Get all packages by current agent |
| GET | `/get-all-pkgs` | Agent only | Alias for `/get-all-packages` |
| GET | `/get-all-bookings` | Agent only | Get all bookings for agent's packages |
| POST | `/get-package-bookings` | Agent only | Get bookings for a specific package |
| GET | `/get-profile` | Agent only | Get full agent profile |
| POST | `/update-profile` | Agent only | Update agent profile |
| DELETE | `/delete-acc` | Agent only | Delete agent account |

---

## POST `/register`

Register a new agent account with full profile, documents, and address.

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `fullName` | string | Yes | Agent's full name |
| `email` | string | Yes | Valid email address |
| `password` | string | Yes | Min 6 characters |
| `phone` | string | Yes | Phone number |
| `profileImageUrl` | string | Yes | Profile image URL (from asset upload) |
| `profileImageFileId` | string | Yes | Cloudinary file ID |
| `companyName` | string | Yes | Travel company name |
| `description` | string | Yes | Agent/company description |
| `aadharNumber` | string | Yes | Aadhar card number |
| `panNumber` | string | No | PAN card number |
| `gstNumber` | string | No | GST number |
| `bannerImageUrl` | string | Yes | Banner image URL |
| `bannerImageFileId` | string | Yes | Banner Cloudinary file ID |
| `addressType` | enum | Yes | `PERMANENT`, `CURRENT`, or `TRAVEL` |
| `country` | string | Yes | Country |
| `state` | string | Yes | State |
| `district` | string | Yes | District |
| `pin` | string | Yes | PIN code |
| `city` | string | Yes | City |
| `longitude` | string | No | Longitude coordinate |
| `latitude` | string | No | Latitude coordinate |
| `aadharDocumentUrl` | string | Yes | Aadhar document URL |
| `aadharDocumentFileId` | string | Yes | Aadhar document file ID |
| `panDocumentUrl` | string | No | PAN document URL |
| `panDocumentFileId` | string | No | PAN document file ID |

```json
{
  "fullName": "Travel Agent",
  "email": "agent@example.com",
  "password": "secret123",
  "phone": "9876543210",
  "profileImageUrl": "https://cloudinary.com/profile.jpg",
  "profileImageFileId": "profile_file_123",
  "companyName": "Best Travels",
  "description": "Premium travel packages across India",
  "aadharNumber": "123456789012",
  "panNumber": "ABCDE1234F",
  "gstNumber": "22AAAAA0000A1Z5",
  "bannerImageUrl": "https://cloudinary.com/banner.jpg",
  "bannerImageFileId": "banner_file_123",
  "addressType": "PERMANENT",
  "country": "India",
  "state": "West Bengal",
  "district": "Kolkata",
  "pin": "700001",
  "city": "Kolkata",
  "longitude": "88.3639",
  "latitude": "22.5726",
  "aadharDocumentUrl": "https://cloudinary.com/aadhar.pdf",
  "aadharDocumentFileId": "aadhar_file_123",
  "panDocumentUrl": "https://cloudinary.com/pan.pdf",
  "panDocumentFileId": "pan_file_123"
}
```

### Success Response

**Status:** `201 Created`

```json
{
  "success": true,
  "message": "Agent account created successfully. Please verify your email."
}
```

### Side Effects

- Creates user with `role = AGENT`, `roleStatus = PENDING`
- Creates agent profile, address, profile image, banner image, and documents
- Sets authentication cookies
- Sends verification email

### Error Responses

| Status | Condition |
|--------|-----------|
| 400 | Email already exists |
| 400 | Invalid request body |

---

## POST `/login`

Login an existing agent account.

### Request Body

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `email` | string | Yes | Valid email format |
| `password` | string | Yes | Min 6 characters |

```json
{
  "email": "agent@example.com",
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
| 400 | Not registered as agent |
| 400 | Password mismatch |

---

## DELETE `/logout`

Logout the current agent. Same behavior as user logout.

### Success Response

**Status:** `200 OK`

```json
{
  "statusCode": 200,
  "data": null,
  "message": "User logged out successfully"
}
```

---

## POST `/verify-account`

Verify email using token. Same as user verify-account endpoint.

### Request Body

```json
{
  "verifyToken": "token-from-email"
}
```

---

## POST `/send-verification-link`

Re-send verification email. Same as user send-verification-link endpoint.

---

## POST `/publish-package`

Publish a new travel package with itinerary details.

See [package-payloads.md](package-payloads.md) for the full payload reference.

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Package title |
| `description` | string | Yes | Package description |
| `pricePerPerson` | number | Yes | Price per person |
| `totalSeats` | number | Yes | Total available seats (min 1) |
| `discountAmount` | number | No | Fixed discount per person |
| `discountPercentage` | number | No | Percentage discount |
| `withTax` | boolean | No | Whether tax applies |
| `taxPercentage` | number | No | Tax percentage |
| `destination` | string | Yes | Destination location |
| `durationDays` | number | Yes | Trip duration in days (min 1) |
| `startDate` | string (ISO) | No | Trip start date |
| `endDate` | string (ISO) | No | Trip end date |
| `bookingActiveFrom` | string (ISO) | Yes | When bookings open |
| `bookingEndAt` | string (ISO) | Yes | When bookings close |
| `packagePolicies` | string | No | Package policies text |
| `cancellationPolicies` | string | No | Cancellation policies text |
| `bannerImageUrl` | string | Yes | Banner image URL |
| `bannerImageFileId` | string | Yes | Banner file ID |
| `packageImages` | array | No | Additional images |
| `itineraryDays` | array | Yes | Day-by-day itinerary (min 1) |

**Itinerary Day Object:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `dayNumber` | number | Yes | Day sequence number (min 1) |
| `title` | string | Yes | Day title |
| `description` | string | No | Day description |
| `hotelStay` | object | No | Hotel accommodation details |
| `transports` | array | Yes | Transport segments (min 1) |
| `visits` | array | Yes | Places to visit (min 1) |
| `meals` | array | No | Meals included |

**Hotel Stay Object:**

| Field | Type | Required |
|-------|------|----------|
| `hotelName` | string | Yes |
| `checkIn` | string | Yes |
| `checkOut` | string | Yes |
| `address` | string | No |
| `wifi` | boolean | No |
| `tv` | boolean | No |
| `attachWashroom` | boolean | No |
| `acRoom` | boolean | No |
| `kitchen` | boolean | No |

**Transport Object:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `fromLocation` | string | Yes | Start location |
| `toLocation` | string | Yes | End location |
| `mode` | enum | Yes | `BUS`, `TRAIN`, `CAR`, `FLIGHT`, `BOAT`, `WALK`, `OTHER` |
| `startTime` | string | Yes | Departure time |
| `endTime` | string | Yes | Arrival time |

**Visit Object:**

| Field | Type | Required |
|-------|------|----------|
| `name` | string | Yes |
| `address` | string | No |
| `description` | string | No |
| `visitTime` | string | Yes |

**Meal Object:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | enum | Yes | `BREAKFAST`, `LUNCH`, or `DINNER` |
| `mealDescription` | string | No | Meal details |

### Success Response

**Status:** `201 Created`

```json
{
  "success": true,
  "message": "Package published successfully",
  "packageId": "cuid_string"
}
```

### Error Responses

| Status | Condition |
|--------|-----------|
| 400 | Invalid input / validation failure |

---

## POST `/update-package`

Update an existing package owned by the current agent.

See [package-payloads.md](package-payloads.md) for the full payload reference.

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `packageId` | string | Yes | Package ID to update |
| All package fields | various | No | Same as publish, all optional |
| `deleteImageIds` | array | No | Image IDs to remove |
| `deleteItineraryDayIds` | array | No | Itinerary day IDs to remove |

Nested itinerary items can include `id` for updates, or omit `id` for new items. Delete arrays like `deleteTransportIds`, `deleteVisitIds`, `deleteMealIds` are also supported within itinerary days.

### Success Response

**Status:** `200 OK`

```json
{
  "success": true,
  "message": "Package updated successfully",
  "data": {
    "id": "cuid_string",
    "title": "Updated Package",
    "...": "full updated package with all nested data"
  }
}
```

### Error Responses

| Status | Condition |
|--------|-----------|
| 400 | Invalid input |
| 404 | Package not found or access denied |

---

## GET `/get-all-packages`

Get all packages created by the current agent.

### Request Body

None

### Success Response

**Status:** `200 OK`

```json
{
  "statusCode": 200,
  "data": [
    {
      "id": "cuid_string",
      "title": "Package Title",
      "description": "...",
      "pricePerPerson": 5000,
      "totalSeats": 20,
      "availableSeats": 15,
      "destination": "Goa",
      "durationDays": 5,
      "packageApprovedStatus": "APPROVED",
      "isBookingActive": true,
      "PackageBannerImage": { "imageUrl": "...", "fileId": "..." },
      "packagesImages": [ ... ],
      "itinerary": [ ... ],
      "reviews": [ ... ],
      "_count": { "bookings": 5, "reviews": 3 },
      "createdAt": "2026-03-01T00:00:00.000Z",
      "updatedAt": "2026-03-10T00:00:00.000Z"
    }
  ],
  "message": "Successfully get all the packatges"
}
```

---

## GET `/get-all-bookings`

Get all bookings across all packages owned by the current agent.

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
        "userId": "cuid_string",
        "numberOfTravelers": 2,
        "status": "CONFIRMED",
        "paymentStatus": "SUCCESS",
        "totalAmount": 10000,
        "baseAmount": 9000,
        "taxAmount": 1620,
        "discountAmount": 900,
        "refundableAmount": 0,
        "cancellationReason": null,
        "cancelledAt": null,
        "cancelledBy": null,
        "createdAt": "2026-03-15T00:00:00.000Z",
        "travelPackage": {
          "id": "...",
          "title": "...",
          "destination": "...",
          "PackageBannerImage": { "imageUrl": "..." }
        },
        "user": {
          "id": "...",
          "fullName": "...",
          "email": "...",
          "phone": "...",
          "profileImage": { "imageUrl": "..." }
        },
        "payments": [
          {
            "id": "...",
            "amount": 10000,
            "status": "SUCCESS",
            "razorpayOrderId": "order_xxx",
            "razorpayPaymentId": "pay_xxx",
            "createdAt": "..."
          }
        ]
      }
    ]
  },
  "message": "Bookings fetched successfully"
}
```

---

## POST `/get-package-bookings`

Get all bookings for a specific package owned by the current agent.

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Package ID |

```json
{
  "id": "package_cuid"
}
```

### Success Response

**Status:** `200 OK`

```json
{
  "statusCode": 200,
  "data": {
    "travelPackage": {
      "id": "...",
      "title": "...",
      "destination": "...",
      "totalSeats": 20,
      "availableSeats": 15
    },
    "allBookingsOfPackage": [
      {
        "id": "...",
        "bookingCode": "BK-...",
        "numberOfTravelers": 2,
        "status": "CONFIRMED",
        "user": { "fullName": "...", "email": "..." },
        "payments": [ ... ]
      }
    ]
  },
  "message": "Package bookings fetched successfully"
}
```

---

## GET `/get-profile`

Get the full agent profile with company info, documents, reviews, and stats.

### Request Body

None

### Success Response

**Status:** `200 OK`

```json
{
  "statusCode": 200,
  "data": {
    "id": "agent_profile_cuid",
    "userId": "user_cuid",
    "companyName": "Best Travels",
    "description": "Premium travel packages",
    "aadharNumber": "123456789012",
    "panNumber": "ABCDE1234F",
    "gstNumber": "22AAAAA0000A1Z5",
    "user": {
      "id": "user_cuid",
      "fullName": "Agent Name",
      "email": "agent@example.com",
      "phone": "9876543210",
      "roleStatus": "APPROVED",
      "profileImage": {
        "id": "...",
        "imageUrl": "https://...",
        "fileId": "...",
        "createdAt": "..."
      },
      "createdAt": "...",
      "updatedAt": "..."
    },
    "documents": [
      {
        "id": "doc_cuid",
        "documentType": "AADHAR",
        "documentUrl": "https://...",
        "documentFileId": "..."
      }
    ],
    "bannerImage": {
      "id": "img_cuid",
      "imageUrl": "https://...",
      "fileId": "...",
      "createdAt": "..."
    },
    "reviews": [
      {
        "id": "review_cuid",
        "rating": 5,
        "comment": "Great agent!",
        "createdAt": "...",
        "user": {
          "id": "...",
          "fullName": "John Doe",
          "profileImage": { "imageUrl": "..." }
        }
      }
    ],
    "_count": {
      "packages": 10,
      "reviews": 25
    }
  },
  "message": "Agent profile get successfully"
}
```

---

## POST `/update-profile`

Update agent profile fields (user info + agent-specific fields).

### Request Body

**User fields:**

| Field | Type | Required |
|-------|------|----------|
| `fullName` | string | No |
| `phone` | string | No |
| `profileImageUrl` | string | No |
| `profileFileId` | string | No |
| `addresses` | array | No |

**Agent fields:**

| Field | Type | Required |
|-------|------|----------|
| `companyName` | string | No |
| `description` | string | No |
| `aadharNumber` | string | No |
| `panNumber` | string | No |
| `gstNumber` | string | No |
| `bannerImageUrl` | string | No |
| `bannerFileId` | string | No |

### Success Response

**Status:** `200 OK`

```json
{
  "statusCode": 200,
  "data": {
    "id": "agent_profile_cuid",
    "user": { "...user profile data" },
    "documents": [ ... ],
    "bannerImage": { "imageUrl": "...", "fileId": "..." },
    "companyName": "Updated Company",
    "description": "Updated description",
    "_count": { "packages": 10, "reviews": 25 }
  },
  "message": "Profile updated successfully"
}
```

### Error Responses

| Status | Condition |
|--------|-----------|
| 400 | Invalid data / phone already in use |
| 404 | Agent profile not found |

---

## DELETE `/delete-acc`

Soft-delete the agent account. Same behavior as user delete-acc.

### Success Response

**Status:** `200 OK`

```json
{
  "statusCode": 200,
  "data": null,
  "message": "Account deleted successfully"
}
```
