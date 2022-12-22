import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Colors from '../../styles/Colors'
import Metrics from '../../styles/Metrics'
import Info from '../../components/svgs/Info'
import FPETouchable from '../FPETouchable'

const LIGHT_COLOR = Colors.white
const BACKGROUND_COLOR = Colors.backgroundLight
const BORDER_COLOR = LIGHT_COLOR

function NewsAlert({ data, navigation }) {
  if (!data) {
    console.warn('Rendering null news item')
    return null
  }
  function handleLinkPress() {
    if (data.link) {
      navigation.navigate('WebviewModal', { uri: data.link })
    }
  }
  return (
    <FPETouchable disabled={!data.link} onPress={handleLinkPress}>
      <View style={styles.container}>
        <Info fill={LIGHT_COLOR} style={styles.icon} />
        <Text
          maxFontSizeMultiplier={global.maxFontSizeMultiplier}
          style={styles.title}
        >
          {data.title}
        </Text>
      </View>
    </FPETouchable>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: Metrics.defaultPadding,
    flexDirection: 'row',
    alignItems: 'center',
    // borderRadius: 20,
    // borderWidth: 2,
    backgroundColor: BACKGROUND_COLOR,
    borderColor: BORDER_COLOR,
  },
  icon: {
    marginRight: Metrics.defaultPadding,
  },
  title: {
    flex: 1,
    fontSize: 16,
    color: LIGHT_COLOR,
  },
})

export default NewsAlert
