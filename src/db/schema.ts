import { PostTable } from './post/post.table';
import { SubStateTable } from './sub_state/sub_state.table';

export interface DatabaseSchema {
  post: PostTable
  sub_state: SubStateTable
}