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
  '10002': { city: 'New York', lat: 40.7157, lng: -73.9863 },
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
  '90002': { city: 'Los Angeles', lat: 33.9491, lng: -118.2453 },
  '90003': { city: 'Los Angeles', lat: 33.9642, lng: -118.2729 },
  '90004': { city: 'Los Angeles', lat: 34.0769, lng: -118.3090 },
  '90005': { city: 'Los Angeles', lat: 34.0599, lng: -118.3089 },
  '90006': { city: 'Los Angeles', lat: 34.0489, lng: -118.2933 },
  '90007': { city: 'Los Angeles', lat: 34.0269, lng: -118.2851 },
  '90008': { city: 'Los Angeles', lat: 33.9857, lng: -118.3387 },
  '90010': { city: 'Los Angeles', lat: 34.0661, lng: -118.3142 },
  '90011': { city: 'Los Angeles', lat: 33.9871, lng: -118.2567 },
  '90012': { city: 'Los Angeles', lat: 34.0633, lng: -118.2378 },
  '90013': { city: 'Los Angeles', lat: 34.0444, lng: -118.2467 },
  '90014': { city: 'Los Angeles', lat: 34.0444, lng: -118.2525 },
  '90015': { city: 'Los Angeles', lat: 34.0395, lng: -118.2661 },
  '90016': { city: 'Los Angeles', lat: 34.0307, lng: -118.3528 },
  '90017': { city: 'Los Angeles', lat: 34.0527, lng: -118.2637 },
  '90018': { city: 'Los Angeles', lat: 34.0269, lng: -118.3089 },
  '90019': { city: 'Los Angeles', lat: 34.0463, lng: -118.3441 },
  '90020': { city: 'Los Angeles', lat: 34.0678, lng: -118.3094 },
  
  '60601': { city: 'Chicago', lat: 41.8819, lng: -87.6278 },
  '60602': { city: 'Chicago', lat: 41.8829, lng: -87.6269 },
  '60603': { city: 'Chicago', lat: 41.8808, lng: -87.6273 },
  '60604': { city: 'Chicago', lat: 41.8773, lng: -87.6283 },
  '60605': { city: 'Chicago', lat: 41.8695, lng: -87.6187 },
  '60606': { city: 'Chicago', lat: 41.8831, lng: -87.6391 },
  '60607': { city: 'Chicago', lat: 41.8743, lng: -87.6477 },
  '60608': { city: 'Chicago', lat: 41.8538, lng: -87.6710 },
  '60609': { city: 'Chicago', lat: 41.8098, lng: -87.6534 },
  '60610': { city: 'Chicago', lat: 41.9021, lng: -87.6351 },
  '60611': { city: 'Chicago', lat: 41.8958, lng: -87.6232 },
  '60612': { city: 'Chicago', lat: 41.8809, lng: -87.6884 },
  '60613': { city: 'Chicago', lat: 41.9503, lng: -87.6521 },
  '60614': { city: 'Chicago', lat: 41.9218, lng: -87.6513 },
  
  '78701': { city: 'Austin', lat: 30.2672, lng: -97.7431 },
  '78702': { city: 'Austin', lat: 30.2600, lng: -97.7234 },
  '78703': { city: 'Austin', lat: 30.2834, lng: -97.7324 },
  '78704': { city: 'Austin', lat: 30.2435, lng: -97.7699 },
  '78705': { city: 'Austin', lat: 30.2859, lng: -97.7341 },
  
  '80201': { city: 'Denver', lat: 39.7392, lng: -104.9903 },
  '80202': { city: 'Denver', lat: 39.7514, lng: -104.9900 },
  '80203': { city: 'Denver', lat: 39.7307, lng: -104.9810 },
  '80204': { city: 'Denver', lat: 39.7392, lng: -105.0124 },
  '80205': { city: 'Denver', lat: 39.7608, lng: -104.9700 },
  
  '98101': { city: 'Seattle', lat: 47.6062, lng: -122.3321 },
  '98102': { city: 'Seattle', lat: 47.6300, lng: -122.3217 },
  '98103': { city: 'Seattle', lat: 47.6694, lng: -122.3417 },
  
  'NYC': { city: 'New York', lat: 40.7128, lng: -74.0060 },
  'LA': { city: 'Los Angeles', lat: 34.0522, lng: -118.2437 },
  'Chicago': { city: 'Chicago', lat: 41.8781, lng: -87.6298 },
  'Houston': { city: 'Houston', lat: 29.7604, lng: -95.3698 },
  'Phoenix': { city: 'Phoenix', lat: 33.4484, lng: -112.0740 },
  'Austin': { city: 'Austin', lat: 30.2672, lng: -97.7431 },
  'Denver': { city: 'Denver', lat: 39.7392, lng: -104.9903 },
  'Seattle': { city: 'Seattle', lat: 47.6062, lng: -122.3321 },
  'Miami': { city: 'Miami', lat: 25.7617, lng: -80.1918 },
  'Boston': { city: 'Boston', lat: 42.3601, lng: -71.0589 },
  'Atlanta': { city: 'Atlanta', lat: 33.7490, lng: -84.3880 },
  'Portland': { city: 'Portland', lat: 45.5152, lng: -122.6784 },
  'Nashville': { city: 'Nashville', lat: 36.1627, lng: -86.7816 },
  'Minneapolis': { city: 'Minneapolis', lat: 44.9778, lng: -93.2650 },
};

