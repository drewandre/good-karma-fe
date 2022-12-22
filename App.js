//@refresh reset
import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
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
  Platform,
  View,
  Text,
  Image,
  ScrollView,
  SafeAreaView,
  Animated,
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
import DownArrow from './shared/components/svgs/DownArrow'
import Menu from './shared/components/svgs/Menu'
import * as SplashScreen from 'expo-splash-screen'
import { createDrawerNavigator } from '@react-navigation/drawer'
import Gear from './shared/components/svgs/Gear'
import HomeIcon from './shared/components/svgs/Home'
import { CardStyleInterpolators } from '@react-navigation/stack'
import deviceInfoModule from 'react-native-device-info'

const APP_VERSION = deviceInfoModule.getVersion()
const BUILD_NUMBER = deviceInfoModule.getBuildNumber()

const forFade = ({ current, next }) => {
  const opacity = Animated.add(
    current.progress,
    next ? next.progress : 0
  ).interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0, 1, 0],
  })

  return {
    leftButtonStyle: { opacity },
    rightButtonStyle: { opacity },
    titleStyle: { opacity },
    backgroundStyle: { opacity },
  }
}

const Stack = createSharedElementStackNavigator()
const Drawer = createDrawerNavigator()

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

function MyStack() {
  const logo = React.useMemo(() => {
    return (
      <Image
        source={require('./assets/warped-logo-yellow.png')}
        style={styles.logo}
      />
    )
  }, [])
  return (
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
        options={({ navigation }) => ({
          headerStyleInterpolator: forFade,
          headerStyle: {
            shadowOpacity: 0.4,
            backgroundColor: Colors.background,
          },
          headerLeft: () => {
            return (
              <FPETouchable
                haptic
                style={{ marginHorizontal: Metrics.defaultPadding }}
                onPress={() => {
                  navigation.openDrawer()
                }}
              >
                <Menu fill={Colors.white} />
              </FPETouchable>
            )
          },
          headerTitle: () => {
            return logo
          },
        })}
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
          cardStyleInterpolator:
            CardStyleInterpolators.forFadeFromBottomAndroid,
          gestureEnabled: false,
          presentation: 'transparentModal',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{
          headerTintColor: '#fff',
          // presentation: 'modal',
          headerTitleStyle: {},
          headerStyle: {
            shadowOpacity: 0.4,
            backgroundColor: Colors.background,
          },
          headerBackImage: () => <DownArrow style={styles.modalDownArrow} />,
          headerBackgroundContainerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitle: 'Settings',
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
            headerBackImage: () => <DownArrow style={styles.modalDownArrow} />,
            headerBackgroundContainerStyle: {
              backgroundColor: Colors.background,
            },
            headerTitle: () => {
              return (
                <Text
                  maxFontSizeMultiplier={global.maxFontSizeMultiplier}
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
          cardStyle: {
            backgroundColor: Colors.black,
          },
          headerStyleInterpolator: forFade,
          headerTransparent: true,
          headerTitle: '',
          headerBackTitleVisible: false,
          headerBackImage: () => null,
          // headerShown: false,
        }}
      />
    </Stack.Navigator>
  )
}

function CustomDrawerContent(props) {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        shadowColor: '#000',
        shadowOpacity: 1,
        shadowRadius: 10,
      }}
    >
      <ScrollView
        {...props}
        style={{
          padding: Metrics.defaultPadding,
        }}
      >
        <Image
          source={require('./assets/gkc-face.png')}
          style={{
            alignSelf: 'center',
            width: 50,
            height: 50,
            marginBottom: Metrics.defaultPadding,
            resizeMode: 'contain',
            tintColor: Colors.yellow,
          }}
        />
        {/* <Text
          maxFontSizeMultiplier={global.maxFontSizeMultiplier}
          style={{
            textAlign: 'center',
            paddingTop: Metrics.defaultPadding,
            color: 'rgba(255,255,255,0.5)',
          }}
        >
          Good Karma Club v{DEVICE_VERSION}
        </Text>
        <Text
          maxFontSizeMultiplier={global.maxFontSizeMultiplier}
          style={{
            textAlign: 'center',
            paddingBottom: Metrics.defaultPadding,
            color: 'rgba(255,255,255,0.5)',
          }}
        >
          © Good Karma Records {new Date().getFullYear()}
        </Text> */}
        <FPETouchable
          style={styles.drawerMenuItemContainer}
          onPress={() => {
            props.navigation.closeDrawer()
            setTimeout(() => props.navigation.navigate('Home'), 200)
          }}
        >
          <View style={{ flexDirection: 'row' }}>
            <HomeIcon fill={Colors.white} style={{ width: 50 }} />
            <Text
              maxFontSizeMultiplier={global.maxFontSizeMultiplier}
              style={styles.drawerMenuItemText}
            >
              Home
            </Text>
          </View>
        </FPETouchable>
        <FPETouchable
          style={styles.drawerMenuItemContainer}
          onPress={() => {
            props.navigation.closeDrawer()
            setTimeout(() => props.navigation.navigate('Settings'), 200)
          }}
        >
          <View style={{ flexDirection: 'row' }}>
            <Gear fill={Colors.white} style={{ width: 50 }} />
            <Text
              maxFontSizeMultiplier={global.maxFontSizeMultiplier}
              style={styles.drawerMenuItemText}
            >
              Settings
            </Text>
          </View>
        </FPETouchable>
      </ScrollView>
      <Text
        maxFontSizeMultiplier={global.maxFontSizeMultiplier}
        style={{
          textAlign: 'center',
          color: 'rgba(255,255,255,0.7)',
          fontSize: 12,
        }}
      >
        Version {APP_VERSION} #{BUILD_NUMBER}
      </Text>
      <Text
        maxFontSizeMultiplier={global.maxFontSizeMultiplier}
        style={{
          textAlign: 'center',
          color: 'rgba(255,255,255,0.7)',
          fontSize: 12,
        }}
      >
        © Good Karma Records {new Date().getFullYear()}
      </Text>
    </SafeAreaView>
  )
}

