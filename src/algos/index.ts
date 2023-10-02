import { AppContext } from '../config'
import {
  QueryParams,
  OutputSchema as AlgoOutput,
} from '../lexicon/types/app/bsky/feed/getFeedSkeleton'
import { Algo } from './algo'
import { AzumangaDaiohAlgo } from './azumanga-daioh'
import { CirnoAlgo } from './cirno'
import { MarisaKirisameAlgo } from './marisa-kirisame'

type AlgoHandler = (ctx: AppContext, params: QueryParams) => Promise<AlgoOutput>

export const algos: Array<Algo> = [
  new AzumangaDaiohAlgo(0),
  new CirnoAlgo(1),
  new MarisaKirisameAlgo(2),
]

export const algosByShortname: Record<string, Algo> = algos.reduce((acc, algo) => ({ ...acc, [algo.shortname]: algo }), {})
