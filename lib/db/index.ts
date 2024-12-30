import { sql } from '@vercel/postgres';
import { createGameTables } from './schema';

export async function initializeDatabase() {
  try {
    await createGameTables();
    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Utility function for parametrized queries
export async function query(query: string, params: any[] = []) {
  try {
    const result = await sql.query(query, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Player-related queries
export async function createPlayer(walletAddress: string, ensName?: string) {
  return query(
    'INSERT INTO players (wallet_address, ens_name) VALUES ($1, $2) ON CONFLICT (wallet_address) DO UPDATE SET ens_name = $2 RETURNING *',
    [walletAddress, ensName]
  );
}

export async function getPlayerStats(walletAddress: string) {
  return query(
    'SELECT p.*, COUNT(gs.id) as total_games, MAX(gs.wave_reached) as highest_wave FROM players p LEFT JOIN game_sessions gs ON p.wallet_address = gs.wallet_address WHERE p.wallet_address = $1 GROUP BY p.wallet_address',
    [walletAddress]
  );
}

// Leaderboard queries
export async function updateLeaderboard(walletAddress: string, timeframe: string, points: number) {
  return query(
    'INSERT INTO leaderboard_stats (wallet_address, timeframe, points) VALUES ($1, $2, $3) ON CONFLICT (wallet_address, timeframe) DO UPDATE SET points = leaderboard_stats.points + $3, updated_at = CURRENT_TIMESTAMP',
    [walletAddress, timeframe, points]
  );
}

export async function getLeaderboard(timeframe: string, limit: number = 10) {
  return query(
    'SELECT ls.*, p.ens_name FROM leaderboard_stats ls JOIN players p ON ls.wallet_address = p.wallet_address WHERE timeframe = $1 ORDER BY points DESC LIMIT $2',
    [timeframe, limit]
  );
}