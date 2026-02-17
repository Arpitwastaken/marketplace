import { Listing, Match, MatchingConfig } from './models';

// Haversine formula to calculate distance between two coordinates
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Calculate match score between buyer and seller
export function calculateMatchScore(
  buyer: Listing,
  seller: Listing,
  config: MatchingConfig
): number {
  // Must be same category
  if (buyer.category !== seller.category) {
    return 0;
  }

  let score = 0;

  // Price compatibility (buyer's max price >= seller's price)
  const buyerMaxPrice = buyer.price; // For buyer, price = max they're willing to pay
  const sellerPrice = seller.price; // For seller, price = asking price

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

  // Category score (0-30 points - must match)
  const categoryScore = buyer.category === seller.category ? 30 : 0;

  score = priceScore + locationScore + categoryScore;

  return Math.round(score) / 100; // Normalize to 0-1
}

// Find all matches between buyers and sellers
export function findMatches(
  buyers: Listing[],
  sellers: Listing[],
  config: MatchingConfig
): Match[] {
  const matches: Match[] = [];

  for (const buyer of buyers) {
    for (const seller of sellers) {
      // Skip if same listing or same type
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
          createdAt: new Date()
        });
      }
    }
  }

  // Sort by score descending
  return matches.sort((a, b) => b.score - a.score);
}

// Default configuration
export const defaultConfig: MatchingConfig = {
  minScore: 0.5,
  maxDistance: 100, // km
  priceTolerance: 0.1
};
