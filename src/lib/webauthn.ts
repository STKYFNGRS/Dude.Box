const rpName = "Dude.Box";

export function getRpID(): string {
  const url = process.env.NEXTAUTH_URL || "http://localhost:3000";
  return new URL(url).hostname;
}

export function getOrigin(): string {
  return process.env.NEXTAUTH_URL || "http://localhost:3000";
}

interface ChallengeEntry {
  challenge: string;
  expires: number;
  email?: string;
  name?: string;
}

const challengeStore = new Map<string, ChallengeEntry>();

export function storeChallenge(key: string, entry: ChallengeEntry): void {
  challengeStore.set(key, entry);
  setTimeout(() => challengeStore.delete(key), 5 * 60 * 1000);
}

export function getAndDeleteChallenge(key: string): ChallengeEntry | null {
  const entry = challengeStore.get(key);
  challengeStore.delete(key);
  if (!entry || Date.now() > entry.expires) return null;
  return entry;
}

const passkeyAuthTokens = new Map<string, { userId: string; expires: number }>();

export function createPasskeyAuthToken(userId: string): string {
  const token = crypto.randomUUID();
  passkeyAuthTokens.set(token, { userId, expires: Date.now() + 60_000 });
  setTimeout(() => passkeyAuthTokens.delete(token), 65_000);
  return token;
}

export function consumePasskeyAuthToken(token: string): string | null {
  const entry = passkeyAuthTokens.get(token);
  passkeyAuthTokens.delete(token);
  if (!entry || Date.now() > entry.expires) return null;
  return entry.userId;
}

export { rpName };
