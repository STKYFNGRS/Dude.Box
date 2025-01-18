import { query } from './index';

export async function getTraits() {
  const result = await query(
    'SELECT * FROM nft_traits ORDER BY category, rarity_score DESC'
  );
  return result.rows;
}

export async function getTraitsByCategory(category: string) {
  const result = await query(
    'SELECT * FROM nft_traits WHERE category = $1 ORDER BY rarity_score DESC',
    [category]
  );
  return result.rows;
}