// Category-specific matching weights
const categoryWeights = {
  electronics: { tag: 35, price: 30, location: 15, condition: 20 },
  furniture: { tag: 20, price: 25, location: 30, condition: 25 },
  vehicles: { tag: 25, price: 25, location: 20, condition: 30 },
  clothing: { tag: 30, price: 30, location: 15, condition: 25 },
  books: { tag: 40, price: 30, location: 15, condition: 15 },
  other: { tag: 30, price: 30, location: 20, condition: 20 }
};

function getDistance(zip1, zip2) {
  const z1 = zipcodeCoords[zip1] || { lat: 0, lng: 0 };
  const z2 = zipcodeCoords[zip2] || { lat: 0, lng: 0 };
  if (!z1.lat || !z2.lat) return 9999;
  
  const R = 3959;
  const dLat = (z2.lat - z1.lat) * Math.PI / 180;
  const dLng = (z2.lng - z1.lng) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(z1.lat * Math.PI / 180) * Math.cos(z2.lat * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
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

// Listings
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
  { id: '11', user_id: 'seller5', type: 'sell', category: 'electronics', title: 'iPhone 14 Pro 128GB', description: 'Good condition, minor scratches', price: 650, condition: 'good', location: 'New York', zipcode: '10001', status: 'active', tags: ['iphone', 'iphone_14'], image: 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=400&h=300&fit=crop', created_at: '2026-02-08T10:00:00Z' },
  { id: '12', user_id: 'seller6', type: 'sell', category: 'furniture', title: 'IKEA Desk - White', description: 'Used for 1 year, good condition', price: 80, condition: 'good', location: 'Seattle', zipcode: '98101', status: 'active', tags: ['desk', 'ikea', 'office'], image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&h=300&fit=crop', created_at: '2026-02-05T10:00:00Z' },
];

// Buyer Intent Profiles
const buyerIntents = [
  { id: '1', user_id: 'buyer1', title: 'iPhone 15 Pro Max', category: 'electronics', budget_min: 800, budget_max: 1200, condition_preference: 'like_new', urgency: 'high', description: 'Need it for work ASAP', tags: ['iphone', 'iphone_15'], created_at: '2026-02-10T10:00:00Z' },
  { id: '2', user_id: 'buyer1', title: 'RTX 4080 Graphics Card', category: 'electronics', budget_min: 800, budget_max: 1200, condition_preference: 'new', urgency: 'medium', description: 'For gaming build', tags: ['gpu', 'rtx_4080'], created_at: '2026-02-12T10:00:00Z' },
  { id: '3', user_id: 'buyer2', title: 'MacBook Pro 14 inch', category: 'electronics', budget_min: 1400, budget_max: 2000, condition_preference: 'like_new', urgency: 'high', description: 'Need for software development', tags: ['macbook', 'apple', 'laptop'], created_at: '2026-02-13T10:00:00Z' },
  { id: '4', user_id: 'buyer3', title: 'PS5 Console', category: 'electronics', budget_min: 350, budget_max: 500, condition_preference: 'new', urgency: 'low', description: 'Looking for a deal', tags: ['ps5', 'playstation'], created_at: '2026-02-11T10:00:00Z' },
  { id: '5', user_id: 'buyer4', title: 'Standing Desk', category: 'furniture', budget_min: 300, budget_max: 600, condition_preference: 'good', urgency: 'medium', description: 'Home office setup', tags: ['desk', 'standing'], created_at: '2026-02-09T10:00:00Z' },
];

// User profiles with trust scores
const users = {
  'buyer1': { id: 'buyer1', name: 'John Buyer', trust_score: 85, response_speed: 90, completion_rate: 95, cancellation_rate: 5, dispute_rate: 0, total_sales: 0, total_purchases: 12, joined: '2025-06-15' },
  'buyer2': { id: 'buyer2', name: 'Sarah Shopper', trust_score: 72, response_speed: 65, completion_rate: 80, cancellation_rate: 15, dispute_rate: 5, total_sales: 0, total_purchases: 8, joined: '2025-09-20' },
  'buyer3': { id: 'buyer3', name: 'Mike Bargainer', trust_score: 91, response_speed: 95, completion_rate: 98, cancellation_rate: 2, dispute_rate: 0, total_sales: 0, total_purchases: 25, joined: '2025-01-10' },
  'buyer4': { id: 'buyer4', name: 'Lisa Home', trust_score: 68, response_speed: 50, completion_rate: 75, cancellation_rate: 20, dispute_rate: 5, total_sales: 0, total_purchases: 5, joined: '2025-11-05' },
  'seller1': { id: 'seller1', name: 'Tech Trader', trust_score: 92, response_speed: 88, completion_rate: 97, cancellation_rate: 3, dispute_rate: 0, total_sales: 45, total_purchases: 0, joined: '2024-08-01' },
  'seller2': { id: 'seller2', name: 'Gadget Guy', trust_score: 78, response_speed: 70, completion_rate: 82, cancellation_rate: 12, dispute_rate: 6, total_sales: 18, total_purchases: 0, joined: '2025-03-15' },
  'seller3': { id: 'seller3', name: 'Gamer Store', trust_score: 95, response_speed: 98, completion_rate: 99, cancellation_rate: 1, dispute_rate: 0, total_sales: 120, total_purchases: 0, joined: '2024-05-20' },
  'seller4': { id: 'seller4', name: 'Furniture Flipper', trust_score: 81, response_speed: 75, completion_rate: 85, cancellation_rate: 10, dispute_rate: 5, total_sales: 22, total_purchases: 0, joined: '2025-02-10' },
  'seller5': { id: 'seller5', name: 'Phone Pro', trust_score: 88, response_speed: 82, completion_rate: 93, cancellation_rate: 5, dispute_rate: 2, total_sales: 35, total_purchases: 0, joined: '2024-12-01' },
  'seller6': { id: 'seller6', name: 'Home Goods', trust_score: 70, response_speed: 60, completion_rate: 78, cancellation_rate: 15, dispute_rate: 7, total_sales: 12, total_purchases: 0, joined: '2025-07-20' },
};

const offers = [];
const transactions = [];
const conversations = [];
const messages = [];

// Fair Market Value
function calculateFairMarketValue(listing) {
  const similar = listings.filter(l => 
    l.type === 'sell' && l.status === 'active' && l.id !== listing.id &&
    l.category === listing.category && l.price > 0 &&
    (l.tags || []).some(t => (listing.tags || []).includes(t))
  );
  
  if (similar.length === 0) return null;
  
  const prices = similar.map(l => l.price);
  return {
    average: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
    low: Math.min(...prices),
    high: Math.max(...prices),
    count: similar.length,
    similar: similar.map(s => ({ id: s.id, title: s.title, price: s.price, condition: s.condition }))
  };
}

// Smart Negotiation Agent
function analyzeOffer(buyerOffer, listing, seller) {
  const fmv = calculateFairMarketValue(listing);
  const fmvAvg = fmv ? fmv.average : listing.price;
  
  const percentBelowFmv = ((fmvAvg - buyerOffer) / fmvAvg) * 100;
  
  let dealProbability = 50;
  
  if (percentBelowFmv > 20) dealProbability += 20;
  else if (percentBelowFmv > 10) dealProbability += 10;
  else if (percentBelowFmv > 0) dealProbability += 5;
  else if (percentBelowFmv < -10) dealProbability -= 15;
  
  if (seller) {
    dealProbability += (seller.trust_score - 70) * 0.3;
    dealProbability += (seller.response_speed - 70) * 0.1;
  }
  
  if (listing.condition === 'new') dealProbability += 5;
  else if (listing.condition === 'like_new') dealProbability += 3;
  
  dealProbability = Math.max(5, Math.min(95, Math.round(dealProbability)));
  
  const suggestions = [];
  
  const fairCounter = Math.round(fmvAvg * 0.95);
  suggestions.push({ type: 'fair', price: fairCounter, message: `Fair price - meets market value`, confidence: 80 });
  
  const aggressiveCounter = Math.round(fmvAvg * 0.90);
  suggestions.push({ type: 'aggressive', price: aggressiveCounter, message: `Strong negotiation - may lose buyer`, confidence: 50 });
  
  const conservativeCounter = Math.round(fmvAvg * 0.98);
  suggestions.push({ type: 'conservative', price: conservativeCounter, message: `Quick sale - motivated seller`, confidence: 90 });
  
  let recommended = suggestions[0];
  if (dealProbability > 70) recommended = suggestions[2];
  else if (dealProbability < 40) recommended = suggestions[1];
  
  return {
    buyer_offer: buyerOffer,
    listing_price: listing.price,
    fair_market_value: fmvAvg,
    percent_below_fmv: Math.round(percentBelowFmv * 10) / 10,
    deal_probability: dealProbability,
    recommended_counter: recommended,
    suggestions: suggestions.sort((a, b) => b.confidence - a.confidence),
    factors: {
      price_impact: percentBelowFmv > 0 ? 'positive' : 'negative',
      seller_trust: seller ? seller.trust_score : 50,
      condition_bonus: listing.condition === 'new' || listing.condition === 'like_new' ? 5 : 0
    }
  };
}

// Seller Analytics
function getSellerAnalytics(sellerId) {
  const sellerListings = listings.filter(l => l.user_id === sellerId && l.type === 'sell');
  
  const categoryStats = {};
  for (const l of sellerListings) {
    if (!categoryStats[l.category]) {
      categoryStats[l.category] = { count: 0, total_price: 0 };
    }
    categoryStats[l.category].count++;
    categoryStats[l.category].total_price += l.price || 0;
  }
  
  const totalListings = sellerListings.length;
  const avgPrice = totalListings > 0 
    ? Math.round(Object.values(categoryStats).reduce((a, c) => a + c.total_price, 0) / totalListings)
    : 0;
  
  const categoryDemand = {};
  for (const l of listings) {
    if (l.type === 'buy') {
      categoryDemand[l.category] = (categoryDemand[l.category] || 0) + 1;
    }
  }
  
  const timeToSaleEstimate = {
    electronics: 5,
    furniture: 8,
    vehicles: 14,
    clothing: 6,
    books: 4,
    other: 7
  };
  
  const suggestedPricing = {};
  for (const cat of Object.keys(categoryStats)) {
    const catListings = listings.filter(l => l.category === cat && l.type === 'sell' && l.price > 0);
    if (catListings.length > 0) {
      const prices = catListings.map(l => l.price);
      suggestedPricing[cat] = {
        min: Math.round(Math.min(...prices) * 0.9),
        optimal: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
        max: Math.round(Math.max(...prices) * 1.1)
      };
    }
  }
  
  const boostScore = sellerListings.length > 0 
    ? Math.min(100, 50 + (categoryDemand[sellerListings[0].category] || 0) * 10)
    : 0;
  
  return {
    seller_id: sellerId,
    user: users[sellerId] || null,
    total_listings: totalListings,
    total_active: sellerListings.filter(l => l.status === 'active').length,
    average_price: avgPrice,
    categories: categoryStats,
    demand_heat: categoryDemand,
    time_to_sale_estimate: timeToSaleEstimate,
    suggested_pricing: suggestedPricing,
    boost_score: boostScore,
    recommendations: [
      boostScore > 60 ? 'Great time to boost - high demand in your category!' : null,
      suggestedPricing[sellerListings[0]?.category] ? `Price your items between $${suggestedPricing[sellerListings[0].category].min} - $${suggestedPricing[sellerListings[0].category].max}` : null,
      'Add more photos to increase buyer interest'
    ].filter(Boolean)
  };
}

// Category-specific matching
function matchWithCategoryWeights(buy, sell) {
  const weights = categoryWeights[sell.category] || categoryWeights.other;
  
  const matchingTags = buy.tags.filter(t => sell.tags.includes(t));
  const tagScore = matchingTags.length > 0 
    ? Math.min(weights.tag, matchingTags.length * (weights.tag / 3)) 
    : 0;
  
  let priceScore = 0;
  if (sell.price >= (buy.budget_min || buy.min_price) && sell.price <= (buy.budget_max || buy.max_price)) {
    priceScore = weights.price;
  } else if (sell.price > (buy.budget_max || buy.max_price)) {
    priceScore = Math.max(0, weights.price - 20);
  }
  
  const locScore = getLocationScore(buy.zipcode || '10001', sell.zipcode || '10001');
  
  let conditionScore = 0;
  if (sell.condition === 'new') conditionScore = weights.condition;
  else if (sell.condition === 'like_new') conditionScore = Math.round(weights.condition * 0.8);
  else if (sell.condition === 'good') conditionScore = Math.round(weights.condition * 0.5);
  
  const totalScore = tagScore + priceScore + locScore + conditionScore;
  const maxScore = weights.tag + weights.price + 20 + weights.condition;
  
  return {
    buyer_intent: buy,
    seller_listing: sell,
    score: Math.round(totalScore),
    max_score: maxScore,
    confidence: Math.round((totalScore / maxScore) * 100),
    breakdown: {
      tag: { score: Math.round(tagScore), max: weights.tag },
      price: { score: priceScore, max: weights.price },
      location: { score: locScore, max: 20 },
      condition: { score: conditionScore, max: weights.condition }
    },
    category: sell.category
  };
}

// Marketplace Health
function getMarketplaceHealth() {
  const totalListings = listings.filter(l => l.status === 'active').length;
  const buyListings = listings.filter(l => l.type === 'buy').length;
  const sellListings = listings.filter(l => l.type === 'sell').length;
  
  const conversionRate = 12.5;
  const avgTimeToSale = 7.3;
  const liquidityRatio = buyListings > 0 ? Math.round((sellListings / buyListings) * 100) : 0;
  
  const totalUsers = Object.keys(users).length;
  const activeSellers = new Set(listings.filter(l => l.type === 'sell').map(l => l.user_id)).size;
  const activeBuyers = new Set([...listings.filter(l => l.type === 'buy').map(l => l.user_id), ...buyerIntents.map(b => b.user_id)]).size;
  
  let healthScore = 50;
  healthScore += conversionRate > 10 ? 15 : 5;
  healthScore += liquidityRatio > 80 ? 15 : 5;
  healthScore += activeSellers > 5 ? 10 : 0;
  healthScore += activeBuyers > 5 ? 10 : 0;
  
  return {
    health_score: Math.min(100, healthScore),
    metrics: {
      total_listings: totalListings,
      active_buyers: buyListings,
      active_sellers: sellListings,
      conversion_rate: conversionRate,
      avg_time_to_sale_days: avgTimeToSale,
      liquidity_ratio: liquidityRatio,
      total_users: totalUsers,
      active_users: activeSellers + activeBuyers
    },
    status: healthScore > 75 ? 'healthy' : healthScore > 50 ? 'growing' : 'needs_boost'
  };
}

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/zipcode/:zip', (req, res) => {
  const info = zipcodeCoords[req.params.zip];
  if (!info) return res.status(404).json({ error: 'Zipcode not found' });
  res.json({ zipcode: req.params.zip, ...info });
});

app.get('/api/locations', (req, res) => {
  const locations = Object.entries(zipcodeCoords).map(([zip, info]) => ({
    zipcode: zip,
    city: info.city,
    state: info.state || ''
  }));
  const unique = [];
  const seen = new Set();
  for (const loc of locations) {
    if (!seen.has(loc.city)) {
      seen.add(loc.city);
      unique.push(loc);
    }
  }
  res.json(unique);
});

// Listings
app.get('/api/listings', (req, res) => {
  const { type, status, category, zipcode, radius } = req.query;
  let result = listings;
  
  if (type) result = result.filter(l => l.type === type);
  if (status) result = result.filter(l => l.status === status);
  if (category) result = result.filter(l => l.category === category);
  
  if (zipcode && radius) {
    const maxDist = parseInt(radius);
    result = result.filter(l