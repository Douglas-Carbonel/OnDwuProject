import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

export async function testSupabaseConnection() {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    throw new Error('DATABASE_URL não configurada');
  }

  try {
    const client = postgres(connectionString, {
      ssl: 'require',
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
    });
    
    const db = drizzle(client);
    
    // Teste simples de conexão
    const result = await db.execute('SELECT NOW() as current_time');
    
    await client.end();
    
    return {
      success: true,
      message: 'Conexão com Supabase estabelecida com sucesso',
      timestamp: result[0]?.current_time
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido',
      error
    };
  }
}