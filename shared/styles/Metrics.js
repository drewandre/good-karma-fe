import { Dimensions } from 'react-native'

const { width: screenWidth, height: screenHeight } = Dimensions.get('screen')

const Metrics = {
  screenWidth,
  screenHeight,
}

export default Metrics
