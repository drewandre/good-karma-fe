import React from 'react'

import Svg, { Path } from 'react-native-svg'

import Colors from '../../../styles/Colors'

function Home({ style, fill = Colors.icon }) {
  return (
    <Svg width="27" height="27" viewBox="0 0 27 27" fill="none" style={style}>
      <Path
        d="M 15 2 A 1 1 0 0 0 14.300781 2.2851562 L 3.3925781 11.207031 A 1 1 0 0 0 3.3554688 11.236328 L 3.3183594 11.267578 L 3.3183594 11.269531 A 1 1 0 0 0 3 12 A 1 1 0 0 0 4 13 L 5 13 L 5 24 C 5 25.105 5.895 26 7 26 L 23 26 C 24.105 26 25 25.105 25 24 L 25 13 L 26 13 A 1 1 0 0 0 27 12 A 1 1 0 0 0 26.681641 11.267578 L 26.666016 11.255859 A 1 1 0 0 0 26.597656 11.199219 L 23 8.2558594 L 23 4 C 23 3.448 22.552 3 22 3 L 21 3 C 20.448 3 20 3.448 20 4 L 20 5.8027344 L 15.677734 2.2675781 A 1 1 0 0 0 15 2 z M 12 16 L 18 16 L 18 24 L 12 24 L 12 16 z"
        fill={fill}
      />
    </Svg>
  )
}

export default Home
