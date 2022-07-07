import AsyncStorage from '@react-native-async-storage/async-storage'
import DeviceInfo from 'react-native-device-info'
import { createStore, applyMiddleware } from 'redux'
import { persistReducer, persistStore } from 'redux-persist'
import hardSet from 'redux-persist/lib/stateReconciler/hardSet'
import thunk from 'redux-thunk'
import rootReducer from './rootReducer'

function generatePersistStorageVersionKey(versionNumber, buildNumber) {
  try {
    return parseInt(`${versionNumber}${buildNumber}`.replaceAll('.', ''))
  } catch (error) {
    console.warn('Could not generate persist storage version key', error)
    return 1
  }
}

var BUILD_NUMBER = DeviceInfo.getBuildNumber()
var VERSION_NUMBER = DeviceInfo.getVersion()
var CURRENT_PERSIST_VERSION_KEY = generatePersistStorageVersionKey(
  VERSION_NUMBER,
  BUILD_NUMBER
)

const persistConfig = {
  key: 'root',
  stateReconciler: hardSet,
  storage: AsyncStorage,
  version: CURRENT_PERSIST_VERSION_KEY,
  migrate: handleStateMigration,
  debug: __DEV__,
}

const handleStateMigration = (state) => {
  return {
    session: state.session,
  }
}

let middleware = [thunk]

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = createStore(
  persistedReducer,
  process.env.NODE_ENV === 'test' ? undefined : applyMiddleware(...middleware)
)

const persistor = persistStore(store)

persistor.purge()

export { persistor, persistConfig }
export default store
