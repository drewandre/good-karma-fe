import ContentfulManager from '../../../ContentfulManager'
import Metrics from '../../../shared/styles/Metrics'
import {
  getBlogPostsBegin,
  getBlogPostsError,
  getBlogPostsSuccess,
  getEventsBegin,
  getEventsError,
  getEventsSuccess,
} from './contentActions'
import rnTextSize from 'react-native-text-size'

const fontSpecs = {
  fontFamily: undefined,
  fontSize: 55,
  usePreciseWidth: true,
  allowFontScaling: false,
  fontWeight: 'bold',
}

export const getBlogPosts = () => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch(getBlogPostsBegin())
    ContentfulManager.getBlogPosts()
      .then(async (response) => {
        const promises = response.map(async (entry) => {
          return await rnTextSize.measure({
            text: entry.title,
            width: Metrics.screenWidth - Metrics.defaultPadding * 2,
            ...fontSpecs,
          })
        })
        const fontSizes = await Promise.all(promises)
        response = response.map((item, index) => {
          return {
            ...item,
            fontSize: fontSizes[index],
          }
        })
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
