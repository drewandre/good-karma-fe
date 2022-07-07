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

export const getBlogPostsBegin = () => {
  return {
    type: GET_BLOG_POSTS_BEGIN,
  }
}

export const getBlogPostsSuccess = (payload) => {
  return {
    type: GET_BLOG_POSTS_SUCCESS,
    payload,
  }
}

export const getBlogPostsError = () => {
  return {
    type: GET_BLOG_POSTS_ERROR,
  }
}

export const getEventsBegin = () => {
  return {
    type: GET_EVENTS_BEGIN,
  }
}

export const getEventsSuccess = (payload) => {
  return {
    type: GET_EVENTS_SUCCESS,
    payload,
  }
}

export const getEventsError = () => {
  return {
    type: GET_EVENTS_ERROR,
  }
}

export const getNewsBegin = () => {
  return {
    type: GET_NEWS_BEGIN,
  }
}

export const getNewsSuccess = (payload) => {
  return {
    type: GET_NEWS_SUCCESS,
    payload,
  }
}

export const getNewsError = () => {
  return {
    type: GET_NEWS_ERROR,
  }
}

export const setArtistOverlay = (payload) => {
  return {
    type: SET_ARTIST_OVERLAY,
    payload,
  }
}
