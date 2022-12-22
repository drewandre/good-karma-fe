//@refresh reset
import { StatusBar } from 'expo-status-bar'
import { View, Image, Dimensions, StyleSheet } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { connect } from 'react-redux'
import {
  setOnboardingModalPreviouslyShown,
  setTopicSubscriptionStatusBegin,
  setTopicSubscriptionStatusSuccess,
  setTopicSubscriptionStatusError,
} from '../../features/session/redux/sessionActions'
import OnboardingCarousel from '../../shared/components/OnboardingCarousel'
import Colors from '../../shared/styles/Colors'
import BackArrow from '../../shared/components/svgs/BackArrow'
import FPETouchable from '../../shared/components/FPETouchable'
import Metrics from '../../shared/styles/Metrics'
import { requestPushNotificationPermissions } from '../../shared/helpers/pushNotifications'

const { width: screenWidth } = Dimensions.get('screen')

const entries = [
  {
    title: 'Good Karma Records',
    subtitle:
      'is a community owned record label built to empower web3 artist communities.',
    buttonText: 'Get started',
    image: require('../../assets/asset_1.png'),
  },
  {
    title: 'Our shared treasury',
    subtitle:
      'powers live events, artist marketing, music production, and more.',
    buttonText: 'Next',
    image: require('../../assets/warped-logo.png'),
  },
  {
    title: 'Our app was designed',
    subtitle:
      'to keep you in the loop with Good Karma Records events, blogs, and news.',
    buttonText: 'Next',
    image: require('../../assets/warped-logo.png'),
  },
  {
    title: 'Stay in touch',
    subtitle:
      'by enabling push notifications for the latest news and event reminders.',
    buttonText: 'Done',
    image: require('../../assets/warped-logo.png'),
  },
]

function OnboardingModal({
  navigation,
  setOnboardingModalPreviouslyShown,
  handleFinish,
  notificationTopics,
}) {
  function goBack() {
    setOnboardingModalPreviouslyShown(true)
    navigation.goBack()
  }
  const translationY = useSharedValue(0)
  const nextButtonVisibility = useSharedValue(0)
  const animatedBackgroundStyles = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      left: -100 + -translationY.value * 0.75,
      right: 0,
      height: '100%',
      resizeMode: 'cover',
    }
  })

  function onScroll(event) {
    const percentage =
      event.nativeEvent.contentOffset.x / event.nativeEvent.contentSize.width
    if (percentage > 0.7) {
      nextButtonVisibility.value = 1
    } else {
      nextButtonVisibility.value = 0
    }
    translationY.value = percentage * 1000
  }

  const animatedNextButtonStyles = useAnimatedStyle(() => {
    return {
      opacity: withTiming(nextButtonVisibility.value),
    }
  })

  async function handleFinish() {
    await requestPushNotificationPermissions({
      setTopicSubscriptionStatusBegin,
      setTopicSubscriptionStatusSuccess,
      setTopicSubscriptionStatusError,
      notificationTopics,
    })
    goBack()
  }
  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="light" />
      <Animated.Image
        source={require('../../assets/asset_1.png')}
        style={animatedBackgroundStyles}
      />
      <Animated.View style={[animatedNextButtonStyles, styles.nextArrow]}>
        <FPETouchable haptic onPress={handleFinish}>
          <BackArrow fill={Colors.white} style={styles.nextArrowIcon} />
        </FPETouchable>
      </Animated.View>
      <Image
        source={require('../../assets/warped-logo.png')}
        style={{
          position: 'absolute',
          top: Metrics.hasNotch ? 50 : Metrics.defaultPadding,
          tintColor: Colors.white,
          width: 100,
          height: 100,
          resizeMode: 'contain',
          left: Metrics.defaultPadding,
        }}
      />
      <OnboardingCarousel
        close={goBack}
        onScroll={onScroll}
        entries={entries}
        dotWidth={screenWidth / (entries.length + 3)}
      />
    </View>
  )
}
const styles = StyleSheet.create({
  nextArrow: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 100,
    height: 45,
    width: 45,
    zIndex: 100,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: Metrics.hasNotch ? 34 : Metrics.defaultPadding,
    right: Metrics.defaultPadding,
  },
  nextArrowIcon: {
    transform: [{ rotate: '180deg' }],
  },
})

function mapStateToProps({ session }) {
  return {
    notificationTopics: session.notificationTopics,
  }
}

const mapDispatchToProps = {
  setOnboardingModalPreviouslyShown,
}

export default connect(mapStateToProps, mapDispatchToProps)(OnboardingModal)
