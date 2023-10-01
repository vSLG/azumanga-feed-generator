import { Insertable, Selectable, Updateable } from "kysely"

export interface SubStateTable {
  service: string
  cursor: number
}

export type SubState = Selectable<SubStateTable>
export type NewSubState = Insertable<SubStateTable>
export type UpdateSubState = Updateable<SubStateTable>
