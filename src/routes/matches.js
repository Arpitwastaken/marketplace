const express = require('express');
const pool = require('../db/pool');

const router = express.Router();

// Tag normalization
function normalizeTags(tags) {
  if (!tags) return [];
  const mapping = {
    'iphone 15': 'iphone_15', 'iphone': 'iphone',
    'rtx 4070': 'gpu_rtx_4070', 'rtx 4080': 'gpu_rtx_4080',
    'macbook': 'macbook', 'ps5': 'ps5'
  };
  return tags.map(t => mapping[t.toLowerCase()] || t.toLowerCase().replace(/\s+/g, '_'));
}

function tagScore(buyerTags, sellerTags) {
  const b = new Set(normalizeTags(buyerTags));
  const s = new Set(normalizeTags(sellerTags));
  if (!b.size || !s.size) return 0.5;
  const match = [...b].filter(x => s.has(x)).length;
  return match / Math.max(b.size, s.size);
}

function priceScore(buyerMin, buyerMax, sellerPrice) {
  if (!buyerMin || !buyerMax || !sellerPrice) return 12.5;
  const mid = (buyerMin + buyerMax) / 2;
  const range = buyerMax - buyerMin;
  if (range <= 0) return sellerPrice <= buyerMax ? 25 : 0;
  const diff = Math.abs(sellerPrice - mid);
  return Math.max(0, (1 - diff / range)) * 25;
}

function locationScore(buyerLoc, sellerLoc) {
  if (!buyerLoc || !sellerLoc) return 7.5;
  return buyerLoc.toLowerCase() === sellerLoc.toLowerCase() ? 15 : 4.5;
}

function conditionScore(pref, actual) {
  const hier = { new: 5, like_new: 4, good: 3, fair: 2, poor: 1 };
  if (!pref || !actual) return 5;
  return Math.max(0, (1 - Math.abs(hier[pref] - hier[actual]) / 4)) * 10;
}

// Get matches for user's listings
router.get('/', async (req, res) => {
  try {
    const { user_id } = req.query;
    
    // Get user's buy listings
    const buys = await pool.query(
      "SELECT * FROM listings WHERE user_id = $1 AND type = 'buy' AND status = 'active'",
      [user_id]
    );
    
    // Get ALL sell listings (not just other users)
    const sells = await pool.query(
      "SELECT * FROM listings WHERE type = 'sell' AND status = 'active'",
      []
    );
    
    const matches = [];
    
    for (const buy of buys.rows) {
      for (const sell of sells.rows) {
        if (buy.category !== sell.category) continue;
        
        const score = 
          tagScore(buy.tags, sell.tags) * 40 +
          priceScore(Number(buy.min_price), Number(buy.max_price), Number(sell.price)) * 25 +
          locationScore(buy.location, sell.location) * 15 +
          conditionScore(buy.condition_preference, sell.condition) * 10 +
          5; // recency bonus
        
        if (score >= 55) {
          matches.push({
            buyer_listing: buy,
            seller_listing: sell,
            score: Math.round(score),
            breakdown: {
              tag: Math.round(tagScore(buy.tags, sell.tags) * 40),
              price: Math.round(priceScore(Number(buy.min_price), Number(buy.max_price), Number(sell.price)) * 25),
              location: Math.round(locationScore(buy.location, sell.location) * 15),
              condition: Math.round(conditionScore(buy.condition_preference, sell.condition) * 10)
            }
          });
        }
      }
    }
    
    // Sort by score
    matches.sort((a, b) => b.score - a.score);
    
    res.json(matches.slice(0, 10));
  } catch (error) {
    console.error('Matches error:', error.message);
    res.status(500).json({ error: 'Failed to get matches' });
  }
});

module.exports = router;
