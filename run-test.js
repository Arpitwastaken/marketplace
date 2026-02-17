// Simple test runner that outputs to file
const fs = require('fs');
const path = require('path');

let output = '';

// Haversine formula
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function calculateMatchScore(buyer, seller, config) {
  if (buyer.category !== seller.category) return 0;
  
  const priceMatch = seller.price <= buyer.price;
  const priceDiff = priceMatch ? (buyer.price - seller.price) / buyer.price : 0;
  const priceScore = priceMatch ? 40 * (1 - priceDiff * config.priceTolerance) : 0;
  
  const distance = calculateDistance(
    buyer.location.lat, buyer.location.lng,
    seller.location.lat, seller.location.lng
  );
  const locationScore = distance <= config.maxDistance ? 30 * (1 - distance / config.maxDistance) : 0;
  
  const categoryScore = buyer.category === seller.category ? 30 : 0;
  
  return (priceScore + locationScore + categoryScore) / 100;
}

function findMatches(buyers, sellers, config) {
  const matches = [];
  for (const buyer of buyers) {
    for (const seller of sellers) {
      if (buyer.id === seller.id) continue;
      
      const score = calculateMatchScore(buyer, seller, config);
      if (score >= config.minScore) {
        const distance = calculateDistance(
          buyer.location.lat, buyer.location.lng,
          seller.location.lat, seller.location.lng
        );
        matches.push({
          buyerId: buyer.id,
          sellerId: seller.id,
          score: Math.round(score * 100) / 100,
          priceMatch: seller.price <= buyer.price,
          categoryMatch: buyer.category === seller.category,
          locationScore: Math.round((1 - distance / config.maxDistance) * 100) / 100
        });
      }
    }
  }
  return matches.sort((a, b) => b.score - a.score);
}

const config = { minScore: 0.5, maxDistance: 100, priceTolerance: 0.1 };

const testBuyers = [
  { id: 'buyer_1', type: 'buyer', category: 'electronics', price: 500, location: { lat: 40.7128, lng: -74.006 } },
  { id: 'buyer_2', type: 'buyer', category: 'furniture', price: 300, location: { lat: 40.7589, lng: -73.9851 } },
  { id: 'buyer_3', type: 'buyer', category: 'electronics', price: 800, location: { lat: 40.7128, lng: -74.006 } }
];

const testSellers = [
  { id: 'seller_1', type: 'seller', category: 'electronics', price: 450, location: { lat: 40.7282, lng: -73.7949 } },
  { id: 'seller_2', type: 'seller', category: 'furniture', price: 250, location: { lat: 40.7831, lng: -73.9712 } },
  { id: 'seller_3', type: 'seller', category: 'electronics', price: 750, location: { lat: 40.7128, lng: -74.006 } },
  { id: 'seller_4', type: 'seller', category: 'vehicles', price: 5000, location: { lat: 40.6501, lng: -73.9496 } }
];

output += '=== Running Matching Service Tests ===\n\n';

const matches = findMatches(testBuyers, testSellers, config);
output += `Found ${matches.length} matches\n\n`;

for (const m of matches) {
  output += `${m.buyerId} <-> ${m.sellerId}: Score=${(m.score*100).toFixed(1)}%, PriceMatch=${m.priceMatch}, CategoryMatch=${m.categoryMatch}\n`;
}

// Validation
let healthScore = 100;
const issues = [];

if (matches.length < 3) {
  issues.push('Not enough matches');
  healthScore -= 10;
}

const wrongCategory = matches.filter(m => !m.categoryMatch);
if (wrongCategory.length > 0) {
  issues.push('Wrong category matches');
  healthScore -= 20;
}

const priceViolations = matches.filter(m => {
  const s = testSellers.find(s => s.id === m.sellerId);
  const b = testBuyers.find(b => b.id === m.buyerId);
  return s.price > b.price;
});
if (priceViolations.length > 0) {
  issues.push('Price violations');
  healthScore -= 15;
}

output += '\n=== RESULTS ===\n';
output += `Health Score: ${healthScore}/100\n`;
output += `Matches Created: ${matches.length}\n`;
output += `Issues: ${issues.length > 0 ? issues.join(', ') : 'None'}\n`;

// Write output to file
fs.writeFileSync(path.join(__dirname, 'test-results.txt'), output);
console.log('Test completed. Results written to test-results.txt');
