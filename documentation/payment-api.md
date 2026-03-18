# Payment API

**Base URL:** `/api/v1/payment`

All endpoints require `authMiddleware` (valid JWT in `accesstoken` cookie).

Payment integration uses **Razorpay** as the payment gateway.

---

## Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/create-order` | Yes | Create a Razorpay order and internal booking/payment records |
| POST | `/verify-payment` | Yes | Verify Razorpay signature and confirm booking |

---

## POST `/create-order`

Create a Razorpay order for booking a travel package. Also creates internal booking and payment records.

### Request Body

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `packageId` | string | Yes | Non-empty, valid package ID |
| `numberOfTravelers` | number | Yes | Positive integer, minimum 1 |

```json
{
  "packageId": "package_cuid",
  "numberOfTravelers": 2
}
```

### Success Response

**Status:** `201 Created`

```json
{
  "statusCode": 201,
  "data": {
    "orderId": "order_xxx",
    "amount": 1000000,
    "currency": "INR",
    "bookingId": "booking_cuid",
    "bookingCode": "BK-1234567890",
    "paymentId": "payment_cuid",
    "packageTitle": "Goa Beach Package",
    "numberOfTravelers": 2,
    "breakdown": {
      "baseAmount": 10000,
      "discountAmount": 1000,
      "taxAmount": 1620,
      "totalAmount": 10620
    },
    "razorpayKeyId": "rzp_test_xxx"
  },
  "message": "Order created successfully"
}
```

### Price Calculation

```
baseAmount = pricePerPerson * numberOfTravelers

If discountPercentage:
  discountAmount = (baseAmount * discountPercentage) / 100
Else if discountAmount:
  discountAmount = discountAmount * numberOfTravelers

amountAfterDiscount = baseAmount - discountAmount

If withTax = true:
  taxAmount = (amountAfterDiscount * taxPercentage) / 100

totalAmount = amountAfterDiscount + taxAmount
```

**Note:** The `amount` field in the response is in **paise** (totalAmount * 100) as required by Razorpay.

### Error Responses

| Status | Condition |
|--------|-----------|
| 400 | Invalid input / validation failure |
| 400 | Booking not active for this package |
| 400 | Booking period has not started yet |
| 400 | Booking period has ended |
| 400 | Not enough available seats |
| 401 | Unauthenticated |
| 404 | Package not found |

### Side Effects

- Creates a `Bb_booking` record with status `PENDING`
- Creates a `Bb_payment` record with status `PENDING`
- Creates a Razorpay order via Razorpay SDK
- Decrements `availableSeats` on the package

---

## POST `/verify-payment`

Verify the Razorpay payment signature after the client completes payment. On success, updates booking and payment status.

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `razorpay_order_id` | string | Yes | Razorpay order ID from payment callback |
| `razorpay_payment_id` | string | Yes | Razorpay payment ID from payment callback |
| `razorpay_signature` | string | Yes | Razorpay HMAC signature for verification |
| `bookingId` | string | Yes | Internal booking ID from create-order response |
| `paymentId` | string | Yes | Internal payment ID from create-order response |

```json
{
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "hmac_sha256_signature",
  "bookingId": "booking_cuid",
  "paymentId": "payment_cuid"
}
```

### Success Response

**Status:** `200 OK`

```json
{
  "statusCode": 200,
  "data": null,
  "message": "Payment verified successfully and booking confirmed"
}
```

### Verification Process

1. Generates expected signature: `HMAC-SHA256(razorpay_order_id + "|" + razorpay_payment_id, RAZORPAY_SECRET)`
2. Compares expected signature with `razorpay_signature`
3. On match: updates payment status to `SUCCESS` and booking status to `CONFIRMED`
4. On mismatch: returns 400 error

### Error Responses

| Status | Condition |
|--------|-----------|
| 400 | Invalid payment signature |
| 400 | Validation failure |

### Side Effects

- Updates `Bb_payment.status` to `SUCCESS`
- Updates `Bb_payment.razorpayPaymentId` with the actual payment ID
- Updates `Bb_booking.status` to `CONFIRMED`

---

## Payment Flow

```
1. Client calls POST /create-order with packageId and numberOfTravelers
2. Server creates booking (PENDING) + payment (PENDING) + Razorpay order
3. Server returns orderId, razorpayKeyId, and booking details
4. Client uses Razorpay checkout SDK with orderId and razorpayKeyId
5. User completes payment on Razorpay
6. Razorpay returns razorpay_order_id, razorpay_payment_id, razorpay_signature
7. Client calls POST /verify-payment with all Razorpay values + bookingId + paymentId
8. Server verifies signature and confirms booking
```

## Payment Status Values

| Status | Description |
|--------|-------------|
| `PENDING` | Payment created, awaiting completion |
| `SUCCESS` | Payment verified and confirmed |
| `FAILED` | Payment failed |
| `REFUNDED` | Payment refunded |
