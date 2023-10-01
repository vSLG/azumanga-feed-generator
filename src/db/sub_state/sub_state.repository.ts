import { Database } from "..";

export const updateCursor = async (db: Database, service: string, cursor: number): Promise<void> => {
  await db.updateTable('sub_state')
    .where('service', '=', service)
    .set({ cursor })
    .execute()
}

export const getCursor = async (db: Database, service: string): Promise<number | undefined> => {
  const res = await db.selectFrom('sub_state')
    .select('cursor')
    .where('service', '=', service)
    .executeTakeFirst()

  return res?.cursor
}