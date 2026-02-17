const { Pool } = require('pg');
const pool = new Pool({ user: 'postgres', host: 'localhost', database: 'marketplace', port: 5432 });
const fs = require('fs');

async function main() {
  const client = await pool.connect();
  let output = '';
  
  try {
    // Create new test users
    await client.query(`
      INSERT INTO users (id, email, password_hash, tier) 
      VALUES ('test-user-1', 'alice@test.com', 'x', 1),
             ('test-user-2', 'bob@test.com', 'x', 1),
             ('test-user-3', 'carol@test.com', 'x', 2),
             ('test-user-4', 'dave@test.com', 'x', 0),
             ('test-user-5', 'eve@test.com', 'x', 1)
      ON CONFLICT (id) DO NOTHING
    `);
    output += 'Users created\n';
    
    // Create test listings
    await client.query(`
      INSERT INTO listings (id, user_id, type, category, title, description, price, min_price, max_price, condition, location, tags, status) 
      VALUES 
        ('new-l1', 'test-user-1', 'buy', 'electronics', 'MacBook Pro 14"', 'Need M3, for work', 0, 1400, 2000, NULL, 'Chicago', ARRAY['macbook','apple'], 'active'),
        ('new-l2', 'test-user-2', 'sell', 'electronics', 'MacBook Pro M3', 'Like new, 16GB', 1850, 0, 0, 'like_new', 'Chicago', ARRAY['macbook','apple'], 'active'),
        ('new-l3', 'test-user-3', 'buy', 'electronics', 'PS5', 'Disc edition preferred', 0, 300, 450, NULL, 'NYC', ARRAY['ps5','playstation'], 'active'),
        ('new-l4', 'test-user-4', 'sell', 'electronics', 'PS5 Digital', 'Brand new', 380, 0, 0, 'new', 'NYC', ARRAY['ps5','playstation'], 'active'),
        ('new-l5', 'test-user-5', 'buy', 'furniture', 'Standing Desk', 'Electric adjustable', 0, 300, 600, NULL, 'Austin', ARRAY['desk','standing'], 'active'),
        ('new-l6', 'test-user-1', 'sell', 'furniture', 'Uplift V2 Desk', 'Excellent condition', 450, 0, 0, 'good', 'Austin', ARRAY['desk','standing'], 'active'),
        ('new-l7', 'test-user-2', 'buy', 'vehicles', 'Honda Civic 2020+', 'Under 50k miles', 0, 15000, 22000, NULL, 'LA', ARRAY['honda','civic'], 'active'),
        ('new-l8', 'test-user-3', 'sell', 'vehicles', 'Honda Civic 2021', 'EX, 35k miles', 19000, 0, 0, 'excellent', 'LA', ARRAY['honda','civic'], 'active'),
        ('new-l9', 'test-user-4', 'buy', 'books', 'Design Patterns', 'Any edition', 0, 20, 50, NULL, 'Chicago', ARRAY['book','design'], 'active'),
        ('new-l10', 'test-user-5', 'sell', 'books', 'Head First Design Patterns', 'Used, fair', 25, 0, 0, 'fair', 'NYC', ARRAY['book','design'], 'active')
      ON CONFLICT (id) DO NOTHING
    `);
    output += 'Listings created\n';
    
    const listings = await client.query('SELECT id, type, title, location FROM listings WHERE id LIKE \'new-%\' ORDER BY id');
    output += 'New listings: ' + JSON.stringify(listings.rows) + '\n';
    
  } catch (e) {
    output += 'Error: ' + e.message + '\n';
  } finally {
    client.release();
    await pool.end();
  }
  
  fs.writeFileSync('test-data-output.txt', output);
  console.log('Done');
}

main();
