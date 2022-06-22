import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import { createClient } from 'contentful/dist/contentful.browser.min.js'
import { BLOCKS } from '@contentful/rich-text-types'

// https://meliorence.github.io/react-native-render-html/docs/content/images
// https://www.npmjs.com/package/@contentful/rich-text-html-renderer
const documentToHtmlStringOptions = {
  renderNode: {
    [BLOCKS.EMBEDDED_ASSET]: (node) => {
      const type = node?.data?.target?.fields?.file?.contentType
      if (type?.includes('image')) {
        return `<img src=${'https://i.scdn.co/image/ab6761610000e5eb11520b922e1cc39475eb460f'}></img>`
      } else {
        return '<div style="width:100%;padding:5px 15px;margin:15px 0;border-radius:5px;background-color:#D8D8D8;"><p style="color:#48484a;">This content is not supported :(</p></div>'
      }
    },
  },
}

function transformRichText(text) {
  if (text) {
    return documentToHtmlString(text, documentToHtmlStringOptions)
  } else {
    return ''
  }
}

function transformMedia(image) {
  try {
    return {
      src: `https:${image.fields.file.url}`,
      width: image.fields.file.details?.image?.width,
      height: image.fields.file.details?.image?.height,
    }
  } catch (error) {
    console.warn('Unable to transform image in transformMedia')
    return {
      src: '',
      width: null,
      height: null,
    }
  }
}

function transformArtists(artists) {
  return artists.map(transformArtist)
}

function transformArtist(artist) {
  return {
    id: artist.sys.id,
    name: artist.fields.name,
    coverPhoto: transformMedia(artist.fields.coverPhoto),
    spotifyUrl: artist.fields.spotifyUrl,
    soundCloudUrl: artist.fields.soundCloudUrl,
  }
}

function transformBlogPost(post) {
  return {
    id: post.sys.id,
    title: post.fields.title,
    author: post.fields.author,
    coverPhoto: transformMedia(post.fields.coverPhoto),
    content: transformRichText(post.fields.content),
  }
}

function transformBlogPosts(posts) {
  return posts.map(transformBlogPost)
}

function transformEvent(event) {
  return {
    id: event.sys.id,
    name: event.fields.name,
    coverPhoto: transformMedia(event.fields.coverPhoto),
    date: event.fields.date,
    endDateTime: event.fields.endDateTime,
    location: event.fields.location,
    locationName: event.fields.locationName,
    artists: transformArtists(event.fields.artists),
    about: transformRichText(event.fields.about),
  }
}

function transformEvents(events) {
  return events.map(transformEvent)
}

class ContentfulManager {
  constructor() {
    this.client = createClient({
      // This is the space ID. A space is like a project folder in Contentful terms
      space: 'z08x63qrkj2y',
      // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
      accessToken: 'LZCL1WbvDarZQA9wRhPv0tkwc8vkuVVyRpbqpy-D8T0',
    })
  }

  getEvents = () => {
    return new Promise((resolve, reject) => {
      this.client
        .getEntries({
          content_type: 'event',
          include: 10,
        })
        .then((response) => {
          resolve(transformEvents(response?.items || []))
        })
        .catch((error) => {
          console.warn(error)
          reject(error)
        })
    })
  }

  getBlogPosts = () => {
    return new Promise((resolve, reject) => {
      this.client
        .getEntries({
          content_type: 'blogPost',
          include: 10,
        })
        .then((response) => {
          resolve(transformBlogPosts(response?.items || []))
        })
        .catch((error) => {
          console.warn(error)
          reject(error)
        })
    })
  }
}

export default new ContentfulManager()
