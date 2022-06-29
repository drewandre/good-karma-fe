import { StatusBar } from 'expo-status-bar'
import moment from 'moment'
import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import deviceInfoModule from 'react-native-device-info'
import { SafeAreaView } from 'react-native-safe-area-context'
import { connect } from 'react-redux'
import {
  getEvents,
  getBlogPosts,
} from '../../features/content/redux/contentOperations'
import Article from '../../shared/components/Article'
import EventsCarousel from '../../shared/components/EventsCarousel'
import Gear from '../../shared/components/svgs/Gear'
import { requestPushNotificationPermissions } from '../../shared/helpers/pushNotifications'
import Colors from '../../shared/styles/Colors'
import Metrics from '../../shared/styles/Metrics'

function Home({
  getEvents,
  getBlogPosts,
  navigation,
  onboardingModalPreviouslyShown,
  blogPosts,
  events,
}) {
  React.useEffect(() => {
    getBlogPosts()
    getEvents()
  }, [])

  React.useEffect(() => {
    if (onboardingModalPreviouslyShown) {
      requestPushNotificationPermissions()
    } else {
      setTimeout(() => {
        navigation.navigate('OnboardingModal')
      }, 1000)
    }
  }, [])

  function handleEventPress(item) {
    navigation.navigate('EventDetail', { id: item.id })
  }

  function renderEvents() {
    return (
      <EventsCarousel handleEventPress={handleEventPress} entries={events} />
    )
  }

  function handleArticlePress(data) {
    navigation.navigate('ArticleDetail', { id: data.id })
  }

  function renderArticles() {
    return blogPosts.map((post) => {
      return (
        <Article
          key={`blog_post_${post.id}`}
          data={post}
          onPress={handleArticlePress}
        />
      )
    })
  }

  function handleSettingsPress() {
    navigation.navigate('Settings')
  }

  var today = new Date()
  var curHr = today.getHours()
  var text = ''

  if (curHr < 12) {
    text = 'Good Morning!'
  } else if (curHr < 18) {
    text = 'Good Afternoon!'
  } else {
    text = 'Good Evening!'
  }

  return (
    <SafeAreaView
      style={styles.screenContainer}
      edges={['right', 'top', 'left']}
    >
      <StatusBar style="light" />
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerSubtitle}>
            {moment().format('dddd, MMMM Do')}
          </Text>
          <Text style={styles.headerTitle}>{text}</Text>
        </View>
        <TouchableOpacity
          style={styles.headerRight}
          onPress={handleSettingsPress}
        >
          <Gear fill="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainerStyle}
        >
          <Text style={styles.comingUpTitle}>COMING UP</Text>
          {renderEvents()}
          <View style={styles.articleContainer}>
            <Text style={styles.articlesTitle}>ARTICLES</Text>
            {renderArticles()}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    overflow: 'hidden',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#111',
  },
  contentContainerStyle: {
    overflow: 'hidden',
    paddingTop: Metrics.defaultPadding,
    paddingBottom: deviceInfoModule.hasNotch() ? 25 : 15,
  },
  articleContainer: {
    paddingHorizontal: Metrics.defaultPadding,
  },
  scrollView: {
    overflow: 'hidden',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,
  },
  comingUpTitle: {
    color: '#fff',
    fontWeight: 'bold',
    letterSpacing: 1,
    paddingHorizontal: 15,
    paddingBottom: 5,
  },
  articlesTitle: {
    color: '#fff',
    fontWeight: 'bold',
    letterSpacing: 1,
    paddingBottom: 20,
  },
  header: {
    alignSelf: 'center',
    paddingVertical: 15,
    width: Metrics.screenWidth - 30,
    flexDirection: 'row',
    // borderBottomWidth: 2,
    // borderBottomColor: 'rgba(0,0,0,0.2)',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
    paddingTop: 3,
    fontSize: 20,
  },
  headerSubtitle: {
    color: '#fff',
    fontSize: 12,
  },
})

function mapStateToProps({ session, content }) {
  return {
    blogPosts: content?.blogPosts?.data || [],
    events: content?.events?.data || [],
    onboardingModalPreviouslyShown: session?.onboardingModalPreviouslyShown,
  }
}

const mapDispatchToProps = {
  getEvents,
  getBlogPosts,
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
