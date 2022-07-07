//@refresh reset
import { View, Text, Button, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import { setOnboardingModalPreviouslyShown } from '../../features/session/redux/sessionActions'
import OnboardingCarousel from '../../shared/components/OnboardingCarousel'

const { width: screenWidth } = Dimensions.get('screen')

const entries = [
  {
    title: 'Welcome to the Good Karma Family',
    subtitle: 'Some text about the company mission statement',
    buttonText: 'Get started',
    image: require('../../assets/warped-logo.png'),
  },
  {
    title: 'Our app keeps you connected with our community',
    subtitle: 'Some text about what you can do with the app',
    buttonText: 'Next',
    image: require('../../assets/warped-logo.png'),
  },
  {
    title: 'The best way to support the community is to stay active',
    subtitle: 'Some text about enabling push notifications',
    buttonText: 'Next',
    image: require('../../assets/warped-logo.png'),
  },
  {
    title: 'You are all set!',
    subtitle: 'An additional weclome message here',
    buttonText: 'Done',
    image: require('../../assets/warped-logo.png'),
  },
]

function OnboardingModal({ navigation, setOnboardingModalPreviouslyShown }) {
  function goBack() {
    setOnboardingModalPreviouslyShown(true)
    navigation.goBack()
  }
  return (
    <View style={{ flex: 1 }}>
      <OnboardingCarousel
        close={goBack}
        entries={entries}
        dotWidth={screenWidth / (entries.length + 3)}
      />
    </View>
  )
}

function mapStateToProps({}) {
  return {}
}

const mapDispatchToProps = {
  setOnboardingModalPreviouslyShown,
}

export default connect(mapStateToProps, mapDispatchToProps)(OnboardingModal)
