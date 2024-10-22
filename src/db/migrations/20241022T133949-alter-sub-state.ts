import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('sub_state')
    .alterColumn("cursor").setDataType("bigint")
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable("sub_state")
    .alterColumn("cursor").setDataType("integer")
    .execute()
}
