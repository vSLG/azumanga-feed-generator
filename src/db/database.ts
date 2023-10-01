import dotenv from 'dotenv'
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { Database } from './schema';

dotenv.config()

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: process.env.FEEDGEN_DATABASE_URL,
  })
})

export const db = new Kysely<Database>({
  dialect,
})