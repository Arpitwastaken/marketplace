const jwt = require('jsonwebtoken');
const pool = require('../db/pool');

const JWT_SECRET = process.env.JWT_SECRET || 'marketplace-secret-key-change-in-production';

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Get user from database
    const result = await pool.query('SELECT id, email, tier FROM users WHERE id = $1', [decoded.userId]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    req.user = result.rows[0];
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }
  
  const token = authHeader.split(' ')[1];
  
  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) return next();
    
    try {
      const result = await pool.query('SELECT id, email, tier FROM users WHERE id = $1', [decoded.userId]);
      if (result.rows.length > 0) {
        req.user = result.rows[0];
      }
    } catch {}
    next();
  });
}

function requireTier(minTier) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    if (req.user.tier < minTier) {
      return res.status(403).json({ error: `Tier ${minTier} required` });
    }
    next();
  };
}

module.exports = { authMiddleware, optionalAuth, requireTier, JWT_SECRET };
