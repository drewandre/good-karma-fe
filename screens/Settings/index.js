import { StyleSheet, View } from 'react-native'
import { connect } from 'react-redux'
import SettingsItem from '../../shared/components/SettingsItem'

function Settings({}) {
  return (
    <View style={styles.container}>
      <SettingsItem topic="newEvents" />
      <SettingsItem topic="newEvents" />
      <SettingsItem topic="newEvents" />
      <SettingsItem topic="newEvents" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

function mapStateToProps({}) {
  return {}
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
