import ContentfulManager from '../../../ContentfulManager'
import {
  getBlogPostsBegin,
  getBlogPostsError,
  getBlogPostsSuccess,
  getEventsBegin,
  getEventsError,
  getEventsSuccess,
} from './contentActions'

export const getBlogPosts = () => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch(getBlogPostsBegin())
    ContentfulManager.getBlogPosts()
      .then((response) => {
        dispatch(getBlogPostsSuccess(response))
        resolve(response)
      })
      .catch((error) => {
        console.warn(error)
        dispatch(getBlogPostsError())
        reject(error)
      })
  })
}

export const getEvents = () => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch(getEventsBegin())
    ContentfulManager.getEvents()
      .then((response) => {
        dispatch(getEventsSuccess(response))
        resolve(response)
      })
      .catch((error) => {
        console.warn(error)
        dispatch(getEventsError())
        reject(error)
      })
  })
}
