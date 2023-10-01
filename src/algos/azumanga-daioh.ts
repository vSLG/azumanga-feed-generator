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
    this.avatar = './avatars/azumanga-daioh.png'
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
}
