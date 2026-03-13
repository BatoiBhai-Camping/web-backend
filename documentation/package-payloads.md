# Package Payload Reference

This file captures payload shape used by package publish/update validators.

## Publish package (`POST /api/v1/agent/publish-package`)

Required top-level keys:

- `title`, `description`, `pricePerPerson`, `totalSeats`
- `destination`, `durationDays`, `bookingActiveFrom`, `bookingEndAt`
- `bannerImageUrl`, `bannerImageFileId`
- `itineraryDays` (array, minimum 1)

Optional top-level keys:

- `discountAmount`, `discountPercentage`
- `withTax`, `taxPercentage`
- `startDate`, `endDate`
- `packagePolicies`, `cancellationPolicies`
- `packageImages`

## Update package (`POST /api/v1/agent/update-package`)

Required:

- `packageId`

All other package and nested itinerary fields are optional and may include nested IDs for update/delete behavior:

- `itineraryDays[].id`
- `deleteImageIds`, `deleteItineraryDayIds`
- nested delete collections such as `deleteTransportIds`, `deleteVisitIds`, `deleteMealIds`
