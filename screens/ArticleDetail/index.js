//@refresh reset
import React from 'react'
import {
  Alert,
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  Share,
  InteractionManager,
} from 'react-native'
import ParallaxScrollView from 'react-native-parallax-scroll-view'
import { connect } from 'react-redux'
import RenderHtml from 'react-native-render-html'
import Metrics from '../../shared/styles/Metrics'
import Close from '../../shared/components/svgs/Close'
import ShareIcon from '../../shared/components/svgs/Share'
import FastImage from 'react-native-fast-image'
import { StatusBar, setStatusBarHidden } from 'expo-status-bar'
import { INLINES, BLOCKS } from '@contentful/rich-text-types'
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import { SharedElement } from 'react-navigation-shared-element'
import Animated, {
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import deviceInfoModule from 'react-native-device-info'
import FPETouchable from '../../shared/components/FPETouchable'
import dynamicLinks from '@react-native-firebase/dynamic-links'
import UpArrow from '../../shared/components/svgs/UpArrow'
import { LinearGradient } from 'expo-linear-gradient'
import moment from 'moment'
import { setArtistOverlay } from '../../features/content/redux/contentActions'
import { transformArtist } from '../../ContentfulManager'
import base64 from 'react-native-base64'

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient)
const AnimatedParallaxScrollView =
  Animated.createAnimatedComponent(ParallaxScrollView)

const PARALLAX_HEADER_HEIGHT = Metrics.screenWidth

const tagsStyles = {
  a: {
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: '#fdf727',
  },
}

const renderersProps = {
  a: {
    onPress: () => Alert.alert('yooooo'),
  },
  img: {
    enableExperimentalPercentWidth: true,
  },
}

const linkContainerStyles = {
  transform: [
    {
      translateY: 3.5,
    },
  ],
}

const PRIMARY_ASSOCIATED_DOMAIN = 'goodkarmaclub.xyz'

