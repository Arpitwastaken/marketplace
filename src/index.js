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
  '90001': { city: 'Los Angeles', lat: 33.9731, lng: -118.2479 },
  '90012': { city: 'Los Angeles', lat: 34.0633, lng: -118.2378 },
  '60601': { city: 'Chicago', lat: 41.8819, lng: -87.6278 },
  '60614': { city: 'Chicago', lat: 41.9218, lng: -87.6513 },
  '78701': { city: 'Austin', lat: 30.2672, lng: -97.7431 },
  '78704': { city: 'Austin', lat: 30.2435, lng: -97.7699 },
  '80201': { city: 'Denver', lat: 39.7392, lng: -104.9903 },
  '80203': { city: 'Denver', lat: 39.7307, lng: -104.9810 },
  '98101': { city: 'Seattle', lat: 47.6062, lng: -122.3321 },
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

// 30 Listings from 10 different agents
const listings = [
  { id: '1', user_id: 'seller1', type: 'sell', category: 'electronics', title: 'iPhone 15 Pro Max 256GB', description: 'Excellent condition, barely used', price: 950, condition: 'like_new', location: 'New York', zipcode: '10012', status: 'active', tags: ['iphone', 'iphone_15'], image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=300&fit=crop', created_at: '2026-02-14T10:00:00Z', views: 234 },
  { id: '2', user_id: 'seller1', type: 'sell', category: 'electronics', title: 'RTX 4080 Super', description: 'Brand new in box, unopened', price: 1100, condition: 'new', location: 'Los Angeles', zipcode: '90012', status: 'active', tags: ['gpu', 'rtx_4080'], image: 'https://images.unsplash.com/photo-1555685812-4b943f3e9942?w=400&h=300&fit=crop', created_at: '2026-02-15T10:00:00Z', views: 189 },
  { id: '3', user_id: 'seller1', type: 'sell', category: 'electronics', title: 'iPad Pro 12.9" M2', description: '256GB, Space Gray', price: 780, condition: 'like_new', location: 'New York', zipcode: '10011', status: 'active', tags: ['ipad', 'apple', 'tablet'], image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop', created_at: '2026-02-16T10:00:00Z', views: 156 },
  { id: '4', user_id: 'seller2', type: 'sell', category: 'electronics', title: 'MacBook Pro M3 16GB', description: 'Like new, Silver, includes charger', price: 1850, condition: 'like_new', location: 'Chicago', zipcode: '60614', status: 'active', tags: ['macbook', 'apple', 'laptop'], image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&h=300&fit=crop', created_at: '2026-02-16T10:00:00Z', views: 312 },
  { id: '5', user_id: 'seller2', type: 'sell', category: 'electronics', title: 'AirPods Pro 2nd Gen', description: 'Mint condition, case included', price: 180, condition: 'like_new', location: 'Chicago', zipcode: '60601', status: 'active', tags: ['airpods', 'apple', 'audio'], image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&h=300&fit=crop', created_at: '2026-02-15T10:00:00Z', views: 98 },
  { id: '6', user_id: 'seller3', type: 'sell', category: 'electronics', title: 'PS5 Digital Edition', description: 'Brand new, unopened', price: 380, condition: 'new', location: 'Austin', zipcode: '78704', status: 'active', tags: ['ps5', 'playstation', 'gaming'], image: 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=400&h=300&fit=crop', created_at: '2026-02-15T10:00:00Z', views: 456 },
  { id: '7', user_id: 'seller3', type: 'sell', category: 'electronics', title: 'Xbox Series X', description: '1TB, excellent condition', price: 420, condition: 'like_new', location: 'Austin', zipcode: '78701', status: 'active', tags: ['xbox', 'microsoft', 'gaming'], image: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400&h=300&fit=crop', created_at: '2026-02-14T10:00:00Z', views: 234 },
  { id: '8', user_id: 'seller3', type: 'sell', category: 'electronics', title: 'Nintendo Switch OLED', description: 'White edition, barely used', price: 280, condition: 'like_new', location: 'Austin', zipcode: '78704', status: 'active', tags: ['switch', 'nintendo', 'gaming'], image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400&h=300&fit=crop', created_at: '2026-02-16T10:00:00Z', views: 178 },
  { id: '9', user_id: 'seller5', type: 'sell', category: 'electronics', title: 'iPhone 14 Pro 128GB', description: 'Good condition, minor scratches', price: 650, condition: 'good', location: 'New York', zipcode: '10001', status: 'active', tags: ['iphone', 'iphone_14'], image: 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=400&h=300&fit=crop', created_at: '2026-02-08T10:00:00Z', views: 145 },
  { id: '10', user_id: 'seller5', type: 'sell', category: 'electronics', title: 'Samsung Galaxy S23 Ultra', description: '256GB, Phantom Black', price: 720, condition: 'like_new', location: 'New York', zipcode: '10013', status: 'active', tags: ['samsung', 'galaxy', 'android'], image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=300&fit=crop', created_at: '2026-02-12T10:00:00Z', views: 198 },
  { id: '11', user_id: 'seller4', type: 'sell', category: 'furniture', title: 'Uplift V2 Standing Desk', description: 'Excellent condition, bamboo top', price: 450, condition: 'good', location: 'Denver', zipcode: '80203', status: 'active', tags: ['desk', 'standing', 'office'], image: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=400&h=300&fit=crop', created_at: '2026-02-14T10:00:00Z', views: 167 },
  { id: '12', user_id: 'seller4', type: 'sell', category: 'furniture', title: 'Herman Miller Aeron Chair', description: 'Size B, fully loaded', price: 850, condition: 'good', location: 'Denver', zipcode: '80201', status: 'active', tags: ['chair', 'office', 'ergonomic'], image: 'https://images.unsplash.com/photo-1580480055273-228ff5398ef7?w=400&h=300&fit=crop', created_at: '2026-02-10T10:00:00Z', views: 289 },
  { id: '13', user_id: 'seller4', type: 'sell', category: 'furniture', title: 'IKEA Kallax Shelf', description: '4x4, white, like new', price: 65, condition: 'like_new', location: 'Denver', zipcode: '80201', status: 'active', tags: ['shelf', 'ikea', 'storage'], image: 'https://images.unsplash.com/photo-1595428774223-ef5236412e01?w=400&h=300&fit=crop', created_at: '2026-02-15T10:00:00Z', views: 78 },
  { id: '14', user_id: 'seller6', type: 'sell', category: 'furniture', title: 'IKEA Desk - White', description: 'Used for 1 year, good condition', price: 80, condition: 'good', location: 'Seattle', zipcode: '98101', status: 'active', tags: ['desk', 'ikea', 'office'], image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&h=300&fit=crop', created_at: '2026-02-05T10:00:00Z', views: 45 },
  { id: '15', user_id: 'seller7', type: 'sell', category: 'vehicles', title: 'Trek Domane SL5 Road Bike', description: '2023 model, carbon frame, like new', price: 2800, condition: 'like_new', location: 'New York', zipcode: '10011', status: 'active', tags: ['bike', 'trek', 'road'], image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=300&fit=crop', created_at: '2026-02-11T10:00:00Z', views: 234 },
  { id: '16', user_id: 'seller7', type: 'sell', category: 'vehicles', title: 'Specialized Rockhopper', description: 'Mountain bike, great condition', price: 650, condition: 'good', location: 'Los Angeles', zipcode: '90012', status: 'active', tags: ['bike', 'mountain', 'specialized'], image: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=400&h=300&fit=crop', created_at: '2026-02-13T10:00:00Z', views: 123 },
  { id: '17', user_id: 'seller8', type: 'sell', category: 'books', title: 'Programming Books Bundle', description: 'Clean Code, Design Patterns, Refactoring', price: 120, condition: 'good', location: 'Chicago', zipcode: '60601', status: 'active', tags: ['books', 'programming', 'coding'], image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=300&fit=crop', created_at: '2026-02-14T10:00:00Z', views: 89 },
  { id: '18', user_id: 'seller9', type: 'sell', category: 'vehicles', title: 'Car Roof Cargo Box', description: 'Thule Motion XT, fits most roof racks', price: 280, condition: 'like_new', location: 'Austin', zipcode: '78701', status: 'active', tags: ['car', 'rooftop', 'cargo'], image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop', created_at: '2026-02-12T10:00:00Z', views: 67 },
  { id: '19', user_id: 'seller10', type: 'sell', category: 'electronics', title: 'Fender Stratocaster', description: 'American Professional II, Sunburst', price: 1450, condition: 'like_new', location: 'Denver', zipcode: '80203', status: 'active', tags: ['guitar', 'fender', 'music'], image: 'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=400&h=300&fit=crop', created_at: '2026-02-10T10:00:00Z', views: 312 },
  { id: '20', user_id: 'seller10', type: 'sell', category: 'electronics', title: 'Yamaha P-125 Digital Piano', description: 'With stand and pedal board', price: 680, condition: 'good', location: 'Denver', zipcode: '80201', status: 'active', tags: ['piano', 'yamaha', 'music'], image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f8a1ea?w=400&h=300&fit=crop', created_at: '2026-02-11T10:00:00Z', views: 156 },
  // BUY REQUESTS
  { id: '21', user_id: 'buyer1', type: 'buy', category: 'electronics', title: 'iPhone 15 Pro', description: 'Looking for iPhone 15 Pro Max', min_price: 800, max_price: 1200, location: 'New York', zipcode: '10001', status: 'active', tags: ['iphone', 'iphone_15'], created_at: '2026-02-10T10:00:00Z' },
  { id: '22', user_id: 'buyer1', type: 'buy', category: 'electronics', title: 'RTX 4080 GPU', description: 'Need graphics card', min_price: 800, max_price: 1200, location: 'Los Angeles', zipcode: '90001', status: 'active', tags: ['gpu', 'rtx_4080'], created_at: '2026-02-12T10:00:00Z' },
  { id: '23', user_id: 'buyer2', type: 'buy', category: 'electronics', title: 'MacBook Pro 14"', description: 'Need M3 for work', min_price: 1400, max_price: 2000, location: 'Chicago', zipcode: '60601', status: 'active', tags: ['macbook', 'apple', 'laptop'], created_at: '2026-02-13T10:00:00Z' },
  { id: '24', user_id: 'buyer3', type: 'buy', category: 'electronics', title: 'PS5 Disc Edition', description: 'Looking for console', min_price: 350, max_price: 500, location: 'Austin', zipcode: '78701', status: 'active', tags: ['ps5', 'playstation', 'gaming'], created_at: '2026-02-11T10:00:00Z' },
  { id: '25', user_id: 'buyer4', type: 'buy', category: 'furniture', title: 'Standing Desk', description: 'Electric height adjustable', min_price: 300, max_price: 600, location: 'Denver', zipcode: '80201', status: 'active', tags: ['desk', 'standing', 'office'], created_at: '2026-02-09T10:00:00Z' },
  { id: '26', user_id: 'buyer5', type: 'buy', category: 'vehicles', title: 'Road Bike', description: 'Carbon frame preferred', min_price: 1000, max_price: 2500, location: 'New York', zipcode: '10001', status: 'active', tags: ['bike', 'road', 'cycling'], created_at: '2026-02-12T10:00:00Z' },
  { id: '27', user_id: 'buyer6', type: 'buy', category: 'books', title: 'Technical Books', description: 'Programming, system design', min_price: 50, max_price: 200, location: 'Chicago', zipcode: '60614', status: 'active', tags: ['books', 'programming'], created_at: '2026-02-14T10:00:00Z' },
  { id: '28', user_id: 'buyer7', type: 'buy', category: 'electronics', title: 'Gaming Monitor 27"', description: '144Hz, IPS panel', min_price: 250, max_price: 500, location: 'Seattle', zipcode: '98101', status: 'active', tags: ['monitor', 'gaming'], created_at: '2026-02-15T10:00:00Z' },
  { id: '29', user_id: 'buyer8', type: 'buy', category: 'furniture', title: 'Office Chair', description: 'Ergonomic, mesh back', min_price: 150, max_price: 400, location: 'Austin', zipcode: '78704', status: 'active', tags: ['chair', 'office', 'ergonomic'], created_at: '2026-02-13T10:00:00Z' },
  { id: '30', user_id: 'buyer5', type: 'buy', category: 'electronics', title: 'Wireless Earbuds', description: 'AirPods or Galaxy Buds', min_price: 80, max_price: 200, location: 'Los Angeles', zipcode: '90012', status: 'active', tags: ['airpods', 'earbuds', 'wireless'], created_at: '2026-02-16T10:00:00Z' },
];

// 18 Users
const users = {
  'buyer1': { id: 'buyer1', name: 'John Buyer', trust_score: 85, response_speed: 90, completion_rate: 95, cancellation_rate: 5, dispute_rate: 0, total_sales: 0, total_purchases: 12, joined: '2025-06-15', initials: 'JB' },
  'buyer2': { id: 'buyer2', name: 'Sarah Shopper', trust_score: 72, response_speed: 65, completion_rate: 80, cancellation_rate: 15, dispute_rate: 5, total_sales: 0, total_purchases: 8, joined: '2025-09-20', initials: 'SS' },
  'buyer3': { id: 'buyer3', name: 'Mike Bargainer', trust_score: 91, response_speed: 95, completion_rate: 98, cancellation_rate: 2, dispute_rate: 0, total_sales: 0, total_purchases: 25, joined: '2025-01-10', initials: 'MB' },
  'buyer4': { id: 'buyer4', name: 'Lisa Home', trust_score: 68, response_speed: 50, completion_rate: 75, cancellation_rate: 20, dispute_rate: 5, total_sales: 0, total_purchases: 5, joined: '2025-11-05', initials: 'LH' },
  'buyer5': { id: 'buyer5', name: 'Alex Shopper', trust_score: 88, response_speed: 85, completion_rate: 94, cancellation_rate: 4, dispute_rate: 2, total_sales: 0, total_purchases: 18, joined: '2025-04-12', initials: 'AS' },
  'buyer6': { id: 'buyer6', name: 'Emma Wilson', trust_score: 79, response_speed: 72, completion_rate: 85, cancellation_rate: 10, dispute_rate: 5, total_sales: 0, total_purchases: 14, joined: '2025-07-03', initials: 'EW' },
  'buyer7': { id: 'buyer7', name: 'David Chen', trust_score: 94, response_speed: 97, completion_rate: 99, cancellation_rate: 1, dispute_rate: 0, total_sales: 0, total_purchases: 42, joined: '2024-11-18', initials: 'DC' },
  'buyer8': { id: 'buyer8', name: 'Sophie Taylor', trust_score: 82, response_speed: 78, completion_rate: 89, cancellation_rate: 8, dispute_rate: 3, total_sales: 0, total_purchases: 21, joined: '2025-02-28', initials: 'ST' },
  'seller1': { id: 'seller1', name: 'Tech Trader', trust_score: 92, response_speed: 88, completion_rate: 97, cancellation_rate: 3, dispute_rate: 0, total_sales: 45, total_purchases: 0, joined: '2024-08-01', initials: 'TT' },
  'seller2': { id: 'seller2', name: 'Gadget Guy', trust_score: 78, response_speed: 70, completion_rate: 82, cancellation_rate: 12, dispute_rate: 6, total_sales: 18, total_purchases: 0, joined: '2025-03-15', initials: 'GG' },
  'seller3': { id: 'seller3', name: 'Gamer Store', trust_score: 95, response_speed: 98, completion_rate: 99, cancellation_rate: 1, dispute_rate: 0, total_sales: 120, total_purchases: 0, joined: '2024-05-20', initials: 'GS' },
  'seller4': { id: 'seller4', name: 'Furniture Flipper', trust_score: 81, response_speed: 75, completion_rate: 85, cancellation_rate: 10, dispute_rate: 5, total_sales: 22, total_purchases: 0, joined: '2025-02-10', initials: 'FF' },
  'seller5': { id: 'seller5', name: 'Phone Pro', trust_score: 88, response_speed: 82, completion_rate: 93, cancellation_rate: 5, dispute_rate: 2, total_sales: 35, total_purchases: 0, joined: '2024-12-01', initials: 'PP' },
  'seller6': { id: 'seller6', name: 'Home Goods', trust_score: 70, response_speed: 60, completion_rate: 78, cancellation_rate: 15, dispute_rate: 7, total_sales: 12, total_purchases: 0, joined: '2025-07-20', initials: 'HG' },
  'seller7': { id: 'seller7', name: 'Bike Master', trust_score: 91, response_speed: 92, completion_rate: 96, cancellation_rate: 2, dispute_rate: 2, total_sales: 67, total_purchases: 0, joined: '2024-04-15', initials: 'BM' },
  'seller8': { id: 'seller8', name: 'Book Worm', trust_score: 84, response_speed: 85, completion_rate: 91, cancellation_rate: 5, dispute_rate: 4, total_sales: 28, total_purchases: 0, joined: '2025-01-08', initials: 'BW' },
  'seller9': { id: 'seller9', name: 'Car Zone', trust_score: 86, response_speed: 79, completion_rate: 90, cancellation_rate: 8, dispute_rate: 2, total_sales: 41, total_purchases: 0, joined: '2024-09-22', initials: 'CZ' },
  'seller10': { id: 'seller10', name: 'Music Pro', trust_score: 93, response_speed: 95, completion_rate: 98, cancellation_rate: 1, dispute_rate: 1, total_sales: 89, total_purchases: 0, joined: '2024-03-10', initials: 'MP' },
};

const conversations = [];
const messages = [];
const escrows = [];
const boosts = [];
const watchlists = [];

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
  const totalViews = sellerListings.reduce((sum, l) => sum + (l.views || 0), 0);
  return { seller_id: sellerId, user: users[sellerId] || null, total_listings: sellerListings.length, total_views: totalViews, average_price: sellerListings.length > 0 ? Math.round(sellerListings.reduce((a, l) => a + (l.price || 0), 0) / sellerListings.length) : 0, demand_heat: categoryDemand, boost_score: boostScore };
}

app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.get('/api/listings', (req, res) => {
  const { type, status, category, zipcode, radius } = req.query;
  let result = listings;
  if (type) result = result.filter(l => l.type === type);
  if (status) result = result.filter(l => l.status === status);
  if (category) result = result.filter(l => l.category === category);
  if (zipcode && radius) {
    const maxDist = parseInt(radius);
    result = result.filter(l => getDistance(zipcode, l.zipcode) <= maxDist);
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
  const listing = { id: String(listings.length + 1), user_id: 'seller1', type, category, title, description: description || '', price: price || 0, min_price: min_price || 0, max_price: max_price || 0, condition: condition || null, location: location || '', zipcode: zipcode || '', status: 'active', tags: tags || [], image: image || null, created_at: new Date().toISOString(), views: 0 };
  listings.push(listing);
  res.status(201).json(listing);
});

app.get('/api/users/:id', (req, res) => {
  const user = users[req.params.id];
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

app.get('/api/fair-market-value/:id', (req, res) => {
  const listing = listings.find(l => l.id === req.params.id);
  if (!listing) return res.status(404).json({ error: 'Not found' });
  res.json(calculateFairMarketValue(listing) || { error: 'No similar listings found' });
});

app.get('/api/analytics/:seller_id', (req, res) => res.json(getSellerAnalytics(req.params.seller_id)));

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
  if (initial_message) messages.push({ id: String(messages.length + 1), conversation_id: conversation.id, sender_id: buyer_id, text: initial_message, created_at: new Date().toISOString() });
  res.status(201).json(conversation);
});

app.get('/api/messages/:conversation_id', (req, res) => res.json(messages.filter(m => m.conversation_id === req.params.conversation_id)));

app.post('/api/messages', (req, res) => {
  const { conversation_id, sender_id, text } = req.body;
  if (!conversation_id || !sender_id || !text) return res.status(400).json({ error: 'Required fields missing' });
  const message = { id: String(messages.length + 1), conversation_id, sender_id, text, created_at: new Date().toISOString() };
  messages.push(message);
  res.status(201).json(message);
});

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

app.get('/api/health', (req, res) => {
  const activeListings = listings.filter(l => l.status === 'active').length;
  const activeSellers = new Set(listings.filter(l => l.type === 'sell').map(l => l.user_id)).size;
  res.json({ health_score: Math.min(100, 50 + activeListings * 2 + activeSellers * 5), metrics: { total_listings: activeListings, active_sellers: activeSellers, total_users: Object.keys(users).length } });
});

const PORT2 = process.env.PORT || 3000;
app.listen(PORT2, () => console.log(`Server running on http://localhost:${PORT2}`));
