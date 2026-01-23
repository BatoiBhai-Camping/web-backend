# Admin API Documentation

Base URL: `/api/v1/admin`

## Authentication

Most endpoints require authentication via JWT token in cookies or Authorization header.

---

## Endpoints

### 1. Register Admin

**POST** `/register`

Register a new admin account.

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
    "role": "ADMIN"
  },
  "message": "Admin registered successfully"
}
```

---

### 2. Verify Account

**POST** `/verify-account`

Verify admin account using verification token.

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

### 3. Send Verification Link

**POST** `/send-verification-link`

Request a new verification link to be sent via email.

**Authentication Required:** Yes

**Request Body:** None (uses authenticated user's email)

**Response:**

```json
{
  "statusCode": 200,
  "data": {},
  "message": "Verification link sent successfully"
}
```

---

### 4. Login

**POST** `/login`

Login as admin.

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
      "role": "ADMIN"
    },
    "token": "string"
  },
  "message": "Login successful"
}
```

---

### 5. Logout

**DELETE** `/logout`

Logout current admin session.

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

### 6. Approve Agent

**POST** `/approve-agent`

Approve a pending agent registration.

**Authentication Required:** Yes (Admin role)

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

### 7. Approve Package

**POST** `/approve-pkg`

Approve a pending travel package.

**Authentication Required:** Yes (Admin role)

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

### 8. Reject Package

**POST** `/reject-pkg`

Reject a pending travel package.

**Authentication Required:** Yes (Admin role)

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

### 9. Get All Agents

**GET** `/get-all-agent`

Retrieve all agents in the system.

**Authentication Required:** Yes (Admin role)

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

### 10. Get All Payments

**GET** `/get-all-payments`

Retrieve all payment transactions.

**Authentication Required:** Yes (Admin role)

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
      "createdAt": "datetime"
    }
  ],
  "message": "Successfully get all the payments"
}
```

---

### 11. Get All Users

**GET** `/get-all-user`

Retrieve all regular users.

**Authentication Required:** Yes (Admin role)

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
      "createdAt": "datetime"
    }
  ],
  "message": "Successfully get all the users"
}
```

---

### 12. Get All Packages

**GET** `/get-all-pkg`

Retrieve all travel packages.

**Authentication Required:** Yes (Admin role)

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
      "agentId": "string",
      "isApproved": "boolean",
      "createdAt": "datetime"
    }
  ],
  "message": "Successfully get all the users"
}
```

---

### 13. Delete Account

**DELETE** `/delete-acc`

Delete admin account permanently.

**Authentication Required:** Yes (Admin role)

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
- `403` - Forbidden (Insufficient permissions)
- `404` - Not Found (Resource doesn't exist)
- `500` - Internal Server Error
