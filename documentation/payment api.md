# Payment API Documentation

## Overview

The Payment Router handles all payment-related operations including order creation and payment verification using Razorpay payment gateway. These endpoints are used for booking travel packages on the BatioBhai platform.

**Base URL:** `/api/v1/payment`

**User Role:** Authenticated users (TRAVELER, AGENT, ADMIN, ROOTADMIN)

**Payment Gateway:** Razorpay

**Route File:** `/src/routes/payment.route.ts`

**Controller File:** `/src/controller/payement/payment.controller.ts`

**Middleware:** `/src/middlewares/auth.middleware.ts`

**Validation:** `/src/validators/payment.validator.ts`

---

## Table of Contents

1. [Create Order](#create-order)
2. [Verify Payment](#verify-payment)

---

## Create Order

### Endpoint

```
POST /api/v1/payment/create-order
```

### Description

Creates a new booking order and initializes a Razorpay payment. This endpoint handles the complete booking flow including seat reservation, price calculation with discounts and taxes, and Razorpay order creation.

**Authorization:** Requires authentication (any authenticated user)

### Request Headers

```
Authorization: Bearer <access_token>
Content-Type: application/json
Cookie: accesstoken=<token>
```

### Request Body

```json
{
  "packageId": "clz3a2b3c4d5e6f7g8h9i0j1",
  "numberOfTravelers": 2
}
```

### Request Body Validation

| Field             | Type   | Required | Rules              | Notes                       |
| ----------------- | ------ | -------- | ------------------ | --------------------------- |
| packageId         | string | Yes      | Valid package ID   | Must be an existing package |
| numberOfTravelers | number | Yes      | Minimum 1, integer | Number of travelers booking |

### Success Response

**Status Code:** `201 Created`

```json
{
  "success": true,
  "statusCode": 201,
  "data": {
    "orderId": "order_NXR8J9HDk2L3Mn",
    "amount": 28350,
    "currency": "INR",
    "bookingId": "clz5a2b3c4d5e6f7g8h9i0j6",
    "bookingCode": "BK1709635200ABC12",
    "paymentId": "clz5a2b3c4d5e6f7g8h9i0j7",
    "packageTitle": "Manali Adventure Tour",
    "numberOfTravelers": 2,
    "breakdown": {
      "baseAmount": 30000,
      "discountAmount": 3000,
      "taxAmount": 1350,
      "totalAmount": 28350
    },
    "razorpayKeyId": "rzp_test_xxxxxxxxxxxxx"
  },
  "message": "Order created successfully"
}
```

### Error Responses

#### 1. Validation Error - Invalid Package ID

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "statusCode": 400,
  "data": null,
  "message": "Validation failed",
  "errors": [
    {
      "code": "invalid_type",
      "path": ["packageId"],
      "message": "Required"
    }
  ]
}
```

#### 2. Package Not Found

**Status Code:** `404 Not Found`

```json
{
  "success": false,
  "statusCode": 404,
  "data": null,
  "message": "Travel package not found",
  "errors": [
    {
      "field": "packageId",
      "message": "Package does not exist or has been deleted"
    }
  ]
}
```

#### 3. Booking Not Active

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "statusCode": 400,
  "data": null,
  "message": "Booking is not active for this package",
  "errors": [
    {
      "field": "isBookingActive",
      "message": "This package is not currently accepting bookings"
    }
  ]
}
```

#### 4. Booking Not Started Yet

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "statusCode": 400,
  "data": null,
  "message": "Booking has not started yet",
  "errors": [
    {
      "field": "bookingActiveFrom",
      "message": "Booking opens on 2026-04-01T00:00:00.000Z"
    }
  ]
}
```

#### 5. Booking Period Ended

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "statusCode": 400,
  "data": null,
  "message": "Booking period has ended",
  "errors": [
    {
      "field": "bookingEndAt",
      "message": "This package is no longer accepting bookings"
    }
  ]
}
```

#### 6. Insufficient Seats

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "statusCode": 400,
  "data": null,
  "message": "Insufficient seats available",
  "errors": [
    {
      "field": "seatsAvailable",
      "message": "Only 1 seats available, but 2 requested"
    }
  ]
}
```

#### 7. User Not Authenticated

**Status Code:** `401 Unauthorized`

```json
{
  "success": false,
  "statusCode": 401,
  "data": null,
  "message": "Authentication required",
  "errors": [
    {
      "field": "userId",
      "message": "User not authenticated"
    }
  ]
}
```

### Data Flow

```
1. User submits booking request with packageId and numberOfTravelers
   ↓
