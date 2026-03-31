# Quick Reference: All API Endpoints

Complete listing of all 68 API endpoints organized by route and HTTP method.

---

## 📊 Endpoint Count by Route

| Route      | Total  | Auth Required | Status |
| ---------- | ------ | ------------- | ------ |
| Public/App | 3      | 1 of 3        | ✅     |
| User       | 15     | 14 of 15      | ✅     |
| Agent      | 14     | 13 of 14      | ✅     |
| Admin      | 16     | 15 of 16      | ✅     |
| Root Admin | 19     | 18 of 19      | ✅     |
| Payment    | 2      | 2 of 2        | ✅     |
| **TOTAL**  | **69** | **63 of 69**  | ✅     |

---

## 🌍 Public/App Routes (`/api/v1`)

```
GET     /health-status                          [public-api.md]
GET     /get-all-pkg                            [public-api.md]
POST    /assets/upload-file              Auth   [public-api.md]
```

---

## 👤 User Routes (`/api/v1/user`)

```
POST    /register                               [user-api.md]
POST    /login                                  [user-api.md]
DELETE  /logout                          Auth   [user-api.md]
POST    /verify-account                  Auth   [user-api.md]
POST    /send-verification-link          Auth   [user-api.md]
GET     /get-profile                     Auth   [user-api.md]
POST    /update-profile                  Auth   [user-api.md]
DELETE  /delete-acc                      Auth   [user-api.md]
GET     /get-all-bookings                Auth   [user-api.md]
POST    /platform-review                 Auth   [user-api.md]
POST    /delete-platform-review          Auth   [user-api.md]
POST    /agent-review                    Auth   [user-api.md]
POST    /delete-agent-review             Auth   [user-api.md]
POST    /package-review                  Auth   [user-api.md]
POST    /delete-package-review           Auth   [user-api.md]
```

---

## 🧳 Agent Routes (`/api/v1/agent`)

```
POST    /register                               [agent-api.md]
POST    /login                                  [agent-api.md]
DELETE  /logout                          Auth   [agent-api.md]
POST    /verify-account                  Auth   [agent-api.md]
POST    /send-verification-link          Auth   [agent-api.md]
POST    /publish-package                 Agent  [agent-api.md]
POST    /update-package                  Agent  [agent-api.md]
GET     /get-all-packages                Agent  [agent-api.md]
GET     /get-all-pkgs                    Agent  [agent-api.md]
GET     /get-all-bookings                Agent  [agent-api.md]
POST    /get-package-bookings            Agent  [agent-api.md]
GET     /get-profile                     Agent  [agent-api.md]
POST    /update-profile                  Agent  [agent-api.md]
DELETE  /delete-acc                      Agent  [agent-api.md]
```

---

## 👨‍💼 Admin Routes (`/api/v1/admin`)

```
POST    /register                               [admin-api.md]
POST    /login                                  [admin-api.md]
DELETE  /logout                          Auth   [admin-api.md]
POST    /verify-account                  Auth   [admin-api.md]
POST    /send-verification-link          Auth   [admin-api.md]
POST    /approve-agent                   Admin  [admin-api.md]
POST    /approve-pkg                     Admin  [admin-api.md]
POST    /reject-pkg                      Admin  [admin-api.md]
GET     /get-all-agent                   Admin  [admin-api.md]
GET     /get-all-user                    Admin  [admin-api.md]
GET     /get-all-pkg                     Admin  [admin-api.md]
POST    /get-agent-pkg                   Admin  [admin-api.md]
GET     /get-all-payments                Admin  [admin-api.md]
GET     /get-profile                     Auth   [admin-api.md]
POST    /update-profile                  Admin* [admin-api.md]
DELETE  /delete-acc                      Admin  [admin-api.md]
```

\*Admin Self Operation - requires ADMIN/ROOTADMIN role (no approval required)

---

## 👑 Root Admin Routes (`/api/v1/root-admin`)

