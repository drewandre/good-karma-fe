import React from 'react'

import Svg, { Path } from 'react-native-svg'

import Colors from '../../../styles/Colors'

function MapPin({ style, fill = Colors.icon, size = 24 }) {
  return (
    <Svg
      fill={fill}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      style={style}
    >
      <Path d="M 7 1 C 6.448 1 6 1.448 6 2 L 6 3 L 5 3 C 3.9 3 3 3.9 3 5 L 3 19 C 3 20.1 3.9 21 5 21 L 19 21 C 20.1 21 21 20.1 21 19 L 21 5 C 21 3.9 20.1 3 19 3 L 18 3 L 18 2 C 18 1.448 17.552 1 17 1 C 16.448 1 16 1.448 16 2 L 16 3 L 8 3 L 8 2 C 8 1.448 7.552 1 7 1 z M 5 8 L 19 8 L 19 18 C 19 18.552 18.552 19 18 19 L 6 19 C 5.448 19 5 18.552 5 18 L 5 8 z" />
    </Svg>
  )
}

export default MapPin
