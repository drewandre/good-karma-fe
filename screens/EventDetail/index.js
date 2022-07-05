//@refresh reset
import React from 'react'
import { Image, View, StyleSheet, Text, Linking } from 'react-native'
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
import { INLINES, BLOCKS } from '@contentful/rich-text-types'
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import ParallaxScrollView from 'react-native-parallax-scroll-view'
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated'
import { LinearGradient } from 'expo-linear-gradient'
import FPETouchable from '../../shared/components/FPETouchable'
import { transformArtist } from '../../ContentfulManager'
import base64 from 'react-native-base64'

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient)
const AnimatedParallaxScrollView =
  Animated.createAnimatedComponent(ParallaxScrollView)

const PARALLAX_HEADER_HEIGHT = Metrics.screenWidth

const tagsStyles = {
  a: {
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: '#fdf727',
  },
}

const linkContainerStyles = {
  transform: [
    {
      translateY: 3.5,
    },
  ],
}

const PRIMARY_ASSOCIATED_DOMAIN = 'goodkarmaclub.xyz'

function EventDetail({ data, id, navigation }) {
  const translationY = useSharedValue(0)

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

  function handleMapPress() {
    const scheme = Platform.select({
      ios: 'maps:0,0?q=',
      android: 'geo:0,0?q=',
    })
    const latLng = `${data?.location?.lat},${data?.location?.lon}`
    const label = data?.locationName
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    })
    Linking.openURL(url)
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

  const animatedScrollHandler = useAnimatedScrollHandler((event) => {
    translationY.value = event.contentOffset.y
  })

  const animatedLinearGradientStyles = useAnimatedStyle(() => {
    let bottom = translationY.value * 0.8
    if (translationY.value < 0) {
      bottom -= translationY.value
    }
    return {
      position: 'absolute',
      bottom,
      width: '100%',
      height: '50%',
    }
  })

  function renderData() {
    console.log(data)
    let darkStyles =
      '&style=element:geometry|invert_lightness:true&style=feature:landscape.natural.terrain|element:geometry|visibility:on&style=feature:landscape|element:geometry.fill|color:0x292E3B&style=feature:poi|element:geometry.fill|color:0x404040&style=feature:poi.park|element:geometry.fill|color:0x0a330a&style=feature:water|element:geometry|color:0x00000000&style=feature:transit|element:geometry|visibility:on|color:0x101010&style=feature:road|element:geometry.stroke|visibility:on&style=feature:road.local|element:geometry.fill|color:0x606060&style=feature:road.arterial|element:geometry.fill|color:0x888888'
    return (
      <View style={styles.container}>
        <AnimatedParallaxScrollView
          style={styles.container}
          indicatorStyle="white"
          onScroll={animatedScrollHandler}
          parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
          contentContainerStyle={styles.contentContainerStyle}
          renderBackground={() => (
            <View
              style={{
                backgroundColor: Colors.black,
                width: Metrics.screenWidth,
                height: PARALLAX_HEADER_HEIGHT,
              }}
            >
              <FastImage
                source={{
                  uri: data?.coverPhoto?.src,
                }}
                style={{
                  width: '100%',
                  height: '100%',
                }}
              />
              <AnimatedLinearGradient
                colors={['transparent', 'rgba(0,0,0,1)']}
                style={animatedLinearGradientStyles}
              />
            </View>
          )}
        >
          <View style={styles.metadataContainer}>
            <Text style={styles.eventTitle}>{data.name}</Text>
            <Text style={styles.eventLocation}>{data.shortDescription}</Text>
            <View
              style={[
                styles.rowContainer,
                { marginTop: Metrics.defaultPadding },
              ]}
            >
              <Calendar
                style={{
                  marginTop: 2.5,
                  marginRight: Metrics.defaultPadding * 0.5,
                }}
              />
              <View style={styles.wrapper}>
                <Text style={styles.eventDate}>
                  {moment(data.startDateTime).format('dddd MMMM Do')}
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
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: Metrics.defaultPadding,
                }}
              >
                <MapPin
                  fill={Colors.white}
                  style={{
                    marginTop: 2.5,
                    marginRight: Metrics.defaultPadding * 0.5,
                  }}
                />
                <View style={{ flex: 1, marginBottom: Metrics.defaultPadding }}>
                  <Text style={styles.eventDate}>{data?.locationName}</Text>
                  <FPETouchable onPress={handleMapPress}>
                    <Text style={styles.eventAddress}>
                      {data?.locationAddress}
                    </Text>
                  </FPETouchable>
                </View>
              </View>
              <FPETouchable onPress={handleMapPress}>
                <Image
                  style={styles.map}
                  source={{
                    // https://developers.google.com/maps/documentation/maps-static/styling
                    // size:tiny|anchor:topleft|icon:https://i.ibb.co/Pc55DY2/warped-logo-yellow-map-pin.png
                    uri: encodeURI(
                      `https://maps.googleapis.com/maps/api/staticmap?center=${
                        data?.location?.lat
                      },${
                        data?.location?.lon
                      }&markers=size:mid|color:0xfdf727|${
                        data?.location?.lat
                      },${
                        data?.location?.lon
                      }&zoom=12&scale=2&sensor=false&size=${styles.map.width}x${
                        styles.map.height + 50
                      }&style=feature:administrative.locality|element:labels|visibility:off&style=feature:poi|element:labels|visibility:off${darkStyles}&key=AIzaSyA73p5AfXMlPgvvKawdSxu7ELS012OW7C4`
                    ),
                  }}
                />
              </FPETouchable>
            </View>
            <Text style={styles.eventDescription}>ABOUT</Text>
          </View>
          <View style={styles.container}>
            <RenderHtml
              contentWidth={Metrics.screenWidth - 40}
              source={{ html }}
              defaultTextProps={{
                style: { color: '#fff', fontSize: 20, lineHeight: 27 },
              }}
              defaultViewProps={{ backgroundColor: '#000' }}
              baseStyle={{
                backgroundColor: '#000',
                paddingHorizontal: Metrics.defaultPadding,
              }}
              tagsStyles={tagsStyles}
              renderersProps={renderersProps}
              renderers={renderers}
              systemFonts={[]}
            />
          </View>
        </AnimatedParallaxScrollView>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" animated />
      {data ? renderData() : <Text>Could not find this event!</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  rowContainer: {
    paddingTop: Metrics.defaultPadding,
    flexDirection: 'row',
  },
  safeAreaViewContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainerStyle: {
    backgroundColor: '#000',
    // paddingHorizontal: 15,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  metadataContainer: {
    backgroundColor: Colors.black,
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
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 40,
  },
  eventDate: {
    fontWeight: 'bold',
    paddingBottom: 2,
    color: '#fff',
  },
  eventTime: {
    color: '#fff',
  },
  eventAddress: {
    color: '#fff',
    // textDecorationColor: Colors.yellow,
    // textDecorationStyle: 'solid',
    // textDecorationLine: 'underline',
  },
  eventLocation: {
    color: '#fff',
    fontSize: 20,
  },
  eventDescription: {
    marginTop: Metrics.defaultPadding,
    color: Colors.yellow,
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
  map: {
    backgroundColor: '#111',
    width: Metrics.screenWidth - Metrics.defaultPadding * 2,
    height: 200,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 5,
  },
  button: {
    marginVertical: Metrics.defaultPadding,
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
