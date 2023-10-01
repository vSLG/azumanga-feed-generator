import * as path from 'path';
import { promises as fs } from 'fs';

import { FileMigrationProvider, Migrator } from 'kysely';
import { db } from './database';
import { run } from 'kysely-migration-cli';

const migrationFolder = path.join(__dirname, 'migrations')

const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider({
    fs: fs,
    path: path,
    migrationFolder: migrationFolder,
  }),
})

run(db, migrator, migrationFolder)