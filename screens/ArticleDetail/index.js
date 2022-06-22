import React from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import ParallaxScrollView from 'react-native-parallax-scroll-view'
import { connect } from 'react-redux'
import RenderHtml from 'react-native-render-html'
import Metrics from '../../shared/styles/Metrics'
import BackArrow from '../../shared/components/svgs/BackArrow'
import FastImage from 'react-native-fast-image'
import { StatusBar } from 'expo-status-bar'
import deviceInfoModule from 'react-native-device-info'

const PARALLAX_HEADER_HEIGHT = 300
const STICKY_HEADER_HEIGHT = 70

function ArticleDetail({ data, id, navigation }) {
  /*
    title: string
    id: int
    content: string (rich text)
  */

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

  function renderData() {
    return (
      <ParallaxScrollView
        style={styles.container}
        parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
        contentContainerStyle={styles.contentContainerStyle}
        renderForeground={() => {
          return (
            <TouchableOpacity
              onPress={navigation.goBack}
              style={styles.backArrow}
            >
              <BackArrow />
            </TouchableOpacity>
          )
        }}
        renderBackground={() => (
          <View key="background" style={{ backgroundColor: '#000' }}>
            <FastImage
              source={{
                uri: data.coverPhoto.src,
              }}
              style={{
                width: Metrics.screenWidth,
                height: PARALLAX_HEADER_HEIGHT,
              }}
            />
            {/* <View
              style={{
                position: 'absolute',
                top: 0,
                width: Metrics.screenWidth,
                backgroundColor: 'rgba(0,0,0,.4)',
                height: PARALLAX_HEADER_HEIGHT,
              }}
            /> */}
          </View>
        )}
      >
        <View style={styles.parallaxHeader} key="foreground" />
        <View style={styles.titleContainer}>
          <Text
            style={styles.sectionSpeakerText}
            numberOfLines={5}
            adjustsFontSizeToFit
          >
            {data.title}
          </Text>
          <Text
            style={styles.sectionTitleText}
            numberOfLines={2}
            adjustsFontSizeToFit
          >
            By {data.author}
          </Text>
        </View>
        <RenderHtml
          contentWidth={Metrics.screenWidth - 40}
          source={{ html: data.content }}
          defaultTextProps={{ style: { color: '#fff' } }}
          baseStyle={{ backgroundColor: '#000', padding: 15 }}
          renderersProps={renderersProps}
          systemFonts={[]}
        />
      </ParallaxScrollView>
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
  },
  contentContainerStyle: {
    // paddingHorizontal: 15,
  },
  backArrow: {
    position: 'absolute',
    top: deviceInfoModule.hasNotch() ? 50 : 25,
    left: 25,
  },
  parallaxHeader: {
    backgroundColor: '#000',
    overflow: 'visible',
    height: PARALLAX_HEADER_HEIGHT / 2,
  },
  titleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'visible',
    top: PARALLAX_HEADER_HEIGHT * -0.5,
  },
  sectionSpeakerText: {
    paddingHorizontal: 15,
    color: '#fff',
    fontSize: 40,
    textShadowColor: '#rgba(0,0,0,0.5)',
    textShadowRadius: 20,
    fontWeight: 'bold',
    paddingVertical: 5,
  },
  sectionTitleText: {
    paddingHorizontal: 15,
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
