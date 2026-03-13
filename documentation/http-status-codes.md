# HTTP Status Code Guide

Common statuses used in this API:

- `200 OK` — successful read/update/delete.
- `201 Created` — successful creation.
- `400 Bad Request` — invalid body/query/params.
- `401 Unauthorized` — missing/invalid auth token.
- `403 Forbidden` — role/middleware denied request.
- `404 Not Found` — route or resource not found.
- `409 Conflict` — duplicate/invalid state conflict.
- `500 Internal Server Error` — unexpected backend error.

## Project-specific not found behavior

Any unmatched API route falls back to:

- status: `400`
- message: `api location not found`

(from the not-found handler in `src/app.ts`).
