import React from 'react'
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native'
import { connect } from 'react-redux'
import RenderHtml from 'react-native-render-html'
import Metrics from '../../shared/styles/Metrics'
import Calendar from '../../shared/components/svgs/Calendar'
import MapPin from '../../shared/components/svgs/MapPin'
import FastImage from 'react-native-fast-image'
import { StatusBar } from 'expo-status-bar'
import deviceInfoModule from 'react-native-device-info'
import Colors from '../../shared/styles/Colors'
import moment from 'moment'
import GKCButton from '../../shared/components/GKCButton'
import * as AddCalendarEvent from 'react-native-add-calendar-event'
import { SafeAreaView } from 'react-native-safe-area-context'

const PARALLAX_HEADER_HEIGHT = 300
const STICKY_HEADER_HEIGHT = 70

function EventDetail({ data, id, navigation }) {
  /*
    title: string
    id: int
    about: string (rich text)
  */

  React.useEffect(() => {
    if (!data) {
      console.log('Event not found in local state -- should fetch?')
    }
  }, [])

  console.log(data)

  function handleAddToCalendar() {
    const eventConfig = {
      title: data.name,
      startDate: moment(data.startDateTime).format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
      endDate: moment(data.endDateTime).format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
      location: data.locationName,
      // and other options
    }

    AddCalendarEvent.presentEventCreatingDialog(eventConfig)
      .then((eventInfo) => {
        const { calendarItemIdentifier, eventIdentifier } = eventInfo
        // handle success - receives an object with `calendarItemIdentifier` and `eventIdentifier` keys, both of type string.
        // These are two different identifiers on iOS.
        // On Android, where they are both equal and represent the event id, also strings.
        // when { action: 'CANCELED' } is returned, the dialog was dismissed
        console.log(JSON.stringify(eventInfo))
      })
      .catch((error) => {
        // handle error such as when user rejected permissions
        console.warn(error)
      })
  }

  const renderersProps = {
    img: {
      enableExperimentalPercentWidth: true,
    },
  }

  function renderData() {
    return (
      <ScrollView style={styles.container}>
        <FastImage
          source={{
            uri: data.coverPhoto.src,
          }}
          style={{
            width: Metrics.screenWidth,
            height: PARALLAX_HEADER_HEIGHT,
          }}
        />
        <View style={styles.metadataContainer}>
          <Text>{data.name}</Text>
          <View style={styles.rowContainer}>
            <Calendar />
            <View style={styles.wrapper}>
              <Text>{moment(data.startDateTime).format('dddd MMMM do')}</Text>
              <Text>
                {moment(data.startDateTime).format('h:mmA')} -{' '}
                {moment(data.endDateTime).format('h:mmA')}
              </Text>
              <GKCButton
                title="Add to Calendar"
                onPress={handleAddToCalendar}
              />
            </View>
          </View>
          <View style={styles.rowContainer}>
            <MapPin />
            <View style={styles.wrapper}>
              <Text>{data.locationName}</Text>
            </View>
          </View>
          <Text>About</Text>
        </View>
        <RenderHtml
          contentWidth={Metrics.screenWidth - 40}
          source={{ html: data.about }}
          // defaultTextProps={{ style: { color: '#fff' } }}
          baseStyle={{
            backgroundColor: Colors.background,
            paddingHorizontal: 15,
          }}
          renderersProps={renderersProps}
          systemFonts={[]}
        />
      </ScrollView>
    )
  }

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <StatusBar style="light" animated />
      {data ? renderData() : <Text>Could not find this event!</Text>}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  rowContainer: {
    flexDirection: 'row',
  },
  safeAreaViewContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  metadataContainer: {
    padding: 15,
  },
  backArrow: {
    position: 'absolute',
    top: deviceInfoModule.hasNotch() ? 50 : 25,
    left: 25,
  },
  parallaxHeader: {
    backgroundColor: Colors.background,
    overflow: 'visible',
    height: PARALLAX_HEADER_HEIGHT / 2,
  },
  titleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'visible',
    top: PARALLAX_HEADER_HEIGHT * -0.5,
  },
  sectionSpeakerText: {
    paddingHorizontal: 15,
    color: '#fff',
    fontSize: 40,
    textShadowColor: '#rgba(0,0,0,0.5)',
    textShadowRadius: 20,
    fontWeight: 'bold',
    paddingVertical: 5,
  },
  sectionTitleText: {
    paddingHorizontal: 15,
    color: '#fff',
    fontSize: 18,
    paddingVertical: 5,
  },
  stickySection: {
    height: STICKY_HEADER_HEIGHT,
    width: 300,
    justifyContent: 'flex-end',
  },
  stickySectionText: {
    color: 'white',
    fontSize: 20,
    margin: 10,
  },
  fixedSection: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  fixedSectionText: {
    color: '#999',
    fontSize: 20,
  },
})

function mapStateToProps({ content }, { route }) {
  const { id } = route.params
  return {
    id,
    data: content.events.data.find((event) => {
      return event.id === id
    }),
  }
}

export default connect(mapStateToProps)(EventDetail)
