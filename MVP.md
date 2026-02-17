# MARKETPLACE MVP (v1.0)

## Core Goal
Create a marketplace that:
- Intelligently matches buyers & sellers
- Uses weighted scoring
- Has built-in safety
- Learns from user data
- Is scalable from day one

---

## 1. CORE FEATURES

### A) Post Types

**BUY Post:**
- Category
- Title
- Description
- Min Price
- Max Price
- Condition Preference
- Location
- Shipping required? (Y/N)

**SELL Post:**
- Category
- Title
- Description
- Price
- Condition
- Location
- Shipping available? (Y/N)

---

## 2. MATCHING ENGINE (Structured + Weighted)

### Pre-Filter
Only compare:
- Same category
- Compatible shipping
- Price not wildly outside range

### Weighted Score (0-100)
| Factor | Weight |
|--------|--------|
| Product Tag Match | 40 |
| Price Closeness | 25 |
| Location Match | 15 |
| Condition Match | 10 |
| Seller Reliability | 5 |
| Recency | 5 |

### Smart Price Scoring
```javascript
budget_mid = (min_price + max_price) / 2
diff = abs(seller_price - budget_mid)
price_score = max(0, 1 - diff / budget_range) * 25
```
Closer = higher score.

### Tag Normalization
Convert variations into canonical tags.
Example:
- "RTX 4070" / "4070" / "Nvidia 4070" → `gpu_rtx_4070`

### Final Score
```
final_score = tag_score + price_score + location_score + condition_score + reliability_score + recency_score
```
- Only show matches above 55
- Return top 10
- Auto-notify top 3 matches

---

## 3. TRUST & SAFETY LAYER

### Phone verification required to post

### Tiered Trust System
- **Tier 0:** Email only - Can browse
- **Tier 1:** Phone verified - Can post items under $1k
- **Tier 2:** ID verified - Unlimited listing
  - (Leave room for Stripe Identity later)

### Escrow System
**Flow:**
1. Buyer → Platform escrow
2. Seller ships
3. Buyer confirms
4. Funds released

- 48-hour protection window after delivery
- Dispute button inside app

### Risk Scoring Engine (Internal)
Every transaction gets `risk_score (0-100)`

**Factors:**
- Account age
- New seller + high price
- Copy-paste descriptions
- IP mismatch
- Dispute history

**If >70:**
- Manual review
- Delayed payout

### Block Off-Platform Payments
Auto-detect:
- Phone numbers
- "Zelle" / "Venmo" / "CashApp"
- External links
- Warn users

---

## 4. OFFER SYSTEM
Instead of messy chat negotiation:
- Buyer → "Make Offer"
- Seller → Accept / Counter / Reject

Structured negotiation. Tracks pricing behavior.

---

## 5. DATA & IMPROVEMENT ENGINE

### Event Tracking
- Listing created
- Listing viewed
- Message sent
- Offer sent
- Offer accepted
- Escrow started
- Transaction completed
- Dispute opened

### Conversion Funnel
`Listing → View → Message → Offer → Payment → Completion`

Find friction instantly.

### Match Quality Learning
Store:
- match_score
- did_message
- did_offer
- did_complete

**Over time:** Adjust weights based on conversion correlation. Matching improves automatically.

### Bug Tracking
Log:
- App crashes
- Payment failures
- Escrow errors
- Message failures

Include: Device, App version, Timestamp, Stack trace

Add: "Report Issue" button with auto-log attachment.

---

## 6. LIQUIDITY ENGINE

### Auto-Notifications
When:
- New seller posts → notify matching buyers
- New buyer posts → notify matching sellers

Push supply & demand together.

---

## 7. SELLER PERFORMANCE DASHBOARD
Show sellers:
- Response time
- Completion rate
- Ranking percentile
- Visibility score

Gamify reputation.

---

## 8. SMART PRICE SUGGESTION
When listing:
Show: "Items in this range sell 2.1x faster."

Use historical data. Improves conversion rate.

---

## 9. INTERNAL DASHBOARD (Marketplace Health)
Track:
- DAU
- Listings/day
- Conversion rate
- Avg time to sale
- Dispute rate
- Fraud rate
- Avg match score vs conversion

If:
- Dispute rate spikes → safety issue
- Time-to-sale rises → liquidity issue
- Match score doesn't predict conversion → algorithm issue

---

## 10. SCALABLE ARCHITECTURE

### Backend
- Node.js or Python
- PostgreSQL

### Matching
- Pre-filter in SQL
- Score in service layer
- Later: Redis (caching), Elasticsearch, OpenAI/HuggingFace embeddings

---

## MVP STRENGTHS
- Intelligent matching
- Built-in escrow safety
- Fraud resistance
- Data-driven improvements
- Liquidity push
- Structured negotiation
- Scalable foundation
