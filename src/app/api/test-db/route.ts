import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    
    // Test connection
    const dbName = await sql`SELECT current_database()`;
    const user = await sql`SELECT current_user`;
    
    // List existing tables
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    
    return NextResponse.json({
      success: true,
      database: dbName[0].current_database,
      user: user[0].current_user,
      tables: tables.map(t => t.table_name),
      message: tables.length === 0 
        ? 'Database connected! No tables yet (expected).' 
        : `Database connected! Found ${tables.length} table(s).`
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
