import React from 'react'
import { StyleSheet, Switch, Text, View } from 'react-native'
import { connect } from 'react-redux'
import Colors from '../../styles/Colors'
import Metrics from '../../styles/Metrics'

function SettingsItem({ onChange, topic, title, description, subscribed }) {
  function handleChange(value) {
    onChange(topic, value)
  }
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text
          style={{
            color: '#fff',
            fontSize: 16,
            marginBottom: 5,
            fontWeight: 'bold',
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            color: 'rgba(255,255,255,0.7)',
          }}
        >
          {description}
        </Text>
      </View>
      <Switch
        style={styles.switch}
        value={subscribed}
        onValueChange={handleChange}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundLight,
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
  },
  switch: {
    marginLeft: Metrics.defaultPadding,
  },
})

function mapStateToProps({ session }, { topic }) {
  return {
    subscribed: session.notificationTopics?.[topic]?.subscribed,
  }
}

export default connect(mapStateToProps)(SettingsItem)
