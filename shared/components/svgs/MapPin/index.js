import React from 'react'

import Svg, { Path } from 'react-native-svg'

import Colors from '../../../styles/Colors'

function MapPin({ style, fill = Colors.icon, size = 30 }) {
  return (
    <Svg
      fill={fill}
      viewBox="0 0 30 30"
      width={size}
      height={size}
      style={style}
    >
      <Path d="M 3 5 C 2.448 5 2 5.448 2 6 L 2 22 C 2 22.466 2.3258125 22.840172 2.7578125 22.951172 L 9 24.753906 L 9 6.7089844 L 3.3945312 5.0664062 C 3.2625312 5.0244063 3.14 5 3 5 z M 19 5.1855469 L 11 6.7988281 L 11 24.796875 L 19 23.199219 L 19 5.1855469 z M 21 5.25 L 21 23.292969 L 26.681641 24.935547 C 26.782641 24.969547 26.887 25 27 25 C 27.552 25 28 24.552 28 24 L 28 8 C 28 7.525 27.65975 7.1799219 27.21875 7.0449219 L 21 5.25 z" />
    </Svg>
  )
}

export default MapPin
