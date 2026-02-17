const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'marketplace',
  port: 5432,
});

async function checkData() {
  const client = await pool.connect();
  
  try {
    const users = await client.query('SELECT id, email FROM users');
    console.log('Users:', JSON.stringify(users.rows, null, 2));
    
    const listings = await client.query('SELECT id, user_id, type, title, category, price, status FROM listings');
    console.log('Listings:', JSON.stringify(listings.rows, null, 2));
    
  } finally {
    client.release();
    await pool.end();
  }
}

checkData();
