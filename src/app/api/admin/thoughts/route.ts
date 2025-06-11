import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    const { rows } = await sql`
      SELECT id, title, slug, category, created_at, published 
      FROM thoughts 
      ORDER BY created_at DESC
    `;
    
    return NextResponse.json({ thoughts: rows });
  } catch (error) {
    console.error('Error fetching thoughts:', error);
    return NextResponse.json({ error: 'Failed to fetch thoughts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      title, 
      slug, 
      category, 
      description, 
      content, 
      image_url, 
      pdf_url, 
      published 
    } = body;

    // Check if slug already exists
    const { rows: existingRows } = await sql`
      SELECT id FROM thoughts WHERE slug = ${slug}
    `;
    
    if (existingRows.length > 0) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }

    const { rows } = await sql`
      INSERT INTO thoughts (
        title, slug, category, description, content, 
        image_url, pdf_url, published, created_at, updated_at
      ) VALUES (
        ${title}, ${slug}, ${category}, ${description || null}, ${content || null},
        ${image_url || null}, ${pdf_url || null}, ${published}, NOW(), NOW()
      ) 
      RETURNING id, title, slug, category, created_at, published
    `;

    return NextResponse.json({ thought: rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating thought:', error);
    return NextResponse.json({ error: 'Failed to create thought' }, { status: 500 });
  }
} 