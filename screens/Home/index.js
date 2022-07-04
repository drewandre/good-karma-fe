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
import {
  setTopicSubscriptionStatusBegin,
  setTopicSubscriptionStatusSuccess,
  setTopicSubscriptionStatusError,
} from '../../features/session/redux/sessionActions'
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
  setTopicSubscriptionStatusBegin,
  setTopicSubscriptionStatusSuccess,
  setTopicSubscriptionStatusError,
  notificationTopics,
}) {
  React.useEffect(() => {
    getBlogPosts()
    getEvents()
  }, [])

  React.useEffect(() => {
    if (onboardingModalPreviouslyShown) {
      requestPushNotificationPermissions({
        setTopicSubscriptionStatusBegin,
        setTopicSubscriptionStatusSuccess,
        setTopicSubscriptionStatusError,
        notificationTopics,
      })
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
    if (Array.isArray(blogPosts)) {
      return (blogPosts || []).map((post) => {
        return (
          <Article
            key={`blog_post_${post.id}`}
            data={post}
            onPress={handleArticlePress}
          />
        )
      })
    } else {
      return null
    }
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
      <StatusBar style="light" hidden={false} />
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
          <Gear fill="rgba(255,255,255,0.9)" />
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
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    overflow: 'hidden',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // backgroundColor: Colors.backgroundLight,
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
    color: 'rgba(255,255,255,0.9)',
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 1,
    paddingHorizontal: 15,
  },
  articlesTitle: {
    color: 'rgba(255,255,255,0.9)',
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 1,
    paddingBottom: 20,
  },
  header: {
    alignSelf: 'center',
    paddingVertical: 15,
    width: Metrics.screenWidth - 30,
    flexDirection: 'row',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
    paddingTop: 3,
    fontSize: 26,
  },
  headerSubtitle: {
    color: '#fff',
    fontSize: 16,
  },
})

function mapStateToProps({ session, content }) {
  return {
    notificationTopics: session.notificationTopics,
    blogPosts: content?.blogPosts?.data || [],
    events: content?.events?.data || [],
    onboardingModalPreviouslyShown: session?.onboardingModalPreviouslyShown,
  }
}

const mapDispatchToProps = {
  getEvents,
  getBlogPosts,
  setTopicSubscriptionStatusBegin,
  setTopicSubscriptionStatusSuccess,
  setTopicSubscriptionStatusError,
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
