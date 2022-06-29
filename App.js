import React from 'react'
import { StatusBar } from 'expo-status-bar'
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native'
import Login from './screens/Login'
import Home from './screens/Home'
import OnboardingModal from './screens/OnboardingModal'
import Settings from './screens/Settings'
import ArticleDetail from './screens/ArticleDetail'
import EventDetail from './screens/EventDetail'
import { connect } from 'react-redux'
import messaging from '@react-native-firebase/messaging'
import { Alert, useColorScheme, Platform, Animated } from 'react-native'
import { createSharedElementStackNavigator } from 'react-navigation-shared-element'
import { CardStyleInterpolators } from '@react-navigation/stack'

const Stack = createSharedElementStackNavigator()

function customFade(ref) {
  let {
    current,
    inverted,
    layouts: { screen },
  } = ref
  const translateY = Animated.multiply(
    current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [screen.height, 0],
      extrapolate: 'clamp',
    }),
    inverted
  )
  return {
    cardStyle: {
      backgroundColor: '#000',
      opacity: current.progress,
      transform: [
        {
          translateY,
        },
      ],
    },
  }
}

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
      <Stack.Navigator
        initialRouteName={/* !authenticated ? 'Home' : 'Login' */ 'Home'}
      >
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
            presentation: 'modal',
            headerShown: false,
            cardStyle: {
              backgroundColor: '#000',
            },
            cardStyleInterpolator: Platform.select({
              ios: customFade,
              android: customFade,
              // android: CardStyleInterpolators.forRevealFromBottomAndroid,
            }),
          }}
          sharedElements={(route, otherRoute, showing) => {
            const { id } = route.params
            return [
              { id: `item.${id}.photo` },
              { id: `item.${id}.text`, animation: 'fade' },
              { id: `item.${id}.author`, animation: 'fade' },
            ]
          }}
        />
        <Stack.Screen
          name="OnboardingModal"
          component={OnboardingModal}
          options={{
            presentation: 'modal',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{
            presentation: 'modal',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="EventDetail"
          component={EventDetail}
          options={{
            headerTitle: 'Event Detail',
            // headerShown: false,
          }}
        />
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
