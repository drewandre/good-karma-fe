import React from 'react'

import Svg, { G, Path } from 'react-native-svg'

import Colors from '../../../styles/Colors'

export default ({ style, fill = Colors.white, size = 18 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18" style={style}>
      <G stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <G
          transform="translate(-15.000000, -57.000000)"
          fill={fill}
          fillRule="nonzero"
        >
          <G transform="translate(0.000000, 44.000000)">
            <Path d="M31.834476,13 C32.4809011,13 33,13.5276212 33,14.2074408 C33,14.5321308 32.8628795,14.8365276 32.6474045,15.0698985 L32.6474045,15.0698985 L25.7815867,22 L32.6474045,28.9301015 C32.8628795,29.1634724 33,29.4577227 33,29.7925592 C33,30.4723788 32.4809011,31 31.834476,31 C31.5112635,31 31.2370225,30.8782413 31.0215475,30.6550169 L31.0215475,30.6550169 L24,23.53 L16.9784525,30.6550169 C16.7629775,30.8782413 16.4887365,31 16.165524,31 C15.5190989,31 15,30.4723788 15,29.7925592 C15,29.4577227 15.1371205,29.1634724 15.3525955,28.9301015 L22.2184133,22 L15.3525955,15.0698985 C15.1371205,14.8365276 15,14.5321308 15,14.2074408 C15,13.5276212 15.5190989,13 16.165524,13 C16.4887365,13 16.7629775,13.1217587 16.9784525,13.3449831 L24,20.459 L31.0215475,13.3449831 C31.2062404,13.1536479 31.4341082,13.0368589 31.6989832,13.0073955 Z" />
          </G>
        </G>
      </G>
    </Svg>
  )
}
