import React from 'react'
import {
  Alert,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  InteractionManager,
} from 'react-native'
import ParallaxScrollView from 'react-native-parallax-scroll-view'
import { connect } from 'react-redux'
import RenderHtml from 'react-native-render-html'
import Metrics from '../../shared/styles/Metrics'
import Close from '../../shared/components/svgs/Close'
import FastImage from 'react-native-fast-image'
import { StatusBar, setStatusBarHidden } from 'expo-status-bar'
import { INLINES, BLOCKS } from '@contentful/rich-text-types'
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import { SharedElement } from 'react-navigation-shared-element'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import deviceInfoModule from 'react-native-device-info'

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity)

const PARALLAX_HEADER_HEIGHT = Metrics.screenWidth
const STICKY_HEADER_HEIGHT = 70

function ArticleDetail({ data, id, navigation }) {
  /*
    title: string
    id: int
    content: string (rich text)
  */

  function onContentfulLinkPress(event, href) {
    Alert.alert('Link clicked!', href)
  }
  // https://meliorence.github.io/react-native-render-html/docs/content/images
  // https://www.npmjs.com/package/@contentful/rich-text-html-renderer
  const documentToHtmlStringOptions = {
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
        return `<a href="https://google.com/ style="text-decoration-color:red;color:red !important;text-decoration:none;border-bottom:1px solid #fdf727;">${node?.data?.target?.fields?.name}</a>`
      },
    },
    a: {
      onPress: onContentfulLinkPress,
    },
  }

  const html = React.useMemo(() => {
    return documentToHtmlString(data?.content, documentToHtmlStringOptions)
  }, [data?.content])

  React.useEffect(() => {
    if (!data) {
      console.log('Article not found in local state -- should fetch?')
    }
  }, [])

  const renderersProps = {
    img: {
      enableExperimentalPercentWidth: true,
    },
  }

  React.useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      elementOpacities.value = withTiming(1)
    })
  })

  const elementOpacities = useSharedValue(0)

  const animatedCloseIconStyles = useAnimatedStyle(() => {
    return {
      opacity: elementOpacities.value,
    }
  })

  function handleScroll(e) {
    if (
      (e?.nativeEvent?.contentOffset?.y || 0) >
      PARALLAX_HEADER_HEIGHT - 100
    ) {
      setStatusBarHidden(true, 'fade')
      elementOpacities.value = withTiming(0)
    } else {
      setStatusBarHidden(false, 'fade')
      elementOpacities.value = withTiming(1)
    }
  }

  function renderData() {
    return (
      <View style={styles.container}>
        <ParallaxScrollView
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.container}
          parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
          contentContainerStyle={styles.contentContainerStyle}
          renderBackground={() => (
            <SharedElement
              id={`item.${data.id}.photo`}
              style={{ backgroundColor: '#000' }}
            >
              <FastImage
                source={{
                  uri: data?.coverPhoto?.src,
                }}
                style={{
                  width: Metrics.screenWidth,
                  height: PARALLAX_HEADER_HEIGHT,
                }}
              />
            </SharedElement>
          )}
        >
          <View style={styles.parallaxHeader} key="foreground" />
          <View style={styles.titleContainer}>
            <SharedElement id={`item.${data.id}.text`}>
              <Text allowFontScaling={false} style={styles.sectionSpeakerText}>
                {data.title}
              </Text>
            </SharedElement>
            <SharedElement id={`item.${data.id}.author`}>
              <Text style={styles.sectionTitleText}>By {data.author}</Text>
            </SharedElement>
          </View>
          <RenderHtml
            contentWidth={Metrics.screenWidth - 40}
            source={{ html }}
            defaultTextProps={{
              style: { color: '#fff' },
            }}
            baseStyle={{ backgroundColor: '#000', padding: 15 }}
            renderersProps={renderersProps}
            systemFonts={[]}
          />
        </ParallaxScrollView>
        <AnimatedTouchableOpacity
          hitSlop={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
          onPress={navigation.goBack}
          style={[animatedCloseIconStyles, styles.close]}
        >
          <Animated.View style={animatedCloseIconStyles}>
            <Close fill="rgba(255,255,255,0.7)" />
          </Animated.View>
        </AnimatedTouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" animated />
      {data ? renderData() : <Text>Could not find this article!</Text>}
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
  contentContainerStyle: {
    backgroundColor: '#000',
    // paddingHorizontal: 15,
  },
  close: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 100,
    padding: 15,
    top: deviceInfoModule.hasNotch() ? 55 : 25,
    right: 30,
  },
  parallaxHeader: {
    backgroundColor: '#000',
    overflow: 'visible',
    height: PARALLAX_HEADER_HEIGHT / 2,
  },
  titleContainer: {
    position: 'absolute',
    left: Metrics.defaultPadding,
    right: Metrics.defaultPadding,
    bottom: 0,
    top: PARALLAX_HEADER_HEIGHT * -0.35,
  },
  sectionSpeakerText: {
    color: '#fff',
    fontSize: 55,
    fontWeight: 'bold',
  },
  sectionTitleText: {
    color: '#fff',
    fontSize: 18,
    paddingVertical: 5,
  },
  stickySection: {
    height: STICKY_HEADER_HEIGHT,
    width: 300,
    justifyContent: 'flex-end',
  },
  stickySectionText: {
    color: 'white',
    fontSize: 20,
    margin: 10,
  },
  fixedSection: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  fixedSectionText: {
    color: '#999',
    fontSize: 20,
  },
})

function mapStateToProps({ content }, { route }) {
  const { id } = route.params
  return {
    id,
    data: content.blogPosts.data.find((post) => {
      return post.id === id
    }),
  }
}

export default connect(mapStateToProps)(ArticleDetail)
