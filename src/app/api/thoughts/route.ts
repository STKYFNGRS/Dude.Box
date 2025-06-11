import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    const { rows } = await sql`
      SELECT id, title, slug, category, description, created_at as date 
      FROM thoughts 
      WHERE CAST(published AS BOOLEAN) = true
      ORDER BY created_at DESC
    `;
    
    return NextResponse.json({ thoughts: rows });
  } catch (error) {
    console.error('Error fetching thoughts:', error);
    return NextResponse.json({ error: 'Failed to fetch thoughts' }, { status: 500 });
  }
} 