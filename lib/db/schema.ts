import { sql } from '@vercel/postgres';

export async function createGameTables() {
  try {
    // Players table
    await sql`
      CREATE TABLE IF NOT EXISTS players (
        wallet_address VARCHAR(42) PRIMARY KEY,
        ens_name VARCHAR(255),
        total_points BIGINT DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    // Game sessions table
    await sql`
      CREATE TABLE IF NOT EXISTS game_sessions (
        id SERIAL PRIMARY KEY,
        wallet_address VARCHAR(42) REFERENCES players(wallet_address),
        wave_reached INTEGER DEFAULT 0,
        points_earned BIGINT DEFAULT 0,
        started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        ended_at TIMESTAMP WITH TIME ZONE,
        FOREIGN KEY (wallet_address) REFERENCES players(wallet_address)
      );
    `;
    
    // Leaderboard stats
    await sql`
      CREATE TABLE IF NOT EXISTS leaderboard_stats (
        id SERIAL PRIMARY KEY,
        wallet_address VARCHAR(42) REFERENCES players(wallet_address),
        timeframe VARCHAR(10),
        points BIGINT DEFAULT 0,
        rank INTEGER,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (wallet_address) REFERENCES players(wallet_address)
      );
    `;

    // Game achievements
    await sql`
      CREATE TABLE IF NOT EXISTS achievements (
        id SERIAL PRIMARY KEY,
        wallet_address VARCHAR(42) REFERENCES players(wallet_address),
        achievement_type VARCHAR(50),
        earned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        metadata JSONB,
        FOREIGN KEY (wallet_address) REFERENCES players(wallet_address)
      );
    `;

    return { success: true, message: 'Game tables created successfully' };
  } catch (error) {
    console.error('Error creating game tables:', error);
    throw error;
  }
}