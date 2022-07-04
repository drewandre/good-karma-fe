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
import { LinearGradient } from 'expo-linear-gradient'
import { INLINES, BLOCKS } from '@contentful/rich-text-types'
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'

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

  function handleExternalLinkPress(url) {
    if (url) {
      navigation.navigate('WebviewModal', { uri: url })
    }
  }

  const ARenderer = React.useCallback(({ TDefaultRenderer, ...props }) => {
    function onPress() {
      if (props?.tnode?.init?.textNode?.parent?.attribs?.href) {
        const link = props?.tnode?.init?.textNode?.parent?.attribs?.href
        let data = props?.tnode?.init?.textNode?.parent?.attribs?.data || ''
        if (link.includes(PRIMARY_ASSOCIATED_DOMAIN)) {
          let scrubbedLink = link.replace('https://', '')
          scrubbedLink = link.replace('http://', '')
          let paths = scrubbedLink.split(PRIMARY_ASSOCIATED_DOMAIN)[1] || ''
          if (paths.includes('artists')) {
            const [path, artistId] = paths.split('/').filter((x) => x)
            if (data) {
              data = JSON.parse(base64.decode(data))
              setArtistOverlay(data)
            } else {
              setArtistOverlay({ id: artistId })
            }
          }
        } else {
          handleExternalLinkPress(
            props?.tnode?.init?.textNode?.parent?.attribs?.href
          )
        }
      } else if (props?.tnode?.init?.domNode?.attribs?.href) {
        handleExternalLinkPress(props?.tnode?.init?.domNode?.attribs?.href)
      }
    }
    return (
      <FPETouchable onPress={onPress} style={linkContainerStyles}>
        <TDefaultRenderer {...props} />
      </FPETouchable>
    )
  }, [])

  const renderers = {
    a: ARenderer,
  }

  // https://meliorence.github.io/react-native-render-html/docs/content/images
  // https://www.npmjs.com/package/@contentful/rich-text-html-renderer
  const documentToHtmlStringOptions = React.useMemo(() => {
    return {
      renderNode: {
        [BLOCKS.EMBEDDED_ASSET]: (node) => {
          const type = node?.data?.target?.fields?.file?.contentType
          if (type?.includes('image')) {
            return `<img src="https:${node?.data?.target?.fields?.file.url}"></img>`
          } else {
            return '<div style="width:100%;padding:5px 15px;margin:15px 0;border-radius:5px;background-color:#D8D8D8;"><p style="color:#48484a;">This content is not supported :(</p></div>'
          }
        },
        [INLINES.EMBEDDED_ENTRY]: (node) => {
          const d = transformArtist(node?.data?.target)
          return `<a href="https://goodkarmaclub.xyz/artists/${
            d?.id
          }" data="${base64.encode(JSON.stringify(d))}">${d?.name}</a>`
        },
      },
    }
  }, [])

  const html = React.useMemo(() => {
    return documentToHtmlString(data?.about, documentToHtmlStringOptions)
  }, [data?.about])

  function renderData() {
    return (
      <ScrollView style={styles.container}>
        <FastImage
          source={{
            uri: data?.coverPhoto?.src,
          }}
          style={{
            width: Metrics.screenWidth,
            height: PARALLAX_HEADER_HEIGHT,
          }}
        />
        <LinearGradient
          colors={['rgba(0,0,0,1)', 'transparent']}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            width: '100%',
            height: 200,
          }}
        />
        <View style={styles.metadataContainer}>
          <Text style={styles.eventTitle}>{data.name}</Text>
          <Text style={styles.eventLocation}>{data.locationName}</Text>
          <View style={styles.rowContainer}>
            <Calendar />
            <View style={styles.wrapper}>
              <Text style={styles.eventDate}>
                {moment(data.startDateTime).format('dddd MMMM do')}
              </Text>
              <Text style={styles.eventTime}>
                {moment(data.startDateTime).format('h:mmA')} -{' '}
                {moment(data.endDateTime).format('h:mmA')}
              </Text>
              <GKCButton
                style={styles.button}
                title="Add to Calendar"
                onPress={handleAddToCalendar}
              />
            </View>
          </View>
          <Text style={styles.eventDescription}>ABOUT</Text>
        </View>
        <RenderHtml
          contentWidth={Metrics.screenWidth - 40}
          source={{ html }}
          defaultTextProps={{ style: { color: '#fff' } }}
          baseStyle={{
            // backgroundColor: Colors.background,
            paddingHorizontal: Metrics.defaultPadding,
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
    backgroundColor: Colors.black,
  },
  metadataContainer: {
    paddingTop: Metrics.defaultPadding,
    paddingHorizontal: Metrics.defaultPadding,
  },
  backArrow: {
    position: 'absolute',
    top: deviceInfoModule.hasNotch() ? 50 : 25,
    left: Metrics.defaultPadding,
  },
  parallaxHeader: {
    backgroundColor: Colors.background,
    overflow: 'visible',
    height: PARALLAX_HEADER_HEIGHT / 2,
  },
  eventTitle: {
    color: '#fff',
    fontSize: 40,
  },
  eventDate: {
    color: '#fff',
  },
  eventTime: {
    color: '#fff',
  },
  eventLocation: {
    color: '#fff',
    fontSize: 20,
  },
  eventDescription: {
    color: 'rgba(255,255,255,0.9)',
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 1,
    paddingTop: 10,
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
    paddingHorizontal: Metrics.defaultPadding,
    color: '#fff',
    fontSize: 40,
    textShadowColor: '#rgba(0,0,0,0.5)',
    textShadowRadius: 20,
    fontWeight: 'bold',
    paddingVertical: 5,
  },
  sectionTitleText: {
    paddingHorizontal: Metrics.defaultPadding,
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
  button: {
    marginVertical: 15,
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
