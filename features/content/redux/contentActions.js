import {
  GET_BLOG_POSTS_BEGIN,
  GET_BLOG_POSTS_SUCCESS,
  GET_BLOG_POSTS_ERROR,
  GET_EVENTS_BEGIN,
  GET_EVENTS_SUCCESS,
  GET_EVENTS_ERROR,
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