function App({
  /* authenticated */
  artistOverlay,
  setArtistOverlay,
}) {
  const navigatorRef = React.useRef(null)
  const bottomSheetRef = React.useRef(null)

  const snapPoints = React.useMemo(() => ['50%'], [])

  const handleDynamicLink = (link) => {
    console.log('Received a dynamic link!', link)
    // Handle dynamic link inside your own application
    // if (link.url === 'https://invertase.io/offer') {}
  }

  React.useEffect(() => {
    async function hideSplash() {
      SplashScreen.hideAsync().catch(console.warn)
    }
    setTimeout(hideSplash, 500)

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

  const navTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: Colors.background,
    },
  }

  return (
    <View style={styles.container}>
      <NavigationContainer theme={navTheme} ref={setNavigatorRef}>
        <StatusBar style="auto" />
        <Drawer.Navigator
          initialRouteName="DrawerHome"
          drawerContent={(props) => <CustomDrawerContent {...props} />}
          screenOptions={{
            headerShown: false,
            drawerType: 'back',
            drawerActiveBackgroundColor: Colors.backgroundLight,
            drawerLabelStyle: {
              fontSize: 16,
              color: Colors.white,
            },
            drawerContentStyle: {
              shadowColor: '#000',
              shadowOpacity: 1,
              shadowRadius: 10,
            },
            drawerStyle: {
              shadowColor: '#000',
              shadowOpacity: 1,
              shadowRadius: 10,
              backgroundColor: Colors.backgroundLight,
              width: 240,
            },
          }}
        >
          <Drawer.Screen name="DrawerHome" component={MyStack} />
        </Drawer.Navigator>
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
            haptic
            onPress={closeBottomSheet}
            style={styles.close}
          >
            <Close size={16} fill="#fff" />
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
    backgroundColor: Colors.black,
    flex: 1,
  },
  close: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 100,
    height: 45,
    width: 45,
    justifyContent: 'center',
    alignItems: 'center',
    top: Metrics.defaultPadding,
    right: Metrics.defaultPadding,
  },
  modalDownArrow: {
    transform: [{ rotate: '0deg' }],
    marginLeft: Metrics.defaultPadding,
  },
  drawerMenuItemText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 22,
    marginLeft: Metrics.defaultPadding,
  },
  drawerMenuItemContainer: {
    padding: Metrics.defaultPadding * 0.5,
    // backgroundColor: Colors.backgroundLight,
    borderRadius: 4,
    marginBottom: Metrics.defaultPadding * 0.75,
  },
  logo: {
    width: 60,
    height: 45,
    marginBottom: 12,
    resizeMode: 'contain',
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
