# Package Payload Reference

Detailed payload schemas for package publish and update operations.

---

## Publish Package (`POST /api/v1/agent/publish-package`)

### Full Request Body

```json
{
  "title": "Goa Beach Paradise",
  "description": "5 days exploring the best of Goa",
  "pricePerPerson": 5000,
  "totalSeats": 20,
  "discountAmount": 500,
  "discountPercentage": 10,
  "withTax": true,
  "taxPercentage": 18,
  "destination": "Goa",
  "durationDays": 5,
  "startDate": "2026-04-01T00:00:00.000Z",
  "endDate": "2026-04-05T00:00:00.000Z",
  "bookingActiveFrom": "2026-03-01T00:00:00.000Z",
  "bookingEndAt": "2026-03-28T00:00:00.000Z",
  "packagePolicies": "No refund after 7 days of trip start",
  "cancellationPolicies": "Full refund if cancelled 15 days before",
  "bannerImageUrl": "https://res.cloudinary.com/banner.jpg",
  "bannerImageFileId": "banner_file_123",
  "packageImages": [
    {
      "imageUrl": "https://res.cloudinary.com/img1.jpg",
      "fileId": "img_file_1"
    },
    {
      "imageUrl": "https://res.cloudinary.com/img2.jpg",
      "fileId": "img_file_2"
    }
  ],
  "itineraryDays": [
    {
      "dayNumber": 1,
      "title": "Arrival & North Goa Exploration",
      "description": "Welcome to Goa! Explore North Goa beaches",
      "hotelStay": {
        "hotelName": "Taj Fort Aguada",
        "checkIn": "14:00",
        "checkOut": "12:00",
        "address": "Sinquerim, Candolim, Goa",
        "wifi": true,
        "tv": true,
        "attachWashroom": true,
        "acRoom": true,
        "kitchen": false
      },
      "transports": [
        {
          "fromLocation": "Goa Airport",
          "toLocation": "Hotel",
          "mode": "CAR",
          "startTime": "12:00",
          "endTime": "13:30"
        }
      ],
      "visits": [
        {
          "name": "Baga Beach",
          "address": "Baga, North Goa",
          "description": "Famous beach with water sports",
          "visitTime": "15:00"
        },
        {
          "name": "Fort Aguada",
          "address": "Sinquerim, Candolim",
          "description": "17th century Portuguese fort",
          "visitTime": "17:00"
        }
      ],
      "meals": [
        {
          "type": "LUNCH",
          "mealDescription": "Goan fish thali at local restaurant"
        },
        {
          "type": "DINNER",
          "mealDescription": "Beach-side barbecue dinner"
        }
      ]
    }
  ]
}
```

### Field Reference

#### Top-Level Fields

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `title` | string | Yes | Non-empty | Package title |
| `description` | string | Yes | Non-empty | Package description |
| `pricePerPerson` | number | Yes | Positive | Price per person in INR |
| `totalSeats` | number | Yes | Min 1 | Total seats available |
| `discountAmount` | number | No | Non-negative | Fixed discount per person |
| `discountPercentage` | number | No | 0-100 | Percentage discount |
| `withTax` | boolean | No | | Whether tax applies |
| `taxPercentage` | number | No | 0-100 | Tax percentage |
| `destination` | string | Yes | Non-empty | Destination location |
| `durationDays` | number | Yes | Min 1 | Trip duration in days |
| `startDate` | string | No | ISO 8601 | Trip start date |
| `endDate` | string | No | ISO 8601 | Trip end date |
| `bookingActiveFrom` | string | Yes | ISO 8601 | Booking open date |
| `bookingEndAt` | string | Yes | ISO 8601 | Booking close date |
| `packagePolicies` | string | No | | Policy text |
| `cancellationPolicies` | string | No | | Cancellation policy text |
| `bannerImageUrl` | string | Yes | Valid URL | Banner image URL |
| `bannerImageFileId` | string | Yes | Non-empty | Banner Cloudinary file ID |
| `packageImages` | array | No | | Additional package images |
| `itineraryDays` | array | Yes | Min 1 item | Day-by-day itinerary |

#### Package Image Object

