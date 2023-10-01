import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('post')
    .addColumn('uri', 'text', (c) => c.primaryKey())
    .addColumn('cid', 'text', (c) => c.notNull())
    .addColumn('replyParent', 'text')
    .addColumn('replyRoot', 'text')
    .addColumn('indexedAt', 'timestamp', (c) => c.notNull().defaultTo(sql`NOW()`))
    .addColumn('feeds', 'integer', (c) => c.notNull().defaultTo(0))
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('post').execute()
}
