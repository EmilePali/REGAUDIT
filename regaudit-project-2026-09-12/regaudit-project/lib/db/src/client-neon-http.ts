import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

/**
 * Alternate client for environments that can't open a raw TCP connection to
 * Postgres - edge/serverless runtimes, or a sandboxed dev environment
 * behind an HTTPS-only egress proxy (that's why this exists: Claude's own
 * sandbox can reach Neon's SQL-over-HTTP endpoint but not port 5432
 * directly). Talks to Neon over HTTPS instead of a socket.
 *
 * The default client (./client.ts, postgres-js over raw TCP) is what
 * artifacts/api-server uses normally and what to reach for in a real
 * deployment - use this one only where raw TCP genuinely isn't available.
 */
export function createNeonHttpDb(databaseUrl: string) {
  const sql = neon(databaseUrl);
  return drizzle(sql, { schema });
}

export type NeonHttpDatabase = ReturnType<typeof createNeonHttpDb>;