```
POST    /register                               [root-admin-api.md]
POST    /login                                  [root-admin-api.md]
DELETE  /logout                          Auth   [root-admin-api.md]
POST    /verify-account                  Auth   [root-admin-api.md]
POST    /send-verification-link          Auth   [root-admin-api.md]
POST    /approve-sub-admin               RAdm   [root-admin-api.md]
POST    /reject-sub-admin                RAdm   [root-admin-api.md]
POST    /approve-agent                   RAdm   [root-admin-api.md]
POST    /approve-pkg                     RAdm   [root-admin-api.md]
POST    /reject-pkg                      RAdm   [root-admin-api.md]
GET     /get-all-agent                   RAdm   [root-admin-api.md]
GET     /get-all-sub-admin               RAdm   [root-admin-api.md]
GET     /get-all-user                    RAdm   [root-admin-api.md]
GET     /get-all-pkg                     RAdm   [root-admin-api.md]
POST    /get-agent-pkg                   RAdm   [root-admin-api.md]
GET     /get-all-payments                RAdm   [root-admin-api.md]
GET     /get-profile                     RAdm   [root-admin-api.md]
POST    /update-profile                  RAdm   [root-admin-api.md]
DELETE  /delete-acc                      RAdm   [root-admin-api.md]
```

---

## 💳 Payment Routes (`/api/v1/payment`)

```
POST    /create-order                    Auth   [payment-api.md]
POST    /verify-payment                  Auth   [payment-api.md]
```

---

## Authentication Legend

| Symbol  | Meaning              | Requirements                                                                                |
| ------- | -------------------- | ------------------------------------------------------------------------------------------- |
| (empty) | Public/Open          | No authentication required                                                                  |
| `Auth`  | Basic Authentication | Valid JWT in `accesstoken` cookie                                                           |
| `Agent` | Agent Only           | JWT + role=AGENT + emailVerified + roleStatus=APPROVED                                      |
| `Admin` | Admin Operation      | JWT + role∈[ADMIN,ROOTADMIN] + emailVerified + roleStatus=APPROVED                          |
| `RAdm`  | Root Admin Only      | JWT + role=ROOTADMIN + emailVerified + roleStatus=APPROVED + email matches ROOT_ADMIN_GMAIL |

---

## HTTP Methods Summary

| Method    | Count  | Used For                                      |
| --------- | ------ | --------------------------------------------- |
| GET       | 18     | Retrieving data (listings, profile, bookings) |
| POST      | 44     | Creating/updating data, approvals, reviews    |
| DELETE    | 7      | Account deletion, review deletion, logout     |
| **TOTAL** | **69** |                                               |

---

## Key Endpoint Categories

### 🔐 Authentication (Sign up, Log in, Verification)

- User register/login/logout/verify
- Agent register/login/logout/verify
- Admin register/login/logout/verify
- Root Admin register/login/logout/verify
- **Total:** 20 endpoints

### 👥 Profile Management (Get, Update, Delete)

- User: get-profile, update-profile, delete-acc
- Agent: get-profile, update-profile, delete-acc
- Admin: get-profile, update-profile, delete-acc
- Root Admin: get-profile, update-profile, delete-acc
- **Total:** 12 endpoints

### 📦 Package Management

- Agent: publish-package, update-package, get-all-packages, get-all-pkgs
- Admin: get-all-pkg, get-agent-pkg, approve-pkg, reject-pkg
- Root Admin: get-all-pkg, get-agent-pkg, approve-pkg, reject-pkg
- **Total:** 12 endpoints

### 📋 Booking Management

- User: get-all-bookings
- Agent: get-all-bookings, get-package-bookings
- **Total:** 3 endpoints

### ⭐ Review System

- User: platform-review, delete-platform-review
- User: agent-review, delete-agent-review
- User: package-review, delete-package-review
- **Total:** 6 endpoints

### 👤 User/Account Approvals

