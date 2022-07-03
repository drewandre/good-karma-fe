import React from 'react'

import Svg, { Path, G } from 'react-native-svg'

import Colors from '../../../styles/Colors'

function DownArrow({ style, fill = Colors.white }) {
  return (
    <Svg
      width="10"
      height="18"
      viewBox="0 0 10 18"
      style={[
        {
          transform: [
            {
              rotate: '270deg',
            },
          ],
        },
        style,
      ]}
    >
      <G stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <G
          transform="translate(-15.000000, -57.000000)"
          fill={fill}
          fillRule="nonzero"
        >
          <G transform="translate(0.000000, 44.000000)">
            <Path d="M23.834476,31 C24.4809011,31 25,30.4723788 25,29.7925592 C25,29.4577227 24.8628795,29.1634724 24.6474045,28.9301015 L17.7815867,22 L24.6474045,15.0698985 C24.8628795,14.8365276 25,14.5321308 25,14.2074408 C25,13.5276212 24.4809011,13 23.834476,13 C23.5112635,13 23.2370225,13.1217587 23.0215475,13.3449831 L15.4015671,21.0665163 C15.1273262,21.3404735 15,21.6448703 15,22 C15,22.3551297 15.1273262,22.6595265 15.4015671,22.9233371 L23.0215475,30.6550169 C23.2370225,30.8782413 23.5112635,31 23.834476,31 Z" />
          </G>
        </G>
      </G>
    </Svg>
  )
}

export default DownArrow
