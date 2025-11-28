const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

async function checkSchema() {
  const client = await pool.connect();
  try {
    const res = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users';
    `);
    console.log('Columns in users table:', res.rows);
  } catch (err) {
    console.error('Error checking schema:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

checkSchema();
