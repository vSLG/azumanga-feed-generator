import { InvalidRequestError } from "@atproto/xrpc-server";
import { Database } from "..";
import { NewPost, Post } from "./post.table";
import { sql } from "kysely";

export const insertPost = async (db: Database, posts: NewPost[]): Promise<Post> => {
  const insertedPost = await db.insertInto('post')
    .values(posts)
    .onConflict((oc) => oc.doNothing())
    .returningAll()
    .executeTakeFirstOrThrow()

  return insertedPost
}

export const deletePostByUri = async (db: Database, uri: string): Promise<void> => {
  await db.deleteFrom('post')
    .where('uri', '=', uri)
    .execute()
}

export const deletePostsByUris = async (db: Database, uris: string[]): Promise<void> => {
  await db.deleteFrom('post')
    .where('uri', 'in', uris)
    .execute()
}

export const getLatestsPostsForFeed = async (
  db: Database,
  feed: number,
  limit = 20,
  cursor: string | undefined = undefined,
): Promise<Post[]> => {
  let builder = db.selectFrom('post')
    .selectAll()
    .orderBy('indexedAt', 'desc')
    .orderBy('cid', 'desc')
    .where(sql`feeds & ${1 << feed} != 0`)
    .limit(limit)

  if (cursor) {
    const [indexedAt, cid] = cursor.split('::')

    if (!indexedAt || !cid) {
      throw new InvalidRequestError('malformed cursor')
    }

    const time = new Date(parseInt(indexedAt, 10))

    builder = builder.where('post.indexedAt', '<', time)
      .orWhere((qb) => qb.where('post.indexedAt', '=', time))
      .where('post.cid', '<', cid)
  }

  const res = await builder.execute()

  return res;
}