# Marisa's collection of ATProto Feed Generators scripts

This is a modified version of the [ATProto Feed Generation](https://github.com/bluesky-social/feed-generator) with notable changes, including:
- Database change to use PostgreSQL instead of SQLite
- The ability to handle multiple feeds on the same server
- The ability to publish multiple feeds
- Simple feed algorithm creation, but allowing for more complex feeds
- The feed algorithm logic is embedded in the Algo class itself, you don't need to modify subscription.ts

## Feeds hosted by me
- [azumanga-daioh](./src/algos/azumanga-daioh.ts): filters Azumanga Daioh content from the whole network
- [cirno](./src/algos/cirno.ts): filters Cirno content from the whole network

## How to create and publish your own feed algorithm
1. Create your feed algorithm in [src/algos](./src/algos) extending the Algo class ([src/algos/Algo.ts](./src/algos/Algo.ts))
2. Fill information about in the constructor (example: [src/algos/azumanga-daioh.ts](./src/algos/azumanga-daioh.ts))
3. Implement the algorithm logic in the `filterPost(post: IncomingPost)` method, returning `true` if the post should be included in the feed, `false` otherwise
4. Instantiate your class in the [`algos` array](./src/algos/index.ts#L12)
5. Publish your feed with the command `yarn publishFeed` (this will publish all feeds in the `algos` array with `publish: true`)

## How to run your feeds
0. Make sure you have a PostgreSQL database running and configured (this software doesn't create the database for you)
1. Fill required information in the `.env` file (see [.env.example](./.env.example))
2. Run `yarn`
3. Run `yarn start`