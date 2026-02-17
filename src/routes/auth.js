const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db/pool');

const router = express.Router();
const JWT_SECRET = 'marketplace-secret-key';

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    const passwordHash = await bcrypt.hash(password, 10);
    
    const result = await pool.query(`
      INSERT INTO users (email, password_hash, tier)
      VALUES ($1, $2, 0)
      RETURNING id, email, tier
    `, [email, passwordHash]);
    
    const token = jwt.sign({ userId: result.rows[0].id }, JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({ user: result.rows[0], token });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Email already registered' });
    }
    console.error('Register error:', error.message);
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ user: { id: user.id, email: user.email, tier: user.tier }, token });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
