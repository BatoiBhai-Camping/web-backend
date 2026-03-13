# Public / Common API

**Version prefix:** `/api/v1`

## Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/health-status` | No | Health check endpoint. |
| GET | `/api/v1/get-all-pkg` | No | Returns all approved/public packages. |
| POST | `/api/v1/assets/upload-file` | Yes (`authMiddleware`) | Upload a file (`multipart/form-data`, field name `file`). |

## Notes

- Asset upload requires a valid logged-in user token (cookie-based auth).
- Uploaded asset response returns `url` and `fileId`.
