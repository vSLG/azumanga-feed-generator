import { InvalidRequestError } from '@atproto/xrpc-server'
import { QueryParams } from '../lexicon/types/app/bsky/feed/getFeedSkeleton'
import { AppContext } from '../config'
import { getLatestsPostsForFeed } from '../db/post/post.repository'

// max 15 chars
export const shortname = 'azumanga-daioh'

export const handler = async (ctx: AppContext, params: QueryParams) => {
  const feedNum = parseInt(params.feed, 10)
  const res = await getLatestsPostsForFeed(ctx.db, feedNum, params.limit, params.cursor)

  const feed = res.map((row) => ({
    post: row.uri,
  }))

  let cursor: string | undefined

  const last = res.at(-1)

  if (last) {
    cursor = `${new Date(last.indexedAt).getTime()}::${last.cid}`
  }

  return {
    cursor,
    feed,
  }
}
