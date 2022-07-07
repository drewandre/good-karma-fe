import React from 'react'
import { WebView } from 'react-native-webview'
import Colors from '../../shared/styles/Colors'

function WebviewModal({ navigation, route }) {
  function onNavigationStateChange({ title }) {
    navigation.setParams({
      headerTitle: title,
    })
  }
  return (
    <WebView
      source={{ uri: route?.params?.uri }}
      style={{
        backgroundColor: Colors.backgroundLight,
      }}
      onNavigationStateChange={onNavigationStateChange}
    />
  )
}

export default WebviewModal
