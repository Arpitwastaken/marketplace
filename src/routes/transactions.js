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

// Get my transactions
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT t.*, l.title as listing_title
      FROM transactions t
      JOIN listings l ON t.listing_id = l.id
      WHERE t.buyer_id = $1 OR t.seller_id = $1
      ORDER BY t.created_at DESC
    `, [req.userId]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Transactions error:', error.message);
    res.status(500).json({ error: 'Failed to get transactions' });
  }
});

// Start escrow (buyer pays)
router.post('/:id/escrow', authMiddleware, async (req, res) => {
  try {
    await pool.query(`
      UPDATE transactions 
      SET escrow_status = 'held', escrow_held_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND buyer_id = $2
    `, [req.params.id, req.userId]);
    
    res.json({ message: 'Payment held in escrow' });
  } catch (error) {
    console.error('Escrow error:', error.message);
    res.status(500).json({ error: 'Failed to start escrow' });
  }
});

// Confirm delivery (release funds)
router.put('/:id/confirm', authMiddleware, async (req, res) => {
  try {
    await pool.query(`
      UPDATE transactions 
      SET escrow_status = 'released', 
          escrow_released_at = CURRENT_TIMESTAMP,
          completed_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND buyer_id = $2
    `, [req.params.id, req.userId]);
    
    res.json({ message: 'Transaction complete, funds released' });
  } catch (error) {
    console.error('Confirm error:', error.message);
    res.status(500).json({ error: 'Failed to confirm' });
  }
});

// Open dispute
router.post('/:id/dispute', authMiddleware, async (req, res) => {
  try {
    const { reason } = req.body;
    
    await pool.query(`
      UPDATE transactions 
      SET dispute_status = 'open', dispute_reason = $1
      WHERE id = $2 AND (buyer_id = $3 OR seller_id = $3)
    `, [reason, req.params.id, req.userId]);
    
    res.json({ message: 'Dispute opened' });
  } catch (error) {
    console.error('Dispute error:', error.message);
    res.status(500).json({ error: 'Failed to open dispute' });
  }
});

module.exports = router;
