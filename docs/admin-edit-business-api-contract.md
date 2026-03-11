# Admin Edit Business API Contract

## Why This Exists

The control panel business details screen is an admin view for a specific business by ID.

The existing merchant endpoint:

- `PUT /api/v1/business`

updates the currently authenticated business from a business JWT, which does not fit the admin control panel use case.

## Proposed Admin Endpoint

**Endpoint**

`PUT /api/v1/admin/business/:id`

**Auth**

`Authorization: Bearer <admin JWT>`

**Path Params**

- `id`: business ID being edited

## Request Body

Use the same editable shape as the merchant profile update endpoint so both flows stay aligned:

```json
{
  "businessName": "Firespot Cafe",
  "firespotId": "FSP-001",
  "businessDescription": "A neighborhood cafe and food spot.",
  "registrationNumber": "RC-123456",
  "businessAddress": {
    "state": "Lagos",
    "city": "Ikeja",
    "address": "12 Allen Avenue"
  },
  "websiteUrl": "https://firespot.co",
  "customerSupport": {
    "emailAddress": "support@firespot.co",
    "phoneNumber": {
      "countryCode": "+234",
      "number": "8098765432"
    }
  },
  "industry": "Hospitality",
  "numberOfBranches": "3",
  "socialMediaProfile": {
    "twitterUrl": "https://x.com/firespot",
    "faceBookUrl": "https://facebook.com/firespot",
    "instagramUrl": "https://instagram.com/firespot",
    "tiktokUrl": "https://tiktok.com/@firespot",
    "whatsappUrl": "https://wa.me/2348098765432",
    "customUrl": "https://linktr.ee/firespot"
  },
  "businessImageUrl": "https://example.com/logo.jpg",
  "businessBannerImageUrl": "https://example.com/banner.jpg"
}
```

## Success Response

Status: `200 OK`

```json
{
  "code": "00",
  "message": "Business updated successfully",
  "data": {
    "id": "<businessId>",
    "businessName": "Firespot Cafe",
    "firespotId": "FSP-001",
    "businessDescription": "A neighborhood cafe and food spot.",
    "registrationNumber": "RC-123456",
    "businessMainAddress": {
      "state": "Lagos",
      "city": "Ikeja",
      "address": "12 Allen Avenue"
    },
    "websiteUrl": "https://firespot.co",
    "industry": "Hospitality",
    "numberOfBranches": "3",
    "contactInformation": {
      "customerSupport": {
        "emailAddress": "support@firespot.co",
        "phoneNumber": {
          "countryCode": "+234",
          "number": "8098765432"
        }
      }
    },
    "socialMediaProfile": {
      "twitter": "https://x.com/firespot",
      "facebook": "https://facebook.com/firespot",
      "instagram": "https://instagram.com/firespot",
      "tiktok": "https://tiktok.com/@firespot",
      "website": "https://linktr.ee/firespot"
    },
    "businessImageUrl": "https://example.com/logo.jpg",
    "businessBannerImageUrl": "https://example.com/banner.jpg"
  }
}
```

## Frontend Notes

- The current UI calls `PUT /api/v1/admin/business/:id`.
- After save, the page re-fetches the business detail record so the About tab and header stay in sync.
- Keeping the admin payload aligned with `PUT /api/v1/business` reduces duplication across apps.
