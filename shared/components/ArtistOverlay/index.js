import React from 'react'

import {
  Text,
  ActivityIndicator,
  StyleSheet,
  Image,
  View,
  Linking,
} from 'react-native'
import FastImage from 'react-native-fast-image'
import { connect } from 'react-redux'
import Colors from '../../styles/Colors'
import Metrics from '../../styles/Metrics'
import { LinearGradient } from 'expo-linear-gradient'
import FPETouchable from '../FPETouchable'

function ArtistOverlay({ artistOverlay }) {
  function handleSoundCloudTap() {
    if (artistOverlay?.soundCloudUrl) {
      Linking.openURL(artistOverlay?.soundCloudUrl)
    }
  }

  function handleSpotifyTap() {
    if (artistOverlay?.spotifyUrl) {
      Linking.openURL(artistOverlay?.spotifyUrl)
    }
  }
  return (
    <View style={styles.container}>
      {artistOverlay ? (
        <View style={{ width: '100%', height: Metrics.screenHeight * 0.5 }}>
          <FastImage
            source={{ uri: artistOverlay.coverPhoto.src }}
            style={{
              position: 'absolute',
              width: '100%',
              height: Metrics.screenHeight * 0.5,
            }}
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,1)']}
            style={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              height: Metrics.screenHeight * 0.3,
            }}
          />
          <View style={styles.artistInfoContainer}>
            <Text
              maxFontSizeMultiplier={global.maxFontSizeMultiplier}
              style={styles.titleText}
            >
              {artistOverlay.name}
            </Text>
            {artistOverlay.spotifyUrl || artistOverlay.soundCloudUrl ? (
              <View style={styles.mediaContainer}>
                {artistOverlay.spotifyUrl ? (
                  <FPETouchable onPress={handleSpotifyTap} haptic>
                    <Image
                      source={require('../../../assets/spotify-button.png')}
                      style={{
                        width: Metrics.screenWidth * 0.3,
                        height: 50,
                        resizeMode: 'contain',
                      }}
                    />
                  </FPETouchable>
                ) : null}
                {artistOverlay.soundCloudUrl ? (
                  <FPETouchable onPress={handleSoundCloudTap} haptic>
                    <Image
                      source={require('../../../assets/soundcloud-button.png')}
                      style={{
                        marginLeft: Metrics.defaultPadding * 0.5,
                        width: Metrics.screenWidth * 0.3,
                        height: 50,
                        resizeMode: 'contain',
                      }}
                    />
                  </FPETouchable>
                ) : null}
              </View>
            ) : null}
          </View>
        </View>
      ) : (
        <ActivityIndicator />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: Colors.background,
  },
  titleText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: Colors.white,
  },
  artistInfoContainer: {
    position: 'absolute',
    bottom: 40,
    left: Metrics.defaultPadding,
  },
  mediaContainer: {
    paddingTop: Metrics.defaultPadding * 0.25,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})

const mapDispatchToProps = {}

function mapStateToProps({ content }) {
  return {
    artistOverlay: content.artistOverlay,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ArtistOverlay)
