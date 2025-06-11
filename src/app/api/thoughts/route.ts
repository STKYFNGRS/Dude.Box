import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    const { rows } = await sql`
      SELECT id, title, slug, category, description, created_at as date 
      FROM thoughts 
      WHERE published = true
      ORDER BY created_at DESC
    `;
    
    console.log('PUBLIC API: Found', rows.length, 'thoughts:', rows.map(r => ({ id: r.id, title: r.title })));
    
    const response = NextResponse.json({ thoughts: rows });
    
    // Add cache-busting headers
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    console.error('Error fetching thoughts:', error);
    return NextResponse.json({ error: 'Failed to fetch thoughts' }, { status: 500 });
  }
} 