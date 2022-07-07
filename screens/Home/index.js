//@refresh reset
import { useFocusEffect, useIsFocused } from '@react-navigation/native'
import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import deviceInfoModule from 'react-native-device-info'
import { connect } from 'react-redux'
import {
  getEvents,
  getNews,
  getBlogPosts,
} from '../../features/content/redux/contentOperations'
import {
  setTopicSubscriptionStatusBegin,
  setTopicSubscriptionStatusSuccess,
  setTopicSubscriptionStatusError,
} from '../../features/session/redux/sessionActions'
import Article from '../../shared/components/Article'
import EventsCarousel from '../../shared/components/EventsCarousel'
import NewsAlert from '../../shared/components/NewsAlert'
import Gear from '../../shared/components/svgs/Gear'
import { requestPushNotificationPermissions } from '../../shared/helpers/pushNotifications'
import Colors from '../../shared/styles/Colors'
import Metrics from '../../shared/styles/Metrics'
import { setStatusBarHidden, StatusBar } from 'expo-status-bar'

const APP_VERSION = deviceInfoModule.getVersion()
const BUILD_NUMBER = deviceInfoModule.getBuildNumber()

function Home({
  getEvents,
  getBlogPosts,
  getNews,
  navigation,
  onboardingModalPreviouslyShown,
  blogPosts,
  events,
  news,
  setTopicSubscriptionStatusBegin,
  setTopicSubscriptionStatusSuccess,
  setTopicSubscriptionStatusError,
  notificationTopics,
}) {
  React.useEffect(() => {
    getBlogPosts()
    getEvents()
    getNews()
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

  useFocusEffect(
    React.useCallback(() => {
      setStatusBarHidden(false, 'fade')
    }, [])
  )

  function renderNews() {
    return news.map((item, index) => {
      return (
        <NewsAlert
          key={`news_article_${index}`}
          data={item}
          navigation={navigation}
        />
      )
    })
  }

  return (
    <>
      <StatusBar style="light" hidden={false} />
      <View style={styles.container}>
        <View style={styles.newsContainer}>{renderNews()}</View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainerStyle}
        >
          <Text style={styles.comingUpTitle}>UPCOMING EVENTS</Text>
          {renderEvents()}
          <View style={styles.articleContainer}>
            <Text style={styles.articlesTitle}>ARTICLES</Text>
            {renderArticles()}
          </View>
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              paddingBottom: Metrics.defaultPadding * 0.5,
            }}
          >
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>
              © Good Karma Records, {new Date().getFullYear()}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>
              v{APP_VERSION} #{BUILD_NUMBER}
            </Text>
          </View>
        </ScrollView>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
  },
  contentContainerStyle: {
    paddingTop: Metrics.defaultPadding,
    paddingBottom: deviceInfoModule.hasNotch() ? 25 : 15,
  },
  articleContainer: {
    paddingHorizontal: Metrics.defaultPadding,
  },
  scrollView: {
    flex: 1,
  },
  comingUpTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
    paddingHorizontal: 15,
  },
  articlesTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
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
    alignItems: 'center',
  },
  headerTitle: {
    width: 80,
    height: 50,
    resizeMode: 'contain',
  },
  headerSubtitle: {
    color: '#fff',
    fontSize: 16,
  },
  newsContainer: {
    // paddingHorizontal: Metrics.defaultPadding,
    // paddingBottom: Metrics.defaultPadding,
  },
})

function mapStateToProps({ session, content }) {
  return {
    news: content?.news?.data || [],
    notificationTopics: session.notificationTopics,
    blogPosts: content?.blogPosts?.data || [],
    events: content?.events?.data || [],
    onboardingModalPreviouslyShown: session?.onboardingModalPreviouslyShown,
  }
}

const mapDispatchToProps = {
  getEvents,
  getNews,
  getBlogPosts,
  setTopicSubscriptionStatusBegin,
  setTopicSubscriptionStatusSuccess,
  setTopicSubscriptionStatusError,
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
