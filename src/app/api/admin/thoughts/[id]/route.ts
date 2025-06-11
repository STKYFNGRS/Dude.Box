import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const { rows } = await sql`
      SELECT * FROM thoughts WHERE id = ${id}
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

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
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

    // Check if slug already exists for other records
    const { rows: existingRows } = await sql`
      SELECT id FROM thoughts WHERE slug = ${slug} AND id != ${id}
    `;
    
    if (existingRows.length > 0) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }

    const { rows } = await sql`
      UPDATE thoughts SET 
        title = ${title},
        slug = ${slug},
        category = ${category},
        description = ${description || null},
        content = ${content || null},
        image_url = ${image_url || null},
        pdf_url = ${pdf_url || null},
        published = ${published},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING id, title, slug, category, created_at, published
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Thought not found' }, { status: 404 });
    }

    return NextResponse.json({ thought: rows[0] });
  } catch (error) {
    console.error('Error updating thought:', error);
    return NextResponse.json({ error: 'Failed to update thought' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const { rowCount } = await sql`
      DELETE FROM thoughts WHERE id = ${id}
    `;
    
    if (rowCount === 0) {
      return NextResponse.json({ error: 'Thought not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting thought:', error);
    return NextResponse.json({ error: 'Failed to delete thought' }, { status: 500 });
  }
} 