import { query } from '@/../tools/db';

export async function read_query(sql: string) {
  try {
    const result = await query({ sql });
    return result;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}