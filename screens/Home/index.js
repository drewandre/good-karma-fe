//@refresh reset
import { useFocusEffect } from '@react-navigation/native'
import React from 'react'
import {
  View,
  AppState,
  Image,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native'
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
import { requestPushNotificationPermissions } from '../../shared/helpers/pushNotifications'
import Colors from '../../shared/styles/Colors'
import Metrics from '../../shared/styles/Metrics'
import { setStatusBarHidden, StatusBar } from 'expo-status-bar'

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
  const [refreshing, setRefreshing] = React.useState(false)
  React.useEffect(() => {
    onRefresh()
  }, [])

  const appState = React.useRef(AppState.currentState)
  const [appStateVisible, setAppStateVisible] = React.useState(appState.current)

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

  React.useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        onRefresh()
      }
      appState.current = nextAppState
      setAppStateVisible(appState.current)
    })

    return () => {
      subscription.remove()
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

  async function onRefresh() {
    setRefreshing(true)
    const promises = [getBlogPosts(), getNews(), getEvents()]
    await Promise.all(promises).finally(() => {
      setRefreshing(false)
    })
  }

  return (
    <>
      <StatusBar style="light" hidden={false} />
      <View style={styles.container}>
        <View style={styles.newsContainer}>{renderNews()}</View>
        <ScrollView
          refreshControl={
            <RefreshControl
              tintColor={Colors.white}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainerStyle}
        >
          <Text
            maxFontSizeMultiplier={global.maxFontSizeMultiplier}
            style={styles.comingUpTitle}
          >
            Upcoming Events
          </Text>
          <Text
            maxFontSizeMultiplier={global.maxFontSizeMultiplier}
            style={{
              paddingHorizontal: Metrics.defaultPadding,
              color: 'rgba(255,255,255,0.5)',
              fontSize: 14,
              paddingBottom: 5,
            }}
          >
            Official Good Karma Records events and virtual meetups.
          </Text>
          {renderEvents()}
          <View style={styles.articleContainer}>
            <Text
              maxFontSizeMultiplier={global.maxFontSizeMultiplier}
              style={styles.articlesTitle}
            >
              Articles
            </Text>
            <Text
              maxFontSizeMultiplier={global.maxFontSizeMultiplier}
              style={{
                color: 'rgba(255,255,255,0.5)',
                fontSize: 14,
                paddingBottom: 25,
              }}
            >
              Latest from the Good Karma Records team about artists, our
              company, and industry news.
            </Text>
            {renderArticles()}
          </View>
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              paddingBottom: Metrics.defaultPadding * 0.5,
            }}
          >
            <Image
              source={require('../../assets/gkc-face.png')}
              style={{
                width: 50,
                height: 50,
                marginBottom: Metrics.defaultPadding,
                tintColor: Colors.yellow,
                resizeMode: 'contain',
              }}
            />
            <Text
              maxFontSizeMultiplier={global.maxFontSizeMultiplier}
              style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}
            >
              © Good Karma Records, {new Date().getFullYear()}
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
  },
  container: {
    flex: 1,
  },
  contentContainerStyle: {
    paddingTop: Metrics.defaultPadding * 1.3,
    paddingBottom: deviceInfoModule.hasNotch() ? 25 : 15,
  },
  articleContainer: {
    paddingHorizontal: Metrics.defaultPadding,
  },
  scrollView: {
    backgroundColor: Colors.background,
    flex: 1,
  },
  comingUpTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    letterSpacing: 1,
    paddingHorizontal: Metrics.defaultPadding,
    paddingBottom: 5,
  },
  articlesTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    paddingBottom: 5,
    letterSpacing: 1,
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
