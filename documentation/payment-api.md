# Payment API

**Base URL:** `/api/v1/payment`

## Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/create-order` | Yes | Create Razorpay order + internal booking/payment records. |
| POST | `/verify-payment` | Yes | Verify Razorpay signature and finalize payment status. |

## Create order payload

```json
{
  "packageId": "pkg_cuid",
  "numberOfTravelers": 2
}
```

## Verify payment payload

```json
{
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "signature",
  "bookingId": "booking_cuid",
  "paymentId": "payment_cuid"
}
```
