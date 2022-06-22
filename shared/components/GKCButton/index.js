import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'

function GKCButton({ title, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Text>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    minWidth: 150,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'pink',
  },
})

export default React.memo(GKCButton)
