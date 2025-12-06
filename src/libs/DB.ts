import path from 'node:path';

import { PGlite } from '@electric-sql/pglite';
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
import { migrate as migratePg } from 'drizzle-orm/node-postgres/migrator';
import { drizzle as drizzlePglite, type PgliteDatabase } from 'drizzle-orm/pglite';
import { migrate as migratePglite } from 'drizzle-orm/pglite/migrator';
import { PHASE_PRODUCTION_BUILD } from 'next/dist/shared/lib/constants';
import { Pool } from 'pg';

import * as schema from '@/models/Schema';

import { Env } from './Env';

// Use connection pooling for better performance and reliability
const globalForDb = globalThis as unknown as {
  pool?: Pool;
  drizzle?: ReturnType<typeof drizzlePg>;
  client?: PGlite;
  pgliteDrizzle?: PgliteDatabase<typeof schema>;
  _dbInitialized?: boolean;
  _pgliteInitialized?: boolean;
};

let drizzle;

// Need a database for production? Check out https://www.prisma.io/?via=saasboilerplatesrc
// Tested and compatible with Next.js Boilerplate
if (process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD && Env.DATABASE_URL) {
  if (!globalForDb.pool) {
    globalForDb.pool = new Pool({
      connectionString: Env.DATABASE_URL,
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
      connectionTimeoutMillis: 10000, // Return an error after 10 seconds if connection could not be established
      // Enable SSL if needed (for production databases)
      ssl: Env.DATABASE_URL?.includes('sslmode=require')
        ? { rejectUnauthorized: false }
        : undefined,
    });

    // Handle pool errors
    globalForDb.pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
    });

    globalForDb.drizzle = drizzlePg(globalForDb.pool, { schema });

    // Run migrations only once (lazy initialization)
    if (!globalForDb._dbInitialized) {
      // Don't await migrations in top-level - let them run in background
      migratePg(globalForDb.drizzle, {
        migrationsFolder: path.join(process.cwd(), 'migrations'),
      }).catch((error) => {
        console.error('Migration error:', error);
        // Don't throw, allow app to continue
      });
      globalForDb._dbInitialized = true;
    }
  }

  drizzle = globalForDb.drizzle;
} else {
  // Stores the db connection in the global scope to prevent multiple instances due to hot reloading with Next.js
  if (!globalForDb.client) {
    globalForDb.client = new PGlite();
    // Initialize drizzle immediately, migrations will run when client is ready
    globalForDb.pgliteDrizzle = drizzlePglite(globalForDb.client, { schema });

    // Run migrations when client is ready (non-blocking)
    globalForDb.client.waitReady.then(() => {
      if (!globalForDb._pgliteInitialized) {
        migratePglite(globalForDb.pgliteDrizzle!, {
          migrationsFolder: path.join(process.cwd(), 'migrations'),
        }).catch((error) => {
          console.error('PGlite migration error:', error);
        });
        globalForDb._pgliteInitialized = true;
      }
    }).catch((error) => {
      console.error('PGlite initialization error:', error);
    });
  }

  drizzle = globalForDb.pgliteDrizzle;
  if (!drizzle && globalForDb.client) {
    drizzle = drizzlePglite(globalForDb.client, { schema });
    globalForDb.pgliteDrizzle = drizzle;
  }
}

if (!drizzle) {
  throw new Error('Database connection failed to initialize');
}

export const db = drizzle;

// Graceful shutdown for production
if (typeof process !== 'undefined') {
  const shutdown = async () => {
    if (globalForDb.pool) {
      await globalForDb.pool.end();
    }
  };

  process.on('SIGINT', async () => {
    await shutdown();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    await shutdown();
    process.exit(0);
  });
}
