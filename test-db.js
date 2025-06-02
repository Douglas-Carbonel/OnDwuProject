import { Client } from 'pg';

async function testConnection() {
  const client = new Client({
    connectionString: "postgresql://postgres.brjwbznxsfbtoktpdssw:oBfiPmNzLW81Hz1b@aws-0-sa-east-1.pooler.supabase.com:6543/postgres"
  });

  try {
    await client.connect();
    console.log('✅ Connected to Supabase successfully!');
    
    // Test if avaliacao_user table exists
    const result = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'avaliacao_user'
    `);
    
    console.log('📊 avaliacao_user table structure:', result.rows);
    
    // Try to insert a test record
    const insertResult = await client.query(`
      INSERT INTO avaliacao_user (userId, passed, createdAt) 
      VALUES ($1, $2, $3) 
      RETURNING *
    `, ['999', true, new Date()]);
    
    console.log('✅ Test insert successful:', insertResult.rows[0]);
    
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
  } finally {
    await client.end();
  }
}

testConnection();