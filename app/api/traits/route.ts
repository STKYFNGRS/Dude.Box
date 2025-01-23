import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

export async function GET() {
  try {
    console.log('API route hit');
    console.log('Current working directory:', process.cwd());
    console.log('Database path:', process.cwd(), 'dude.db');
    const dbPath = path.resolve(process.cwd(), 'dude.db');
    const db = new Database(dbPath, { readonly: true });
    
    // Add COALESCE to ensure color_variants is never null
    console.log('Database connected successfully');
    const traits = db.prepare(`
      SELECT 
        id,
        category,
        trait_type,
        display_name,
        rarity_score,
        rarity_tier,
        COALESCE(color_variants, '') as color_variants,
        metadata_key,
        description
      FROM nft_traits 
      ORDER BY category, rarity_score DESC;
    `).all();
    console.log('Query executed, found traits:', traits?.length || 0);
    
    db.close();

    if (!traits || traits.length === 0) {
      return NextResponse.json(
        { error: 'No traits found in database' },
        { status: 404 }
      );
    }

    return NextResponse.json(traits);
  } catch (error: any) {
    console.error('Error in /api/traits:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch traits' },
      { status: 500 }
    );
  }
}