2. Validate request body with Zod schema
   ↓ (if validation fails)
   Return 400 error
   ↓ (if validation passes)
3. Fetch travel package from database
   ↓ (if not found)
   Return 404 error
   ↓ (if found)
4. Validate booking eligibility:
   - Check if booking is active
   - Check if booking period is valid (between bookingActiveFrom and bookingEndAt)
   - Check if sufficient seats available
   ↓ (if any check fails)
   Return 400 error with specific reason
   ↓ (if all checks pass)
5. Calculate pricing:
   - baseAmount = pricePerPerson × numberOfTravelers
   - discountAmount = based on discountPercentage or discountAmount
   - amountAfterDiscount = baseAmount - discountAmount
   - taxAmount = amountAfterDiscount × taxPercentage (if withTax is true)
   - totalAmount = amountAfterDiscount + taxAmount
   ↓
6. Generate unique booking code: BK{timestamp}{random5chars}
   ↓
7. Create Razorpay order with totalAmount in paise (INR × 100)
   ↓
8. START DATABASE TRANSACTION
   ↓
9. Create booking record with:
   - bookingCode, userId, packageId, numberOfTravelers
   - status: PENDING, paymentStatus: PENDING
   - baseAmount, taxAmount, discountAmount, totalAmount
   ↓
10. Update package seat availability:
    - Decrement seatsAvailable by numberOfTravelers
    - Increment seatBooked by numberOfTravelers
    ↓
11. Create payment record with:
    - bookingId, type: BOOKING, status: PENDING
    - amount: totalAmount, currency: INR
    - provider: RAZORPAY, providerRef: orderId
    ↓
12. COMMIT TRANSACTION
    ↓
13. Return response with:
    - Razorpay order details
    - Booking and payment IDs
    - Price breakdown
    - Razorpay key ID for frontend initialization
```

### Database Operations (Transaction)

**Primary Tables:** `Bb_booking`, `Bb_payment`, `Bb_travelPackage`

**Prisma Schema:** `/src/prisma/schema.prisma`

**Database Client:** `/src/config/database.ts`

#### Step 1: Fetch Travel Package

```sql
SELECT id, title, pricePerPerson, discountAmount, discountPercentage,
       withTax, taxPercentage, seatsAvailable, isBookingActive,
       bookingActiveFrom, bookingEndAt
FROM "Bb_travelPackage"
WHERE id = 'package_id' AND isDeleted = false;
```

#### Step 2: Create Booking

```sql
INSERT INTO "Bb_booking" (
  id, bookingCode, userId, packageId, numberOfTravelers,
  status, paymentStatus, baseAmount, taxAmount, discountAmount, totalAmount,
  createdAt, updatedAt
) VALUES (
  GENERATED_CUID, 'BK1709635200ABC12', 'user_id', 'package_id', 2,
  'PENDING', 'PENDING', 30000, 1350, 3000, 28350,
  NOW(), NOW()
);
```

#### Step 3: Update Package Seats

```sql
UPDATE "Bb_travelPackage"
SET seatsAvailable = seatsAvailable - 2,
    seatBooked = seatBooked + 2
WHERE id = 'package_id';
```

#### Step 4: Create Payment

```sql
INSERT INTO "Bb_payment" (
  id, bookingId, type, status, amount, currency,
  provider, providerRef, isRefund, createdAt, updatedAt
) VALUES (
  GENERATED_CUID, 'booking_id', 'BOOKING', 'PENDING', 28350, 'INR',
  'RAZORPAY', 'order_NXR8J9HDk2L3Mn', false, NOW(), NOW()
);
```

### Database State After Order Creation

```typescript
// Bb_booking Table
{
  id: "clz5a2b3c4d5e6f7g8h9i0j6",
  bookingCode: "BK1709635200ABC12",
  userId: "user_id",
  packageId: "package_id",
  numberOfTravelers: 2,
  status: "PENDING",
  paymentStatus: "PENDING",
  baseAmount: 30000,
  taxAmount: 1350,
  discountAmount: 3000,
  totalAmount: 28350,
  refundableAmount: null,
  cancellationReason: null,
  cancelledAt: null,
  cancelledBy: null,
  createdAt: "2026-03-04T10:30:00.000Z",
  updatedAt: "2026-03-04T10:30:00.000Z"
}

