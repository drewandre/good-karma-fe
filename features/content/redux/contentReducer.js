import { produce } from 'immer'

import {
  GET_BLOG_POSTS_BEGIN,
  GET_BLOG_POSTS_SUCCESS,
  GET_BLOG_POSTS_ERROR,
  GET_EVENTS_BEGIN,
  GET_EVENTS_SUCCESS,
  GET_EVENTS_ERROR,
} from './contentTypes'

const INITIAL_STATE = {
  blogPosts: {
    loading: false,
    data: [],
  },
  events: {
    loading: false,
    data: [],
  },
}

export { INITIAL_STATE }
export default produce((draft, action) => {
  switch (action.type) {
    case GET_BLOG_POSTS_BEGIN:
      return draft
    case GET_BLOG_POSTS_SUCCESS:
      draft.blogPosts.data = action.payload
      return draft
    case GET_BLOG_POSTS_ERROR:
      return draft
    case GET_EVENTS_BEGIN:
      return draft
    case GET_EVENTS_SUCCESS:
      draft.events.data = action.payload
      return draft
    case GET_EVENTS_ERROR:
      return draft
    default:
      return draft
  }
}, INITIAL_STATE)
