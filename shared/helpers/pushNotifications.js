import messaging from '@react-native-firebase/messaging'

export async function requestPushNotificationPermissions({
  setTopicSubscriptionStatusBegin,
  setTopicSubscriptionStatusSuccess,
  setTopicSubscriptionStatusError,
  notificationTopics = {},
}) {
  const authStatus = await messaging().requestPermission()
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL

  if (enabled) {
    if (!notificationTopics.newEvents) {
      setTopicSubscriptionStatusBegin('newEvents', true)
      messaging()
        .subscribeToTopic('newEvents')
        .then(() => {
          setTopicSubscriptionStatusSuccess('newEvents', true)
          console.log('Subscribed to newEvents topic!')
        })
        .catch((error) => {
          setTopicSubscriptionStatusError('newEvents', false)
          console.log('Unable to subscribe to newEvents topic', error)
        })
    }
    if (!notificationTopics.eventReminders) {
      setTopicSubscriptionStatusBegin('eventReminders', true)
      messaging()
        .subscribeToTopic('eventReminders')
        .then(() => {
          setTopicSubscriptionStatusSuccess('eventReminders', true)
          console.log('Subscribed to eventReminders topic!')
        })
        .catch((error) => {
          setTopicSubscriptionStatusError('eventReminders', false)
          console.log('Unable to subscribe to eventReminders topic', error)
        })
    }
    if (!notificationTopics.newArticles) {
      setTopicSubscriptionStatusBegin('newArticles', true)
      messaging()
        .subscribeToTopic('newArticles')
        .then(() => {
          setTopicSubscriptionStatusSuccess('newArticles', true)
          console.log('Subscribed to newArticles topic!')
        })
        .catch((error) => {
          setTopicSubscriptionStatusError('newArticles', false)
          console.log('Unable to subscribe to newArticles topic', error)
        })
    }
    if (!notificationTopics.daoVotes) {
      setTopicSubscriptionStatusBegin('daoVotes', true)
      messaging()
        .subscribeToTopic('daoVotes')
        .then(() => {
          setTopicSubscriptionStatusSuccess('daoVotes', true)
          console.log('Subscribed to daoVotes topic!')
        })
        .catch((error) => {
          setTopicSubscriptionStatusError('daoVotes', false)
          console.log('Unable to subscribe to daoVotes topic', error)
        })
    }
    console.log('Authorization status:', authStatus)
  }
  return enabled
}
