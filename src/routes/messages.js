const express = require('express');
const pool = require('../db/pool');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get messages for a match
router.get('/match/:matchId', authMiddleware, async (req, res) => {
  try {
    const { matchId } = req.params;
    
    // Verify user is part of this match
    const matchCheck = await pool.query(`
      SELECT m.*, bl.user_id as buyer_id, sl.user_id as seller_id
      FROM matches m
      JOIN listings bl ON m.buyer_listing_id = bl.id
      JOIN listings sl ON m.seller_listing_id = sl.id
      WHERE m.id = $1
    `, [matchId]);
    
    if (matchCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Match not found' });
    }
    
    const { buyer_id, seller_id } = matchCheck.rows[0];
    if (req.user.id !== buyer_id && req.user.id !== seller_id) {
      return res.status(403).json({ error: 'Not part of this match' });
    }
    
    const result = await pool.query(`
      SELECT m.*, 
        from_user.email as from_email,
        to_user.email as to_email
      FROM messages m
      JOIN users from_user ON m.from_user_id = from_user.id
      JOIN users to_user ON m.to_user_id = to_user.id
      WHERE m.match_id = $1
      ORDER BY m.created_at ASC
    `, [matchId]);
    
    // Mark messages as read
    await pool.query(`
      UPDATE messages SET read_at = CURRENT_TIMESTAMP
      WHERE match_id = $1 AND to_user_id = $2 AND read_at IS NULL
    `, [matchId, req.user.id]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
});

// Send message
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { match_id, content } = req.body;
    
    if (!match_id || !content) {
      return res.status(400).json({ error: 'Match ID and content required' });
    }
    
    // Verify user is part of this match and get recipient
    const matchCheck = await pool.query(`
      SELECT m.*, bl.user_id as buyer_id, sl.user_id as seller_id
      FROM matches m
      JOIN listings bl ON m.buyer_listing_id = bl.id
      JOIN listings sl ON m.seller_listing_id = sl.id
      WHERE m.id = $1
    `, [match_id]);
    
    if (matchCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Match not found' });
    }
    
    const { buyer_id, seller_id } = matchCheck.rows[0];
    if (req.user.id !== buyer_id && req.user.id !== seller_id) {
      return res.status(403).json({ error: 'Not part of this match' });
    }
    
    const toUserId = req.user.id === buyer_id ? seller_id : buyer_id;
    
    const result = await pool.query(`
      INSERT INTO messages (match_id, from_user_id, to_user_id, content)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [match_id, req.user.id, toUserId, content]);
    
    // Update match status
    await pool.query('UPDATE matches SET status = \'messaged\' WHERE id = $1', [match_id]);
    
    // Notify recipient
    await pool.query(`
      INSERT INTO notifications (user_id, type, title, body, data)
      VALUES ($1, 'match', 'New Message', 'You have a new message', $2)
    `, [toUserId, { match_id, message_id: result.rows[0].id }]);
    
    // Log event
    await pool.query(`
      INSERT INTO events (event_type, user_id, match_id, metadata)
      VALUES ('message_sent', $1, $2, $3)
    `, [req.user.id, match_id, { content_length: content.length }]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

module.exports = router;
