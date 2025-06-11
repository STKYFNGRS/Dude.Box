import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    
    const { rows } = await sql`
      SELECT 
        title, 
        created_at as date, 
        category, 
        description, 
        content, 
        image_url as image, 
        pdf_url as pdf 
      FROM thoughts 
      WHERE slug = ${slug} AND published = true
    `;
    
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Thought not found' }, { status: 404 });
    }

    return NextResponse.json({ thought: rows[0] });
  } catch (error) {
    console.error('Error fetching thought:', error);
    return NextResponse.json({ error: 'Failed to fetch thought' }, { status: 500 });
  }
} 