# Marketplace API v1.0

Intelligent marketplace with weighted matching, trust tiers, and escrow.

## Quick Start

```bash
# Install dependencies
npm install

# Set up database
# Make sure PostgreSQL is running, then:
cp .env.example .env
# Edit .env with your database URL

npm run db:init

# Start server
npm start
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `POST /api/auth/verify/phone` - Verify phone (Tier 1)
- `POST /api/auth/verify/id` - Verify ID (Tier 2)
- `GET /api/auth/me` - Get current user

### Listings
- `GET /api/listings` - Browse listings
- `POST /api/listings` - Create listing
- `GET /api/listings/:id` - Get listing
- `PUT /api/listings/:id` - Update listing
- `DELETE /api/listings/:id` - Delete listing

### Matches
- `GET /api/matches` - Get my matches
- `GET /api/matches/:id` - Get match details
- `POST /api/matches/:id/message` - Mark as messaged

### Offers
- `GET /api/offers` - Get my offers
- `POST /api/offers` - Make offer
- `PUT /api/offers/:id` - Accept/Reject/Counter

### Transactions
- `GET /api/transactions` - Get my transactions
- `POST /api/transactions/:id/escrow` - Start escrow
- `PUT /api/transactions/:id/confirm` - Confirm delivery
- `POST /api/transactions/:id/dispute` - Open dispute

### Users
- `GET /api/users/:id` - Public profile
- `GET /api/users/:id/listings` - User's listings

### Categories
- `GET /api/categories` - All categories
- `GET /api/categories/:slug` - Category with listings

### Notifications
- `GET /api/notifications` - My notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read

### Messages
- `GET /api/messages/match/:matchId` - Get messages
- `POST /api/messages` - Send message

## Trust Tiers

- **Tier 0:** Email only - Can browse
- **Tier 1:** Phone verified - Can post items under $1000
- **Tier 2:** ID verified - Unlimited

## Matching

Score >= 55 triggers a match. Weights:
- Tag Match: 40
- Price Closeness: 25
- Location: 15
- Condition: 10
- Reliability: 5
- Recency: 5