- Admin: approve-agent, approve-pkg, reject-pkg
- Root Admin: approve-sub-admin, reject-sub-admin, approve-agent, approve-pkg, reject-pkg
- **Total:** 8 endpoints

### 📊 System Listings/Reports

- Admin: get-all-agent, get-all-user, get-all-pkg, get-all-payments, get-agent-pkg
- Root Admin: get-all-agent, get-all-sub-admin, get-all-user, get-all-pkg, get-all-payments, get-agent-pkg
- **Total:** 11 endpoints

### 💳 Payment Processing

- Create order, verify payment
- **Total:** 2 endpoints

### 🔧 Utilities

- Health check, get-all-pkg (public), upload-file
- **Total:** 3 endpoints

---

## Response Status Codes Used

| Code  | Purpose                              | Frequency                 |
| ----- | ------------------------------------ | ------------------------- |
| `200` | OK - Success                         | Most requests             |
| `201` | Created - New resource               | register, publish-package |
| `400` | Bad Request - Validation/logic error | All endpoints             |
| `401` | Unauthorized - Missing/invalid JWT   | Auth required endpoints   |
| `403` | Forbidden - Role/permission denied   | Role-based endpoints      |
| `404` | Not Found - Resource doesn't exist   | Get/update endpoints      |

---

## Common Response Patterns

### Success Response

```json
{
  "statusCode": 200,
  "data": {
    /* response data */
  },
  "message": "Success message"
}
```

### Error Response

```json
{
  "statusCode": 400,
  "message": "Error description",
  "issues": [
    /* validation errors */
  ]
}
```

---

## Documentation Files Map

| File                                         | Purpose                         | Lines\* |
| -------------------------------------------- | ------------------------------- | ------- |
| [public-api.md](public-api.md)               | 3 public endpoints              | ~120    |
| [user-api.md](user-api.md)                   | 15 user endpoints               | ~650    |
| [agent-api.md](agent-api.md)                 | 14 agent endpoints              | ~800    |
| [admin-api.md](admin-api.md)                 | 16 admin endpoints              | ~500    |
| [root-admin-api.md](root-admin-api.md)       | 19 root admin endpoints         | ~600    |
| [payment-api.md](payment-api.md)             | 2 payment endpoints             | ~140    |
| [package-payloads.md](package-payloads.md)   | Complex payload structures      | ~400    |
| [database-schema.md](database-schema.md)     | 17 models + 19 enums            | ~900    |
| [http-status-codes.md](http-status-codes.md) | HTTP conventions                | ~100    |
| [VERIFICATION.md](VERIFICATION.md)           | Endpoint verification checklist | ~400    |
| [UPDATES.md](UPDATES.md)                     | Change summary                  | ~450    |

\*Approximate line counts

---

## Quick Navigation

- 🌍 **Start here:** [README.md](README.md) - System overview
- 📋 **Full checklist:** [VERIFICATION.md](VERIFICATION.md) - All endpoints verified
- 📊 **Database design:** [database-schema.md](database-schema.md)
- 👤 **User features:** [user-api.md](user-api.md)
- 🧳 **Agent features:** [agent-api.md](agent-api.md)
- 👨‍💼 **Admin features:** [admin-api.md](admin-api.md)
- 👑 **Root admin:** [root-admin-api.md](root-admin-api.md)
- 💳 **Payments:** [payment-api.md](payment-api.md)
- 🌐 **Public endpoints:** [public-api.md](public-api.md)

---

## Statistics

- **Total Endpoints:** 69
- **Documented Endpoints:** 69 ✅
- **Public Endpoints:** 3
- **Authenticated Endpoints:** 66
- **API Files:** 6 (public, user, agent, admin, root-admin, payment)
- **Supporting Doc Files:** 5 (database-schema, package-payloads, http-status-codes, VERIFICATION, UPDATES)
- **Total Documentation Files:** 11
- **Total Lines of Documentation:** ~5,000+

---

**Last Updated:** April 1, 2026  
**Status:** ✅ All endpoints documented and organized
