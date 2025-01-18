import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

export async function GET() {
  try {
    // Use the correct database
    const dbPath = path.resolve('./dude.db');
    const db = new Database(dbPath, { readonly: true });
    
    // Get all traits
    const traits = db.prepare(`
      SELECT 
        id,
        category,
        trait_type,
        display_name,
        rarity_score,
        rarity_tier,
        color_variants,
        metadata_key,
        description
      FROM nft_traits 
      ORDER BY category, rarity_score DESC
    `).all();
    
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