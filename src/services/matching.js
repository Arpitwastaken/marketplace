const pool = require('../db/pool');

/**
 * Tag normalization mapping
 */
const TAG_MAPPING = {
  'rtx 4070': 'gpu_rtx_4070', '4070': 'gpu_rtx_4070', 'nvidia 4070': 'gpu_rtx_4070',
  'rtx 4080': 'gpu_rtx_4080', '4080': 'gpu_rtx_4080', 'nvidia 4080': 'gpu_rtx_4080',
  'rtx 4090': 'gpu_rtx_4090', '4090': 'gpu_rtx_4090', 'nvidia 4090': 'gpu_rtx_4090',
  'rtx 3060': 'gpu_rtx_3060', 'rtx 3070': 'gpu_rtx_3070',
  'iphone 15': 'phone_iphone_15', 'iphone 14': 'phone_iphone_14', 'iphone': 'phone_iphone',
  'samsung': 'phone_samsung', 'galaxy': 'phone_samsung',
  'macbook': 'laptop_macbook', 'macbook pro': 'laptop_macbook_pro', 'macbook air': 'laptop_macbook_air',
  'playstation': 'gaming_playstation', 'ps5': 'gaming_ps5', 'ps4': 'gaming_ps4',
  'xbox': 'gaming_xbox', 'xbox series x': 'gaming_xbox_series_x',
  'nintendo': 'gaming_nintendo', 'switch': 'gaming_nintendo_switch'
};

function normalizeTags(tags) {
  if (!tags || !Array.isArray(tags)) return [];
  return tags.map(t => {
    const lower = t.toLowerCase().trim();
    return TAG_MAPPING[lower] || lower.replace(/\s+/g, '_');
  });
}

function tagSimilarity(buyerTags, sellerTags) {
  const buyerSet = new Set(normalizeTags(buyerTags));
  const sellerSet = new Set(normalizeTags(sellerTags));
  
  if (buyerSet.size === 0 || sellerSet.size === 0) return 0.5;
  
  const intersection = [...buyerSet].filter(t => sellerSet.has(t));
  const union = new Set([...buyerSet, ...sellerSet]);
  
  return intersection.length / union.size;
}

function locationScore(buyerLoc, sellerLoc) {
  if (!buyerLoc || !sellerLoc) return 0.5;
  return buyerLoc.toLowerCase().trim() === sellerLoc.toLowerCase().trim() ? 1.0 : 0.3;
}

const CONDITION_HIERARCHY = { 'new': 5, 'like_new': 4, 'good': 3, 'fair': 2, 'poor': 1 };

function conditionScore(pref, actual) {
  const prefVal = CONDITION_HIERARCHY[pref] || 3;
  const actualVal = CONDITION_HIERARCHY[actual] || 3;
  const diff = Math.abs(prefVal - actualVal);
  return Math.max(0, 1 - diff / 4);
}

async function reliabilityScore(userId) {
  try {
    const result = await pool.query(`
      SELECT tier, completion_rate FROM (
        SELECT id, tier FROM users WHERE id = $1
      ) u
      LEFT JOIN LATERAL (
        SELECT 
          COALESCE(completed_transactions::float / NULLIF(total_transactions, 1), 0.5) * 100 as completion_rate
        FROM (
          SELECT 
            COUNT(*) FILTER (WHERE escrow_status = 'released') as completed_transactions,
            COUNT(*) as total_transactions
          FROM transactions 
          WHERE buyer_id = $1 OR seller_id = $1
        ) t
      ) c ON true
    `, [userId]);
    
    if (result.rows.length === 0) return 0.5;
    
    const { tier = 0, completion_rate = 50 } = result.rows[0];
    return Math.min(1.0, (completion_rate / 100 * 0.6) + (tier * 0.2));
  } catch {
    return 0.5;
  }
}

function recencyScore(createdAt) {
  if (!createdAt) return 0.5;
  const hoursOld = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
  if (hoursOld < 24) return 1.0;
  if (hoursOld < 72) return 0.7;
  if (hoursOld < 168) return 0.4;
  return 0.2;
}

function priceScore(buyerMin, buyerMax, sellerPrice) {
  if (!buyerMin || !buyerMax || sellerPrice === null) return 12.5;
  
  const budgetMid = (buyerMin + buyerMax) / 2;
  const budgetRange = buyerMax - buyerMin;
  
  if (budgetRange <= 0) return sellerPrice <= buyerMax ? 25 : 0;
  
  const priceDiff = Math.abs(sellerPrice - budgetMid);
  return Math.max(0, (1 - priceDiff / budgetRange) * 25);
}

