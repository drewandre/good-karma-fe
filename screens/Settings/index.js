import { StyleSheet, View } from 'react-native'
import { connect } from 'react-redux'
import SettingsItem from '../../shared/components/SettingsItem'
import Colors from '../../shared/styles/Colors'
import messaging from '@react-native-firebase/messaging'
import {
  setTopicSubscriptionStatusBegin,
  setTopicSubscriptionStatusSuccess,
  setTopicSubscriptionStatusError,
} from '../../features/session/redux/sessionActions'

function Settings({
  setTopicSubscriptionStatusBegin,
  setTopicSubscriptionStatusSuccess,
  setTopicSubscriptionStatusError,
}) {
  function handleTopicSubscriptionChange(topic, newValue) {
    if (newValue) {
      setTopicSubscriptionStatusBegin(topic, newValue)
      messaging()
        .subscribeToTopic(topic)
        .then(() => {
          setTopicSubscriptionStatusSuccess(topic, newValue)
          console.log(`Subscribed to ${topic} topic!`)
        })
        .catch((error) => {
          setTopicSubscriptionStatusError(topic, !newValue)
          console.error(`Unable to subscribe to ${topic} topic`, error)
        })
    } else {
      setTopicSubscriptionStatusBegin(topic, newValue)
      messaging()
        .unsubscribeFromTopic(topic)
        .then(() => {
          setTopicSubscriptionStatusSuccess(topic, newValue)
          console.log(`Unsubscribed from ${topic} topic!`)
        })
        .catch((error) => {
          setTopicSubscriptionStatusError(topic, !newValue)
          console.error(`Unable to subscribe to ${topic} topic`, error)
        })
    }
  }
  return (
    <View style={styles.container}>
      <SettingsItem
        topic="newArticles"
        title="New Articles"
        onChange={handleTopicSubscriptionChange}
        description="Push notifications sent when a new article is published."
      />
      <SettingsItem
        topic="newEvents"
        title="New Events"
        onChange={handleTopicSubscriptionChange}
        description="Push notifications sent when a new event is published."
      />
      <SettingsItem
        topic="eventReminders"
        title="Event Reminders"
        onChange={handleTopicSubscriptionChange}
        description="Push notifications sent 24 hours before an event."
      />
      {/* <SettingsItem
        topic="daoVotes"
        title="DAO Votes"
        onChange={handleTopicSubscriptionChange}
        description="Push notifications send when a new DAO voting session has opened."
      /> */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.background,
  },
  categoryText: {
    color: '#fff',
    fontWeight: 'bold',
    letterSpacing: 1,
    paddingBottom: 20,
  },
})

function mapStateToProps({}) {
  return {}
}

const mapDispatchToProps = {
  setTopicSubscriptionStatusBegin,
  setTopicSubscriptionStatusSuccess,
  setTopicSubscriptionStatusError,
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
