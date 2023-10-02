import { Algo } from './algo'
import { IncomingPost } from '../util/types'

export class MarisaKirisameAlgo extends Algo {
  constructor(feed: number) {
    super(feed)

    this.shortname = 'marisa-kirisame'
    this.displayname = 'Marisa Kirisame Feed'
    this.description = 'This feed filters Marisa Kirisame (from Touhou) content from the whole network' +
      `\nRegex: ${this.re}`
    this.avatar = './avatars/marisa-kirisame.jpg'
    this.publish = true
  }

  public re = /(marisa|kirisame|霧雨|魔理沙|まりさ|きりさめ|マリサ)/i

  public async filterPost(post: IncomingPost): Promise<boolean> {
    const textMatches = this.re.test(post.text)
    let imageMatches = false

    const { embed } = post

    if (embed?.images?.some(image => this.re.test(image.alt)))
      imageMatches = true

    return textMatches || imageMatches
  }
}
