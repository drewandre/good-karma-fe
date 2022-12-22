import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import Colors from '../../styles/Colors'
import FPETouchable from '../FPETouchable'

function GKCButton({ title, onPress, style, children }) {
  return (
    <FPETouchable haptic onPress={onPress} style={[styles.container, style]}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {children}
      </View>
    </FPETouchable>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 175,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.yellow,
  },
  text: {
    fontWeight: 'bold',
    // textTransform: 'uppercase',
  },
})

export default React.memo(GKCButton)
