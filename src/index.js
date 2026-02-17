console.log('Starting server...');
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('../'));

// Zipcode to coordinates mapping (major US cities)
const zipcodeCoords = {
  '10001': { city: 'New York', lat: 40.7501, lng: -73.9971 },
  '10002': { city: 'New York', lat: 40.7157, lng: -73.9863 },
  '10003': { city: 'New York', lat: 40.7317, lng: -73.9885 },
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
  '60615': { city: 'Chicago', lat: 41.8019, lng: -87.5956 },
  '60616': { city: 'Chicago', lat: 41.8388, lng: -87.6294 },
  '60617': { city: 'Chicago', lat: 41.7186, lng: -87.5553 },
  '60618': { city: 'Chicago', lat: 41.9376, lng: -87.6518 },
  '60619': { city: 'Chicago', lat: 41.7498, lng: -87.5636 },
  '60620': { city: 'Chicago', lat: 41.7396, lng: -87.6147 },
  
  '77001': { city: 'Houston', lat: 29.7604, lng: -95.3698 },
  '77002': { city: 'Houston', lat: 29.7589, lng: -95.3677 },
  '77003': { city: 'Houston', lat: 29.7537, lng: -95.3520 },
  '77004': { city: 'Houston', lat: 29.7305, lng: -95.3671 },
  '77005': { city: 'Houston', lat: 29.7181, lng: -95.4258 },
  '77006': { city: 'Houston', lat: 29.7413, lng: -95.3913 },
  '77007': { city: 'Houston', lat: 29.7697, lng: -95.3959 },
  '77008': { city: 'Houston', lat: 29.7915, lng: -95.4069 },
  
  '85001': { city: 'Phoenix', lat: 33.4484, lng: -112.0740 },
  '85002': { city: 'Phoenix', lat: 33.4500, lng: -112.0667 },
  '85003': { city: 'Phoenix', lat: 33.4505, lng: -112.0726 },
  '85004': { city: 'Phoenix', lat: 33.4511, lng: -112.0711 },
  
  '19101': { city: 'Philadelphia', lat: 39.9526, lng: -75.1652 },
  '19102': { city: 'Philadelphia', lat: 39.9526, lng: -75.1652 },
  '19103': { city: 'Philadelphia', lat: 39.9495, lng: -75.1709 },
  
  '78201': { city: 'San Antonio', lat: 29.4241, lng: -98.4936 },
  '78202': { city: 'San Antonio', lat: 29.4328, lng: -98.4677 },
  
  '92101': { city: 'San Diego', lat: 32.7157, lng: -117.1611 },
  '92102': { city: 'San Diego', lat: 32.7080, lng: -117.1285 },
  
  '75201': { city: 'Dallas', lat: 32.7767, lng: -96.7970 },
  '75202': { city: 'Dallas', lat: 32.7792, lng: -96.7968 },
  
  '95101': { city: 'San Jose', lat: 37.3382, lng: -121.8863 },
  '95102': { city: 'San Jose', lat: 37.3230, lng: -121.8737 },
  
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
  
  // Fallback cities
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

// Calculate distance between two zipcodes (in miles)
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

function getLocationScore(zip1, zip2, buyerZip, sellerZip) {
  const distance = getDistance(zip1 || buyerZip, zip2 || sellerZip);
  
  if (distance <= 5) return 20;
  if (distance <= 15) return 15;
  if (distance <= 50) return 10;
  if (distance <= 150) return 5;
  return 0;
}

// Listings with images
const listings = [
  { id: '1', user_id: 'buyer1', type: 'buy', category: 'electronics', title: 'iPhone 15 Pro', description: 'Looking for iPhone 15 Pro Max', min_price: 800, max_price: 1200, location: 'New York', zipcode: '10001', status: 'active', tags: ['iphone', 'iphone_15'], image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop' },
  { id: '2', user_id: 'buyer1', type: 'buy', category: 'electronics', title: 'RTX 4080 GPU', description: 'Need graphics card', min_price: 800, max_price: 1200, location: 'Los Angeles', zipcode: '90001', status: 'active', tags: ['gpu', 'rtx_4080'], image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&h=300&fit=crop' },
  { id: '3', user_id: 'seller1', type: 'sell', category: 'electronics', title: 'iPhone 15 Pro Max 256GB', description: 'Excellent condition, barely used', price: 950, condition: 'like_new', location: 'New York', zipcode: '10012', status: 'active', tags: ['iphone', 'iphone_15'], image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=300&fit=crop' },
  { id: '4', user_id: 'seller1', type: 'sell', category: 'electronics', title: 'RTX 4080 Super', description: 'Brand new in box, unopened', price: 1100, condition: 'new', location: 'Los Angeles', zipcode: '90012', status: 'active', tags: ['gpu', 'rtx_4080'], image: 'https://images.unsplash.com/photo-1555685812-4b943f3e9942?w=400&h=300&fit=crop' },
  { id: '5', user_id: 'buyer2', type: 'buy', category: 'electronics', title: 'MacBook Pro 14"', description: 'Need M3 for work', min_price: 1400, max_price: 2000, location: 'Chicago', zipcode: '60601', status: 'active', tags: ['macbook', 'apple', 'laptop'], image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop' },
  { id: '6', user_id: 'seller2', type: 'sell', category: 'electronics', title: 'MacBook Pro M3 16GB', description: 'Like new, Silver, includes charger', price: 1850, condition: 'like_new', location: 'Chicago', zipcode: '60614', status: 'active', tags: ['macbook', 'apple', 'laptop'], image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&h=300&fit=crop' },
  { id: '7', user_id: 'buyer3', type: 'buy', category: 'electronics', title: 'PS5 Disc Edition', description: 'Looking for console', min_price: 350, max_price: 500, location: 'Austin', zipcode: '78701', status: 'active', tags: ['ps5', 'playstation', 'gaming'], image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop' },
  { id: '8', user_id: 'seller3', type: 'sell', category: 'electronics', title: 'PS5 Digital Edition', description: 'Brand new, unopened', price: 380, condition: 'new', location: 'Austin', zipcode: '78704', status: 'active', tags: ['ps5', 'playstation', 'gaming'], image: 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=400&h=300&fit=crop' },
  { id: '9', user_id: 'buyer4', type: 'buy', category: 'furniture', title: 'Standing Desk', description: 'Electric height adjustable', min_price: 300, max_price: 600, location: 'Denver', zipcode: '80201', status: 'active', tags: ['desk', 'standing', 'office'], image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&h=300&fit=crop' },
  { id: '10', user_id: 'seller4', type: 'sell', category: 'furniture', title: 'Uplift V2 Standing Desk', description: 'Excellent condition, bamboo top', price: 450, condition: 'good', location: 'Denver', zipcode: '80203', status: 'active', tags: ['desk', 'standing', 'office'], image: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=400&h=300&fit=crop' },
];

const offers = [];
const transactions = [];

// Messages/Conversations system
const conversations = [];
const messages = [];

// Fair Market Value calculation
function calculateFairMarketValue(listing) {
  // Find similar listings (same category and at least one matching tag)
  const similar = listings.filter(l => 
    l.type === 'sell' && 
    l.status === 'active' &&
    l.id !== listing.id &&
    l.category === listing.category &&
    l.price > 0 &&
    (l.tags || []).some(t => (listing.tags || []).includes(t))
  );
  
  if (similar.length === 0) {
    return null;
  }
  
  const prices = similar.map(l => l.price);
  const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  
  return {
    average: Math.round(avg),
    low: min,
    high: max,
    count: similar.length,
    similar: similar.map(s => ({
      id: s.id,
      title: s.title,
      price: s.price,
      condition: s.condition
    }))
  };
}

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/zipcode/:zip', (req, res) => {
  const info = zipcodeCoords[req.params.zip];
  if (!info) {
    return res.status(404).json({ error: 'Zipcode not found' });
  }
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
  const { type, status, zipcode, radius } = req.query;
  let result = listings;
  
  if (type) result = result.filter(l => l.type === type);
  if (status) result = result.filter(l => l.status === status);
  
  if (zipcode && radius) {
    const maxDist = parseInt(radius);
    result = result.filter(l => {
      const dist = getDistance(zipcode, l.zipcode);
      return dist <= maxDist;
    });
  }
  
  res.json(result);
});

app.get('/api/listings/:id', (req, res) => {
  const listing = listings.find(l => l.id === req.params.id);
  if (!listing) return res.status(404).json({ error: 'Not found' });
  
  // Add fair market value to listing response
  const fmv = listing.type === 'sell' ? calculateFairMarketValue(listing) : null;
  
  res.json({ ...listing, fairMarketValue: fmv });
});

// Fair Market Value endpoint
app.get('/api/fair-market-value/:id', (req, res) => {
  const listing = listings.find(l => l.id === req.params.id);
  if (!listing) return res.status(404).json({ error: 'Not found' });
  
  const fmv = calculateFairMarketValue(listing);
  if (!fmv) {
    return res.json({ error: 'No similar listings found', listing });
  }
  
  res.json(fmv);
});

// Conversations
app.get('/api/conversations', (req, res) => {
  const { user_id } = req.query;
  let result = conversations;
  if (user_id) {
    result = conversations.filter(c => c.buyer_id === user_id || c.seller_id === user_id);
  }
  res.json(result);
});

app.post('/api/conversations', (req, res) => {
  const { listing_id, buyer_id, seller_id, initial_message } = req.body;
  
  if (!listing_id || !buyer_id || !seller_id) {
    return res.status(400).json({ error: 'listing_id, buyer_id, seller_id required' });
  }
  
  // Check if conversation already exists
  const existing = conversations.find(c => 
    c.listing_id === listing_id && 
    c.buyer_id === buyer_id && 
    c.seller_id === seller_id
  );
  
  if (existing) {
    return res.json(existing);
  }
  
  const conversation = {
    id: String(conversations.length + 1),
    listing_id,
    buyer_id,
    seller_id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  conversations.push(conversation);
  
  // Add initial message if provided
  if (initial_message) {
    const msg = {
      id: String(messages.length + 1),
      conversation_id: conversation.id,
      sender_id: buyer_id,
      text: initial_message,
      created_at: new Date().toISOString()
    };
    messages.push(msg);
  }
  
  res.status(201).json(conversation);
});

// Messages
app.get('/api/messages/:conversation_id', (req, res) => {
  const conversationMessages = messages.filter(m => m.conversation_id === req.params.conversation_id);
  res.json(conversationMessages);
});

app.post('/api/messages', (req, res) => {
  const { conversation_id, sender_id, text } = req.body;
  
  if (!conversation_id || !sender_id || !text) {
    return res.status(400).json({ error: 'conversation_id, sender_id, text required' });
  }
  
  const message = {
    id: String(messages.length + 1),
    conversation_id,
    sender_id,
    text,
    created_at: new Date().toISOString()
  };
  
  messages.push(message);
  
  // Update conversation timestamp
  const conv = conversations.find(c => c.id === conversation_id);
  if (conv) {
    conv.updated_at = new Date().toISOString();
  }
  
  res.status(201).json(message);
});

// Matches
app.get('/api/matches', (req, res) => {
  const { user_id, zipcode } = req.query;
  const buys = listings.filter(l => l.type === 'buy' && l.status === 'active');
  const sells = listings.filter(l => l.type === 'sell' && l.status === 'active');
  
  const matches = [];
  for (const buy of buys) {
    for (const sell of sells) {
      if (buy.category !== sell.category) continue;
      
      const matchingTags = buy.tags.filter(t => sell.tags.includes(t));
      const tagScore = matchingTags.length > 0 ? 40 : 0;
      
      let priceScore = 0;
      if (sell.price >= buy.min_price && sell.price <= buy.max_price) {
        priceScore = 25;
      } else if (sell.price > buy.max_price) {
        priceScore = 10;
      }
      
      const locScore = getLocationScore(buy.zipcode, sell.zipcode, buy.zipcode, sell.zipcode);
      const conditionScore = sell.condition === 'new' || sell.condition === 'like_new' ? 5 : 0;
      
      const totalScore = tagScore + priceScore + locScore + conditionScore;
      
      if (totalScore >= 55) {
        matches.push({
          buyer_listing: buy,
          seller_listing: sell,
          score: totalScore,
          breakdown: {
            tag: tagScore,
            price: priceScore,
            location: locScore,
            condition: conditionScore
          },
          distance_miles: Math.round(getDistance(buy.zipcode, sell.zipcode))
        });
      }
    }
  }
  
  matches.sort((a, b) => b.score - a.score);
  res.json(matches);
});

// Create listing
app.post('/api/listings', (req, res) => {
  const { type, category, title, description, price, min_price, max_price, condition, location, zipcode, tags, image } = req.body;
  
  if (!type || !category || !title) {
    return res.status(400).json({ error: 'Type, category, title required' });
  }
  
  const listing = {
    id: String(listings.length + 1),
    user_id: 'user1',
    type,
    category,
    title,
    description: description || '',
    price: price || 0,
    min_price: min_price || 0,
    max_price: max_price || 0,
    condition: condition || null,
    location: location || '',
    zipcode: zipcode || '',
    status: 'active',
    tags: tags || [],
    image: image || null
  };
  
  listings.push(listing);
  res.status(201).json(listing);
});

const PORT2 = process.env.PORT || 3000;
app.listen(PORT2, () => {
  console.log(`Server running on http://localhost:${PORT2}`);
});