// Bb_payment Table
{
  id: "clz5a2b3c4d5e6f7g8h9i0j7",
  bookingId: "clz5a2b3c4d5e6f7g8h9i0j6",
  type: "BOOKING",
  status: "PENDING",
  amount: 28350,
  currency: "INR",
  provider: "RAZORPAY",
  providerRef: "order_NXR8J9HDk2L3Mn",
  isRefund: false,
  createdAt: "2026-03-04T10:30:00.000Z",
  updatedAt: "2026-03-04T10:30:00.000Z"
}

// Bb_travelPackage Table (Updated)
{
  seatsAvailable: 13, // Decreased from 15 to 13
  seatBooked: 7 // Increased from 5 to 7
}
```

### Razorpay Integration

#### Razorpay Order Creation

```javascript
// Backend creates order
const razorpayOrder = await razorpayInstance.orders.create({
  amount: 2835000, // Amount in paise (28350 INR × 100)
  currency: "INR",
  receipt: "BK1709635200ABC12",
  notes: {
    packageId: "clz3a2b3c4d5e6f7g8h9i0j1",
    packageTitle: "Manali Adventure Tour",
    userId: "user_id",
    numberOfTravelers: "2",
    bookingCode: "BK1709635200ABC12",
  },
});
```

#### Frontend Integration Example

```javascript
// Initialize Razorpay with order details from backend
const options = {
  key: response.data.razorpayKeyId,
  amount: response.data.amount,
  currency: response.data.currency,
  order_id: response.data.orderId,
  name: "BatioBhai",
  description: response.data.packageTitle,
  handler: function (razorpayResponse) {
    // Send verification request to backend
    fetch("/api/v1/payment/verify-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
      body: JSON.stringify({
        razorpay_order_id: razorpayResponse.razorpay_order_id,
        razorpay_payment_id: razorpayResponse.razorpay_payment_id,
        razorpay_signature: razorpayResponse.razorpay_signature,
        bookingId: response.data.bookingId,
        paymentId: response.data.paymentId,
      }),
    });
  },
};

const razorpay = new Razorpay(options);
razorpay.open();
```

### Postman Testing

```
Method: POST
URL: http://localhost:3000/api/v1/payment/create-order
Headers:
  Content-Type: application/json
  Cookie: accesstoken=<your_access_token>
Body:
{
  "packageId": "clz3a2b3c4d5e6f7g8h9i0j1",
  "numberOfTravelers": 2
}
```

---

## Verify Payment

### Endpoint

```
POST /api/v1/payment/verify-payment
```

### Description

Verifies the Razorpay payment signature and confirms the booking. This endpoint must be called after successful payment completion on the frontend using the Razorpay response.

**Authorization:** Requires authentication (any authenticated user)

### Request Headers

```
Authorization: Bearer <access_token>
Content-Type: application/json
Cookie: accesstoken=<token>
```

### Request Body

```json
{
  "razorpay_order_id": "order_NXR8J9HDk2L3Mn",
  "razorpay_payment_id": "pay_NXR8J9HDk2L3Mo",
  "razorpay_signature": "9c5e8f72a3b4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7",
  "bookingId": "clz5a2b3c4d5e6f7g8h9i0j6",
  "paymentId": "clz5a2b3c4d5e6f7g8h9i0j7"
}
```

### Request Body Validation

| Field               | Type   | Required | Rules                              | Notes                                 |
| ------------------- | ------ | -------- | ---------------------------------- | ------------------------------------- |
| razorpay_order_id   | string | Yes      | Valid Razorpay order ID            | Received from Razorpay after payment  |
| razorpay_payment_id | string | Yes      | Valid Razorpay payment ID          | Received from Razorpay after payment  |
| razorpay_signature  | string | Yes      | Valid signature                    | Received from Razorpay after payment  |
| bookingId           | string | Yes      | Valid booking ID from create-order | Booking ID from create-order response |
| paymentId           | string | Yes      | Valid payment ID from create-order | Payment ID from create-order response |

### Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "statusCode": 200,
  "data": null,
  "message": "Payment verified successfully and booking confirmed"
}
```

