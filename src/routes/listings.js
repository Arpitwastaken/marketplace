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

router.get('/', async (req, res) => {
  try {
    const { type, category, status = 'active', limit = 50 } = req.query;
    
    let query = 'SELECT l.*, u.email FROM listings l JOIN users u ON l.user_id = u.id WHERE 1=1';
    const params = [];
    let i = 1;
    
    if (type) { query += ` AND l.type = $${i++}`; params.push(type); }
    if (category) { query += ` AND l.category = $${i++}`; params.push(category); }
    if (status) { query += ` AND l.status = $${i++}`; params.push(status); }
    
    query += ` ORDER BY l.created_at DESC LIMIT $${i++}`;
    params.push(parseInt(limit));
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Listings error:', error.message);
    res.status(500).json({ error: 'Failed to get listings' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { type, category, title, description, price, min_price, max_price, condition, location, tags } = req.body;
    
    if (!type || !category || !title) {
      return res.status(400).json({ error: 'Type, category, title required' });
    }
    
    const result = await pool.query(`
      INSERT INTO listings (user_id, type, category, title, description, price, min_price, max_price, condition, location, tags)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `, [req.userId, type, category, title, description, price, min_price, max_price, condition, location, tags]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create listing error:', error.message);
    res.status(500).json({ error: 'Failed to create listing' });
  }
});

module.exports = router;
