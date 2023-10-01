import {
  OutputSchema as RepoEvent,
  isCommit,
} from './lexicon/types/com/atproto/sync/subscribeRepos'
import { FirehoseSubscriptionBase, getOpsByType } from './util/subscription'

export class FirehoseSubscription extends FirehoseSubscriptionBase {
  async handleEvent(evt: RepoEvent) {
    if (!isCommit(evt)) return
    const ops = await getOpsByType(evt)

    const postsToDelete = ops.posts.deletes.map((del) => del.uri)
    const postsToCreate = ops.posts.creates
      .filter((create) => {
        const filterWordsRegex = [
          'azumanga',
          'daioh',
          'osaka(?:.san)?',
          'chiyo(?:.chan)?',
          'sakaki(?:.san)?',
          'yomi(?:.chan)?',
          'yukari(?:.sensei)?',
          'tomo(?:.chan)?',
        ]

        // First filter post text

        for (const word of filterWordsRegex) {
          const regex = new RegExp(`\\b${word}\\b`, 'i')
          if (regex.test(create.record.text.toLocaleLowerCase())) {
            console.log(`found azumanga post ${create.uri}: ${create.record.text}`)
            return true
          }
        }

        // Then filter embeds with alt text

        if (typeof create.record.embed === 'object' && create.record.embed.images instanceof Array) {
          create.record.embed.images.forEach((image) => {
            for (const word of filterWordsRegex) {
              const regex = new RegExp(`\\b${word}\\b`, 'i')
              if (regex.test(image.alt.toLocaleLowerCase())) {
                console.log(`found azumanga image ${create.uri}: ${image.alt}`)
                return true
              }
            }
          })
        }

        return false
      })
      .map((create) => {
        // map alf-related posts to a db row
        return {
          uri: create.uri,
          cid: create.cid,
          replyParent: create.record?.reply?.parent.uri ?? null,
          replyRoot: create.record?.reply?.root.uri ?? null,
          indexedAt: new Date().toISOString(),
        }
      })

    if (postsToDelete.length > 0) {
      await this.db
        .deleteFrom('post')
        .where('uri', 'in', postsToDelete)
        .execute()
    }
    if (postsToCreate.length > 0) {
      await this.db
        .insertInto('post')
        .values(postsToCreate)
        .onConflict((oc) => oc.doNothing())
        .execute()
    }
  }
}
