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
// import { CardStyleInterpolators } from '@react-navigation/stack'

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
  const navigatorRef = React.useRef(null)

  React.useEffect(() => {
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        console.log(
          'App was launched from a notification',
          JSON.stringify(remoteMessage)
        )
        navigatorRef.current?.navgigate?.('ArticleDetail', {
          id: remoteMessage?.data?.id,
        })
      })

    const unsubscribe = messaging().onMessage((remoteMessage) => {
      console.log(
        'App received push notification while in background',
        JSON.stringify(remoteMessage)
      )
      navigatorRef.current?.navgigate?.('ArticleDetail', {
        id: remoteMessage?.data?.id,
      })
      /*
        {
          messageId: '1656520938997820',
          data: { type: 'article', id: '3iDcn3NhX6bjZ8f4SYHZIM' },
          notification: {
            body: 'Check out the body here.',
            title: 'A new article is ready to view!'
          },
          from: '872723978139'
        }
      */
    })

    return function cleanup() {
      unsubscribe?.()
    }
  }, [])

  const setNavigatorRef = React.useCallback((ref) => {
    navigatorRef.current = ref
  }, [])

  return (
    <NavigationContainer
      theme={scheme === 'dark' ? DarkTheme : DefaultTheme}
      ref={setNavigatorRef}
    >
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
