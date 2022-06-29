import messaging from '@react-native-firebase/messaging'

export async function requestPushNotificationPermissions() {
  const authStatus = await messaging().requestPermission()
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL

  if (enabled) {
    messaging()
      .subscribeToTopic('newEvents')
      .then(() => console.log('Subscribed to newEvents topic!'))
      .catch((error) =>
        console.log('Unable to subscribe to newEvents topic', error)
      )
    messaging()
      .subscribeToTopic('eventReminders')
      .then(() => console.log('Subscribed to eventReminders topic!'))
      .catch((error) =>
        console.log('Unable to subscribe to eventReminders topic', error)
      )
    messaging()
      .subscribeToTopic('newArticles')
      .then(() => console.log('Subscribed to newArticles topic!'))
      .catch((error) =>
        console.log('Unable to subscribe to newArticles topic', error)
      )
    messaging()
      .subscribeToTopic('daoVotes')
      .then(() => console.log('Subscribed to daoVotes topic!'))
      .catch((error) =>
        console.log('Unable to subscribe to daoVotes topic', error)
      )

    console.log('Authorization status:', authStatus)
  }
  return enabled
}
