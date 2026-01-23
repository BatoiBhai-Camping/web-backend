# Root Admin API Documentation

Base URL: `/api/v1/root-admin`

## Authentication

Most endpoints require authentication via JWT token with ROOT_ADMIN role.

---

## Endpoints

### 1. Register Root Admin

**POST** `/register`

Register a new root admin account.

**Authentication Required:** No

**Request Body:**

```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "phone": "string (optional)"
}
```

**Response:**

```json
{
  "statusCode": 201,
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "ROOT_ADMIN"
  },
  "message": "Root admin registered successfully"
}
```

---

### 2. Verify Account

**POST** `/verify-account`

Verify root admin account using verification token.

**Authentication Required:** Yes

**Request Body:**

```json
{
  "token": "string"
}
```

**Response:**

```json
{
  "statusCode": 200,
  "data": {},
  "message": "Account verified successfully"
}
```

---

### 3. Login

**POST** `/login`

Login as root admin.

**Authentication Required:** No

**Request Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**

```json
{
  "statusCode": 200,
  "data": {
    "user": {
      "id": "string",
      "name": "string",
      "email": "string",
      "role": "ROOT_ADMIN"
    },
    "token": "string"
  },
  "message": "Login successful"
}
```

---

### 4. Logout

**DELETE** `/logout`

Logout current root admin session.

**Authentication Required:** Yes

**Request Body:** None

**Response:**

```json
{
  "statusCode": 200,
  "data": {},
  "message": "Logout successful"
}
```

---

### 5. Approve Sub Admin

**POST** `/approve-sub-admin`

Approve a pending sub admin registration.

**Authentication Required:** Yes (Root Admin role)

**Request Body:**

```json
{
  "adminId": "string"
}
```

**Response:**

```json
{
  "statusCode": 200,
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "ADMIN",
    "isApproved": true
  },
  "message": "Sub admin approved successfully"
}
```

---

### 6. Reject Sub Admin

**POST** `/reject-sub-admin`

Reject a pending sub admin registration.

**Authentication Required:** Yes (Root Admin role)

**Request Body:**

```json
{
  "adminId": "string",
  "reason": "string (optional)"
}
```

**Response:**

```json
{
  "statusCode": 200,
  "data": {},
  "message": "Sub admin rejected successfully"
}
```

---

### 7. Approve Agent

**POST** `/approve-agent`

Approve a pending agent registration.

**Authentication Required:** Yes (Root Admin role)

**Request Body:**

```json
{
  "agentId": "string"
}
```

**Response:**

```json
{
  "statusCode": 200,
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "AGENT",
    "isApproved": true
  },
  "message": "Agent approved successfully"
}
```

---

### 8. Approve Package

**POST** `/approve-pkg`

Approve a pending travel package.

**Authentication Required:** Yes (Root Admin role)

**Request Body:**

```json
{
  "packageId": "string"
}
```

**Response:**

```json
{
  "statusCode": 200,
  "data": {
    "id": "string",
    "title": "string",
    "isApproved": true
  },
  "message": "Package approved successfully"
}
```

---

### 9. Reject Package

**POST** `/reject-pkg`

Reject a pending travel package.

**Authentication Required:** Yes (Root Admin role)

**Request Body:**

```json
{
  "packageId": "string",
  "reason": "string (optional)"
}
```

**Response:**

```json
{
  "statusCode": 200,
  "data": {},
  "message": "Package rejected successfully"
}
```

---

### 10. Get All Agents

**GET** `/get-all-agent`

Retrieve all agents in the system.

**Authentication Required:** Yes (Root Admin role)

**Request Body:** None

**Response:**

```json
{
  "statusCode": 200,
  "data": [
    {
      "id": "string",
      "name": "string",
      "email": "string",
      "role": "AGENT",
      "isApproved": "boolean",
      "createdAt": "datetime"
    }
  ],
  "message": "Successfully get all the agents"
}
```

---

### 11. Get All Sub Admins

**GET** `/get-all-sub-admin`

Retrieve all sub admins in the system.

**Authentication Required:** Yes (Root Admin role)

**Request Body:** None

**Response:**

```json
{
  "statusCode": 200,
  "data": [
    {
      "id": "string",
      "name": "string",
      "email": "string",
      "role": "ADMIN",
      "isApproved": "boolean",
      "createdAt": "datetime"
    }
  ],
  "message": "Successfully get all the sub admins"
}
```

---

### 12. Get All Payments

**GET** `/get-all-payments`

Retrieve all payment transactions.

**Authentication Required:** Yes (Root Admin role)

**Request Body:** None

**Response:**

```json
{
  "statusCode": 200,
  "data": [
    {
      "id": "string",
      "userId": "string",
      "packageId": "string",
      "amount": "number",
      "status": "string",
      "paymentMethod": "string",
      "createdAt": "datetime"
    }
  ],
  "message": "Successfully get all the payments"
}
```

---

### 13. Get All Users

**GET** `/get-all-user`

Retrieve all regular users.

**Authentication Required:** Yes (Root Admin role)

**Request Body:** None

**Response:**

```json
{
  "statusCode": 200,
  "data": [
    {
      "id": "string",
      "name": "string",
      "email": "string",
      "role": "USER",
      "isVerified": "boolean",
      "createdAt": "datetime"
    }
  ],
  "message": "Successfully get all the users"
}
```

---

### 14. Get All Packages

**GET** `/get-all-pkg`

Retrieve all travel packages in the system.

**Authentication Required:** Yes (Root Admin role)

**Request Body:** None

**Response:**

```json
{
  "statusCode": 200,
  "data": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "price": "number",
      "duration": "string",
      "destination": "string",
      "agentId": "string",
      "isApproved": "boolean",
      "createdAt": "datetime"
    }
  ],
  "message": "Successfully get all the users"
}
```

---

### 15. Delete Account

**DELETE** `/delete-acc`

Delete root admin account permanently.

**Authentication Required:** Yes (Root Admin role)

**Request Body:** None (deletes authenticated user's account)

**Response:**

```json
{
  "statusCode": 200,
  "data": {},
  "message": "Account deleted successfully"
}
```

---

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "statusCode": 400/401/403/404/500,
  "message": "Error message description",
  "errors": []
}
```

### Common Status Codes:

- `400` - Bad Request (Invalid input data)
- `401` - Unauthorized (Missing or invalid authentication)
- `403` - Forbidden (Insufficient permissions - requires ROOT_ADMIN role)
- `404` - Not Found (Resource doesn't exist)
- `500` - Internal Server Error

---

## Notes

- Root Admin has the highest level of privileges in the system
- Root Admin can approve/reject both sub admins and agents
- All management operations (viewing all users, agents, packages, payments) are available to root admin
- Root Admin approval is required for sub admin accounts to become active
