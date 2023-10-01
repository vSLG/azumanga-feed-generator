import { AppContext } from "../config"
import { IncomingPost } from "../util/types"

import { QueryParams } from '../lexicon/types/app/bsky/feed/getFeedSkeleton'
import { getLatestsPostsForFeed } from "../db/post/post.repository"

export abstract class Algo {
  public shortname: string
  public feed: number
  public displayname: string
  public description: string
  public avatar: string
  public publish: boolean = false

  constructor(feed: number) {
    this.feed = feed
  }

  public abstract filterPost(post: IncomingPost): Promise<boolean>

  public async handler(ctx: AppContext, params: QueryParams): Promise<any> {
    const res = await getLatestsPostsForFeed(ctx.db, this.feed, params.limit, params.cursor)

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
}