### Error Responses

#### 1. Invalid Signature

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "statusCode": 400,
  "data": null,
  "message": "Invalid payment signature",
  "errors": [
    {
      "field": "razorpay_signature",
      "message": "Payment verification failed - signature mismatch"
    }
  ]
}
```

#### 2. Validation Error - Missing Fields

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "statusCode": 400,
  "data": null,
  "message": "Invalid data to verify the payment",
  "errors": [
    {
      "code": "invalid_type",
      "path": ["razorpay_payment_id"],
      "message": "Required"
    }
  ]
}
```

#### 3. Payment or Booking Not Found

**Status Code:** `404 Not Found` or `500 Internal Server Error`

```json
{
  "success": false,
  "statusCode": 404,
  "data": null,
  "message": "Payment or booking record not found",
  "errors": []
}
```

### Data Flow

```
1. User completes payment on Razorpay frontend
   ↓
2. Frontend receives payment response with:
   - razorpay_order_id
   - razorpay_payment_id
   - razorpay_signature
   ↓
3. Frontend sends verification request to backend
   ↓
4. Validate request body with Zod schema
   ↓ (if validation fails)
   Return 400 error
   ↓ (if validation passes)
5. Generate signature using HMAC SHA256:
   - Input: razorpay_order_id|razorpay_payment_id
   - Secret: RAZORPAY_KEY_SECRET
   ↓
6. Compare generated signature with razorpay_signature
   ↓ (if mismatch)
   Return 400 error
   ↓ (if match)
7. START DATABASE TRANSACTION
   ↓
8. Update payment status to SUCCESS
   ↓
9. Update booking status to CONFIRMED
   ↓
10. Update booking paymentStatus to SUCCESS
    ↓
11. COMMIT TRANSACTION
    ↓
12. Return success response
    ↓
13. (Optional) Send confirmation email/notification
```

### Database Operations (Transaction)

**Primary Tables:** `Bb_payment`, `Bb_booking`

**Prisma Schema:** `/src/prisma/schema.prisma`

**Database Client:** `/src/config/database.ts`

#### Step 1: Update Payment Status

```sql
UPDATE "Bb_payment"
SET status = 'SUCCESS'
WHERE id = 'payment_id';
```

#### Step 2: Update Booking Status

```sql
UPDATE "Bb_booking"
SET status = 'CONFIRMED',
    paymentStatus = 'SUCCESS',
    updatedAt = NOW()
WHERE id = 'booking_id';
```

### Database State After Payment Verification

```typescript
// Before Verification
// Bb_payment Table
{
  id: "clz5a2b3c4d5e6f7g8h9i0j7",
  bookingId: "clz5a2b3c4d5e6f7g8h9i0j6",
  status: "PENDING", // ← Will change to SUCCESS
  // ... other fields
}

// Bb_booking Table
{
  id: "clz5a2b3c4d5e6f7g8h9i0j6",
  status: "PENDING", // ← Will change to CONFIRMED
  paymentStatus: "PENDING", // ← Will change to SUCCESS
  // ... other fields
}

// After Verification
// Bb_payment Table
{
  id: "clz5a2b3c4d5e6f7g8h9i0j7",
  bookingId: "clz5a2b3c4d5e6f7g8h9i0j6",
  status: "SUCCESS", // ← Updated
  updatedAt: "2026-03-04T10:32:15.000Z", // ← Updated
  // ... other fields
}

// Bb_booking Table
{
  id: "clz5a2b3c4d5e6f7g8h9i0j6",
  status: "CONFIRMED", // ← Updated
  paymentStatus: "SUCCESS", // ← Updated
  updatedAt: "2026-03-04T10:32:15.000Z", // ← Updated
  // ... other fields
}
```

### Signature Verification Logic

```javascript
// Backend verification code
import crypto from "crypto";

const generatedSignature = crypto
  .createHmac("sha256", RAZORPAY_KEY_SECRET)
  .update(`${razorpay_order_id}|${razorpay_payment_id}`)
  .digest("hex");

if (generatedSignature !== razorpay_signature) {
  throw new Error("Invalid payment signature");
}
```

### Postman Testing

