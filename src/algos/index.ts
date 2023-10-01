import { AppContext } from '../config'
import {
  QueryParams,
  OutputSchema as AlgoOutput,
} from '../lexicon/types/app/bsky/feed/getFeedSkeleton'
import { Algo } from './algo'
import { AzumangaDaiohAlgo } from './azumanga-daioh'

type AlgoHandler = (ctx: AppContext, params: QueryParams) => Promise<AlgoOutput>

export const algos: Array<Algo> = [
  new AzumangaDaiohAlgo(0),
]

export const algosByShortname: Record<string, Algo> = algos.reduce((acc, algo) => ({ ...acc, [algo.shortname]: algo }), {})
