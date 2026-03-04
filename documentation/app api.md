# App API Documentation

## Overview

The App Router handles public-facing endpoints that don't require authentication. These endpoints are accessible to anyone visiting the BatioBhai platform.

**Base URL:** `/api/v1/app`

**Authentication:** Not Required

**Route File:** `/src/routes/app.route.ts`

**Controller File:** `/src/controller/getAllPkg.controller.ts`

---

## Table of Contents

1. [Get All Available Packages](#get-all-available-packages)

---

## Get All Available Packages

### Endpoint

```
GET /api/v1/app/get-all-pkg
```

### Description

Retrieves all travel packages that are currently available for booking. This endpoint only returns packages that are approved, not deleted, and have active booking enabled.

### Request Headers

No authentication required.

### Query Parameters

None

### Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "statusCode": 200,
  "data": [
    {
      "id": "clz3a2b3c4d5e6f7g8h9i0j1",
      "agentId": "clz1a2b3c4d5e6f7g8h9i0j2",
      "title": "Manali Adventure Tour",
      "description": "Experience the breathtaking beauty of Manali with adventure activities",
      "pricePerPerson": 15000,
      "packageApprovedStatus": "APPROVED",
      "discountAmount": 0,
      "discountPercentage": 10,
      "withTax": true,
      "taxPercentage": 5,
      "totalSeats": 20,
      "seatsAvailable": 15,
      "seatBooked": 5,
      "destination": "Manali, Himachal Pradesh",
      "durationDays": 5,
      "startDate": "2026-04-15T00:00:00.000Z",
      "endDate": "2026-04-20T00:00:00.000Z",
      "bookingActiveFrom": "2026-03-01T00:00:00.000Z",
      "bookingEndAt": "2026-04-10T00:00:00.000Z",
      "packagePolicies": "Valid ID required. Minimum age 18 years.",
      "cancellationPolicies": "50% refund if cancelled 7 days before. No refund within 3 days.",
      "isBookingActive": true,
      "isDeleted": false,
      "createdAt": "2026-02-15T10:30:00.000Z",
      "updatedAt": "2026-03-01T14:20:00.000Z",
      "tags": ["adventure", "mountains", "trekking", "camping"],
      "packageBannerImageId": "clz4a2b3c4d5e6f7g8h9i0j3"
    },
    {
      "id": "clz3a2b3c4d5e6f7g8h9i0j4",
      "agentId": "clz1a2b3c4d5e6f7g8h9i0j2",
      "title": "Goa Beach Paradise",
      "description": "Relax on pristine beaches and enjoy water sports",
      "pricePerPerson": 12000,
      "packageApprovedStatus": "APPROVED",
      "discountAmount": 1000,
      "discountPercentage": 0,
      "withTax": true,
      "taxPercentage": 5,
      "totalSeats": 30,
      "seatsAvailable": 25,
      "seatBooked": 5,
      "destination": "Goa",
      "durationDays": 4,
      "startDate": "2026-05-01T00:00:00.000Z",
      "endDate": "2026-05-05T00:00:00.000Z",
      "bookingActiveFrom": "2026-03-15T00:00:00.000Z",
      "bookingEndAt": "2026-04-25T00:00:00.000Z",
      "packagePolicies": "Swimming skills required for water sports.",
      "cancellationPolicies": "75% refund if cancelled 14 days before.",
      "isBookingActive": true,
      "isDeleted": false,
      "createdAt": "2026-02-20T09:15:00.000Z",
      "updatedAt": "2026-02-28T11:45:00.000Z",
      "tags": ["beach", "water-sports", "relaxation", "nightlife"],
      "packageBannerImageId": "clz4a2b3c4d5e6f7g8h9i0j5"
    }
  ],
  "message": "Successfully get all the available packages"
}
```

### Error Responses

#### 1. Internal Server Error

**Status Code:** `500 Internal Server Error`

```json
{
  "success": false,
  "statusCode": 500,
  "data": null,
  "message": "Internal server error",
  "errors": []
}
```

### Data Flow

```
1. Client requests all available packages
   ↓
