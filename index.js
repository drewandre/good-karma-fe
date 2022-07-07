import 'react-native-gesture-handler'
import { registerRootComponent } from 'expo'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import store, { persistor } from './bootstrap/redux/initialize'
import messaging from '@react-native-firebase/messaging'
import * as SplashScreen from 'expo-splash-screen'

import App from './App'

// Prevent native splash screen from autohiding before App component declaration
SplashScreen.preventAutoHideAsync()
  .then((result) =>
    console.log(`SplashScreen.preventAutoHideAsync() succeeded: ${result}`)
  )
  .catch(console.warn) // it's good to explicitly catch and inspect any error

// Register background handler
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
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
  console.log(
    'Message handled in the background!',
    JSON.stringify(remoteMessage)
  )
})

function GoodKarma() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  )
}
// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(GoodKarma)
