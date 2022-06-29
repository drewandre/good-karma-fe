import React from 'react'
import { Image, Text, View, StyleSheet, Dimensions, Button } from 'react-native'

import { useSharedValue } from 'react-native-reanimated'
import Carousel from 'react-native-snap-carousel'

import Pagination from '../Pagination'

import { requestPushNotificationPermissions } from '../../helpers/pushNotifications'

const screenWidth = Dimensions.get('screen').width

const MODAL_CONTAINER_MARGIN = 15
const MODAL_CONTAINER_WIDTH = screenWidth - MODAL_CONTAINER_MARGIN * 2

const padding = 15
const sliderWidth = MODAL_CONTAINER_WIDTH
const imageRatio = 0.7076023392 // height/width of actual image
const imageWidth = sliderWidth - padding * 2
const imageHeight = imageWidth * imageRatio

const OnboardingCarousel = React.memo(({ close, entries = [], dotWidth }) => {
  const progress = useSharedValue(0)
  const carouselRef = React.useRef(null)

  async function requestPushPermissions() {
    await requestPushNotificationPermissions()
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
          <Image
            accessibilityIgnoresInvertColors
            style={styles.image}
            source={item.image}
          />
        </View>
        <View>
          <Text>{item.title}</Text>
          <Text>{item.subtitle}</Text>
        </View>
        <Button title={item.buttonText} onPress={advanceToNextSlide}>
          <Text>{item.buttonText}</Text>
        </Button>
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
    ({
      nativeEvent: {
        contentSize: { width },
        contentOffset: { x },
      },
    }) => {
      setPaginationProgress(x / width)
    },
    [setPaginationProgress]
  )

  return (
    <View style={styles.container}>
      <View style={styles.paginationContainer}>
        <Pagination
          numberOfPages={entries.length}
          progress={progress}
          dotWidth={dotWidth}
        />
        <Button title="Close" onPress={close}>
          <Text>Close</Text>
        </Button>
      </View>
      <Carousel
        ref={setCarouselRef}
        data={entries}
        scrollEnabled={false}
        renderItem={renderItem}
        sliderWidth={screenWidth}
        itemWidth={sliderWidth}
        inactiveSlideOpacity={0}
        inactiveSlideScale={1}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        windowSize={screenWidth}
      />
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    width: screenWidth,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  item: {
    paddingHorizontal: padding,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  imageContainer: {
    paddingVertical: padding,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  image: {
    width: imageWidth,
    height: imageHeight,
  },
  close: {
    padding: padding,
    paddingBottom: 0,
    zIndex: 9999,
  },
  paginationContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: padding,
    paddingVertical: 15,
  },
})

export default OnboardingCarousel