2. Query database for packages with:
   - isBookingActive = true
   - isDeleted = false
   - packageApprovedStatus = "APPROVED"
   ↓
3. Return array of matching packages
   ↓
4. Send response to client
```

### Database Operations

**Primary Table:** `Bb_travelPackage`

**Prisma Schema:** `/src/prisma/schema.prisma`

**Database Client:** `/src/config/database.ts`

#### Query Packages

```sql
SELECT *
FROM "Bb_travelPackage"
WHERE "isBookingActive" = true
  AND "isDeleted" = false
  AND "packageApprovedStatus" = 'APPROVED';
```

### Response Fields Explanation

| Field                 | Type     | Description                                       |
| --------------------- | -------- | ------------------------------------------------- |
| id                    | string   | Unique package identifier (CUID)                  |
| agentId               | string   | ID of the agent who created the package           |
| title                 | string   | Package title/name                                |
| description           | string   | Detailed package description                      |
| pricePerPerson        | number   | Base price per traveler in INR                    |
| packageApprovedStatus | enum     | Approval status (PENDING, APPROVED, REJECTED)     |
| discountAmount        | number   | Fixed discount amount per person (if any)         |
| discountPercentage    | number   | Percentage discount on base price (if any)        |
| withTax               | boolean  | Whether tax is applicable                         |
| taxPercentage         | number   | Tax percentage to be applied (if withTax is true) |
| totalSeats            | number   | Total seats available for this package            |
| seatsAvailable        | number   | Remaining seats available for booking             |
| seatBooked            | number   | Number of seats already booked                    |
| destination           | string   | Travel destination                                |
| durationDays          | number   | Duration of the package in days                   |
| startDate             | datetime | Package start date                                |
| endDate               | datetime | Package end date                                  |
| bookingActiveFrom     | datetime | Date from which bookings can be made              |
| bookingEndAt          | datetime | Last date for booking                             |
| packagePolicies       | string   | General package policies and terms                |
| cancellationPolicies  | string   | Cancellation and refund policies                  |
| isBookingActive       | boolean  | Whether booking is currently active               |
| isDeleted             | boolean  | Soft delete flag                                  |
| createdAt             | datetime | Package creation timestamp                        |
| updatedAt             | datetime | Last update timestamp                             |
| tags                  | string[] | Array of tags for categorization and search       |
| packageBannerImageId  | string   | ID of the banner image for the package            |

### Usage Examples

#### JavaScript/Fetch

```javascript
fetch("http://localhost:3000/api/v1/app/get-all-pkg")
  .then((response) => response.json())
  .then((data) => {
    console.log("Available packages:", data.data);
  })
  .catch((error) => {
    console.error("Error fetching packages:", error);
  });
```

#### cURL

```bash
curl -X GET http://localhost:3000/api/v1/app/get-all-pkg
```

#### Postman Testing

```
Method: GET
URL: http://localhost:3000/api/v1/app/get-all-pkg
Headers: None required
```

### Notes

- This endpoint is public and does not require authentication
- Only approved and active packages are returned
- Packages with `isDeleted: true` or `packageApprovedStatus: "PENDING"/"REJECTED"` are excluded
- Recommended for displaying packages on the homepage or search results
- Frontend should handle empty array response when no packages are available

---

## Future Enhancements

Potential additions to the App API:

1. **Search and Filter Packages**
   - Filter by destination, price range, duration
   - Search by tags, keywords
   - Sort by price, date, popularity

2. **Get Package Details**
   - Single package with full details including itinerary
   - Related packages suggestions

3. **Get Popular Destinations**
   - List of trending destinations
   - Statistics and highlights

4. **Get Package Reviews**
   - Public reviews for packages
   - Average ratings

---

## Contact Information

For any issues or questions regarding the App API, please contact the development team or refer to the main backend documentation.
