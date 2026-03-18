# Root Admin API

**Base URL:** `/api/v1/root-admin`

All privileged routes are protected by `rootAdminMiddleware` which requires:
- Valid JWT token
- `role = ROOTADMIN`
- `emailVerified = true`
- `roleStatus = APPROVED`
- Email must match the `ROOT_ADMIN_GMAIL` environment variable

---

## Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | No | Register root admin account |
| POST | `/login` | No | Root admin login |
| DELETE | `/logout` | Yes | Logout root admin |
| POST | `/verify-account` | Yes | Verify account with email token |
| POST | `/send-verification-link` | Yes | Re-send verification email |
| POST | `/approve-sub-admin` | Root admin only | Approve a sub-admin |
| POST | `/reject-sub-admin` | Root admin only | Reject a sub-admin |
| POST | `/approve-agent` | Root admin only | Approve an agent |
| POST | `/approve-pkg` | Root admin only | Approve a package |
| POST | `/reject-pkg` | Root admin only | Reject a package |
| GET | `/get-all-agent` | Root admin only | List all agents |
| GET | `/get-all-sub-admin` | Root admin only | List all sub-admins |
| GET | `/get-all-user` | Root admin only | List all travelers |
| GET | `/get-all-pkg` | Root admin only | List all packages |
| POST | `/get-agent-pkg` | Root admin only | List packages of specific agent |
| GET | `/get-all-payments` | Root admin only | List all payments |
| GET | `/get-profile` | Root admin only | Get root admin profile |
| POST | `/update-profile` | Root admin only | Update root admin profile |
| DELETE | `/delete-acc` | Root admin only | Delete root admin account |

---

## POST `/register`

Register a new root admin account. Only one root admin can exist.

### Request Body

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `fullName` | string | Yes | Non-empty |
| `email` | string | Yes | Valid email format |
| `password` | string | Yes | Min 6 characters |

```json
{
  "fullName": "Root Admin",
  "email": "rootadmin@example.com",
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
    "email": "rootadmin@example.com",
    "fullName": "Root Admin",
    "emailVerified": false,
    "role": "ROOTADMIN",
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
| 400 | Root admin already exists |
| 400 | Email already in use |

---

## POST `/login`

Login as root admin.

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
    "fullName": "Root Admin",
    "email": "rootadmin@example.com",
    "phone": null,
    "role": "ROOTADMIN",
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

Logout root admin. Same as user logout.

---

## POST `/verify-account`

Verify email with token. Same as user verify-account.

---

## POST `/send-verification-link`

Re-send verification email. Same as user send-verification-link.

---

## POST `/approve-sub-admin`

Approve a pending sub-admin account.

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Sub-admin's user ID |

```json
{
  "id": "admin_user_cuid"
}
```

### Success Response

**Status:** `200 OK`

```json
{
  "statusCode": 200,
  "data": null,
  "message": "Successfully approved the admin"
}
```

### Error Responses

| Status | Condition |
|--------|-----------|
| 400 | Sub-admin not found |
| 400 | Email not verified |

---

## POST `/reject-sub-admin`

Reject a pending sub-admin account.

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Sub-admin's user ID |

```json
{
  "id": "admin_user_cuid"
}
```

### Success Response

**Status:** `200 OK`

```json
{
  "statusCode": 200,
  "data": null,
  "message": "Successfully Rejected the sub admin"
}
```

### Error Responses

| Status | Condition |
|--------|-----------|
| 400 | Sub-admin not found |

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

## GET `/get-all-sub-admin`

List all users with `role = ADMIN`.

### Success Response

**Status:** `200 OK`

```json
{
  "statusCode": 200,
  "data": [
    {
      "id": "cuid_string",
      "fullName": "Admin Name",
      "email": "admin@example.com",
      "phone": null,
      "role": "ADMIN",
      "roleStatus": "APPROVED",
      "emailVerified": true,
      "createdAt": "...",
      "updatedAt": "...",
      "address": { "...": "..." },
      "profileImage": { "id": "...", "imageUrl": "..." }
    }
  ],
  "message": "Successfully get all the sub admins"
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
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "message": "Successfully get all the users"
}
```

---

## GET `/get-all-pkg`

List all travel packages across all agents.

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
      "packageApprovedStatus": "PENDING",
      "isBookingActive": true,
      "...": "full package object"
    }
  ],
  "message": "Successfully get all the users"
}
```

---

## POST `/get-agent-pkg`

Get all packages created by a specific agent.

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

List all payment records in the system.

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

Get root admin's own profile.

### Success Response

**Status:** `200 OK`

```json
{
  "statusCode": 200,
  "data": {
    "id": "cuid_string",
    "fullName": "Root Admin",
    "email": "rootadmin@example.com",
    "phone": null,
    "role": "ROOTADMIN",
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

Update root admin profile. Same request body format as user update-profile.

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

Soft-delete root admin account. Same behavior as user delete-acc.

### Success Response

**Status:** `200 OK`

```json
{
  "statusCode": 200,
  "data": null,
  "message": "Account deleted successfully"
}
```
