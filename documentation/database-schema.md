# Database Schema Documentation

Complete Prisma schema documentation for the BatoiBhai platform.

**ORM:** Prisma  
**Database:** PostgreSQL

---

## Table of Contents

1. [Enums](#enums)
2. [Models](#models)
3. [Relationships](#relationships)
4. [Constraints & Indexes](#constraints--indexes)

---

## Enums

### UserRole

User account role types.

```
ROOTADMIN - Super administrator with full system access
ADMIN - Sub-administrator who can approve agents/packages
AGENT - Travel agent who creates and manages packages
TRAVELER - Regular user who browses and books packages
```

### AddressType

Address classification.

```
PERMANENT - Permanent residence
CURRENT - Current living address
TRAVEL - Travel destination address
```

### RoleStatus

Account approval status.

```
PENDING - Awaiting approval by administrator
APPROVED - Account approved and active
REJECTED - Account rejected
```

### PackageApprovedStatus

Travel package approval status.

```
PENDING - Awaiting admin approval
APPROVED - Approved and visible to travelers
REJECTED - Rejected package
```

### BookingStatus

Booking lifecycle statuses.

```
PENDING - Initial state after order creation
HOLD - Payment in progress
CONFIRMED - Payment verified and confirmed
CANCELLED - User or agent cancelled
COMPLETED - Trip completed
REFUND_PENDING - Cancellation refund processing
REFUNDED - Refund completed
```

### PaymentStatus

Payment attempt status.

```
PENDING - Payment pending
SUCCESS - Payment successful
FAILED - Payment failed
REFUNDED - Payment refunded (full or partial)
```

### PaymentType

Type of payment transaction.

```
BOOKING - Payment for package booking
REFUND - Refund transaction
```

### ProviderType

Payment gateway provider.

```
STRIP - Stripe payment gateway
RAZORPAY - Razorpay payment gateway
OTHER - Other providers
```

### NotificationType

Notification categories.

```
BOOKING_UPDATE - Booking status changed
PAYMENT_UPDATE - Payment status changed
SYSTEM_MESSAGE - System announcements
```

### MealType

Meal classifications for package itinerary.

```
BREAKFAST - Breakfast meal
LUNCH - Lunch meal
DINNER - Dinner meal
```

### CancelledBy

Who initiated the cancellation.

```
USER - Traveler cancelled
AGENT - Agent cancelled
PLATFORM - Platform/admin cancelled
```

### DocumentType

Government identification document types.

```
AADHAR - Aadhar card
PAN - PAN card
```

### TransportMode

Transportation methods.

```
BUS - Bus/Coach
TRAIN - Train
CAR - Car/Sedan
FLIGHT - Airplane
BOAT - Boat/Ferry
WALK - Walking
OTHER - Other transport
```

### ReviewType

Review subject types.

```
AGENT - Review about agent
PACKAGE - Review about travel package
PLATFORM - Review about platform
```

### PaymentMethod

Payment method used.

```
CARD - Credit/Debit card
UPI - UPI payment
WALLET - Digital wallet
NET_BANKING - Net banking
BANK_TRANSFER - Direct bank transfer
```

### PackageType

Package duration type.

```
MULTI_DAY - Multi-day trips
DAILY - Single-day trips
```

---

## Models

### Bb_user

Main user account model. Used by all user types (TRAVELER, AGENT, ADMIN, ROOTADMIN).

| Field            | Type       | Constraints          | Description                      |
| ---------------- | ---------- | -------------------- | -------------------------------- |
| `id`             | String     | PK, CUID             | Unique user identifier           |
| `fullName`       | String     | Required             | User's full name                 |
| `email`          | String     | Unique, Required     | Email address                    |
| `password`       | String     | Optional             | Hashed password (null for OAuth) |
| `emailVerified`  | Boolean    | Default: false       | Email verification status        |
| `role`           | UserRole   | Default: TRAVELER    | User's role                      |
| `roleStatus`     | RoleStatus | Optional             | Role approval status             |
| `phone`          | String     | Unique, Optional     | Primary phone number             |
| `createdAt`      | DateTime   | Default: now()       | Account creation timestamp       |
| `updatedAt`      | DateTime   | Auto-update          | Last update timestamp            |
| `isDeleted`      | Boolean    | Default: false       | Soft delete flag                 |
| `profileImageId` | String     | FK, Unique, Optional | Reference to profile image       |
| `refreshToken`   | String     | Optional             | Refresh token value              |
| `verifyToken`    | String     | Optional             | Email verification token         |

**Relations:**

- `profileImage`: One-to-One with `Bb_image` (profile picture)
- `optionalPhone`: One-to-Many with `Bb_optionalPhone`
- `address`: One-to-One with `Bb_address`
- `agentProfile`: One-to-One with `Bb_agentProfile`
- `bookings`: One-to-Many with `Bb_booking`
- `platformReviews`: One-to-Many with `Bb_platformReview`
- `agentReviews`: One-to-Many with `Bb_agentReview`
- `packageReviews`: One-to-Many with `Bb_packageReview`
- `notifications`: One-to-Many with `Bb_notification`

---

### Bb_optionalPhone

Additional phone numbers for users.

| Field              | Type    | Constraints      | Description         |
| ------------------ | ------- | ---------------- | ------------------- |
| `id`               | String  | PK, CUID         | Identifier          |
| `phoneNumber`      | String  | Unique, Required | Phone number        |
| `isVerifyedNumber` | Boolean | Default: false   | Verification status |
| `userId`           | String  | FK, Required     | User reference      |

---

### Bb_agentProfile

Travel agent profile with company details and documents.

| Field           | Type     | Constraints          | Description                |
| --------------- | -------- | -------------------- | -------------------------- |
| `id`            | String   | PK, CUID             | Identifier                 |
| `userId`        | String   | FK, Unique, Required | User reference             |
| `companyName`   | String   | Required             | Travel company name        |
| `description`   | String   | Optional             | Company description        |
| `aadharNumber`  | String   | Required             | Aadhar ID for verification |
| `panNumber`     | String   | Optional             | PAN number                 |
| `gstNumber`     | String   | Optional             | GST registration number    |
| `bannerImageId` | String   | FK, Unique, Optional | Banner image reference     |
| `createdAt`     | DateTime | Default: now()       | Creation timestamp         |
| `updatedAt`     | DateTime | Auto-update          | Last update timestamp      |

**Relations:**

- `user`: One-to-One with `Bb_user`
- `documents`: One-to-Many with `Bb_document`
- `packages`: One-to-Many with `Bb_travelPackage`
- `bannerImage`: One-to-One with `Bb_image`
- `reviews`: One-to-Many with `Bb_agentReview`

---

### Bb_document

Government identification documents for agent verification.

| Field            | Type         | Constraints  | Description                |
| ---------------- | ------------ | ------------ | -------------------------- |
| `id`             | String       | PK, CUID     | Identifier                 |
| `documentType`   | DocumentType | Required     | Document type (AADHAR/PAN) |
| `documentUrl`    | String       | Required     | Cloudinary URL             |
| `documentFileId` | String       | Optional     | Cloudinary file ID         |
| `agentId`        | String       | FK, Required | Agent reference            |

---

### Bb_address

Address information for users and packages.

| Field             | Type        | Constraints          | Description            |
| ----------------- | ----------- | -------------------- | ---------------------- |
| `id`              | String      | PK, CUID             | Identifier             |
| `addressType`     | AddressType | Default: PERMANENT   | Address classification |
| `country`         | String      | Optional             | Country                |
| `state`           | String      | Optional             | State/Province         |
| `district`        | String      | Optional             | District               |
| `pin`             | String      | Optional             | PIN/Postal code        |
| `city`            | String      | Optional             | City                   |
| `longitude`       | String      | Optional             | Longitude coordinate   |
| `latitude`        | String      | Optional             | Latitude coordinate    |
| `userId`          | String      | FK, Unique, Optional | User reference         |
| `travelPackageId` | String      | FK, Unique, Optional | Package reference      |

**Constraint:** Either `userId` or `travelPackageId` must be set (not both)

---

### Bb_travelPackage

Travel package/tour offering.

| Field                   | Type                  | Constraints          | Description                       |
| ----------------------- | --------------------- | -------------------- | --------------------------------- |
| `id`                    | String                | PK, CUID             | Identifier                        |
| `agentId`               | String                | FK, Required         | Agent who created it              |
| `title`                 | String                | Required             | Package title                     |
| `description`           | String                | Required             | Description                       |
| `pricePerPerson`        | Float                 | Required             | Price per person (INR)            |
| `packageApprovedStatus` | PackageApprovedStatus | Default: PENDING     | Admin approval status             |
| `discountPercentage`    | Int                   | Optional, Default: 0 | Discount percentage               |
| `gstPercentage`         | Int                   | Optional, Default: 0 | GST percentage                    |
| `totalSeats`            | Int                   | Default: 0           | Total available seats             |
| `seatsAvailable`        | Int                   | Default: 0           | Remaining available seats         |
| `seatsBooked`           | Int                   | Default: 0           | Currently booked seats            |
| `destination`           | String                | Required             | Destination name                  |
| `durationDays`          | Int                   | Required             | Trip duration in days             |
| `packageType`           | PackageType           | Default: DAILY       | Type of package (DAILY/MULTI_DAY) |
| `startDate`             | DateTime              | Optional             | Trip start date                   |
| `endDate`               | DateTime              | Optional             | Trip end date                     |
| `packageBannerImageId`  | String                | FK, Unique, Optional | Banner image                      |
| `isBookingActive`       | Boolean               | Default: true        | Can users book this package       |
| `isDeleted`             | Boolean               | Default: false       | Soft delete flag                  |
| `createdAt`             | DateTime              | Default: now()       | Creation timestamp                |
| `updatedAt`             | DateTime              | Auto-update          | Last update timestamp             |
| `tags`                  | String[]              | Array                | Package tags/keywords             |

**Relations:**

- `agent`: Many-to-One with `Bb_agentProfile` (CASCADE delete)
- `PackageBannerImage`: One-to-One with `Bb_image`
- `address`: One-to-One with `Bb_address`
- `reviews`: One-to-Many with `Bb_packageReview`
- `itinerary`: One-to-Many with `Bb_itineraryDay`
- `bookings`: One-to-Many with `Bb_booking`
- `packagesImages`: One-to-Many with `Bb_image`

---

### Bb_image

Image storage metadata (Cloudinary integration).

| Field             | Type     | Constraints              | Description               |
| ----------------- | -------- | ------------------------ | ------------------------- |
| `id`              | String   | PK, CUID                 | Identifier                |
| `imageUrl`        | String   | Required                 | Cloudinary URL            |
| `fileId`          | String   | Optional                 | Cloudinary file/public ID |
| `isDeleted`       | Boolean  | Optional, Default: false | Soft delete               |
| `createdAt`       | DateTime | Default: now()           | Upload timestamp          |
| `userProfile`     | Relation | Optional                 | User profile picture      |
| `agentBanner`     | Relation | Optional                 | Agent banner image        |
| `packageBanner`   | Relation | Optional                 | Package banner image      |
| `travelPackage`   | Relation | Optional                 | Package gallery image     |
| `travelPackageId` | String   | FK, Optional             | Package reference         |
| `userId`          | String   | Optional                 | User reference            |
| `agentId`         | String   | Optional                 | Agent reference           |

---

### Bb_itineraryDay

Day-by-day itinerary for travel packages.

| Field         | Type     | Constraints    | Description              |
| ------------- | -------- | -------------- | ------------------------ |
| `id`          | String   | PK, CUID       | Identifier               |
| `dayNumber`   | Int      | Required       | Day sequence (1-indexed) |
| `title`       | String   | Required       | Day title                |
| `description` | String   | Optional       | Day description          |
| `packageId`   | String   | FK, Required   | Package reference        |
| `createdAt`   | DateTime | Default: now() | Creation timestamp       |

**Constraint:** Unique combination of `packageId` and `dayNumber`

---

### Bb_booking

Booking record for travel packages.

| Field                | Type          | Constraints      | Description                             |
| -------------------- | ------------- | ---------------- | --------------------------------------- |
| `id`                 | String        | PK, CUID         | Identifier                              |
| `bookingCode`        | String        | Unique, Required | Human-readable booking code             |
| `userId`             | String        | FK, Required     | Traveler reference                      |
| `packageId`          | String        | FK, Required     | Package reference                       |
| `numberOfTravelers`  | Int           | Default: 1       | Number of travelers                     |
| `visiteDate`         | DateTime      | Optional         | Planned visit date                      |
| `status`             | BookingStatus | Default: PENDING | Current booking status                  |
| `pricePerPerson`     | Float         | Required         | Snapshot of package price               |
| `gstPercentage`      | Int           | Default: 0       | Snapshot of package GST                 |
| `discountPercentage` | Int           | Default: 0       | Snapshot of package discount            |
| `baseAmount`         | Float         | Required         | numberOfTravelers × pricePerPerson      |
| `gstAmount`          | Float         | Default: 0       | baseAmount × (gstPercentage / 100)      |
| `discountAmount`     | Float         | Default: 0       | baseAmount × (discountPercentage / 100) |
| `totalAmount`        | Float         | Required         | baseAmount + gstAmount - discountAmount |
| `cancellationReason` | String        | Optional         | Reason for cancellation                 |
| `cancelledAt`        | DateTime      | Optional         | Cancellation timestamp                  |
| `cancelledBy`        | CancelledBy   | Optional         | Who cancelled (USER/AGENT/PLATFORM)     |
| `refundableAmount`   | Float         | Optional         | Amount eligible for refund              |
| `createdAt`          | DateTime      | Default: now()   | Booking timestamp                       |
| `updatedAt`          | DateTime      | Auto-update      | Last update timestamp                   |

**Relations:**

- `user`: Many-to-One with `Bb_user`
- `travelPackage`: Many-to-One with `Bb_travelPackage`
- `payments`: One-to-Many with `Bb_payment` (CASCADE delete)

---

### Bb_payment

Payment transaction records (supports retries, partial payments, refunds).

| Field         | Type          | Constraints      | Description                      |
| ------------- | ------------- | ---------------- | -------------------------------- |
| `id`          | String        | PK, CUID         | Identifier                       |
| `bookingId`   | String        | FK, Required     | Booking reference                |
| `paymentRef`  | String        | Unique, Required | Unique payment attempt reference |
| `amount`      | Float         | Required         | Payment amount (INR)             |
| `currency`    | String        | Default: "INR"   | Currency code                    |
| `method`      | PaymentMethod | Default: CARD    | Payment method used              |
| `provider`    | ProviderType  | Default: OTHER   | Payment gateway provider         |
| `providerRef` | String        | Optional         | Provider's transaction ID        |
| `status`      | PaymentStatus | Default: PENDING | Payment status                   |
| `metadata`    | Json          | Optional         | Additional provider data         |
| `createdAt`   | DateTime      | Default: now()   | Creation timestamp               |
| `processedAt` | DateTime      | Optional         | Processing timestamp             |
| `updatedAt`   | DateTime      | Auto-update      | Last update timestamp            |

**Relations:**

- `booking`: Many-to-One with `Bb_booking`

**Indexes:**

- Index on `bookingId`
- Index on `status`

---

### Bb_packageReview

Reviews for travel packages (one per user per package).

| Field       | Type     | Constraints    | Description        |
| ----------- | -------- | -------------- | ------------------ |
| `id`        | String   | PK, CUID       | Identifier         |
| `rating`    | Int      | Required       | Rating value (1-5) |
| `comment`   | String   | Optional       | Review comment     |
| `createdAt` | DateTime | Default: now() | Review timestamp   |
| `packageId` | String   | FK, Required   | Package reference  |
| `userId`    | String   | FK, Required   | Reviewer reference |

**Relations:**

- `travelPackage`: Many-to-One with `Bb_travelPackage` (CASCADE delete)
- `user`: Many-to-One with `Bb_user`

**Constraint:** Unique combination of `packageId` and `userId`

---

### Bb_agentReview

Reviews for travel agents (one per user per agent).

| Field       | Type     | Constraints    | Description        |
| ----------- | -------- | -------------- | ------------------ |
| `id`        | String   | PK, CUID       | Identifier         |
| `rating`    | Int      | Required       | Rating value (1-5) |
| `comment`   | String   | Optional       | Review comment     |
| `createdAt` | DateTime | Default: now() | Review timestamp   |
| `agentId`   | String   | FK, Required   | Agent reference    |
| `userId`    | String   | FK, Required   | Reviewer reference |

**Relations:**

- `agent`: Many-to-One with `Bb_agentProfile` (CASCADE delete)
- `user`: Many-to-One with `Bb_user`

**Constraint:** Unique combination of `agentId` and `userId`

---

### Bb_platformReview

Reviews for the platform itself (one per user).

| Field       | Type     | Constraints          | Description        |
| ----------- | -------- | -------------------- | ------------------ |
| `id`        | String   | PK, CUID             | Identifier         |
| `rating`    | Int      | Required             | Rating value (1-5) |
| `comment`   | String   | Optional             | Review comment     |
| `createdAt` | DateTime | Default: now()       | Review timestamp   |
| `userId`    | String   | FK, Unique, Required | Reviewer reference |

**Relations:**

- `user`: One-to-One with `Bb_user`

---

### Bb_notification

Notification records for users.

| Field       | Type             | Constraints    | Description          |
| ----------- | ---------------- | -------------- | -------------------- |
| `id`        | String           | PK, CUID       | Identifier           |
| `userId`    | String           | FK, Required   | Recipient reference  |
| `type`      | NotificationType | Required       | Notification type    |
| `title`     | String           | Required       | Notification title   |
| `message`   | String           | Required       | Notification message |
| `isRead`    | Boolean          | Default: false | Read status          |
| `createdAt` | DateTime         | Default: now() | Creation timestamp   |

**Relations:**

- `user`: Many-to-One with `Bb_user`

---

## Relationships

### One-to-One Relationships

| Parent              | Child                | Notes                        |
| ------------------- | -------------------- | ---------------------------- |
| `Bb_user`           | `Bb_agentProfile`    | User is agent (optional)     |
| `Bb_user`           | `Bb_address`         | User has one primary address |
| `Bb_user`           | `Bb_image` (profile) | Profile picture              |
| `Bb_agentProfile`   | `Bb_image` (banner)  | Agent banner image           |
| `Bb_travelPackage`  | `Bb_address`         | Package destination address  |
| `Bb_travelPackage`  | `Bb_image` (banner)  | Package banner image         |
| `Bb_platformReview` | `Bb_user`            | User has one platform review |

### One-to-Many Relationships

| Parent             | Child              | Cascade Delete |
| ------------------ | ------------------ | -------------- |
| `Bb_user`          | `Bb_optionalPhone` | ✓              |
| `Bb_user`          | `Bb_booking`       | ✓              |
| `Bb_user`          | `Bb_agentReview`   | ✓              |
| `Bb_user`          | `Bb_packageReview` | ✓              |
| `Bb_user`          | `Bb_notification`  | ✓              |
| `Bb_agentProfile`  | `Bb_document`      | ✓              |
| `Bb_agentProfile`  | `Bb_travelPackage` | ✓              |
| `Bb_agentProfile`  | `Bb_agentReview`   | ✓              |
| `Bb_travelPackage` | `Bb_image`         | ✗              |
| `Bb_travelPackage` | `Bb_itineraryDay`  | ✗              |
| `Bb_travelPackage` | `Bb_booking`       | ✗              |
| `Bb_travelPackage` | `Bb_packageReview` | ✓              |
| `Bb_booking`       | `Bb_payment`       | ✓              |

---

## Constraints & Indexes

### Unique Constraints

| Model               | Field(s)                   | Purpose                         |
| ------------------- | -------------------------- | ------------------------------- |
| `Bb_user`           | `email`                    | Single account per email        |
| `Bb_user`           | `phone`                    | Single phone per user           |
| `Bb_user`           | `profileImageId`           | One profile image               |
| `Bb_agentProfile`   | `userId`                   | One profile per agent           |
| `Bb_agentProfile`   | `bannerImageId`            | One banner per agent            |
| `Bb_optionalPhone`  | `phoneNumber`              | Global phone uniqueness         |
| `Bb_booking`        | `bookingCode`              | Human-readable ID               |
| `Bb_payment`        | `paymentRef`               | Payment iteration tracking      |
| `Bb_packageReview`  | [`packageId`, `userId`]    | One review per user per package |
| `Bb_agentReview`    | [`agentId`, `userId`]      | One review per user per agent   |
| `Bb_platformReview` | `userId`                   | One platform review per user    |
| `Bb_address`        | [`packageId`]              | One address per package         |
| `Bb_address`        | [`userId`]                 | One address per user            |
| `Bb_itineraryDay`   | [`packageId`, `dayNumber`] | One entry per day per package   |
| `Bb_travelPackage`  | `packageBannerImageId`     | One banner per package          |

### Indexes

| Model        | Field(s)    | Purpose                 |
| ------------ | ----------- | ----------------------- |
| `Bb_payment` | `bookingId` | Fast booking lookup     |
| `Bb_payment` | `status`    | Query by payment status |

---

## Notes

- **Soft Deletes:** `isDeleted` flag used instead of hard deletes for audit trail
- **Price Snapshots:** Booking stores price/tax/discount snapshots at booking time
- **Cascading:** Agent deletion cascades to packages, documents, and reviews
- **CUID:** All IDs use CUID for scalable, URL-safe unique identifiers
- **Timestamps:** `createdAt` immutable, `updatedAt` auto-updates
- **Metadata:** Payment `metadata` stores flexible provider-specific data
