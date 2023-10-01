import { Generated, Insertable, Selectable, Updateable } from 'kysely'

export interface PostTable {
  uri: string
  cid: string
  replyParent: string | null
  replyRoot: string | null
  indexedAt: Generated<Date>
  feeds: number
}

export type Post = Selectable<PostTable>
export type NewPost = Insertable<PostTable>
export type UpdatePost = Updateable<PostTable>