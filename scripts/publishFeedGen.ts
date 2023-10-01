import dotenv from 'dotenv'
import { AtpAgent, BlobRef } from '@atproto/api'
import fs from 'fs/promises'
import { ids } from '../src/lexicon/lexicons'
import { algos } from '../src/algos'

const run = async () => {
  dotenv.config()

  if (!process.env.FEEDGEN_HANDLE || !process.env.FEEDGEN_PASSWORD) {
    throw new Error('Please provide a handle and password in the .env file')
  }

  // YOUR bluesky handle
  // Ex: user.bsky.social
  const handle = process.env.FEEDGEN_HANDLE

  // YOUR bluesky password, or preferably an App Password (found in your client settings)
  // Ex: abcd-1234-efgh-5678
  const password = process.env.FEEDGEN_PASSWORD

  if (!process.env.FEEDGEN_SERVICE_DID && !process.env.FEEDGEN_HOSTNAME) {
    throw new Error('Please provide a hostname in the .env file')
  }
  const feedGenDid =
    process.env.FEEDGEN_SERVICE_DID ?? `did:web:${process.env.FEEDGEN_HOSTNAME}`

  // only update this if in a test environment
  const agent = new AtpAgent({ service: 'https://bsky.social' })
  await agent.login({ identifier: handle, password })

  const algosToRun = algos.filter((algo) => algo.publish)

  for (const algo of algosToRun) {
    console.log(`Publishing algo ${algo.shortname}...`)

    let avatarRef: BlobRef | undefined
    if (algo.avatar) {
      let encoding: string
      if (algo.avatar.endsWith('png')) {
        encoding = 'image/png'
      } else if (algo.avatar.endsWith('jpg') || algo.avatar.endsWith('jpeg')) {
        encoding = 'image/jpeg'
      } else {
        throw new Error('expected png or jpeg')
      }
      const img = await fs.readFile(algo.avatar)
      const blobRes = await agent.api.com.atproto.repo.uploadBlob(img, {
        encoding,
      })
      avatarRef = blobRes.data.blob
    }

    await agent.api.com.atproto.repo.putRecord({
      repo: agent.session?.did ?? '',
      collection: ids.AppBskyFeedGenerator,
      rkey: algo.shortname,
      record: {
        did: feedGenDid,
        displayName: algo.displayname,
        description: algo.description,
        avatar: avatarRef,
        createdAt: new Date().toISOString(),
      },
    })
  }

  console.log('All done 🎉')
}

run()
