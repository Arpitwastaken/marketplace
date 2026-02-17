const express = require('express');
const pool = require('../db/pool');

const router = express.Router();

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token' });
  }
  const token = authHeader.split(' ')[1];
  const jwt = require('jsonwebtoken');
  try {
    const decoded = jwt.verify(token, 'marketplace-secret-key');
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Create offer
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { match_id, amount, seller_listing_id } = req.body;
    
    // Create offer record
    const result = await pool.query(`
      INSERT INTO offers (from_user_id, to_listing_id, amount, status)
      VALUES ($1, $2, $3, 'pending')
      RETURNING *
    `, [req.userId, seller_listing_id, amount]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Offer error:', error.message);
    res.status(500).json({ error: 'Failed to create offer' });
  }
});

// Get my offers
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT o.*, l.title as listing_title, l.price as listing_price
      FROM offers o
      JOIN listings l ON o.to_listing_id = l.id
      WHERE o.from_user_id = $1
      ORDER BY o.created_at DESC
    `, [req.userId]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get offers error:', error.message);
    res.status(500).json({ error: 'Failed to get offers' });
  }
});

// Accept offer
router.put('/:id/accept', authMiddleware, async (req, res) => {
  try {
    await pool.query(`
      UPDATE offers SET status = 'accepted', responded_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `, [req.params.id]);
    
    res.json({ message: 'Offer accepted' });
  } catch (error) {
    console.error('Accept error:', error.message);
    res.status(500).json({ error: 'Failed to accept offer' });
  }
});

// Reject offer
router.put('/:id/reject', authMiddleware, async (req, res) => {
  try {
    await pool.query(`
      UPDATE offers SET status = 'rejected', responded_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `, [req.params.id]);
    
    res.json({ message: 'Offer rejected' });
  } catch (error) {
    console.error('Reject error:', error.message);
    res.status(500).json({ error: 'Failed to reject offer' });
  }
});

module.exports = router;
