# BatioBhai Web Backend API Documentation

## Table of Contents

1. Overview
2. Authentication
3. API Endpoints
4. Data Models
5. External Services
6. Error Handling
7. Environment Setup

## Overview

The BatioBhai Web Backend is a Node.js/Express.js application built with TypeScript that provides APIs for a travel booking platform. It supports user management, agent registration, file uploads, and booking operations.

### Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (Access & Refresh tokens)
- **File Storage**: Cloudinary
- **Email**: NodeMailer with MJML templates
- **Validation**: Zod schemas

### Base URL

```
Production: https://api.batiobhai.com
Development: http://localhost:3000
```

## Authentication

### Token System

The API uses JWT-based authentication with:

- **Access Token**: Short-lived (3 days), stored in HTTP-only cookies
- **Refresh Token**: Long-lived, stored in database and cookies
- **Verification Token**: For email verification

### Cookie Names

- `accesstoken`: Bearer access token
- `refreshtoken`: Refresh token

---

## API Endpoints

### 1. Health Check

#### GET /api/v1/health

Check server status.

**Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "data": null,
  "message": "Server is healthy"
}
```

---

### 2. User Management

#### POST /api/v1/user/register

Register a new user.

**Request Body:**

```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "statusCode": 201,
  "data": null,
  "message": "User registered successfully, kindly verify your email"
}
```

**Database Operations:**

1. Check if email exists
2. Hash password with bcrypt
3. Create user record
4. Generate verification token
5. Send verification email

#### POST /api/v1/user/login

User login.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "user": {
      "id": "user_id",
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "TRAVELER"
    }
  },
  "message": "User logged in successfully"
}
```

**Database Operations:**

1. Find user by email
2. Verify password
3. Generate access & refresh tokens
4. Update refresh token in database
5. Set cookies

#### POST /api/v1/user/verify-account

Verify user account with token.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "verifyToken": "verification_token_here"
}
```

**Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "data": null,
  "message": "Account verified successfully"
}
```

#### POST /api/v1/user/send-verification-link

Resend verification email.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "data": null,
  "message": "Verification link sent successfully"
}
```

---

### 3. Agent Management

#### POST /api/v1/agent/register

Register as an agent.

**Request Body:**

```json
{
  "fullName": "Agent Name",
  "email": "agent@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "profileImageUrl": "https://cloudinary.com/image.jpg",
  "profileImageFileId": "cloudinary_file_id",
  "companyName": "Travel Company",
  "description": "Company description",
  "aadharNumber": "123456789012",
  "panNumber": "ABCDE1234F",
  "gstNumber": "27ABCDE1234F1Z5",
  "bannerImageUrl": "https://cloudinary.com/banner.jpg",
  "bannerImageFileId": "banner_file_id",
  "addressType": "PERMANENT",
  "country": "India",
  "state": "Maharashtra",
  "district": "Mumbai",
  "pin": "400001",
  "city": "Mumbai",
  "longitude": "72.8777",
  "latitude": "19.0760",
  "aadharDocumentUrl": "https://cloudinary.com/aadhar.pdf",
  "aadharDocumentFileId": "aadhar_file_id",
  "panDocumentUrl": "https://cloudinary.com/pan.pdf",
  "panDocumentFileId": "pan_file_id"
}
```

**Response:**

```json
{
  "success": true,
  "statusCode": 201,
  "data": {
    "user": { "id": "user_id", "email": "agent@example.com", "role": "AGENT" },
    "agentProfile": { "id": "agent_id", "companyName": "Travel Company" },
    "address": { "id": "address_id", "city": "Mumbai" }
  },
  "message": "Agent registered successfully"
}
```

**Database Transaction:**

1. Create user with AGENT role
2. Create agent profile
3. Create address record
4. Create profile and banner images
5. Link images to user/agent
6. Create document records (Aadhar, PAN)
7. Generate tokens and set cookies

#### POST /api/v1/agent/login

Agent login (uses same endpoint as user login).

#### POST /api/v1/agent/verify-account

Agent account verification (uses same endpoint as user verification).

#### POST /api/v1/agent/send-verification-link

Resend agent verification link (uses same endpoint as user).

---

### 4. Asset Management

#### POST /api/v1/assets/upload-file

Upload a single file to Cloudinary.

**Headers:**

```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**

- `file`: File to upload (image/document)

**Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "imageId": "db_image_id",
    "url": "https://cloudinary.com/uploaded_file.jpg",
    "fileId": "cloudinary_file_id"
  },
  "message": "File uploaded successfully"
}
```

**External Services:**

1. Multer processes file upload
2. Cloudinary stores file
3. Database saves file metadata



## External Services Integration

### 1. Cloudinary (File Storage)

**Purpose**: Store and manage images and documents

**Configuration Required:**

```env
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Operations:**

- Upload files with auto-generated public IDs
- Delete files by public ID
- Transform images (resize, crop, format)

### 2. NodeMailer (Email Service)

**Purpose**: Send verification and notification emails

**Configuration Required:**

```env
GMAIL=your_email@gmail.com
GMAIL_PASS=your_app_password
```

**Operations:**

- Send account verification emails
- Use MJML templates for responsive emails
- SMTP configuration with Gmail

### 3. PostgreSQL Database

**Purpose**: Primary data storage

**Configuration Required:**

```env
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
```

**Operations:**

- Prisma ORM for type-safe queries
- Database transactions for complex operations
- Automatic migrations

---

## Error Handling

### Standard Error Response Format

```json
{
  "success": false,
  "statusCode": 400,
  "data": null,
  "message": "Error message here",
  "errors": ["Detailed error 1", "Detailed error 2"]
}
```

### Common Error Codes

- **400**: Bad Request (validation errors)
- **401**: Unauthorized (invalid/missing token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found (resource doesn't exist)
- **409**: Conflict (duplicate data)
- **500**: Internal Server Error

### Validation Errors

All inputs are validated using Zod schemas. Validation errors return detailed messages:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "errors": ["Email is required", "Password is too short"]
}
```


## Frontend Integration Guidelines

### 1. Authentication Flow

```javascript
// Login
const loginResponse = await fetch("/api/v1/user/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include", // Important for cookies
  body: JSON.stringify({ email, password }),
});

// Authenticated requests
const response = await fetch("/api/v1/protected-endpoint", {
  credentials: "include", // Automatically sends cookies
});
```

### 2. File Upload

```javascript
const formData = new FormData();
formData.append("file", selectedFile);

const uploadResponse = await fetch("/api/v1/assets/upload-file", {
  method: "POST",
  credentials: "include",
  body: formData, // Don't set Content-Type header
});
```

### 3. Error Handling

```javascript
const response = await fetch("/api/v1/endpoint");
const data = await response.json();

if (!data.success) {
  // Handle error
  console.error(data.message);
  if (data.errors) {
    data.errors.forEach((error) => console.error(error));
  }
}
```

### 4. Agent Registration Flow

1. Upload profile image → get `imageUrl` and `fileId`
2. Upload banner image → get `imageUrl` and `fileId`
3. Upload Aadhar document → get `documentUrl` and `fileId`
4. Upload PAN document (optional) → get `documentUrl` and `fileId`
5. Submit agent registration with all URLs and file IDs

---

## Security

### Security Features

- JWT tokens stored in HTTP-only cookies
- Password hashing with bcrypt (salt rounds: 10)
- Input validation with Zod schemas

---

