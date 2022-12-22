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
import { LinearGradient } from 'expo-linear-gradient'

const padding = Metrics.defaultPadding
const itemWidth = Metrics.screenWidth - padding * 2
const itemHeight = 250

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
        <View style={styles.contentContainer}>
          <FastImage
            accessibilityIgnoresInvertColors
            style={styles.image}
            resizeMode="cover"
            source={{ uri: item.coverPhoto.src }}
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,95)']}
            style={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              height: '50%',
              borderRadius: 20,
            }}
          />
          <View style={styles.textContainer}>
            <Text
              maxFontSizeMultiplier={global.maxFontSizeMultiplier}
              style={{
                color: '#fff',
                fontSize: 22,
                fontWeight: 'bold',
                marginBottom: 3,
              }}
            >
              {item.name}
            </Text>
            <Text
              maxFontSizeMultiplier={global.maxFontSizeMultiplier}
              style={{ color: '#fff', fontSize: 16 }}
            >
              {moment(item.date).format('dddd, MMMM Do')} •{' '}
              {moment(item.date).format('h:mmA')}
            </Text>
            <Text
              maxFontSizeMultiplier={global.maxFontSizeMultiplier}
              style={{ color: '#fff', fontSize: 16 }}
            >
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
    width: itemWidth - 20,
    shadowColor: '#000',
    shadowRadius: 5,
    shadowOpacity: 0.2,
    shadowOffset: { height: 5, width: 5 },
    borderRadius: 20,
  },
  contentContainer: {
    width: itemWidth - 20,
    height: itemHeight,
    backgroundColor: 'green',
    borderRadius: 20,
  },
  textContainer: {
    position: 'absolute',
    bottom: 0,
    paddingTop: 15,
    paddingBottom: 15,
    paddingHorizontal: 15,
  },
  image: {
    borderRadius: 20,
    width: '100%',
    height: '100%',
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
