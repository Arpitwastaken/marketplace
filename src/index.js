console.log('Starting server...');
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('../'));

// Zipcode mapping
const zipcodeCoords = {
  '10001': { city: 'New York', lat: 40.7501, lng: -73.9971 },
  '10011': { city: 'New York', lat: 40.7401, lng: -74.0006 },
  '10012': { city: 'New York', lat: 40.7258, lng: -73.9983 },
  '10013': { city: 'New York', lat: 40.7204, lng: -74.0028 },
  '10014': { city: 'New York', lat: 40.7341, lng: -74.0069 },
  '10016': { city: 'New York', lat: 40.7451, lng: -73.9789 },
  '10017': { city: 'New York', lat: 40.7520, lng: -73.9727 },
  '10018': { city: 'New York', lat: 40.7554, lng: -73.9934 },
  '10019': { city: 'New York', lat: 40.7655, lng: -73.9864 },
  '10020': { city: 'New York', lat: 40.7585, lng: -73.9778 },
  '10021': { city: 'New York', lat: 40.7687, lng: -73.9595 },
  '10022': { city: 'New York', lat: 40.7583, lng: -73.9629 },
  '10023': { city: 'New York', lat: 40.7766, lng: -73.9827 },
  '10024': { city: 'New York', lat: 40.7914, lng: -73.9722 },
  '10025': { city: 'New York', lat: 40.7979, lng: -73.9668 },
  '90001': { city: 'Los Angeles', lat: 33.9731, lng: -118.2479 },
  '90012': { city: 'Los Angeles', lat: 34.0633, lng: -118.2378 },
  '90014': { city: 'Los Angeles', lat: 34.0444, lng: -118.2525 },
  '90015': { city: 'Los Angeles', lat: 34.0395, lng: -118.2661 },
  '60601': { city: 'Chicago', lat: 41.8819, lng: -87.6278 },
  '60602': { city: 'Chicago', lat: 41.8829, lng: -87.6269 },
  '60603': { city: 'Chicago', lat: 41.8808, lng: -87.6273 },
  '60614': { city: 'Chicago', lat: 41.9218, lng: -87.6513 },
  '78701': { city: 'Austin', lat: 30.2672, lng: -97.7431 },
  '78704': { city: 'Austin', lat: 30.2435, lng: -97.7699 },
  '78705': { city: 'Austin', lat: 30.2859, lng: -97.7341 },
  '80201': { city: 'Denver', lat: 39.7392, lng: -104.9903 },
  '80202': { city: 'Denver', lat: 39.7514, lng: -104.9900 },
  '80203': { city: 'Denver', lat: 39.7307, lng: -104.9810 },
  '98101': { city: 'Seattle', lat: 47.6062, lng: -122.3321 },
  'NYC': { city: 'New York', lat: 40.7128, lng: -74.0060 },
  'LA': { city: 'Los Angeles', lat: 34.0522, lng: -118.2437 },
  'Chicago': { city: 'Chicago', lat: 41.8781, lng: -87.6298 },
  'Austin': { city: 'Austin', lat: 30.2672, lng: -97.7431 },
  'Denver': { city: 'Denver', lat: 39.7392, lng: -104.9903 },
  'Seattle': { city: 'Seattle', lat: 47.6062, lng: -122.3321 },
  'Miami': { city: 'Miami', lat: 25.7617, lng: -80.1918 },
  'Boston': { city: 'Boston', lat: 42.3601, lng: -71.0589 },
  'Atlanta': { city: 'Atlanta', lat: 33.7490, lng: -84.3880 },
};

// Category weights
const categoryWeights = {
  electronics: { tag: 35, price: 30, location: 15, condition: 20 },
  furniture: { tag: 20, price: 25, location: 30, condition: 25 },
  vehicles: { tag: 25, price: 25, location: 20, condition: 30 },
  clothing: { tag: 30, price: 30, location: 15, condition: 25 },
  other: { tag: 30, price: 30, location: 20, condition: 20 }
};

