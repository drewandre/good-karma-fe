import React from 'react'
import { StatusBar } from 'expo-status-bar'
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Login from './screens/Login'
import Home from './screens/Home'
import OnboardingModal from './screens/OnboardingModal'
import ArticleDetail from './screens/ArticleDetail'
import EventDetail from './screens/EventDetail'
import { connect } from 'react-redux'
import messaging from '@react-native-firebase/messaging'
import { Alert, useColorScheme } from 'react-native'

const Stack = createNativeStackNavigator()

function App({ authenticated }) {
  const scheme = useColorScheme()
  React.useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage))
    })

    return function cleanup() {
      unsubscribe?.()
    }
  }, [])

  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar style="auto" />
      <Stack.Navigator initialRouteName={!authenticated ? 'Home' : 'Login'}>
        <Stack.Group>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Home"
            component={Home}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ArticleDetail"
            component={ArticleDetail}
            options={{
              headerShown: false,
              // headerShown: false,
            }}
          />
        </Stack.Group>
        <Stack.Group screenOptions={{ presentation: 'modal' }}>
          <Stack.Screen
            name="OnboardingModal"
            component={OnboardingModal}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="EventDetail"
            component={EventDetail}
            options={
              {
                // headerShown: false,
              }
            }
          />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

function mapStateToProps({ session }) {
  return {
    authenticated: !!session?.user,
  }
}

export default connect(mapStateToProps)(App)
