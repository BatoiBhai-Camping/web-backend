# Public / Common API

**Version prefix:** `/api/v1`

These endpoints are publicly accessible or require only basic authentication.

---

## Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/v1/health-status` | No | Health check endpoint |
| GET | `/api/v1/get-all-pkg` | No | Get all approved and active packages |
| POST | `/api/v1/assets/upload-file` | Yes (`authMiddleware`) | Upload a file to Cloudinary |

---

## GET `/api/v1/health-status`

Health check endpoint to verify the API is running.

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `restype` | string | Yes | Pass `"success"` for 200 response or `"fail"` for 400 response |

### Success Response (restype=success)

**Status:** `200 OK`

```json
{
  "statusCode": 200,
  "data": null,
  "message": "Api is working perfectly"
}
```

### Error Response (restype=fail)

**Status:** `400 Bad Request`

```json
{
  "statusCode": 400,
  "message": "Api is sending the error as per request",
  "issues": []
}
```

---

## GET `/api/v1/get-all-pkg`

Returns all travel packages that are approved, active for booking, and not deleted.

### Query Parameters

None

### Success Response

**Status:** `200 OK`

```json
{
  "statusCode": 200,
  "data": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "pricePerPerson": 5000,
      "totalSeats": 20,
      "availableSeats": 15,
      "discountAmount": 0,
      "discountPercentage": 10,
      "withTax": true,
      "taxPercentage": 18,
      "destination": "Goa",
      "durationDays": 5,
      "startDate": "2026-04-01T00:00:00.000Z",
      "endDate": "2026-04-05T00:00:00.000Z",
      "bookingActiveFrom": "2026-03-01T00:00:00.000Z",
      "bookingEndAt": "2026-03-28T00:00:00.000Z",
      "isBookingActive": true,
      "packageApprovedStatus": "APPROVED",
      "packagePolicies": "string",
      "cancellationPolicies": "string",
      "PackageBannerImage": {
        "imageUrl": "https://cloudinary.com/...",
        "fileId": "file_123"
      },
      "packagesImages": [
        { "imageUrl": "https://...", "fileId": "file_456" }
      ],
      "itinerary": [ ... ],
      "agent": {
        "id": "string",
        "companyName": "string",
        "user": {
          "fullName": "string",
          "profileImage": { "imageUrl": "https://..." }
        }
      },
      "createdAt": "2026-03-01T00:00:00.000Z",
      "updatedAt": "2026-03-10T00:00:00.000Z"
    }
  ],
  "message": "Successfully get all the available packages"
}
```

### Filters Applied

- `isBookingActive = true`
- `isDeleted = false`
- `packageApprovedStatus = APPROVED`

---

## POST `/api/v1/assets/upload-file`

Upload a file to Cloudinary. Requires authentication.

### Authentication

`authMiddleware` - requires valid JWT in `accesstoken` cookie.

### Request

**Content-Type:** `multipart/form-data`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | File | Yes | The file to upload |

### Success Response

**Status:** `200 OK`

```json
{
  "statusCode": 200,
  "data": {
    "url": "https://res.cloudinary.com/...",
    "fileId": "cloudinary_file_id"
  },
  "message": "file uploded successfuly to the cloude"
}
```

### Error Responses

| Status | Message |
|--------|---------|
| 400 | `"No file uploaded"` |
| 400 | `"Failed to upload file"` |
| 401 | Unauthorized (missing/invalid token) |

### Notes

- The file is temporarily stored on disk at `./public/temp` before being uploaded to Cloudinary.
- The temporary file is deleted after successful upload.
- Use the returned `url` and `fileId` when setting images in other API calls (e.g., profile image, package banner).
