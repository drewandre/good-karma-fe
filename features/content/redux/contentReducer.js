import { produce } from 'immer'

import {
  GET_BLOG_POSTS_BEGIN,
  GET_BLOG_POSTS_SUCCESS,
  GET_BLOG_POSTS_ERROR,
  GET_EVENTS_BEGIN,
  GET_EVENTS_SUCCESS,
  GET_EVENTS_ERROR,
  SET_ARTIST_OVERLAY,
  GET_NEWS_BEGIN,
  GET_NEWS_SUCCESS,
  GET_NEWS_ERROR,
} from './contentTypes'

const INITIAL_STATE = {
  blogPosts: {
    loading: false,
    data: [],
  },
  news: {
    loading: false,
    data: [],
  },
  events: {
    loading: false,
    data: [],
  },
  artistOverlay: null,
}

export { INITIAL_STATE }
export default produce((draft, action) => {
  switch (action.type) {
    case GET_BLOG_POSTS_BEGIN:
      return draft
    case GET_BLOG_POSTS_SUCCESS:
      if (!draft.blogPosts) {
        draft.blogPosts = []
      }
      if (action.payload) {
        draft.blogPosts.data = action.payload
      }
      return draft
    case GET_BLOG_POSTS_ERROR:
      return draft
    case GET_EVENTS_BEGIN:
      return draft
    case GET_EVENTS_SUCCESS:
      if (!draft.events) {
        draft.events = []
      }
      if (action.payload) {
        draft.events.data = action.payload
      }
      return draft
    case GET_EVENTS_ERROR:
      return draft
    case GET_NEWS_BEGIN:
      return draft
    case GET_NEWS_SUCCESS:
      if (!draft.news) {
        draft.news = []
      }
      if (action.payload) {
        draft.news.data = action.payload
      }
      return draft
    case GET_NEWS_ERROR:
      return draft
    case SET_ARTIST_OVERLAY:
      if (action.payload) {
        draft.artistOverlay = action.payload
      }
      return draft
    default:
      return draft
  }
}, INITIAL_STATE)
