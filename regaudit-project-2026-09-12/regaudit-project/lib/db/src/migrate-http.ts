import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';

/**
 * Applies lib/db/drizzle's generated migrations over HTTPS instead of raw
 * TCP - see client-neon-http.ts for why this exists. Prefer `pnpm run
 * push` for normal day-to-day schema iteration wherever raw TCP works;
 * reach for this only where it doesn't.
 */
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is required but was not provided.');
}

const db = drizzle(neon(databaseUrl));

await migrate(db, { migrationsFolder: './drizzle' });

console.log('Migrations applied.');
