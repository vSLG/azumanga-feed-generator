import { AppContext } from "../config"
import { IncomingPost } from "../util/types"

import { QueryParams } from '../lexicon/types/app/bsky/feed/getFeedSkeleton'

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

  public abstract handler(ctx: AppContext, params: QueryParams): Promise<any>
  public abstract filterPost(post: IncomingPost): Promise<boolean>
}