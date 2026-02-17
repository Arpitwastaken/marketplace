# Marketplace Data Models

## Core Entities

---

## User

```json
{
  "id": "uuid",
  "email": "string",
  "phone": "string (hashed)",
  "phone_verified_at": "timestamp",
  "id_verified_at": "timestamp",
  "tier": 0 | 1 | 2,
  "created_at": "timestamp",
  "updated_at": "timestamp",
  "stats": {
    "total_listings": "number",
    "completed_transactions": "number",
    "disputes_opened": "number",
    "avg_response_time_hours": "number",
    "completion_rate": "percentage"
  }
}
```

---

## Listing

```json
{
  "id": "uuid",
  "user_id": "uuid (FK)",
  "type": "buy" | "sell",
  "category": "string",
  "title": "string",
  "description": "string",
  "price": "number (nullable for buy)",
  "min_price": "number (buy only)",
  "max_price": "number (buy only)",
  "condition": "new" | "like_new" | "good" | "fair" | "poor",
  "condition_preference": "string (buy only)",
  "location": "string",
  "shipping": {
    "available": "boolean",
    "required": "boolean",
    "estimated_cost": "number"
  },
  "images": ["url"],
  "tags": ["string"],
  "status": "active" | "sold" | "expired" | "flagged",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

---

## Match

```json
{
  "id": "uuid",
  "buyer_listing_id": "uuid (FK)",
  "seller_listing_id": "uuid (FK)",
  "score": "number (0-100)",
  "scores": {
    "tag_match": "number",
    "price_closeness": "number",
    "location": "number",
    "condition": "number",
    "reliability": "number",
    "recency": "number"
  },
  "status": "suggested" | "messaged" | "offer_sent" | "accepted" | "expired",
  "notified_at": "timestamp",
  "created_at": "timestamp"
}
```

---

## Transaction

```json
{
  "id": "uuid",
  "match_id": "uuid (FK)",
  "buyer_id": "uuid (FK)",
  "seller_id": "uuid (FK)",
  "listing_id": "uuid (FK)",
  "amount": "number",
  "escrow_status": "pending" | "held" | "released" | "refunded",
  "escrow_held_at": "timestamp",
  "escrow_released_at": "timestamp",
  "shipping_tracking": "string",
  "delivered_at": "timestamp",
  "buyer_confirmed_at": "timestamp",
  "dispute_status": "none" | "opened" | "resolved_buyer" | "resolved_seller",
  "dispute_reason": "string",
  "created_at": "timestamp",
  "completed_at": "timestamp"
}
```

---

## Dispute

```json
{
  "id": "uuid",
  "transaction_id": "uuid (FK)",
  "opened_by": "uuid (FK)",
  "reason": "string",
  "status": "open" | "under_review" | "resolved",
  "resolution": "buyer_favored" | "seller_favored" | "partial",
  "refund_amount": "number",
  "evidence": ["url"],
  "notes": "string",
  "resolved_at": "timestamp",
  "created_at": "timestamp"
}
```

---

## RiskProfile

```json
{
  "id": "uuid",
  "user_id": "uuid (FK)",
  "risk_score": "number (0-100)",
  "factors": {
    "account_age_days": "number",
    "verification_level": "number",
    "listing_to_transaction_ratio": "number",
    "high_value_listings_count": "number",
    "ip_change_count": "number",
    "dispute_count": "number",
    "flagged_listings_count": "number"
  },
  "flags": ["string"],
  "last_calculated_at": "timestamp"
}
```

---

## Event (for logging/analytics)

```json
{
  "id": "uuid",
  "event_type": "string",
  "user_id": "uuid (FK, nullable)",
  "listing_id": "uuid (FK, nullable)",
  "match_id": "uuid (FK, nullable)",
  "transaction_id": "uuid (FK, nullable)",
  "metadata": "json",
  "device": "string",
  "app_version": "string",
  "created_at": "timestamp"
}
```

---

## Category (for taxonomy)

```json
{
  "id": "uuid",
  "name": "string",
  "slug": "string",
  "parent_id": "uuid (nullable)",
  "tags": ["string"],
  "avg_days_to_sell": "number",
  "conversion_rate": "number",
  "active_listings_count": "number"
}
```

---

## Offer

```json
{
  "id": "uuid",
  "match_id": "uuid (FK)",
  "from_user_id": "uuid (FK)",
  "amount": "number",
  "status": "pending" | "accepted" | "rejected" | "countered" | "expired",
  "counter_amount": "number (nullable)",
  "expires_at": "timestamp",
  "created_at": "timestamp",
  "responded_at": "timestamp"
}
```
