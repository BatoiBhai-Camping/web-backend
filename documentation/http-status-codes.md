# HTTP Status Code Guide

## Status Codes Used

| Code | Name | Usage in This API |
|------|------|-------------------|
| `200` | OK | Successful read, update, delete, login, logout, verification |
| `201` | Created | Successful creation (agent registration, package publish, payment order) |
| `400` | Bad Request | Invalid request body, validation errors, business logic violations |
| `401` | Unauthorized | Missing or invalid authentication token |
| `403` | Forbidden | Role/permission denied by middleware |
| `404` | Not Found | Resource not found (package, user, etc.) |
| `409` | Conflict | Duplicate or invalid state conflict |
| `500` | Internal Server Error | Unexpected backend error |

## Response Formats

### Success Response

```json
{
  "statusCode": 200,
  "data": { "...result data or null" },
  "message": "Human-readable success message"
}
```

### Error Response

```json
{
  "statusCode": 400,
  "message": "Human-readable error description",
  "issues": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

The `issues` array contains field-level validation errors (from Zod validation). It may be empty or absent for non-validation errors.

## Unmatched Route Behavior

Any unmatched API route returns:

**Status:** `400 Bad Request`

```json
{
  "statusCode": 400,
  "message": "api location not found",
  "issues": []
}
```

This is handled by the not-found handler in `src/app.ts`.

## Common Error Patterns

| Scenario | Status | Typical Message |
|----------|--------|-----------------|
| Missing/invalid JWT cookie | 401 | Unauthorized |
| Wrong user role for endpoint | 403 | Forbidden |
| Email already registered | 400 | Email already exists |
| Invalid Zod validation | 400 | Validation error + issues array |
| Resource not found | 404 | Not found message |
| Account not approved | 403 | Role status not approved |
| Email not verified | 400 | Email not verified |
| Duplicate phone number | 400 | Phone number already exists |
| Package not active for booking | 400 | Booking not active |
| Insufficient seats | 400 | Not enough available seats |
| Invalid payment signature | 400 | Invalid payment signature |
