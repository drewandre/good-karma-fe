//@refresh reset
import React from 'react'
import moment from 'moment'
import { Text, View, StyleSheet, Dimensions } from 'react-native'
import FastImage from 'react-native-fast-image'

import { useSharedValue } from 'react-native-reanimated'
import Carousel from 'react-native-snap-carousel'
import Colors from '../../styles/Colors'
import Metrics from '../../styles/Metrics'
import FPETouchable from '../FPETouchable'
import Pagination from '../Pagination'

const padding = Metrics.defaultPadding
const imageRatio = 0.7076023392
const itemWidth = Metrics.screenWidth - padding * 2
const imageHeight = itemWidth * imageRatio

const EventsCarousel = React.memo(({ handleEventPress, entries = [] }) => {
  const progress = useSharedValue(0)

  const renderItem = React.useCallback(({ item }) => {
    return (
      <FPETouchable
        onPressInDelay={100}
        style={styles.item}
        onPress={() => {
          handleEventPress(item)
        }}
      >
        <View style={styles.contentContainer}>
          <View style={styles.imageShadow}>
            <FastImage
              accessibilityIgnoresInvertColors
              style={styles.image}
              resizeMode="cover"
              source={{ uri: item.coverPhoto.src }}
            />
          </View>
          <View style={styles.textContainer}>
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
        sliderWidth={Metrics.screenWidth}
        itemWidth={itemWidth}
        inactiveSlideOpacity={0.5}
        inactiveSlideScale={1}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        windowSize={Metrics.screenWidth}
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
  },
  item: {
    paddingVertical: Metrics.defaultPadding,
    marginRight: 20,
    shadowColor: '#000',
    shadowRadius: 5,
    shadowOpacity: 0.2,
    shadowOffset: { height: 5, width: 5 },
  },
  imageShadow: {
    shadowColor: '#000',
    shadowRadius: 10,
    shadowOpacity: 0.2,
  },
  contentContainer: {
    overflow: 'hidden',
    backgroundColor: Colors.backgroundLight,
    borderRadius: 20,
  },
  textContainer: {
    padding: Metrics.defaultPadding,
  },
  image: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: imageHeight,
  },
  close: {
    padding: padding,
    paddingBottom: 0,
    zIndex: 9999,
  },
  paginationContainer: {
    marginTop: -15,
    paddingBottom: 5,
    justifyContent: 'center',
  },
})

export default EventsCarousel
