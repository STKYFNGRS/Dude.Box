interface DatabaseConfig {
  url: string;
  max: number;
  idleTimeoutMillis: number;
}

const getDatabaseConfig = (): DatabaseConfig => {
  const url = process.env.POSTGRES_URL;
  
  if (!url) {
    throw new Error(
      'Database URL not found. Please ensure POSTGRES_URL is set in your environment variables.'
    );
  }

  return {
    url,
    max: 20,
    idleTimeoutMillis: 30000,
  };
};

export const dbConfig = getDatabaseConfig();