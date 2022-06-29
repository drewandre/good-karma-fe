import React from 'react'
import Animated, {
  cancelAnimation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated'
import { TapGestureHandler } from 'react-native-gesture-handler'

function FPETouchable({ children, onPress, style }) {
  const progress = useSharedValue(1)
  function scaleIn() {
    'worklet'
    cancelAnimation(progress)
    progress.value = withDelay(100, withTiming(0))
  }
  function scaleOut() {
    'worklet'
    cancelAnimation(progress)
    progress.value = withTiming(1)
  }
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ scale: interpolate(progress.value, [0, 1], [0.98, 1]) }],
    }
  })
  return (
    <TapGestureHandler
      onBegan={scaleIn}
      onActivated={onPress}
      onFailed={scaleOut}
      onCancelled={scaleOut}
      onEnded={scaleOut}
    >
      <Animated.View style={[style, animatedStyles]}>{children}</Animated.View>
    </TapGestureHandler>
  )
}

export default FPETouchable
