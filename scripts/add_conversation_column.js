const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

async function migrate() {
  const client = await pool.connect();
  try {
    console.log('Adding conversation_text column to users table...');
    await client.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS conversation_text TEXT;
    `);
    console.log('Successfully added conversation_text column.');
  } catch (err) {
    console.error('Error running migration:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
