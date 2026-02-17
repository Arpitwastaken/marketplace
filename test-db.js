const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'marketplace',
  port: 5432,
  connectionTimeoutMillis: 5000,
});

async function test() {
  try {
    const client = await pool.connect();
    console.log('Connected to database!');
    
    const result = await client.query('SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\'');
    console.log('Tables:', result.rows.map(r => r.table_name));
    
    client.release();
    await pool.end();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

test();