```
Method: POST
URL: http://localhost:3000/api/v1/payment/verify-payment
Headers:
  Content-Type: application/json
  Cookie: accesstoken=<your_access_token>
Body:
{
  "razorpay_order_id": "order_NXR8J9HDk2L3Mn",
  "razorpay_payment_id": "pay_NXR8J9HDk2L3Mo",
  "razorpay_signature": "9c5e8f72a3b4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7",
  "bookingId": "clz5a2b3c4d5e6f7g8h9i0j6",
  "paymentId": "clz5a2b3c4d5e6f7g8h9i0j7"
}
```

**Note:** For Postman testing, you need to obtain real Razorpay payment response values by completing a test payment through the Razorpay test mode.

---

## Payment Flow Diagram

```
┌─────────────────┐
│   User/Client   │
└────────┬────────┘
         │
         │ 1. POST /create-order
         │    {packageId, numberOfTravelers}
         ↓
┌─────────────────┐
│   Backend API   │
└────────┬────────┘
         │
         │ 2. Validate & Calculate
         │ 3. Create Razorpay Order
         │ 4. Create Booking (PENDING)
         │ 5. Create Payment (PENDING)
         │ 6. Reserve Seats
         ↓
┌─────────────────┐
│   Return Order  │
│   Details +     │
│   Razorpay Key  │
└────────┬────────┘
         │
         │ 7. Frontend initializes Razorpay checkout
         ↓
┌─────────────────┐
│   Razorpay UI   │
│   (Payment)     │
└────────┬────────┘
         │
         │ 8. User completes payment
         │ 9. Razorpay response:
         │    {order_id, payment_id, signature}
         ↓
┌─────────────────┐
│   Frontend      │
└────────┬────────┘
         │
         │ 10. POST /verify-payment
         │     {razorpay_order_id, razorpay_payment_id,
         │      razorpay_signature, bookingId, paymentId}
         ↓
┌─────────────────┐
│   Backend API   │
└────────┬────────┘
         │
         │ 11. Verify Signature
         │ 12. Update Payment (SUCCESS)
         │ 13. Update Booking (CONFIRMED)
         ↓
┌─────────────────┐
│   Booking       │
│   Confirmed     │
└─────────────────┘
```

---

## Environment Variables Required

### Razorpay Configuration

```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret_key
```

These variables must be set in your `.env` file and validated through `/src/validators/env.validator.ts`.

---

## Security Considerations

1. **Signature Verification**: Always verify Razorpay signature on the backend to ensure payment authenticity
2. **HTTPS Only**: Payment endpoints should only be accessible over HTTPS in production
3. **Authentication**: All payment endpoints require user authentication
4. **Transaction Safety**: Database transactions ensure data consistency
5. **Idempotency**: Consider implementing idempotency checks to prevent duplicate payments
6. **Secret Keys**: Never expose Razorpay secret keys to the frontend

---

## Booking Status Flow

```
PENDING → CONFIRMED → COMPLETED
   ↓          ↓
CANCELLED  REFUNDED
   ↑          ↑
REFUND_PENDING
```

---

## Payment Status Flow

```
PENDING → SUCCESS
   ↓
FAILED
   ↓
REFUNDED
```

---

## Common Issues and Troubleshooting

### Issue 1: Payment Successful but Booking Not Confirmed

**Cause:** Signature verification failed or transaction failed after payment
**Solution:** Check Razorpay webhook logs and database transaction logs

### Issue 2: Seats Already Booked

**Cause:** Race condition or seats taken during payment process
**Solution:** Implement seat reservation with timeout

### Issue 3: Payment Verification Timeout

**Cause:** Network issues or server delays
**Solution:** Implement retry mechanism with exponential backoff

---

## Future Enhancements

1. **Refund API**: Endpoint for processing refunds
2. **Payment History**: Endpoint to fetch user's payment history
3. **Webhook Handler**: Razorpay webhook for automatic payment status updates
4. **Partial Payments**: Support for advance payment and EMI
5. **Multiple Payment Gateways**: Support for Stripe, PayPal, etc.
6. **Coupon Codes**: Discount codes and promotional offers
7. **Wallet Integration**: Support for wallet payments

---

## Contact Information

For payment-related issues or Razorpay integration support:

- Backend Team: [Contact Information]
- Razorpay Support: https://razorpay.com/support/

For API documentation issues, please refer to the main backend documentation.
