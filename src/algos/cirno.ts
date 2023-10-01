import { Algo } from './algo'
import { IncomingPost } from '../util/types'

export class CirnoAlgo extends Algo {
  constructor(feed: number) {
    super(feed)

    this.shortname = 'cirno'
    this.displayname = 'Cirno Feed'
    this.description = 'This feed filters Cirno (from Touhou) content from the whole network' +
      `\nRegex: ${this.re}`
    this.avatar = './avatars/cirno.jpg'
    this.publish = true
  }

  public re = /(cirno|チルノ)/i

  public async filterPost(post: IncomingPost): Promise<boolean> {
    const textMatches = this.re.test(post.text)
    let imageMatches = false

    const { embed } = post

    if (embed?.images?.some(image => this.re.test(image.alt)))
      imageMatches = true

    return textMatches || imageMatches
  }
}
