import moment from 'moment'
import React from 'react'
import { Text, View, StyleSheet, Dimensions } from 'react-native'
import FastImage from 'react-native-fast-image'

import { useSharedValue } from 'react-native-reanimated'
import Carousel from 'react-native-snap-carousel'
import Colors from '../../styles/Colors'
import FPETouchable from '../FPETouchable'
import Pagination from '../Pagination'

const screenWidth = Dimensions.get('screen').width

const MODAL_CONTAINER_MARGIN = 15
const MODAL_CONTAINER_WIDTH = screenWidth - MODAL_CONTAINER_MARGIN * 2

const padding = 15
const sliderWidth = MODAL_CONTAINER_WIDTH - padding
const imageRatio = 0.7076023392 // height/width of actual image
const imageWidth = sliderWidth - padding * 2
const imageHeight = imageWidth * imageRatio

const EventsCarousel = React.memo(({ handleEventPress, entries = [] }) => {
  const progress = useSharedValue(0)

  const renderItem = React.useCallback(({ item }) => {
    return (
      <FPETouchable
        style={styles.item}
        onPress={() => {
          handleEventPress(item)
        }}
      >
        <View style={styles.imageContainer}>
          <FastImage
            accessibilityIgnoresInvertColors
            style={styles.image}
            resizeMode="cover"
            source={{ uri: item.coverPhoto.src }}
          />
        </View>
        <View>
          <Text
            style={{
              color: '#fff',
              fontSize: 16,
              fontWeight: 'bold',
              marginBottom: 5,
            }}
          >
            {item.name}
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 12 }}>
            {moment(item.date).format('dddd, MMMM Do')} •{' '}
            {moment(item.date).format('h:mmA')}
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 12 }}>
            {item.locationName}
          </Text>
        </View>
      </FPETouchable>
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
      <Carousel
        data={entries}
        renderItem={renderItem}
        sliderWidth={screenWidth}
        itemWidth={sliderWidth}
        inactiveSlideOpacity={1}
        inactiveSlideScale={1}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        windowSize={screenWidth}
      />
      <View style={styles.paginationContainer}>
        <Pagination numberOfPages={entries.length} progress={progress} />
      </View>
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    width: screenWidth,
  },
  item: {
    paddingTop: padding,
  },
  imageContainer: {
    // padding: padding,
    // marginHorizontal: padding * 0.5,
    marginBottom: padding,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  image: {
    height: imageHeight,
    borderRadius: 10,
  },
  close: {
    padding: padding,
    paddingBottom: 0,
    zIndex: 9999,
  },
  paginationContainer: {
    width: '100%',
    paddingTop: 10,
    paddingBottom: 3,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: padding,
  },
})

export default EventsCarousel
