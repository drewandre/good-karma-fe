//@refresh reset
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
import WebviewModal from './screens/WebviewModal'
import EventDetail from './screens/EventDetail'
import { connect } from 'react-redux'
import messaging from '@react-native-firebase/messaging'
import {
  Animated as RNAnimated,
  StyleSheet,
  useColorScheme,
  Platform,
  View,
  Text,
} from 'react-native'
import { createSharedElementStackNavigator } from 'react-navigation-shared-element'
import Colors from './shared/styles/Colors'
import dynamicLinks from '@react-native-firebase/dynamic-links'
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet'
import { setArtistOverlay } from './features/content/redux/contentActions'
import ArtistOverlay from './shared/components/ArtistOverlay'
import Close from './shared/components/svgs/Close'
import FPETouchable from './shared/components/FPETouchable'
import Metrics from './shared/styles/Metrics'
import UpArrow from './shared/components/svgs/DownArrow'

const Stack = createSharedElementStackNavigator()

function customFade(ref) {
  let {
    current,
    inverted,
    layouts: { screen },
  } = ref
  const translateY = RNAnimated.multiply(
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

function App({
  /* authenticated */
  artistOverlay,
  setArtistOverlay,
}) {
  const scheme = useColorScheme()
  const navigatorRef = React.useRef(null)
  const bottomSheetRef = React.useRef(null)

  const snapPoints = React.useMemo(() => ['50%'], [])

  const handleDynamicLink = (link) => {
    console.log('Received a dynamic link!', link)
    // Handle dynamic link inside your own application
    // if (link.url === 'https://invertase.io/offer') {}
  }

  React.useEffect(() => {
    const deeplinkUnsubscribe = dynamicLinks().onLink(handleDynamicLink)

    dynamicLinks()
      .getInitialLink()
      .then((link) => {
        // if (link.url === 'https://invertase.io/offer') {}
        console.log('Initial link!', link)
      })
      .catch((error) => {
        console.error('Could not retrieve initial dynamic link', error)
      })

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
      deeplinkUnsubscribe?.()
    }
  }, [])

  const setNavigatorRef = React.useCallback((ref) => {
    navigatorRef.current = ref
  }, [])

  function renderArtistOverlay() {
    if (artistOverlay) {
      return <ArtistOverlay />
    } else {
      return null
    }
  }

  function handleBottomSheetChange(index) {
    if (index === -1) {
      setArtistOverlay(null)
    }
  }

  const closeBottomSheet = React.useCallback(() => {
    bottomSheetRef.current.close()
  }, [])

  const renderBackdrop = React.useCallback(
    (props) => (
      <BottomSheetBackdrop
        opacity={0.75}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        {...props}
      />
    ),
    []
  )

  return (
    <View style={styles.container}>
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
              if (otherRoute?.name !== 'WebviewModal') {
                return [
                  { id: `item.${id}.photo` },
                  { id: `item.${id}.text`, animation: 'fade' },
                  { id: `item.${id}.author`, animation: 'fade' },
                ]
              } else {
                return []
              }
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
              headerTintColor: '#fff',
              presentation: 'modal',
              headerTitleStyle: {},
              headerStyle: {
                backgroundColor: 'transparent',
              },
              headerBackImage: () => <UpArrow style={styles.modalDownArrow} />,
              headerBackgroundContainerStyle: {
                backgroundColor: Colors.background,
              },
              headerTitle: 'Notification Settings',
              headerBackTitleVisible: false,
            }}
          />
          <Stack.Screen
            name="WebviewModal"
            component={WebviewModal}
            options={({ navigation, route }) => {
              return {
                headerTintColor: '#fff',
                presentation: 'modal',
                headerTitleStyle: {},
                headerStyle: {
                  backgroundColor: 'transparent',
                },
                headerBackImage: () => (
                  <UpArrow style={styles.modalDownArrow} />
                ),
                headerBackgroundContainerStyle: {
                  backgroundColor: Colors.background,
                },
                headerTitle: () => {
                  return (
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 16,
                        fontWeight: 'bold',
                        paddingHorizontal: Metrics.defaultPadding,
                      }}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {route?.params?.headerTitle || 'Loading...'}
                    </Text>
                  )
                },
                headerBackTitleVisible: false,
              }
            }}
          />
          <Stack.Screen
            name="EventDetail"
            component={EventDetail}
            options={{
              headerTitle: 'Event Detail',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        index={artistOverlay ? 0 : -1}
        animateOnMount
        enablePanDownToClose
        style={{
          shadowColor: Colors.black,
          shadowOpacity: 0.5,
          shadowRadius: 30,
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
          overflow: 'hidden',
        }}
        handleStyle={{
          position: 'absolute',
          width: '100%',
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
          overflow: 'hidden',
          backgroundColor: 'transparent',
        }}
        handleIndicatorStyle={{
          backgroundColor: Colors.white,
        }}
        backgroundStyle={{
          backgroundColor: Colors.background,
        }}
        enableTouchOutsideToClose
        handleComponent={() => (
          <FPETouchable
            hitSlop={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
            onPress={closeBottomSheet}
            style={styles.close}
          >
            <Close size={16} fill="rgba(255,255,255,0.9)" />
          </FPETouchable>
        )}
        backdropComponent={renderBackdrop}
        onChange={handleBottomSheetChange}
      >
        {renderArtistOverlay()}
      </BottomSheet>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  close: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 100,
    height: 45,
    width: 45,
    justifyContent: 'center',
    alignItems: 'center',
    top: Metrics.defaultPadding,
    right: Metrics.defaultPadding,
  },
  modalDownArrow: {
    marginLeft: Metrics.defaultPadding,
  },
})

function mapStateToProps({ session, content }) {
  return {
    authenticated: !!session?.user,
    artistOverlay: content.artistOverlay,
  }
}

const mapDispatchToProps = {
  setArtistOverlay,
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
