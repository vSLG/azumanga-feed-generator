import * as path from 'path'
import { promises as fs } from 'fs'

import { FileMigrationProvider, Kysely, Migrator, PostgresDialect } from 'kysely'
import { Pool } from 'pg'
import { DatabaseSchema } from './schema'
import { Database } from '.'

const migrationFolder = path.join(__dirname, 'migrations')

export const connectDb = (connectionString: string): Database => new Kysely<DatabaseSchema>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: connectionString,
    })
  })
})

export const migrateToLatest = async (db: Database) => {
  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs: fs,
      path: path,
      migrationFolder: migrationFolder,
    }),
  })

  const { error } = await migrator.migrateToLatest()
  if (error) throw error
}