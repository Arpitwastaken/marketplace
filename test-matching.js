// Simple JavaScript matching test runner
// Haversine formula to calculate distance between two coordinates
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg) {
  return deg * (Math.PI / 180);
}

// Calculate match score between buyer and seller
function calculateMatchScore(buyer, seller, config) {
  // Must be same category
  if (buyer.category !== seller.category) {
    return 0;
  }

  let score = 0;

  // Price compatibility
  const buyerMaxPrice = buyer.price;
  const sellerPrice = seller.price;

  const priceMatch = sellerPrice <= buyerMaxPrice;
  const priceDiff = priceMatch ? (buyerMaxPrice - sellerPrice) / buyerMaxPrice : 0;

  // Price score (0-40 points)
  const priceScore = priceMatch ? 40 * (1 - priceDiff * config.priceTolerance) : 0;

  // Location score (0-30 points)
  const distance = calculateDistance(
    buyer.location.lat,
    buyer.location.lng,
    seller.location.lat,
    seller.location.lng
  );

  const locationScore = distance <= config.maxDistance
    ? 30 * (1 - distance / config.maxDistance)
    : 0;

  // Category score (0-30 points)
  const categoryScore = buyer.category === seller.category ? 30 : 0;

  score = priceScore + locationScore + categoryScore;

  return Math.round(score) / 100;
}

// Find all matches
function findMatches(buyers, sellers, config) {
  const matches = [];

  for (const buyer of buyers) {
    for (const seller of sellers) {
      if (buyer.id === seller.id || buyer.type === seller.type) {
        continue;
      }

      const score = calculateMatchScore(buyer, seller, config);

      if (score >= config.minScore) {
        const distance = calculateDistance(
          buyer.location.lat,
          buyer.location.lng,
          seller.location.lat,
          seller.location.lng
        );

        matches.push({
          id: `match_${buyer.id}_${seller.id}`,
          buyerId: buyer.id,
          sellerId: seller.id,
          score,
          priceMatch: seller.price <= buyer.price,
          categoryMatch: buyer.category === seller.category,
          locationScore: Math.max(0, 1 - distance / config.maxDistance),
          createdAt: new Date().toISOString()
        });
      }
    }
  }

  return matches.sort((a, b) => b.score - a.score);
}

// Configuration
const config = {
  minScore: 0.5,
  maxDistance: 100,
  priceTolerance: 0.1
};

// Test data
const testBuyers = [
  {
    id: 'buyer_1',
    type: 'buyer',
    category: 'electronics',
    price: 500,
    location: { lat: 40.7128, lng: -74.006, city: 'New York' },
    description: 'Looking for a laptop',
    createdAt: new Date()
  },
  {
    id: 'buyer_2',
    type: 'buyer',
    category: 'furniture',
    price: 300,
    location: { lat: 40.7589, lng: -73.9851, city: 'Manhattan' },
    description: 'Need a sofa',
    createdAt: new Date()
  },
  {
    id: 'buyer_3',
    type: 'buyer',
    category: 'electronics',
    price: 800,
    location: { lat: 40.7128, lng: -74.006, city: 'New York' },
    description: 'Want a gaming PC',
    createdAt: new Date()
  }
];

const testSellers = [
  {
    id: 'seller_1',
    type: 'seller',
    category: 'electronics',
    price: 450,
    location: { lat: 40.7282, lng: -73.7949, city: 'Queens' },
    description: 'Selling laptop',
    createdAt: new Date()
  },
  {
    id: 'seller_2',
    type: 'seller',
    category: 'furniture',
    price: 250,
    location: { lat: 40.7831, lng: -73.9712, city: 'Upper West Side' },
    description: 'Selling sofa',
    createdAt: new Date()
  },
  {
    id: 'seller_3',
    type: 'seller',
    category: 'electronics',
    price: 750,
    location: { lat: 40.7128, lng: -74.006, city: 'New York' },
    description: 'Selling gaming PC',
    createdAt: new Date()
  },
  {
    id: 'seller_4',
    type: 'seller',
    category: 'vehicles',
    price: 5000,
    location: { lat: 40.6501, lng: -73.9496, city: 'Brooklyn' },
    description: 'Selling car',
    createdAt: new Date()
  }
];

// Run matching tests
function runMatchingTests() {
  const issues = [];
  let healthScore = 100;

  console.log('=== Running Matching Service Tests ===\n');

  // Run matching
  const matches = findMatches(testBuyers, testSellers, config);
  console.log(`Found ${matches.length} matches\n`);

  // Display matches
  console.log('Matches found:');
  for (const match of matches) {
    const buyer = testBuyers.find(b => b.id === match.buyerId);
    const seller = testSellers.find(s => s.id === match.sellerId);
    console.log(`  ${match.buyerId} (${buyer.category}, $${buyer.price}) <-> ${match.sellerId} (${seller.category}, $${seller.price})`);
    console.log(`    Score: ${(match.score * 100).toFixed(1)}% | Price Match: ${match.priceMatch} | Category Match: ${match.categoryMatch}`);
  }

  // Validation checks
  console.log('\n=== Validation ===');

  // Check expected matches
  const expectedMatches = ['buyer_1-seller_1', 'buyer_2-seller_2', 'buyer_3-seller_3'];
  let foundExpected = 0;
  for (const expected of expectedMatches) {
    const [buyerId, sellerId] = expected.split('-');
    const match = matches.find(m => m.buyerId === buyerId && m.sellerId === sellerId);
    if (match) foundExpected++;
  }
  console.log(`Expected matches found: ${foundExpected}/3`);

  if (foundExpected < 3) {
    issues.push(`Missing ${3 - foundExpected} expected matches`);
    healthScore -= 10;
  }

  // Check category matching
  const wrongCategory = matches.filter(m => !m.categoryMatch);
  if (wrongCategory.length > 0) {
    issues.push('Found matches with wrong categories');
    healthScore -= 20;
  } else {
    console.log('✓ All matches have correct category');
  }

  // Check price validation
  const priceViolations = matches.filter(m => {
    const seller = testSellers.find(s => s.id === m.sellerId);
    const buyer = testBuyers.find(b => b.id === m.buyerId);
    return seller.price > buyer.price;
  });
  if (priceViolations.length > 0) {
    issues.push('Price violations found');
    healthScore -= 15;
  } else {
    console.log('✓ All price matches are valid');
  }

  // Check score range
  const invalidScores = matches.filter(m => m.score < 0 || m.score > 1);
  if (invalidScores.length > 0) {
    issues.push('Invalid scores found');
    healthScore -= 10;
  } else {
    console.log('✓ All scores in valid range');
  }

  // Final results
  console.log('\n=== FINAL RESULTS ===');
  console.log(`Health Score: ${healthScore}/100`);
  console.log(`Matches Created: ${matches.length}`);
  console.log(`Issues: ${issues.length > 0 ? issues.join(', ') : 'None'}`);

  return {
    healthScore,
    matchesCreated: matches.length,
    issues
  };
}

// Run tests
const results = runMatchingTests();
process.exit(results.healthScore >= 80 ? 0 : 1);
