import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import FastImage from 'react-native-fast-image'
import { SharedElement } from 'react-navigation-shared-element'
import Colors from '../../styles/Colors'
import Metrics from '../../styles/Metrics'
import FPETouchable from '../FPETouchable'
import { LinearGradient } from 'expo-linear-gradient'
import moment from 'moment'

function Article({ data, onPress }) {
  function handlePress() {
    onPress(data)
  }
  return (
    <FPETouchable onPress={handlePress} style={styles.container}>
      <View style={styles.innerContainer}>
        <SharedElement id={`item.${data.id}.photo`}>
          <View style={styles.coverImage}>
            <FastImage
              source={{ uri: data?.coverPhoto?.src }}
              style={{ width: '100%', height: '100%', borderRadius: 20 }}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,1)']}
              style={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                height: '50%',
                borderRadius: 20,
              }}
            />
          </View>
        </SharedElement>
      </View>
      <View style={styles.textContainer}>
        <SharedElement id={`item.${data.id}.text`}>
          <Text
            // maxFontSizeMultiplier={1.2}
            numberOfLines={4}
            adjustsFontSizeToFit
            style={styles.articleTitle}
          >
            {data.title}
          </Text>
        </SharedElement>
        <Text
          // maxFontSizeMultiplier={1.2}
          numberOfLines={2}
          adjustsFontSizeToFit
          style={styles.articleSubtitle}
        >
          {data.author.name} • {moment(data.createdAt).format('M/D')}
        </Text>
      </View>
    </FPETouchable>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 35,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowRadius: 5,
    shadowOpacity: 0.2,
    shadowOffset: { height: 5, width: 5 },
    borderRadius: 20,
  },
  innerContainer: {
    shadowColor: '#fff',
    shadowRadius: 6,
    shadowOpacity: 0.01,
    shadowOffset: { width: 15 },
    zIndex: 10,
  },
  articleTitle: {
    height: 90,
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
    width: Metrics.screenWidth * 0.5,
    paddingRight: Metrics.defaultPadding * 0.5,
    paddingLeft: Metrics.defaultPadding * 1.5,
    paddingVertical: 12,
    height: 150,
    backgroundColor: Colors.backgroundLight,
    justifyContent: 'space-between',
    alignSelf: 'flex-end',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
})

export default Article
