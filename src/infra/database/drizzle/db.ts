import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

export function createDbClient(connectionString: string) {
  const pool = new Pool({ connectionString });
  return drizzle(pool);
}

export const db = createDbClient(process.env.DATABASE_URL!);