| Field | Type | Required |
|-------|------|----------|
| `imageUrl` | string | Yes |
| `fileId` | string | Yes |

#### Itinerary Day Object

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `dayNumber` | number | Yes | Min 1 |
| `title` | string | Yes | Non-empty |
| `description` | string | No | |
| `hotelStay` | object | No | Hotel accommodation |
| `transports` | array | Yes | Min 1 transport |
| `visits` | array | Yes | Min 1 visit |
| `meals` | array | No | Meals for the day |

#### Hotel Stay Object

| Field | Type | Required | Default |
|-------|------|----------|---------|
| `hotelName` | string | Yes | |
| `checkIn` | string | Yes | |
| `checkOut` | string | Yes | |
| `address` | string | No | |
| `wifi` | boolean | No | false |
| `tv` | boolean | No | false |
| `attachWashroom` | boolean | No | false |
| `acRoom` | boolean | No | false |
| `kitchen` | boolean | No | false |

#### Transport Object

| Field | Type | Required | Values |
|-------|------|----------|--------|
| `fromLocation` | string | Yes | |
| `toLocation` | string | Yes | |
| `mode` | enum | Yes | `BUS`, `TRAIN`, `CAR`, `FLIGHT`, `BOAT`, `WALK`, `OTHER` |
| `startTime` | string | Yes | |
| `endTime` | string | Yes | |

#### Visit Object

| Field | Type | Required |
|-------|------|----------|
| `name` | string | Yes |
| `address` | string | No |
| `description` | string | No |
| `visitTime` | string | Yes |

#### Meal Object

| Field | Type | Required | Values |
|-------|------|----------|--------|
| `type` | enum | Yes | `BREAKFAST`, `LUNCH`, `DINNER` |
| `mealDescription` | string | No | |

---

## Update Package (`POST /api/v1/agent/update-package`)

### Key Differences from Publish

1. `packageId` is **required** (identifies which package to update)
2. All other fields are **optional**
3. Nested items can include `id` for updates or omit `id` for new items
4. Delete arrays allow removing nested items

### Full Request Body Example

```json
{
  "packageId": "existing_package_cuid",
  "title": "Updated Package Title",
  "description": "Updated description",
  "pricePerPerson": 6000,
  "deleteImageIds": ["img_id_to_remove_1", "img_id_to_remove_2"],
  "deleteItineraryDayIds": ["day_id_to_remove"],
  "packageImages": [
    {
      "imageUrl": "https://res.cloudinary.com/new_img.jpg",
      "fileId": "new_img_file"
    }
  ],
  "itineraryDays": [
    {
      "id": "existing_day_cuid",
      "dayNumber": 1,
      "title": "Updated Day 1 Title",
      "transports": [
        {
          "id": "existing_transport_cuid",
          "fromLocation": "Updated Location",
          "toLocation": "Hotel",
          "mode": "CAR",
          "startTime": "13:00",
          "endTime": "14:00"
        },
        {
          "fromLocation": "Hotel",
          "toLocation": "Beach",
          "mode": "WALK",
          "startTime": "15:00",
          "endTime": "15:30"
        }
      ],
      "deleteTransportIds": ["transport_to_remove"],
      "visits": [
        {
          "name": "New Visit Place",
          "visitTime": "16:00"
        }
      ],
      "deleteVisitIds": ["visit_to_remove"],
      "meals": [
        {
          "type": "BREAKFAST",
          "mealDescription": "Updated breakfast"
        }
      ],
      "deleteMealIds": ["meal_to_remove"]
    }
  ]
}
```

### Delete Arrays

| Array | Description |
|-------|-------------|
| `deleteImageIds` | Package image IDs to remove |
| `deleteItineraryDayIds` | Itinerary day IDs to remove (removes all nested items too) |
| `deleteTransportIds` | Transport IDs to remove (within an itinerary day) |
| `deleteVisitIds` | Visit IDs to remove (within an itinerary day) |
| `deleteMealIds` | Meal IDs to remove (within an itinerary day) |

### Update Behavior

- **With `id`:** Updates the existing record with the new values
- **Without `id`:** Creates a new record linked to the package/day
- **In delete arrays:** Removes the specified records
- The entire operation runs in a database transaction
