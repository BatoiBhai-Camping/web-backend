# Public App API Documentation

Base URL: `/api/v1/app`

## Overview

These are public APIs that don't require authentication. They are accessible to all users including guests.

---

## Endpoints

### 1. Get All Packages

**GET** `/get-all-pkg`

Retrieve all approved travel packages available for booking.

**Authentication Required:** No

**Query Parameters:** None

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
      "images": ["string"],
      "inclusions": ["string"],
      "exclusions": ["string"],
      "itinerary": [
        {
          "day": "number",
          "title": "string",
          "description": "string"
        }
      ],
      "agentId": "string",
      "agentName": "string",
      "rating": "number",
      "reviewCount": "number",
      "availableSeats": "number",
      "startDate": "datetime",
      "endDate": "datetime",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  ],
  "message": "Successfully get all the packages"
}
```

**Success Status Code:** `200 OK`

**Description:**

- Returns only approved packages (`isApproved: true`)
- Packages are sorted by creation date (newest first)
- Includes complete package details for display in the app
- No pagination (returns all packages)

---

## Response Format

All successful responses follow this structure:

```json
{
  "statusCode": number,
  "data": any,
  "message": "string"
}
```

---

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "statusCode": 400/404/500,
  "message": "Error message description",
  "errors": []
}
```

### Common Status Codes:

- `400` - Bad Request (Invalid query parameters)
- `404` - Not Found (No packages found)
- `500` - Internal Server Error

---

## Future Endpoints (Coming Soon)

Additional public endpoints that may be added:

- `GET /get-pkg/:id` - Get single package details
- `GET /search-pkg` - Search packages by destination, price range, duration
- `GET /featured-pkg` - Get featured/promoted packages
- `GET /popular-destinations` - Get list of popular destinations
- `GET /pkg-categories` - Get package categories (Adventure, Leisure, etc.)
- `GET /filter-pkg` - Filter packages with advanced options

---

## Notes

- All public APIs are cached for better performance
- No rate limiting applied to public endpoints
- Data returned is read-only (no modifications allowed)
- Only approved and active packages are shown
- Package prices are in the default currency (configure in settings)
