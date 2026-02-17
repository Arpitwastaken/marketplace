import { Listing, Match } from './src/models';
import { findMatches, defaultConfig } from './src/matching';

// Test buyer listings
export const testBuyers: Listing[] = [
  {
    id: 'buyer_1',
    type: 'buyer',
    category: 'electronics',
    price: 500, // Max willing to pay
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

// Test seller listings
export const testSellers: Listing[] = [
  {
    id: 'seller_1',
    type: 'seller',
    category: 'electronics',
    price: 450, // Asking price
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
export function runMatchingTests(): {
  healthScore: number;
  matchesCreated: number;
  matches: Match[];
  issues: string[];
} {
  const issues: string[] = [];
  let healthScore = 100;

  console.log('=== Running Matching Service Tests ===\n');

  // Test 1: Basic matching
  console.log('Test 1: Basic buyer-seller matching...');
  const matches = findMatches(testBuyers, testSellers, defaultConfig);
  console.log(`Found ${matches.length} matches\n`);

  // Test 2: Verify scores
  console.log('Test 2: Verifying match scores...');
  for (const match of matches) {
    console.log(`  Match ${match.id}:`);
    console.log(`    Score: ${(match.score * 100).toFixed(1)}%`);
    console.log(`    Price Match: ${match.priceMatch}`);
    console.log(`    Category Match: ${match.categoryMatch}`);
    console.log(`    Location Score: ${(match.locationScore * 100).toFixed(1)}%`);
  }

  // Test 3: Validate matching logic
  console.log('\nTest 3: Validating matching logic...');

  // Check expected matches
  const expectedMatches = [
    { buyer: 'buyer_1', seller: 'seller_1', reason: 'Same category, price in range, close location' },
    { buyer: 'buyer_2', seller: 'seller_2', reason: 'Same category, price in range' },
    { buyer: 'buyer_3', seller: 'seller_3', reason: 'Same category, price in range, same location' }
  ];

  for (const expected of expectedMatches) {
    const match = matches.find(m => m.buyerId === expected.buyer && m.sellerId === expected.seller);
    if (match) {
      console.log(`  ✓ ${expected.buyer} <-> ${expected.seller}: ${(match.score * 100).toFixed(1)}%`);
    } else {
      issues.push(`Missing expected match: ${expected.buyer} <-> ${expected.seller}`);
      healthScore -= 10;
    }
  }

  // Check no wrong category matches
  const wrongCategoryMatches = matches.filter(m => !m.categoryMatch);
  if (wrongCategoryMatches.length > 0) {
    issues.push('Found matches with mismatched categories');
    healthScore -= 20;
  }

  // Test 4: Price validation
  console.log('\nTest 4: Price validation...');
  const priceViolations = matches.filter(m => m.priceMatch && 
    testSellers.find(s => s.id === m.sellerId)!.price > 
    testBuyers.find(b => b.id === m.buyerId)!.price
  );
  
  if (priceViolations.length > 0) {
    issues.push('Found matches where seller price > buyer max price');
    healthScore -= 15;
  } else {
    console.log('  ✓ All price matches are valid');
  }

  // Test 5: Score range validation
  console.log('\nTest 5: Score range validation...');
  const invalidScores = matches.filter(m => m.score < 0 || m.score > 1);
  if (invalidScores.length > 0) {
    issues.push('Found matches with invalid scores (not between 0-1)');
    healthScore -= 10;
  } else {
    console.log('  ✓ All scores are in valid range (0-1)');
  }

  // Final health check
  if (matches.length === 0) {
    issues.push('No matches created - matching algorithm may not be working');
    healthScore = 0;
  }

  console.log('\n=== Test Results ===');
  console.log(`Health Score: ${healthScore}/100`);
  console.log(`Matches Created: ${matches.length}`);
  console.log(`Issues Found: ${issues.length}`);

  return {
    healthScore,
    matchesCreated: matches.length,
    matches,
    issues
  };
}

// Run tests if executed directly
if (require.main === module) {
  const results = runMatchingTests();
  console.log('\nFull match details:');
  console.log(JSON.stringify(results.matches, null, 2));
}
