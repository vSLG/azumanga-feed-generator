import { algos } from './algos'
import { deletePostsByUris } from './db/post/post.repository'
import { insertPost } from './db/post/post.repository'
import { NewPost } from './db/post/post.table'
import {
  OutputSchema as RepoEvent,
  isCommit,
} from './lexicon/types/com/atproto/sync/subscribeRepos'
import { FirehoseSubscriptionBase, getOpsByType } from './util/subscription'
import { IncomingPost } from './util/types'

export class FirehoseSubscription extends FirehoseSubscriptionBase {
  async handleEvent(evt: RepoEvent) {
    if (!isCommit(evt)) return
    const ops = await getOpsByType(evt)

    const postsToDelete = ops.posts.deletes.map((del) => del.uri)

    const postsToCreate: IncomingPost[] = (await Promise.all(ops.posts.creates.map(async (create) => {
      const post: IncomingPost = {
        uri: create.uri,
        cid: create.cid,
        author: create.author,
        text: create.record.text,
        replyParent: create.record?.reply?.parent.uri ?? null,
        replyRoot: create.record?.reply?.root.uri ?? null,
        feeds: 0,
      }

      const algosToRun = algos.filter((algo) => algo.publish)

      for (const algo of algosToRun) {
        if (await algo.filterPost(post)) {
          console.log(`Post ${post.uri} by ${post.author} matched algo ${algo.shortname}`)
          post.feeds |= 1 << algo.feed
        }
      }

      return post
    }))).filter((post) => post.feeds > 0)

    if (postsToDelete.length > 0)
      await deletePostsByUris(this.db, postsToDelete)

    if (postsToCreate.length > 0) {
      const newPosts: NewPost[] = postsToCreate.map((post) => ({
        uri: post.uri,
        cid: post.cid,
        replyParent: post.replyParent,
        replyRoot: post.replyRoot,
        feeds: post.feeds,
      }))

      await insertPost(this.db, newPosts)
    }
  }
}
