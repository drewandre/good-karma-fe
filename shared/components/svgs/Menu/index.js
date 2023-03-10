import React from 'react'

import Svg, { Path } from 'react-native-svg'

import Colors from '../../../styles/Colors'

function Calendar({ style, fill = Colors.white, size = 30 }) {
  return (
    <Svg
      fill={fill}
      viewBox="0 0 30 30"
      width={size}
      height={size}
      style={style}
    >
      <Path d="M 3 7 A 1.0001 1.0001 0 1 0 3 9 L 27 9 A 1.0001 1.0001 0 1 0 27 7 L 3 7 z M 3 14 A 1.0001 1.0001 0 1 0 3 16 L 27 16 A 1.0001 1.0001 0 1 0 27 14 L 3 14 z M 3 21 A 1.0001 1.0001 0 1 0 3 23 L 27 23 A 1.0001 1.0001 0 1 0 27 21 L 3 21 z" />
    </Svg>
  )
}

export default Calendar
