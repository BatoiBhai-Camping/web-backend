# User API

**Base URL:** `/api/v1/user`

## Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | No | Register a traveler account. |
| POST | `/login` | No | Login user account. |
| DELETE | `/logout` | Yes | Logout current account. |
| POST | `/verify-account` | Yes | Verify account using `verifyToken`. |
| POST | `/send-verification-link` | Yes | Re-send account verification link. |
| GET | `/get-profile` | Yes | Get current user profile. |
| POST | `/update-profile` | Yes | Update user profile and addresses. |
| DELETE | `/delete-acc` | Yes | Delete current account. |
| GET | `/get-all-bookings` | Yes | Get all bookings made by current user. |
| POST | `/platform-review` | Yes | Add/update platform review. |
| POST | `/delete-platform-review` | Yes | Delete platform review by `id`. |
| POST | `/agent-review` | Yes | Add/update agent review (`agentId`, rating, comment). |
| POST | `/delete-agent-review` | Yes | Delete agent review by `id`. |
| POST | `/package-review` | Yes | Add/update package review (`packageId`, rating, comment). |
| POST | `/delete-package-review` | Yes | Delete package review by `id`. |

## Important request bodies

### Register

```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

### Verify account

```json
{
  "verifyToken": "token-from-email"
}
```

### Update profile (partial)

```json
{
  "fullName": "John Doe",
  "phone": "+919999999999",
  "profileImageUrl": "https://...",
  "profileFileId": "file_123",
  "addresses": [
    {
      "id": "optional-address-id",
      "addressType": "CURRENT",
      "country": "India",
      "state": "West Bengal",
      "district": "Kolkata",
      "pin": "700001",
      "city": "Kolkata"
    }
  ]
}
```
