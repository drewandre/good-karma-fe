import React from 'react'
import { Image, View, StyleSheet, Alert } from 'react-native'
import { firebase } from '@react-native-firebase/auth'
import {
  appleAuth,
  AppleButton,
} from '@invertase/react-native-apple-authentication'
import { setUser } from '../../features/session/redux/sessionActions'
import { connect } from 'react-redux'
import { StatusBar } from 'expo-status-bar'

function Login({ navigation, setUser }) {
  /**
   * Note the sign in request can error, e.g. if the user cancels the sign-in.
   * Use `appleAuth.Error` to determine the type of error, e.g. `error.code === appleAuth.Error.CANCELED`
   */
  async function onAppleButtonPress() {
    try {
      // 1). start a apple sign-in request
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      })

      // 2). if the request was successful, extract the token and nonce
      const { identityToken, nonce } = appleAuthRequestResponse

      // can be null in some scenarios
      if (identityToken) {
        // 3). create a Firebase `AppleAuthProvider` credential
        const appleCredential = firebase.auth.AppleAuthProvider.credential(
          identityToken,
          nonce
        )

        // 4). use the created `AppleAuthProvider` credential to start a Firebase auth request,
        //     in this example `signInWithCredential` is used, but you could also call `linkWithCredential`
        //     to link the account to an existing user
        const userCredential = await firebase
          .auth()
          .signInWithCredential(appleCredential)

        setUser(userCredential)
        navigation.navigate('Home')

        console.log(
          `Firebase authenticated via Apple, UID: ${userCredential.user.uid}`
        )
      } else {
        Alert.alert(
          'Error authenticating',
          'Please try again later (identity token did not exist)'
        )
        // handle this - retry?
      }
    } catch (error) {
      console.warn(error)
      Alert.alert('Error logging in!', JSON.stringify(error))
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" animated />
      <Image
        source={require('../../assets/background.png')}
        style={styles.backgroundImage}
        resizeMode="contain"
      />
      {appleAuth.isSupported && (
        <AppleButton
          cornerRadius={5}
          style={styles.button}
          buttonStyle={AppleButton.Style.WHITE}
          buttonType={AppleButton.Type.SIGN_IN}
          onPress={onAppleButtonPress}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    flex: 1,
    opacity: 0.6,
    position: 'absolute',
  },
  button: {
    width: '100%',
    height: 50,
  },
})

function mapStateToProps({}) {
  return {}
}

const mapDispatchToProps = {
  setUser,
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
