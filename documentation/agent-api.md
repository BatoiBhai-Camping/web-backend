# Agent API

**Base URL:** `/api/v1/agent`

## Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | No | Register an agent account/profile. |
| POST | `/login` | No | Login agent account. |
| DELETE | `/logout` | Yes | Logout agent account. |
| POST | `/verify-account` | Yes | Verify account with `verifyToken`. |
| POST | `/send-verification-link` | Yes | Re-send account verification link. |
| POST | `/publish-package` | Agent only | Publish a travel package. |
| POST | `/update-package` | Agent only | Update existing package and nested itinerary data. |
| GET | `/get-all-packages` | Agent only | Get packages created by current agent. |
| GET | `/get-all-pkgs` | Agent only | Alias of `/get-all-packages`. |
| GET | `/get-all-bookings` | Agent only | Get all bookings for agent packages. |
| POST | `/get-package-bookings` | Agent only | Get bookings for specific package (`id`). |
| GET | `/get-profile` | Agent only | Get full agent profile. |
| POST | `/update-profile` | Agent only | Update user + agent profile fields. |
| DELETE | `/delete-acc` | Agent only | Delete current agent account. |

## Notes

- Agent-protected routes use `agentMiddleware`.
- `verify-account` and `send-verification-link` reuse shared user verification handlers.
