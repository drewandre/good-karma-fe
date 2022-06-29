import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import Colors from '../../styles/Colors'

function GKCButton({ title, onPress, style }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, style]}>
      <Text>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,
    padding: 10,
    borderRadius: 10,
    backgroundColor: Colors.backgroundLight,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
  },
})

export default React.memo(GKCButton)
