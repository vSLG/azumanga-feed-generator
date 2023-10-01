import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.createTable('sub_state')
    .addColumn('service', 'text', (c) => c.primaryKey())
    .addColumn('cursor', 'integer')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('sub_state').execute()
}
