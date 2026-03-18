# Admin API

**Base URL:** `/api/v1/admin`

## Middleware

| Middleware | Used For | Requirements |
|-----------|----------|-------------|
| `authMiddleware` | Login-only routes (verify, get-profile) | Valid JWT token |
| `adminMiddlewareOperation` | Privileged actions (approve, list, delete) | JWT + role in `[ADMIN, ROOTADMIN]` + email verified + `roleStatus = APPROVED` |
| `adminMiddlewareSelfOperation` | Self profile update | JWT + role in `[ADMIN, ROOTADMIN]` |

---

## Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | No | Register a sub-admin account |
| POST | `/login` | No | Admin login |
| DELETE | `/logout` | Yes | Logout admin account |
| POST | `/verify-account` | Yes | Verify account with email token |
| POST | `/send-verification-link` | Yes | Re-send verification email |
| POST | `/approve-agent` | Admin operation | Approve a pending agent |
| POST | `/approve-pkg` | Admin operation | Approve a pending package |
| POST | `/reject-pkg` | Admin operation | Reject a pending package |
| GET | `/get-all-agent` | Admin operation | List all agents |
| GET | `/get-all-user` | Admin operation | List all users |
| GET | `/get-all-pkg` | Admin operation | List all packages |
| POST | `/get-agent-pkg` | Admin operation | List packages of a specific agent |
| GET | `/get-all-payments` | Admin operation | List all payments |
| GET | `/get-profile` | Yes | Get current admin profile |
| POST | `/update-profile` | Admin self operation | Update own profile |
| DELETE | `/delete-acc` | Admin operation | Delete account |

---

## POST `/register`

Register a new sub-admin account. Account will be in `PENDING` status until approved by root admin.

### Request Body

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `fullName` | string | Yes | Non-empty |
| `email` | string | Yes | Valid email format |
| `password` | string | Yes | Min 6 characters |

```json
{
  "fullName": "Admin User",
  "email": "admin@example.com",
  "password": "secret123"
}
```

### Success Response

**Status:** `200 OK`

```json
{
  "statusCode": 200,
  "data": {
    "id": "cuid_string",
    "email": "admin@example.com",
    "fullName": "Admin User",
    "emailVerified": false,
    "role": "ADMIN",
    "roleStatus": "PENDING",
    "phone": null,
    "createdAt": "2026-03-01T00:00:00.000Z",
    "profileImage": { "imageUrl": null },
    "address": []
  },
  "message": "User registerd success fully kindly verify your email"
}
```

### Side Effects

- Sets authentication cookies
- Sends verification email

### Error Responses

| Status | Condition |
|--------|-----------|
| 400 | Email already exists |

---

## POST `/login`

Login as admin.

### Request Body

| Field | Type | Required |
|-------|------|----------|
| `email` | string | Yes |
| `password` | string | Yes |

### Success Response

**Status:** `200 OK`

```json
{
  "statusCode": 200,
  "data": {
    "id": "cuid_string",
    "fullName": "Admin User",
    "email": "admin@example.com",
    "phone": null,
    "role": "ADMIN",
    "roleStatus": "APPROVED",
    "emailVerified": true,
    "createdAt": "...",
    "updatedAt": "...",
    "profileImage": { "...": "..." },
    "address": { "...": "..." }
  },
  "message": "User loggedin successfully"
}
```

### Side Effects

- Sets authentication cookies

---

## DELETE `/logout`

Logout admin. Same as user logout.

---

## POST `/verify-account`

Verify email with token. Same as user verify-account.

---

## POST `/send-verification-link`

Re-send verification email. Same as user send-verification-link.

---

## POST `/approve-agent`

Approve a pending agent account.

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Agent's user ID |

```json
{
  "id": "agent_user_cuid"
}
```

### Success Response

**Status:** `200 OK`

```json
{
  "statusCode": 200,
  "data": null,
  "message": "Agent account verifye successfully"
}
```

### Side Effects

- Sets agent's `roleStatus` to `APPROVED`
- Sends approval notification email

### Error Responses

| Status | Condition |
|--------|-----------|
| 400 | Agent not found |
| 400 | Agent email not verified |

---

## POST `/approve-pkg`

Approve a pending travel package.

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `packageId` | string | Yes | Package ID to approve |

