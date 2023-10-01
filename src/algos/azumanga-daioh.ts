import { QueryParams } from '../lexicon/types/app/bsky/feed/getFeedSkeleton'
import { AppContext } from '../config'
import { getLatestsPostsForFeed } from '../db/post/post.repository'
import { Algo } from './algo'
import { IncomingPost } from '../util/types'

export class AzumangaDaiohAlgo extends Algo {
  constructor(feed: number) {
    super(feed)

    this.shortname = 'azumanga-daioh'
    this.displayname = 'Azumanga Daioh Feed'
    this.description = 'This feed filters Azumanga Daioh content from the whole network' +
      `\nRegex: ${this.re}`
    this.avatar = '../../avatars/azumanga-daioh.png'
    this.publish = true
  }

  public re = /\b(azumanga|daioh|osaka(?:.san)?|chiyo(?:.chan)?|sakaki(?:.san)?|yomi(?:.chan)?|yukari(?:.sensei)?)\b/i

  public async filterPost(post: IncomingPost): Promise<boolean> {
    const textMatches = this.re.test(post.text)
    let imageMatches = false

    const { embed } = post

    if (embed?.images?.some(image => this.re.test(image.alt)))
      imageMatches = true

    return textMatches || imageMatches
  }

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
