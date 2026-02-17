const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'marketplace',
  port: 5432,
});

async function addMoreData() {
  const client = await pool.connect();
  
  try {
    // Create second user for matching
    const userResult = await client.query(`
      INSERT INTO users (email, password_hash, phone, tier) 
      VALUES ('buyer@test.com', 'hashed', '555-9999', 1)
      RETURNING id
    `);
    
    const buyerId = userResult.rows[0].id;
    console.log('Created buyer user:', buyerId);
    
    // Get the existing seller's ID
    const sellerResult = await client.query("SELECT id FROM users WHERE email = 'test@test.com'");
    const sellerId = sellerResult.rows[0].id;
    
    // Add buy listing for the buyer
    await client.query(`
      INSERT INTO listings (user_id, type, category, title, description, min_price, max_price, condition_preference, location, tags, status)
      VALUES ($1, 'buy', 'electronics', 'iPhone 15 Pro Max', 'Want to buy iPhone 15 Pro Max', 800, 1200, 'like_new', 'New York', ARRAY['iphone', 'iphone_15'], 'active')
    `, [buyerId]);
    
    console.log('Created buy listing');
    
    // Add more sell listings for the seller
    await client.query(`
      INSERT INTO listings (user_id, type, category, title, description, price, condition, location, tags, status)
      VALUES 
        ($1, 'sell', 'electronics', 'iPhone 15 Pro Max 256GB', 'Excellent condition', 950, 'like_new', 'New York', ARRAY['iphone', 'iphone_15'], 'active'),
        ($1, 'sell', 'electronics', 'RTX 4080 GPU', 'Brand new in box', 1100, 'new', 'Los Angeles', ARRAY['gpu', 'rtx_4080'], 'active'),
        ($1, 'sell', 'electronics', 'MacBook Pro M3', 'Like new, includes warranty', 1800, 'like_new', 'Chicago', ARRAY['macbook', 'apple'], 'active')
    `, [sellerId]);
    
    console.log('Created more sell listings');
    
    // Verify
    const listings = await client.query('SELECT id, user_id, type, title, category, price FROM listings');
    console.log('All listings:', JSON.stringify(listings.rows, null, 2));
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

addMoreData();
