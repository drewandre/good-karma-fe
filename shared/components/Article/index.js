import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import FastImage from 'react-native-fast-image'
import Colors from '../../styles/Colors'
import Metrics from '../../styles/Metrics'

function Article({ data, onPress }) {
  function handlePress() {
    onPress(data)
  }
  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      <FastImage
        source={{ uri: data.coverPhoto.src }}
        style={styles.coverImage}
        resizeMode="cover"
      />
      <View style={styles.textContainer}>
        <Text>{data.title}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'grey',
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    backgroundColor: Colors.backgroundLight,
    marginBottom: 15,
  },
  coverImage: {
    width: Metrics.screenWidth * 0.3,
    height: 75,
    borderRadius: 10,
  },
  textContainer: {
    flex: 1,
    paddingLeft: 15,
  },
})

export default Article
