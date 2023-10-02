import { Algo } from './algo'
import { IncomingPost } from '../util/types'

export class IoTAlgo extends Algo {
  constructor(feed: number) {
    super(feed)

    this.shortname = 'iot'
    this.displayname = 'IoT (Internet of Things) Feed'
    this.description = 'This feed filters IoT content from the whole network' +
      `\n(The regex is so big I won't be writing it here)`
    this.avatar = './avatars/espressif.png'
    this.publish = true
  }

  public re = /(\biot\b|(smart|connected) (devices|cities|city|transportation|agriculture|home|car)|home automation|industrial.?iot|iiot|wearables|edge computing|iot (security|protocol|gateway|architecture|challenge|standard|solution|research)|mqtt|cloud computing|data (analysis|analytics)|real.?time monitoring|machine.?to.?machine|m2m|embedded system|(aws|google cloud|azure|cellular) iot|telemetry|lpwan|zigbee|bluetooth( low energy)?|\bble\b|interoperability|firmware|esp32|espressif|raspberry.?pi|\brpi|esp.?idf)/i

  public async filterPost(post: IncomingPost): Promise<boolean> {
    const textMatches = this.re.test(post.text)
    let imageMatches = false

    const { embed } = post

    if (embed?.images?.some(image => this.re.test(image.alt)))
      imageMatches = true

    return textMatches || imageMatches
  }
}