/**
 * Main matching function
 */
async function calculateMatch(buyerListing, sellerListing) {
  const scores = {};
  
  // Tag Match (40)
  scores.tag = tagSimilarity(buyerListing.tags, sellerListing.tags) * 40;
  
  // Price Closeness (25)
  scores.price = priceScore(buyerListing.min_price, buyerListing.max_price, sellerListing.price);
  
  // Location Match (15)
  scores.location = locationScore(buyerListing.location, sellerListing.location) * 15;
  
  // Condition Match (10)
  scores.condition = conditionScore(buyerListing.condition_preference, sellerListing.condition) * 10;
  
  // Seller Reliability (5)
  scores.reliability = await reliabilityScore(sellerListing.user_id) * 5;
  
  // Recency (5)
  scores.recency = recencyScore(sellerListing.created_at) * 5;
  
  const total = scores.tag + scores.price + scores.location + scores.condition + scores.reliability + scores.recency;
  
  return {
    score: Math.round(total * 100) / 100,
    breakdown: {
      tag_score: Math.round(scores.tag * 100) / 100,
      price_score: Math.round(scores.price * 100) / 100,
      location_score: Math.round(scores.location * 100) / 100,
      condition_score: Math.round(scores.condition * 100) / 100,
      reliability_score: Math.round(scores.reliability * 100) / 100,
      recency_score: Math.round(scores.recency * 100) / 100
    },
    match: total >= 55
  };
}

/**
 * Run matching for a new listing
 */
async function runMatching(listingId, listingType) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Get the listing
    const listingResult = await client.query('SELECT * FROM listings WHERE id = $1', [listingId]);
    if (listingResult.rows.length === 0) {
      throw new Error('Listing not found');
    }
    
    const listing = listingResult.rows[0];
    const isBuy = listing.type === 'buy';
    
    // Find opposite type listings in same category
    const oppositeType = isBuy ? 'sell' : 'buy';
    const matchesResult = await client.query(`
      SELECT l.*, 
        $1 as target_min_price,
        $1 as target_max_price,
        $1 as target_condition_pref
      FROM listings l
      WHERE l.type = $2
        AND l.category = $3
        AND l.status = 'active'
        AND l.id != $4
    `, [isBuy ? listing.min_price : listing.max_price, oppositeType, listing.category, listingId]);
    
    // Calculate scores and insert matches
    const matchPromises = matchesResult.rows.map(async (potentialMatch) => {
      const matchData = await calculateMatch(
        { ...listing, min_price: listing.min_price, max_price: listing.max_price, condition_preference: listing.condition_preference },
        potentialMatch
      );
      
      if (matchData.match) {
        await client.query(`
          INSERT INTO matches (
            buyer_listing_id, seller_listing_id, score,
            tag_score, price_score, location_score, condition_score, reliability_score, recency_score
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          ON CONFLICT DO NOTHING
        `, [
          isBuy ? listingId : potentialMatch.id,
          isBuy ? potentialMatch.id : listingId,
          matchData.score,
          matchData.breakdown.tag_score,
          matchData.breakdown.price_score,
          matchData.breakdown.location_score,
          matchData.breakdown.condition_score,
          matchData.breakdown.reliability_score,
          matchData.breakdown.recency_score
        ]);
        
        // Create notifications for top 3 matches
        await client.query(`
          INSERT INTO notifications (user_id, type, title, body, data)
          SELECT 
            l.user_id, 'match', 'New Match Found!', 
            'A new listing matches your ' || l.type || ' post',
            jsonb_build_object('match_id', m.id, 'listing_id', l.id)
          FROM matches m
          JOIN listings l ON l.id = m.seller_listing_id
          WHERE m.buyer_listing_id = $1
          ORDER BY m.score DESC
          LIMIT 3
        `, [isBuy ? listingId : potentialMatch.id]);
      }
    });
    
    await Promise.all(matchPromises);
    await client.query('COMMIT');
    
    console.log(`✅ Matching complete for listing ${listingId}`);
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Matching error:', error);
  } finally {
    client.release();
  }
}

module.exports = {
  calculateMatch,
  runMatching,
  normalizeTags,
  tagSimilarity,
  locationScore,
  conditionScore,
  priceScore
};
