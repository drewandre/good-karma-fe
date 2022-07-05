import React from 'react'
import { StyleSheet, Text } from 'react-native'
import Colors from '../../styles/Colors'
import FPETouchable from '../FPETouchable'

function GKCButton({ title, onPress, style }) {
  return (
    <FPETouchable onPress={onPress} style={[styles.container, style]}>
      <Text style={styles.text}>{title}</Text>
    </FPETouchable>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,
    padding: 10,
    borderRadius: 10,
    backgroundColor: Colors.yellow,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
  },
  text: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
})

export default React.memo(GKCButton)
