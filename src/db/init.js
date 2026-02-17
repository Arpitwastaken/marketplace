const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'marketplace',
  port: 5432,
});

async function addMissingTables() {
  const client = await pool.connect();
  
  try {
    // Create offers table
    await client.query(`
      CREATE TABLE IF NOT EXISTS offers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        from_user_id UUID REFERENCES users(id),
        to_listing_id UUID REFERENCES listings(id),
        amount DECIMAL(12, 2) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        responded_at TIMESTAMP
      )
    `);
    console.log('Offers table created');
    
    // Create transactions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        listing_id UUID REFERENCES listings(id),
        buyer_id UUID REFERENCES users(id),
        seller_id UUID REFERENCES users(id),
        amount DECIMAL(12, 2) NOT NULL,
        escrow_status VARCHAR(20) DEFAULT 'pending',
        escrow_held_at TIMESTAMP,
        escrow_released_at TIMESTAMP,
        dispute_status VARCHAR(20) DEFAULT 'none',
        dispute_reason TEXT,
        completed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Transactions table created');
    
    // Insert sample data
    const existingUsers = await client.query('SELECT COUNT(*) FROM users');
    if (parseInt(existingUsers.rows[0].count) === 0) {
      console.log('Inserting sample data...');
      
      // Create sample users
      const userResult = await client.query(`
        INSERT INTO users (email, password_hash, phone, tier) VALUES
          ('buyer@example.com', 'hashed_password', '555-0101', 1),
          ('seller@example.com', 'hashed_password', '555-0102', 1)
        RETURNING id, email
      `);
      
      const buyerId = userResult.rows[0].id;
      const sellerId = userResult.rows[1].id;
      
      // Create sample buy listings
      await client.query(`
        INSERT INTO listings (user_id, type, category, title, description, min_price, max_price, condition_preference, location, tags, status) VALUES
          ($1, 'buy', 'electronics', 'iPhone 15 Pro', 'Looking for iPhone 15 Pro Max', 800, 1200, 'like_new', 'New York', ARRAY['iphone', 'iphone_15', 'apple'], 'active'),
          ($1, 'buy', 'electronics', 'RTX 4080 GPU', 'Need graphics card for gaming', 800, 1200, 'new', 'Los Angeles', ARRAY['gpu', 'rtx_4080', 'nvidia'], 'active')
      `, [buyerId]);
      
      // Create sample sell listings
      await client.query(`
        INSERT INTO listings (user_id, type, category, title, description, price, condition, location, tags, status) VALUES
          ($2, 'sell', 'electronics', 'iPhone 15 Pro Max 256GB', 'Excellent condition, includes box', 950, 'like_new', 'New York', ARRAY['iphone', 'iphone_15', 'apple'], 'active'),
          ($2, 'sell', 'electronics', 'RTX 4080 Super', 'Brand new in box, unopened', 1100, 'new', 'Los Angeles', ARRAY['gpu', 'rtx_4080', 'nvidia'], 'active'),
          ($2, 'sell', 'electronics', 'MacBook Pro 14 inch', 'M3 Pro, 18GB RAM, like new', 1800, 'like_new', 'Chicago', ARRAY['macbook', 'apple', 'laptop'], 'active')
      `, [sellerId]);
      
      console.log('Sample data inserted');
    }
    
    console.log('Setup complete!');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

addMissingTables();
