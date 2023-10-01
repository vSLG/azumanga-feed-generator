import { Kysely } from 'kysely';
import { DatabaseSchema } from './schema';

export type Database = Kysely<DatabaseSchema>