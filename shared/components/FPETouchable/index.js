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
import * as Haptics from 'expo-haptics'

function FPETouchable({
  children,
  onPress,
  style = {},
  disabled = false,
  onPressInDelay = 0,
  haptic = false,
}) {
  const progress = useSharedValue(1)
  function scaleIn() {
    'worklet'
    cancelAnimation(progress)
    progress.value = withDelay(onPressInDelay, withTiming(0))
  }
  function scaleOut() {
    'worklet'
    cancelAnimation(progress)
    progress.value = withTiming(1)
  }
  function onActivated() {
    'worklet'
    cancelAnimation(progress)
    haptic && Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    progress.value = withTiming(1)
    onPress && onPress()
  }
  const animatedStyles = useAnimatedStyle(() => {
    if (style.transform) {
      return {
        transform: [
          ...style.transform,
          {
            scale: interpolate(progress.value, [0, 1], [0.98, 1]),
          },
        ],
      }
    } else {
      return {
        transform: [
          {
            scale: interpolate(progress.value, [0, 1], [0.98, 1]),
          },
        ],
      }
    }
  })
  return (
    <TapGestureHandler
      hitSlop={{
        top: 20,
        left: 20,
        right: 20,
        bottom: 20,
      }}
      enabled={!disabled}
      onBegan={scaleIn}
      onActivated={onActivated}
      onFailed={scaleOut}
      onCancelled={scaleOut}
      onEnded={scaleOut}
    >
      <Animated.View style={[style, animatedStyles]}>{children}</Animated.View>
    </TapGestureHandler>
  )
}

export default FPETouchable
