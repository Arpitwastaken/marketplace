const express = require('express');
const pool = require('../db/pool');
const { authMiddleware, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get public profile
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      SELECT 
        id, email, tier, created_at,
        (SELECT COUNT(*) FROM listings WHERE user_id = $1 AND status = 'active') as active_listings,
        (SELECT COUNT(*) FROM listings WHERE user_id = $1) as total_listings,
        (SELECT COUNT(*) FROM transactions WHERE (buyer_id = $1 OR seller_id = $1) AND escrow_status = 'released') as completed_transactions,
        (SELECT COUNT(*) FROM disputes WHERE opened_by = $1 AND status = 'resolved') as disputes
      FROM users 
      WHERE id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Get user listings
router.get('/:id/listings', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status = 'active', limit = 20 } = req.query;
    
    const result = await pool.query(`
      SELECT * FROM listings 
      WHERE user_id = $1 AND status = $2
      ORDER BY created_at DESC
      LIMIT $3
    `, [id, status, parseInt(limit)]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get user listings error:', error);
    res.status(500).json({ error: 'Failed to get user listings' });
  }
});

// Get user reviews
router.get('/:id/reviews', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Placeholder for reviews - would need a reviews table
    res.json([]);
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({ error: 'Failed to get user reviews' });
  }
});

module.exports = router;
