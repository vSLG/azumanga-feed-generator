export type IncomingPost = {
  uri: string
  cid: string
  author: string
  text: string
  replyParent: string | null
  replyRoot: string | null
  embed?: any | null
  feeds: number
}