import React from 'react'

import Svg, { Path } from 'react-native-svg'

import Colors from '../../../styles/Colors'

function Calendar({ style, fill = Colors.icon }) {
  return (
    <Svg width="35" height="36" viewBox="0 0 35 36" fill="none" style={style}>
      <Path
        d="M22.8468 11.4274H22.1331V10H20.7057V11.4274H13.5686V10H12.1411V11.4274H11.4274C10.6423 11.4274 10 12.0698 10 12.8548V24.2742C10 25.0593 10.6423 25.7017 11.4274 25.7017H22.8468C23.6319 25.7017 24.2742 25.0593 24.2742 24.2742V12.8548C24.2742 12.0698 23.6319 11.4274 22.8468 11.4274ZM22.8468 24.2742H11.4274V14.996H22.8468V24.2742Z"
        fill={fill}
      />
    </Svg>
  )
}

export default Calendar
