import { createClient } from 'contentful/dist/contentful.browser.min.js'

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

function transformAuthor(author) {
  return {
    id: author.sys.id,
    name: author.fields.name,
    profilePhoto: transformMedia(author.fields.profilePhoto),
    title: author.fields.title,
    discordUsername: author.fields.discordUsername,
    discordId: author.fields.discordId,
  }
}

function transformArtists(artists) {
  return artists.map(transformArtist)
}

export function transformArtist(artist) {
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
    author: transformAuthor(post.fields.author),
    coverPhoto: transformMedia(post.fields.coverPhoto),
    content: post.fields.content,
    createdAt: post.sys.createdAt,
  }
}

function transformNewsItem(post) {
  return {
    id: post.sys.id,
    title: post.fields.title,
    link: post.fields.link,
  }
}

function transformBlogPosts(posts) {
  return posts.map(transformBlogPost)
}

function transformNews(posts) {
  return posts.map(transformNewsItem)
}

function transformEvent(event) {
  return {
    id: event.sys.id,
    name: event.fields.name,
    shortDescription: event.fields.shortDescription,
    coverPhoto: transformMedia(event.fields.coverPhoto),
    date: event.fields.date,
    endDateTime: event.fields.endDateTime,
    location: event.fields.location,
    locationAddress: event.fields.locationAddress,
    locationName: event.fields.locationName,
    artists: transformArtists(event.fields.artists),
    about: event.fields.about,
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

  getNews = () => {
    return new Promise((resolve, reject) => {
      this.client
        .getEntries({
          content_type: 'news',
          include: 10,
        })
        .then((response) => {
          resolve(transformNews(response?.items || []))
        })
        .catch((error) => {
          console.warn(error)
          reject(error)
        })
    })
  }
}

export default new ContentfulManager()