function ArticleDetail({ data, navigation, setArtistOverlay }) {
  const scrollRef = React.useRef(null)

  const [shareLoading, setShareLoading] = React.useState(false)

  const translationY = useSharedValue(0)
  const elementOpacities = useSharedValue(0)
  const scrollUpOpacity = useSharedValue(0)

  function handleExternalLinkPress(url) {
    if (url) {
      navigation.navigate('WebviewModal', { uri: url })
    }
  }

  const ARenderer = React.useCallback(({ TDefaultRenderer, ...props }) => {
    function onPress() {
      if (props?.tnode?.init?.textNode?.parent?.attribs?.href) {
        const link = props?.tnode?.init?.textNode?.parent?.attribs?.href
        let data = props?.tnode?.init?.textNode?.parent?.attribs?.data || ''
        if (link.includes(PRIMARY_ASSOCIATED_DOMAIN)) {
          let scrubbedLink = link.replace('https://', '')
          scrubbedLink = link.replace('http://', '')
          let paths = scrubbedLink.split(PRIMARY_ASSOCIATED_DOMAIN)[1] || ''
          if (paths.includes('artists')) {
            const [path, artistId] = paths.split('/').filter((x) => x)
            if (data) {
              data = JSON.parse(base64.decode(data))
              setArtistOverlay(data)
            } else {
              setArtistOverlay({ id: artistId })
            }
          }
        } else {
          handleExternalLinkPress(
            props?.tnode?.init?.textNode?.parent?.attribs?.href
          )
        }
      } else if (props?.tnode?.init?.domNode?.attribs?.href) {
        handleExternalLinkPress(props?.tnode?.init?.domNode?.attribs?.href)
      }
    }
    return (
      <FPETouchable onPress={onPress} style={linkContainerStyles}>
        <TDefaultRenderer {...props} />
      </FPETouchable>
    )
  }, [])

  const renderers = {
    a: ARenderer,
  }

  // https://meliorence.github.io/react-native-render-html/docs/content/images
  // https://www.npmjs.com/package/@contentful/rich-text-html-renderer
  const documentToHtmlStringOptions = React.useMemo(() => {
    return {
      renderNode: {
        [BLOCKS.EMBEDDED_ASSET]: (node) => {
          const type = node?.data?.target?.fields?.file?.contentType
          if (type?.includes('image')) {
            return `<img src="https:${node?.data?.target?.fields?.file.url}"></img>`
          } else {
            return '<div style="width:100%;padding:5px 15px;margin:15px 0;border-radius:5px;background-color:#D8D8D8;"><p style="color:#48484a;">This content is not supported :(</p></div>'
          }
        },
        [INLINES.EMBEDDED_ENTRY]: (node) => {
          const d = transformArtist(node?.data?.target)
          return `<a href="https://goodkarmaclub.xyz/artists/${
            d?.id
          }" data="${base64.encode(JSON.stringify(d))}">${d?.name}</a>`
        },
      },
    }
  }, [])

  const html = React.useMemo(() => {
    return documentToHtmlString(data?.content, documentToHtmlStringOptions)
  }, [data?.content])

  React.useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      elementOpacities.value = withTiming(1)
      scrollUpOpacity.value = withTiming(0)
    })
    return function cleanup() {
      setStatusBarHidden(false, 'fade')
    }
  }, [])

  const animatedCloseIconStyles = useAnimatedStyle(() => {
    return {
      opacity: elementOpacities.value,
    }
  })

  const animatedScrollIconStyles = useAnimatedStyle(() => {
    return {
      opacity: scrollUpOpacity.value,
    }
  })

  function setStatusBarHiddenValue(value) {
    setStatusBarHidden(!!value, 'fade')
  }

  const animatedScrollHandler = useAnimatedScrollHandler((event) => {
    translationY.value = event.contentOffset.y
    if ((translationY.value || 0) > PARALLAX_HEADER_HEIGHT - 100) {
      runOnJS(setStatusBarHiddenValue)(true)
      elementOpacities.value = withTiming(0)
      scrollUpOpacity.value = withTiming(1)
    } else {
      runOnJS(setStatusBarHiddenValue)(false)
      elementOpacities.value = withTiming(1)
      scrollUpOpacity.value = withTiming(0)
    }
  })

  async function share() {
    try {
      setShareLoading(true)
      const link = await dynamicLinks().buildLink({
        link: `https://goodkarmaclub.page.link/articleDetail/${data?.id}`,
        domainUriPrefix: 'https://goodkarmaclub.page.link',
        analytics: {
          campaign: 'article',
        },
        android: {
          packageName: 'xyz.goodkarmaclub',
        },
        ios: {
          bundleId: 'xyz.goodkarmaclub',
          appStoreId: '123456789',
        },
        social: {
          title: 'Good Karma Records',
          descriptionText: data?.title,
          imageUrl: data?.coverPhoto?.src,
        },
      })
      setShareLoading(false)
      const result = await Share.share({
        message: data?.title,
        url: link,
      })
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      setShareLoading(false)
      console.error('Could not create or share a dynamic link!', error)
    }
  }

  const htmloutput = React.useMemo(() => {
    return (
      <RenderHtml
        contentWidth={Metrics.screenWidth - Metrics.defaultPadding * 2}
        source={{ html }}
        defaultTextProps={{
          maxFontSizeMultiplier: global.maxFontSizeMultiplier,
          selectable: true,
          style: { color: '#fff', fontSize: 20, lineHeight: 27 },
        }}
        tagsStyles={tagsStyles}
        defaultViewProps={{ backgroundColor: '#000' }}
        baseStyle={{
          backgroundColor: '#000',
          paddingHorizontal: Metrics.defaultPadding,
        }}
        renderersProps={renderersProps}
        renderers={renderers}
        systemFonts={[]}
      />
    )
  }, [html])

  function scrollup() {
    scrollRef.current?.scrollTo?.({ y: 0 })
  }

  const setScrollRef = React.useCallback((ref) => {
    scrollRef.current = ref
  }, [])

  const animatedLinearGradientStyles = useAnimatedStyle(() => {
    let bottom = translationY.value * 0.8
    if (translationY.value < 0) {
      bottom -= translationY.value
    }
    return {
      position: 'absolute',
      bottom,
      width: '100%',
      height: '50%',
    }
  })

  function openDiscordLink(id) {
    handleExternalLinkPress(`https://discordapp.com/users/${id}`)
  }

  function renderData() {
    return (
      <View style={styles.container}>
        <AnimatedParallaxScrollView
          ref={setScrollRef}
          onScroll={animatedScrollHandler}
          scrollEnabled={!!data}
          style={styles.container}
          indicatorStyle="white"
          parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
          contentContainerStyle={styles.contentContainerStyle}
          renderBackground={() => (
            <SharedElement
              id={`item.${data?.id}.photo`}
              style={{ backgroundColor: '#000' }}
            >
              <View
                style={{
                  width: Metrics.screenWidth,
                  height: PARALLAX_HEADER_HEIGHT,
                }}
              >
                <FastImage
                  source={{
                    uri: data?.coverPhoto?.src,
                  }}
                  style={{
                    shadowColor: '#000',
                    shadowRadius: 5,
                    shadowOpacity: 0.2,
                    shadowOffset: { width: 5 },
                    width: '100%',
                    height: '100%',
                  }}
                />
                <AnimatedLinearGradient
                  colors={['transparent', 'rgba(0,0,0,1)']}
                  style={animatedLinearGradientStyles}
                />
              </View>
            </SharedElement>
          )}
        >
          <View
            key="foreground"
            style={[
              styles.parallaxHeader,
              {
                height: data?.fontSize?.height * 0.5,
              },
            ]}
          >
            {data ? null : <ActivityIndicator />}
          </View>
          {data ? (
            <SharedElement
              id={`item.${data?.id}.text`}
              style={[
                styles.titleContainer,
                {
                  height: data?.fontSize?.height,
                  top: data?.fontSize?.height * -0.5,
                },
              ]}
            >
              <Text
                maxFontSizeMultiplier={global.maxFontSizeMultiplier}
                allowFontScaling={false}
                style={styles.sectionSpeakerText}
              >
                {data?.title}
              </Text>
            </SharedElement>
          ) : null}
          <View
            style={{
              borderRadius: 10,
              marginTop: Metrics.defaultPadding,
              marginBottom: Metrics.defaultPadding * 0.5,
              marginHorizontal: Metrics.defaultPadding,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <FastImage
              source={{ uri: data?.author?.profilePhoto?.src }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 4,
                marginRight: Metrics.defaultPadding * 0.5,
              }}
            />
            <View>
              <Text
                maxFontSizeMultiplier={global.maxFontSizeMultiplier}
                style={styles.sectionAuthorTitle}
              >
                {data?.author?.name}
                {data?.author?.discordUsername ? (
                  <FPETouchable
                    onPress={() => openDiscordLink(data?.author?.discordId)}
                    style={{
                      transform: [{ translateY: 2 }],
                    }}
                  >
                    <Text
                      maxFontSizeMultiplier={global.maxFontSizeMultiplier}
                      style={{
                        ...styles.sectionAuthorTitle,
                        fontWeight: 'normal',
                        textDecorationColor: '#fdf727',
                        textDecorationStyle: 'solid',
                        textDecorationLine: 'underline',
                      }}
                    >
                      {' '}
                      @{data?.author?.discordUsername}
                    </Text>
                  </FPETouchable>
                ) : null}
              </Text>
              {data?.author?.title ? (
                <Text
                  maxFontSizeMultiplier={global.maxFontSizeMultiplier}
                  style={styles.sectionAuthorSubtitle}
                >
                  {data?.author?.title}
                </Text>
              ) : null}
              <Text
                maxFontSizeMultiplier={global.maxFontSizeMultiplier}
                style={styles.sectionAuthorSubtitle}
              >
                {moment(data.createdAt).format('dddd MMMM Do, YYYY')}
              </Text>
            </View>
          </View>
          {htmloutput}
        </AnimatedParallaxScrollView>
        <FPETouchable
          hitSlop={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
          haptic
          onPress={navigation.goBack}
          style={[animatedCloseIconStyles, styles.close]}
        >
          <Close size={16} fill="#fff" />
        </FPETouchable>
        <FPETouchable
          hitSlop={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
          haptic
          onPress={scrollup}
          style={[animatedScrollIconStyles, styles.scrollup]}
        >
          <UpArrow size={16} fill="#fff" />
        </FPETouchable>
        {data ? (
          <FPETouchable
            hitSlop={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
            haptic
            onPress={share}
            style={[animatedCloseIconStyles, styles.share]}
          >
            {shareLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ShareIcon size={17} fill="#fff" />
            )}
          </FPETouchable>
        ) : null}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" animated hidden={false} />
      {renderData()}
    </View>
  )
}

const styles = StyleSheet.create({
  safeAreaViewContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
    // paddingTop: 10,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: PARALLAX_HEADER_HEIGHT * 0.5,
  },
  contentContainerStyle: {
    backgroundColor: '#000',
    paddingBottom: Metrics.hasNotch ? 34 : Metrics.defaultPadding,
  },
  close: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 100,
    height: 45,
    width: 45,
    justifyContent: 'center',
    alignItems: 'center',
    top: Metrics.hasNotch ? 45 : Metrics.defaultPadding,
    left: Metrics.defaultPadding,
  },
  scrollup: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 100,
    height: 45,
    width: 45,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: Metrics.hasNotch ? 34 : Metrics.defaultPadding,
    right: Metrics.defaultPadding,
  },
  share: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 100,
    height: 45,
    width: 45,
    justifyContent: 'center',
    alignItems: 'center',
    top: Metrics.hasNotch ? 45 : Metrics.defaultPadding,
    right: Metrics.defaultPadding,
  },
  parallaxHeader: {
    backgroundColor: '#000',
    overflow: 'visible',
  },
  titleContainer: {
    position: 'absolute',
    left: Metrics.defaultPadding,
    right: Metrics.defaultPadding,
    bottom: 0,
  },
  sectionSpeakerText: {
    color: '#fff',
    fontSize: 47.5,
    fontWeight: 'bold',
  },
  sectionAuthorTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionAuthorSubtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
})

function mapStateToProps({ content }, { route }) {
  const { id } = route.params
  const data = content.blogPosts.data.find((post) => {
    return post.id === id
  })
  return {
    id,
    data,
  }
}

const mapDispatchToProps = {
  setArtistOverlay,
}

export default connect(mapStateToProps, mapDispatchToProps)(ArticleDetail)
