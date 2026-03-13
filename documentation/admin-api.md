# Admin API

**Base URL:** `/api/v1/admin`

## Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | No | Register a sub-admin/admin account. |
| POST | `/login` | No | Admin login. |
| DELETE | `/logout` | Yes | Logout admin account. |
| POST | `/verify-account` | Yes | Verify account with `verifyToken`. |
| POST | `/send-verification-link` | Yes | Re-send verification link. |
| POST | `/approve-agent` | Admin operation | Approve pending agent (`id`). |
| POST | `/approve-pkg` | Admin operation | Approve package (`packageId`). |
| POST | `/reject-pkg` | Admin operation | Reject package (`packageId`). |
| GET | `/get-all-agent` | Admin operation | List all agents. |
| GET | `/get-all-user` | Admin operation | List all users. |
| GET | `/get-all-pkg` | Admin operation | List all packages. |
| POST | `/get-agent-pkg` | Admin operation | List packages of a specific agent (`id`). |
| GET | `/get-all-payments` | Admin operation | List all payments. |
| GET | `/get-profile` | Yes | Get current admin profile. |
| POST | `/update-profile` | Admin self operation | Update own profile. |
| DELETE | `/delete-acc` | Admin operation | Delete account. |

## Middleware mapping

- `adminMiddlewareOperation`: privileged admin actions.
- `adminMiddlewareSelfOperation`: self profile update.
- `authMiddleware`: generic authenticated endpoints.
