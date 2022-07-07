import { Dimensions } from 'react-native'
import deviceInfoModule from 'react-native-device-info'

const { width: screenWidth, height: screenHeight } = Dimensions.get('screen')

const Metrics = {
  screenWidth,
  screenHeight,
  defaultPadding: 20,
  hasNotch: deviceInfoModule.hasNotch(),
}

export default Metrics
