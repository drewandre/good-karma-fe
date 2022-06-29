import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import FastImage from 'react-native-fast-image'
import { SharedElement } from 'react-navigation-shared-element'
import Colors from '../../styles/Colors'
import Metrics from '../../styles/Metrics'
import FPETouchable from '../FPETouchable'

function Article({ data, onPress }) {
  function handlePress() {
    onPress(data)
  }
  return (
    <FPETouchable
      onPress={handlePress}
      style={{
        marginBottom: 35,
        justifyContent: 'center',
        shadowColor: '#fff',
        shadowRadius: 15,
        shadowOpacity: 0.05,
        // shadowOffset: { height: 15 },
        borderRadius: 20,
      }}
    >
      <View
        style={{
          shadowColor: '#fff',
          shadowRadius: 6,
          shadowOpacity: 0.01,
          shadowOffset: { width: 15 },
          zIndex: 10,
        }}
      >
        <SharedElement id={`item.${data.id}.photo`}>
          <FastImage
            source={{ uri: data?.coverPhoto?.src }}
            style={styles.coverImage}
            resizeMode="cover"
          />
        </SharedElement>
      </View>
      <View style={styles.textContainer}>
        <SharedElement id={`item.${data.id}.text`}>
          <Text allowFontScaling={false} style={styles.articleTitle}>
            {data.title}
          </Text>
        </SharedElement>
        <SharedElement id={`item.${data.id}.author`}>
          <Text style={styles.articleSubtitle}>{data.author} • 7/26</Text>
        </SharedElement>
      </View>
    </FPETouchable>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'grey',
    borderRadius: 10,
    flexDirection: 'row',
    marginBottom: 15,
  },
  articleTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  articleSubtitle: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
  },
  coverImage: {
    width: Metrics.screenWidth * 0.5 - Metrics.defaultPadding,
    height: Metrics.screenWidth * 0.5 - Metrics.defaultPadding,
    borderRadius: 20,
  },
  textContainer: {
    position: 'absolute',
    width: Metrics.screenWidth * 0.5 - Metrics.defaultPadding,
    paddingHorizontal: Metrics.defaultPadding * 0.5,
    paddingVertical: 12,
    height: 160,
    backgroundColor: '#121212',
    alignSelf: 'flex-end',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
})

export default Article
