
const { Pool } = require('pg');

const databaseUrl = "postgresql://postgres.brjwbznxsfbtoktpdssw:oBfiPmNzLW81Hz1b@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";

async function testConnection() {
  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const client = await pool.connect();
    console.log('✅ Database connection successful!');
    
    // Check if tables exist
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('evaluations', 'evaluation_attempts')
    `);
    
    console.log('📋 Tables found:', result.rows);
    
    client.release();
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
  } finally {
    await pool.end();
  }
}

testConnection();
