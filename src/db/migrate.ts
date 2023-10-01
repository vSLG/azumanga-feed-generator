import * as path from 'path';
import { promises as fs } from 'fs';
import dotenv from 'dotenv';
import { FileMigrationProvider, Migrator } from 'kysely';
import { run } from 'kysely-migration-cli';
import { connectDb } from './database';

const migrationFolder = path.join(__dirname, 'migrations')

dotenv.config()

if (!process.env.FEEDGEN_DATABASE_URL) {
  throw new Error('FEEDGEN_DATABASE_URL is required')
}

const db = connectDb(process.env.FEEDGEN_DATABASE_URL)

const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider({
    fs: fs,
    path: path,
    migrationFolder: migrationFolder,
  }),
})

run(db, migrator, migrationFolder)