function getDistance(zip1, zip2) {
  const z1 = zipcodeCoords[zip1] || { lat: 0, lng: 0 };
  const z2 = zipcodeCoords[zip2] || { lat: 0, lng: 0 };
  if (!z1.lat || !z2.lat) return 9999;
  const R = 3959;
  const dLat = (z2.lat - z1.lat) * Math.PI / 180;
  const dLng = (z2.lng - z1.lng) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(z1.lat * Math.PI / 180) * Math.cos(z2.lat * Math.PI / 180) * Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function getLocationScore(zip1, zip2) {
  const distance = getDistance(zip1, zip2);
  if (distance <= 5) return 20;
  if (distance <= 15) return 15;
  if (distance <= 50) return 10;
  if (distance <= 150) return 5;
  return 0;
}

// Data stores
const listings = [
  { id: '1', user_id: 'buyer1', type: 'buy', category: 'electronics', title: 'iPhone 15 Pro', description: 'Looking for iPhone 15 Pro Max', min_price: 800, max_price: 1200, location: 'New York', zipcode: '10001', status: 'active', tags: ['iphone', 'iphone_15'], image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop', created_at: '2026-02-10T10:00:00Z' },
  { id: '2', user_id: 'buyer1', type: 'buy', category: 'electronics', title: 'RTX 4080 GPU', description: 'Need graphics card', min_price: 800, max_price: 1200, location: 'Los Angeles', zipcode: '90001', status: 'active', tags: ['gpu', 'rtx_4080'], image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&h=300&fit=crop', created_at: '2026-02-12T10:00:00Z' },
  { id: '3', user_id: 'seller1', type: 'sell', category: 'electronics', title: 'iPhone 15 Pro Max 256GB', description: 'Excellent condition, barely used', price: 950, condition: 'like_new', location: 'New York', zipcode: '10012', status: 'active', tags: ['iphone', 'iphone_15'], image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=300&fit=crop', created_at: '2026-02-14T10:00:00Z' },
  { id: '4', user_id: 'seller1', type: 'sell', category: 'electronics', title: 'RTX 4080 Super', description: 'Brand new in box, unopened', price: 1100, condition: 'new', location: 'Los Angeles', zipcode: '90012', status: 'active', tags: ['gpu', 'rtx_4080'], image: 'https://images.unsplash.com/photo-1555685812-4b943f3e9942?w=400&h=300&fit=crop', created_at: '2026-02-15T10:00:00Z' },
  { id: '5', user_id: 'buyer2', type: 'buy', category: 'electronics', title: 'MacBook Pro 14"', description: 'Need M3 for work', min_price: 1400, max_price: 2000, location: 'Chicago', zipcode: '60601', status: 'active', tags: ['macbook', 'apple', 'laptop'], image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop', created_at: '2026-02-13T10:00:00Z' },
  { id: '6', user_id: 'seller2', type: 'sell', category: 'electronics', title: 'MacBook Pro M3 16GB', description: 'Like new, Silver, includes charger', price: 1850, condition: 'like_new', location: 'Chicago', zipcode: '60614', status: 'active', tags: ['macbook', 'apple', 'laptop'], image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&h=300&fit=crop', created_at: '2026-02-16T10:00:00Z' },
  { id: '7', user_id: 'buyer3', type: 'buy', category: 'electronics', title: 'PS5 Disc Edition', description: 'Looking for console', min_price: 350, max_price: 500, location: 'Austin', zipcode: '78701', status: 'active', tags: ['ps5', 'playstation', 'gaming'], image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop', created_at: '2026-02-11T10:00:00Z' },
  { id: '8', user_id: 'seller3', type: 'sell', category: 'electronics', title: 'PS5 Digital Edition', description: 'Brand new, unopened', price: 380, condition: 'new', location: 'Austin', zipcode: '78704', status: 'active', tags: ['ps5', 'playstation', 'gaming'], image: 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=400&h=300&fit=crop', created_at: '2026-02-15T10:00:00Z' },
  { id: '9', user_id: 'buyer4', type: 'buy', category: 'furniture', title: 'Standing Desk', description: 'Electric height adjustable', min_price: 300, max_price: 600, location: 'Denver', zipcode: '80201', status: 'active', tags: ['desk', 'standing', 'office'], image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&h=300&fit=crop', created_at: '2026-02-09T10:00:00Z' },
  { id: '10', user_id: 'seller4', type: 'sell', category: 'furniture', title: 'Uplift V2 Standing Desk', description: 'Excellent condition, bamboo top', price: 450, condition: 'good', location: 'Denver', zipcode: '80203', status: 'active', tags: ['desk', 'standing', 'office'], image: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=400&h=300&fit=crop', created_at: '2026-02-14T10:00:00Z' },
];

const users = {
  'buyer1': { id: 'buyer1', name: 'John Buyer', trust_score: 85, response_speed: 90, completion_rate: 95, cancellation_rate: 5, dispute_rate: 0, total_sales: 0, total_purchases: 12, joined: '2025-06-15' },
  'buyer2': { id: 'buyer2', name: 'Sarah Shopper', trust_score: 72, response_speed: 65, completion_rate: 80, cancellation_rate: 15, dispute_rate: 5, total_sales: 0, total_purchases: 8, joined: '2025-09-20' },
  'seller1': { id: 'seller1', name: 'Tech Trader', trust_score: 92, response_speed: 88, completion_rate: 97, cancellation_rate: 3, dispute_rate: 0, total_sales: 45, total_purchases: 0, joined: '2024-08-01' },
  'seller2': { id: 'seller2', name: 'Gadget Guy', trust_score: 78, response_speed: 70, completion_rate: 82, cancellation_rate: 12, dispute_rate: 6, total_sales: 18, total_purchases: 0, joined: '2025-03-15' },
  'seller3': { id: 'seller3', name: 'Gamer Store', trust_score: 95, response_speed: 98, completion_rate: 99, cancellation_rate: 1, dispute_rate: 0, total_sales: 120, total_purchases: 0, joined: '2024-05-20' },
  'seller4': { id: 'seller4', name: 'Furniture Flipper', trust_score: 81, response_speed: 75, completion_rate: 85, cancellation_rate: 10, dispute_rate: 5, total_sales: 22, total_purchases: 0, joined: '2025-02-10' },
};

const conversations = [];
const messages = [];
const escrows = [];
const boosts = [];
const watchlists = [];

// Helper functions
function calculateFairMarketValue(listing) {
  const similar = listings.filter(l => l.type === 'sell' && l.status === 'active' && l.id !== listing.id && l.category === listing.category && l.price > 0 && (l.tags || []).some(t => (listing.tags || []).includes(t)));
  if (similar.length === 0) return null;
  const prices = similar.map(l => l.price);
  return { average: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length), low: Math.min(...prices), high: Math.max(...prices), count: similar.length };
}

function getSellerAnalytics(sellerId) {
  const sellerListings = listings.filter(l => l.user_id === sellerId && l.type === 'sell');
  const categoryDemand = {};
  for (const l of listings) { if (l.type === 'buy') categoryDemand[l.category] = (categoryDemand[l.category] || 0) + 1; }
  const boostScore = sellerListings.length > 0 ? Math.min(100, 50 + (categoryDemand[sellerListings[0].category] || 0) * 10) : 0;
  return { seller_id: sellerId, user: users[sellerId] || null, total_listings: sellerListings.length, average_price: sellerListings.length > 0 ? Math.round(sellerListings.reduce((a, l) => a + (l.price || 0), 0) / sellerListings.length) : 0, demand_heat: categoryDemand, boost_score: boostScore };
}

// ========== ROUTES ==========

app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Listings
app.get('/api/listings', (req, res) => {
  const { type, status, category, zipcode, radius } = req.query;
  let result = listings;
  if (type) result = result.filter(l => l.type === type);
  if (status) result = result.filter(l => l.status === status);
  if (category) result = result.filter(l => l.category === category);
  if (zipcode && radius) {
    const maxDist = parseInt(radius);
    result = result.filter(l =>, l.zipcode getDistance(zipcode) <= maxDist);
  }
  res.json(result);
});

app.get('/api/listings/:id', (req, res) => {
  const listing = listings.find(l => l.id === req.params.id);
  if (!listing) return res.status(404).json({ error: 'Not found' });
  const fmv = listing.type === 'sell' ? calculateFairMarketValue(listing) : null;
  res.json({ ...listing, fairMarketValue: fmv });
});

app.post('/api/listings', (req, res) => {
  const { type, category, title, description, price, min_price, max_price, condition, location, zipcode, tags, image } = req.body;
  if (!type || !category || !title) return res.status(400).json({ error: 'Type, category, title required' });
  const listing = { id: String(listings.length + 1), user_id: 'user1', type, category, title, description: description || '', price: price || 0, min_price: min_price || 0, max_price: max_price || 0, condition: condition || null, location: location || '', zipcode: zipcode || '', status: 'active', tags: tags || [], image: image || null, created_at: new Date().toISOString() };
  listings.push(listing);
  res.status(201).json(listing);
});

// Users
app.get('/api/users/:id', (req, res) => {
  const user = users[req.params.id];
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// Fair Market Value
app.get('/api/fair-market-value/:id', (req, res) => {
  const listing = listings.find(l => l.id === req.params.id);
  if (!listing) return res.status(404).json({ error: 'Not found' });
  const fmv = calculateFairMarketValue(listing);
  res.json(fmv || { error: 'No similar listings found' });
});

// Seller Analytics
app.get('/api/analytics/:seller_id', (req, res) => {
  res.json(getSellerAnalytics(req.params.seller_id));
});

// Offer Analysis
app.post('/api/analyze-offer', (req, res) => {
  const { offer_amount, listing_id } = req.body;
  const listing = listings.find(l => l.id === listing_id);
  if (!listing) return res.status(404).json({ error: 'Listing not found' });
  const fmv = calculateFairMarketValue(listing);
  const fmvAvg = fmv ? fmv.average : listing.price;
  const percentBelowFmv = ((fmvAvg - offer_amount) / fmvAvg) * 100;
  let dealProbability = 50 + (percentBelowFmv > 10 ? 15 : percentBelowFmv > 0 ? 5 : -10);
  dealProbability = Math.max(5, Math.min(95, dealProbability));
  res.json({ deal_probability: dealProbability, fair_market_value: fmvAvg, percent_below_fmv: Math.round(percentBelowFmv), recommended_counter: Math.round(fmvAvg * 0.95) });
});

// Conversations
app.get('/api/conversations', (req, res) => {
  const { user_id } = req.query;
  let result = conversations;
  if (user_id) result = conversations.filter(c => c.buyer_id === user_id || c.seller_id === user_id);
  res.json(result);
});

app.post('/api/conversations', (req, res) => {
  const { listing_id, buyer_id, seller_id, initial_message } = req.body;
  if (!listing_id || !buyer_id || !seller_id) return res.status(400).json({ error: 'Required fields missing' });
  const existing = conversations.find(c => c.listing_id === listing_id && c.buyer_id === buyer_id && c.seller_id === seller_id);
  if (existing) return res.json(existing);
  const conversation = { id: String(conversations.length + 1), listing_id, buyer_id, seller_id, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
  conversations.push(conversation);
  if (initial_message) {
    messages.push({ id: String(messages.length + 1), conversation_id: conversation.id, sender_id: buyer_id, text: initial_message, created_at: new Date().toISOString() });
  }
  res.status(201).json(conversation);
});

// Messages
app.get('/api/messages/:conversation_id', (req, res) => {
  res.json(messages.filter(m => m.conversation_id === req.params.conversation_id));
});

app.post('/api/messages', (req, res) => {
  const { conversation_id, sender_id, text } = req.body;
  if (!conversation_id || !sender_id || !text) return res.status(400).json({ error: 'Required fields missing' });
  const message = { id: String(messages.length + 1), conversation_id, sender_id, text, created_at: new Date().toISOString() };
  messages.push(message);
  res.status(201).json(message);
});

// Escrow
app.post('/api/escrow/create', (req, res) => {
  const { listing_id, buyer_id, seller_id, amount } = req.body;
  const listing = listings.find(l => l.id === listing_id);
  if (!listing) return res.status(404).json({ error: 'Listing not found' });
  const escrow = { id: 'escrow_' + Date.now(), listing_id, listing_title: listing.title, buyer_id, seller_id, amount, platform_fee: Math.round(amount * 0.03), status: 'pending', created_at: new Date().toISOString(), timeline: [{ status: 'pending', note: 'Escrow created' }] };
  escrows.push(escrow);
  res.status(201).json(escrow);
});

app.get('/api/escrows/:user_id', (req, res) => {
  res.json(escrows.filter(e => e.buyer_id === req.params.user_id || e.seller_id === req.params.user_id));
});

// Boost
app.post('/api/boost/create', (req, res) => {
  const { listing_id, seller_id, tier } = req.body;
  const tiers = { basic: { price: 2.99, multiplier: 1.5, days: 7 }, premium: { price: 5.99, multiplier: 2.5, days: 14 }, featured: { price: 9.99, multiplier: 5, days: 30 } };
  const t = tiers[tier] || tiers.basic;
  const boost = { id: 'boost_' + Date.now(), listing_id, seller_id, tier: tier || 'basic', price: t.price, multiplier: t.multiplier, expires_at: new Date(Date.now() + t.days * 24 * 60 * 60 * 1000).toISOString() };
  boosts.push(boost);
  const listing = listings.find(l => l.id === listing_id);
  if (listing) { listing.boost_score = t.multiplier; }
  res.status(201).json(boost);
});

app.get('/api/boost/:listing_id', (req, res) => {
  const boost = boosts.find(b => b.listing_id === req.params.listing_id && new Date(b.expires_at) > new Date());
  res.json(boost || { boosted: false });
});

// Watchlist
app.post('/api/watchlist/add', (req, res) => {
  const { user_id, listing_id } = req.body;
  if (watchlists.find(w => w.user_id === user_id && w.listing_id === listing_id)) return res.json({ exists: true });
  watchlists.push({ id: 'watch_' + Date.now(), user_id, listing_id, added_at: new Date().toISOString() });
  res.status(201).json({ success: true });
});

app.get('/api/watchlist/:user_id', (req, res) => {
  const userWatches = watchlists.filter(w => w.user_id === req.params.user_id);
  res.json(userWatches.map(w => ({ ...w, listing: listings.find(l => l.id === w.listing_id) })).filter(w => w.listing));
});

// Marketplace Health
app.get('/api/health', (req, res) => {
  const activeListings = listings.filter(l => l.status === 'active').length;
  const activeSellers = new Set(listings.filter(l => l.type === 'sell').map(l => l.user_id)).size;
  res.json({ health_score: Math.min(100, 50 + activeListings * 2 + activeSellers * 5), metrics: { total_listings: activeListings, active_sellers: activeSellers, total_users: Object.keys(users).length } });
});

const PORT2 = process.env.PORT || 3000;
app.listen(PORT2, () => console.log(`Server running on http://localhost:${PORT2}`));