```json
{
  "packageId": "package_cuid"
}
```

### Success Response

**Status:** `200 OK`

```json
{
  "statusCode": 200,
  "data": null,
  "message": "Travel package approved successfully"
}
```

### Error Responses

| Status | Condition |
|--------|-----------|
| 404 | Package not found |
| 400 | Package already approved |

---

## POST `/reject-pkg`

Reject a pending travel package.

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `packageId` | string | Yes | Package ID to reject |

```json
{
  "packageId": "package_cuid"
}
```

### Success Response

**Status:** `200 OK`

```json
{
  "statusCode": 200,
  "data": null,
  "message": "Travel package rejected successfully"
}
```

### Error Responses

| Status | Condition |
|--------|-----------|
| 404 | Package not found |
| 400 | Package already rejected |

---

## GET `/get-all-agent`

List all users with `role = AGENT`.

### Success Response

**Status:** `200 OK`

```json
{
  "statusCode": 200,
  "data": [
    {
      "id": "cuid_string",
      "fullName": "Agent Name",
      "email": "agent@example.com",
      "phone": "9876543210",
      "role": "AGENT",
      "roleStatus": "APPROVED",
      "emailVerified": true,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "message": "Successfully get all the agents"
}
```

---

## GET `/get-all-user`

List all users with `role = TRAVELER`.

### Success Response

**Status:** `200 OK`

```json
{
  "statusCode": 200,
  "data": [
    {
      "id": "cuid_string",
      "fullName": "User Name",
      "email": "user@example.com",
      "role": "TRAVELER",
      "roleStatus": "APPROVED",
      "emailVerified": true,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "message": "Successfully get all the users"
}
```

---

## GET `/get-all-pkg`

List all travel packages.

### Success Response

**Status:** `200 OK`

```json
{
  "statusCode": 200,
  "data": [
    {
      "id": "cuid_string",
      "title": "Package Title",
      "destination": "Goa",
      "pricePerPerson": 5000,
      "packageApprovedStatus": "APPROVED",
      "isBookingActive": true,
      "createdAt": "...",
      "...": "full package object"
    }
  ],
  "message": "Successfully get all the users"
}
```

---

## POST `/get-agent-pkg`

Get all packages for a specific agent.

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Agent's user ID |

```json
{
  "id": "agent_user_cuid"
}
```

### Success Response

**Status:** `200 OK`

```json
{
  "statusCode": 200,
  "data": [ ... ],
  "message": "Successfully get all the agent packages"
}
```

---

## GET `/get-all-payments`

List all payment records.

### Success Response

**Status:** `200 OK`

```json
{
  "statusCode": 200,
  "data": [
    {
      "id": "cuid_string",
      "amount": 10000,
      "status": "SUCCESS",
      "razorpayOrderId": "order_xxx",
      "razorpayPaymentId": "pay_xxx",
      "createdAt": "..."
    }
  ],
  "message": "Successfully get all the payments"
}
```

---

## GET `/get-profile`

Get current admin's profile.

### Success Response

**Status:** `200 OK`

```json
{
  "statusCode": 200,
  "data": {
    "id": "cuid_string",
    "fullName": "Admin User",
    "email": "admin@example.com",
    "phone": null,
    "role": "ADMIN",
    "roleStatus": "APPROVED",
    "emailVerified": true,
    "profileImage": { "imageUrl": "..." },
    "address": [ ... ],
    "createdAt": "...",
    "updatedAt": "..."
  },
  "message": "successfully get the root admin profile"
}
```

---

## POST `/update-profile`

Update own admin profile. Same request body format as user update-profile.

### Request Body

| Field | Type | Required |
|-------|------|----------|
| `fullName` | string | No |
| `phone` | string | No |
| `profileImageUrl` | string | No |
| `profileFileId` | string | No |
| `addresses` | array | No |

### Success Response

**Status:** `200 OK`

```json
{
  "statusCode": 200,
  "data": { "...updated profile" },
  "message": "User profile updated successfully"
}
```

---

## DELETE `/delete-acc`

Soft-delete admin account. Same behavior as user delete-acc.

### Success Response

**Status:** `200 OK`

```json
{
  "statusCode": 200,
  "data": null,
  "message": "Account deleted successfully"
}
```
