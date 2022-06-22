import React from 'react'
import { StyleSheet } from 'react-native'

import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated'

function clamp(value, lowerBound, upperBound) {
  'worklet'
  return Math.min(Math.max(lowerBound, value), upperBound)
}

const DEFAULT_SIZE = 10

function AnimatedDot({ index, style, progress, multiplier, scaleDots }) {
  const animatedStyles = useAnimatedStyle(() => {
    const opacity = interpolate(
      clamp(progress.value, 0, 1 - multiplier),
      [
        index * multiplier - multiplier,
        index * multiplier,
        index * multiplier + multiplier,
      ],
      [0.25, 1, 0.25],
      Extrapolate.CLAMP
    )
    return {
      opacity,
      transform: [
        {
          scale: scaleDots ? interpolate(opacity, [0.25, 1], [0.5, 1]) : 1,
        },
      ],
    }
  })
  return (
    <Animated.View
      key={`onboarding-pagination-dot-${index}`}
      style={[style, animatedStyles]}
    />
  )
}

function Pagination({
  progress,
  numberOfPages,
  fadeAtEnd = false,
  scaleDots = false,
  dotStyles = {},
  dotWidth = DEFAULT_SIZE,
  containerStyles = {},
  size = 'md',
}) {
  const multiplier = 1 / numberOfPages

  const animatedDotContainerStyles = useAnimatedStyle(() => {
    return {
      opacity: fadeAtEnd
        ? numberOfPages -
          1 -
          clamp(progress.value, 0, 1 - multiplier) * numberOfPages
        : 1,
    }
  })

  function returnSize(width) {
    switch (size) {
      case 'sm':
        return {
          width: width * 0.8,
          height: DEFAULT_SIZE * 0.8,
        }
      case 'lg':
        return {
          width: width * 1.2,
          height: DEFAULT_SIZE * 1.2,
        }
      default:
        return {
          width: width,
          height: DEFAULT_SIZE,
        }
    }
  }

  function renderDots() {
    let dots = []
    for (let i = 0; i < numberOfPages; i++) {
      dots.push(
        <AnimatedDot
          key={`palette-pagination-${i}`}
          index={i}
          scaleDots={scaleDots}
          multiplier={multiplier}
          progress={progress}
          style={[styles.dotStyle, dotStyles, returnSize(dotWidth)]}
          size={size}
        />
      )
    }
    return dots
  }

  return (
    <Animated.View
      style={[styles.dotContainer, containerStyles, animatedDotContainerStyles]}
    >
      {renderDots()}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  dotContainer: {
    paddingVertical: 15,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  dotStyle: {
    width: DEFAULT_SIZE,
    height: DEFAULT_SIZE,
    borderRadius: 50,
    marginHorizontal: 5,
    padding: 0,
    backgroundColor: 'red',
  },
})

export default Pagination
