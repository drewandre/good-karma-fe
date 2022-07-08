//@refresh reset
import React from 'react'
import {
  Image,
  Text,
  View,
  StyleSheet,
  Dimensions,
  Button,
  SafeAreaView,
} from 'react-native'

import { useSharedValue } from 'react-native-reanimated'
import Carousel from 'react-native-snap-carousel'

import Pagination from '../Pagination'

import { requestPushNotificationPermissions } from '../../helpers/pushNotifications'
import {
  setTopicSubscriptionStatusBegin,
  setTopicSubscriptionStatusSuccess,
  setTopicSubscriptionStatusError,
} from '../../../features/session/redux/sessionActions'
import { connect } from 'react-redux'
import Colors from '../../styles/Colors'
import Metrics from '../../styles/Metrics'

const screenWidth = Dimensions.get('screen').width

const MODAL_CONTAINER_WIDTH = Metrics.screenWidth

const padding = Metrics.defaultPadding
const sliderWidth = MODAL_CONTAINER_WIDTH
const imageRatio = 0.7076023392 // height/width of actual image
const imageWidth = sliderWidth - padding * 2
const imageHeight = imageWidth * imageRatio

const OnboardingCarousel = React.memo(
  ({
    close,
    entries = [],
    dotWidth,
    setTopicSubscriptionStatusBegin,
    setTopicSubscriptionStatusSuccess,
    setTopicSubscriptionStatusError,
    notificationTopics,
    onScroll,
  }) => {
    const progress = useSharedValue(0)
    const carouselRef = React.useRef(null)

    async function requestPushPermissions() {
      await requestPushNotificationPermissions({
        setTopicSubscriptionStatusBegin,
        setTopicSubscriptionStatusSuccess,
        setTopicSubscriptionStatusError,
        notificationTopics,
      })
      close()
    }

    function advanceToNextSlide() {
      if (carouselRef.current.currentIndex === entries.length - 2) {
        requestPushPermissions()
      } else if (carouselRef.current.currentIndex === entries.length - 1) {
        close()
      } else {
        carouselRef.current.snapToNext()
      }
    }

    const setCarouselRef = React.useCallback((ref) => {
      carouselRef.current = ref
    }, [])

    const renderItem = React.useCallback(({ item }) => {
      return (
        <View style={styles.item}>
          <View style={styles.imageContainer}>
            {/* <Image
              accessibilityIgnoresInvertColors
              style={styles.image}
              source={item.image}
            /> */}
          </View>
          <View>
            <Text style={styles.title}>
              {item.title}
              <Text style={styles.subtitle}> {item.subtitle}</Text>
            </Text>
          </View>
        </View>
      )
    }, [])

    const setPaginationProgress = React.useCallback(
      (p) => {
        'worklet'
        progress.value = p
      },
      [progress]
    )

    const scrollHandler = React.useCallback(
      (event) => {
        const {
          nativeEvent: {
            contentSize: { width },
            contentOffset: { x },
          },
        } = event
        if (onScroll) {
          onScroll(event)
        }
        setPaginationProgress(x / width)
      },
      [setPaginationProgress, onScroll]
    )

    return (
      <SafeAreaView style={styles.wrapper}>
        <View style={styles.container}>
          <Carousel
            ref={setCarouselRef}
            data={entries}
            renderItem={renderItem}
            sliderWidth={screenWidth}
            itemWidth={sliderWidth}
            inactiveSlideOpacity={0}
            inactiveSlideScale={1}
            onScroll={scrollHandler}
            scrollEventThrottle={16}
            windowSize={screenWidth}
          />
          <View style={styles.paginationContainer}>
            <Pagination
              numberOfPages={entries.length}
              progress={progress}
              dotWidth={dotWidth}
            />
          </View>
        </View>
      </SafeAreaView>
    )
  }
)

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    width: Metrics.screenWidth,
    borderRadius: 4,
  },
  item: {
    paddingHorizontal: Metrics.defaultPadding,
    justifyContent: 'space-between',
    flex: 1,
  },
  imageContainer: {
    paddingVertical: Metrics.defaultPadding,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  close: {
    transform: [{ rotate: '90deg' }],
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 100,
    height: 45,
    width: 45,
    justifyContent: 'center',
    alignItems: 'center',
    top: Metrics.hasNotch ? 45 : Metrics.defaultPadding,
    left: Metrics.defaultPadding,
  },
  image: {
    width: imageWidth,
    height: imageHeight,
  },
  title: {
    fontSize: 40,
    fontWeight: '600',
    color: Colors.white,
  },
  subtitle: {
    fontSize: 40,
    fontWeight: '100',
    color: Colors.white,
  },
  paginationContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Metrics.defaultPadding,
    paddingTop: Metrics.defaultPadding * 0.5,
  },
})

function mapStateToProps({ session }) {
  return {
    notificationTopics: session.notificationTopics,
  }
}

const mapDispatchToProps = {
  setTopicSubscriptionStatusBegin,
  setTopicSubscriptionStatusSuccess,
  setTopicSubscriptionStatusError,
}

export default connect(mapStateToProps, mapDispatchToProps)(OnboardingCarousel)
