# Root Admin API

**Base URL:** `/api/v1/root-admin`

## Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | No | Register root admin account. |
| POST | `/login` | No | Root admin login. |
| DELETE | `/logout` | Yes | Logout root admin account. |
| POST | `/verify-account` | Yes | Verify account with `verifyToken`. |
| POST | `/send-verification-link` | Yes | Re-send verification link. |
| POST | `/approve-sub-admin` | Root admin only | Approve sub-admin (`id`). |
| POST | `/reject-sub-admin` | Root admin only | Reject sub-admin (`id`). |
| POST | `/approve-agent` | Root admin only | Approve agent (`id`). |
| POST | `/approve-pkg` | Root admin only | Approve package (`packageId`). |
| POST | `/reject-pkg` | Root admin only | Reject package (`packageId`). |
| GET | `/get-all-agent` | Root admin only | List all agents. |
| GET | `/get-all-sub-admin` | Root admin only | List all sub-admins. |
| GET | `/get-all-user` | Root admin only | List all users. |
| GET | `/get-all-pkg` | Root admin only | List all packages. |
| POST | `/get-agent-pkg` | Root admin only | List packages of specific agent (`id`). |
| GET | `/get-all-payments` | Root admin only | List all payments. |
| GET | `/get-profile` | Root admin only | Get root admin profile. |
| POST | `/update-profile` | Root admin only | Update root admin profile. |
| DELETE | `/delete-acc` | Root admin only | Delete root admin account. |

## Notes

- Privileged routes are protected by `rootAdminMiddleware`.
- `verify-account` uses auth middleware + verification token payload.
