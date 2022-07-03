import React from 'react'
import { WebView } from 'react-native-webview'

function WebviewModal({ navigation, route }) {
  function onNavigationStateChange({ title }) {
    navigation.setParams({
      headerTitle: title,
    })
  }
  return (
    <WebView
      source={{ uri: route?.params?.uri }}
      onNavigationStateChange={onNavigationStateChange}
    />
  )
}

export default WebviewModal
