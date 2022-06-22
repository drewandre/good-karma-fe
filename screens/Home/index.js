import moment from 'moment'
import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import deviceInfoModule from 'react-native-device-info'
import { SafeAreaView } from 'react-native-safe-area-context'
import { connect } from 'react-redux'
import {
  getEvents,
  getBlogPosts,
} from '../../features/content/redux/contentOperations'
import Article from '../../shared/components/Article'
import EventsCarousel from '../../shared/components/EventsCarousel'
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
    if (!onboardingModalPreviouslyShown) {
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
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerSubtitle}>
            {moment().format('dddd, MMMM Do')}
          </Text>
          <Text style={styles.headerTitle}>{text}</Text>
        </View>
        <View style={styles.headerRight}>
          <View
            style={{
              width: 50,
              borderRadius: 1000,
              height: 50,
              backgroundColor: 'red',
            }}
          />
        </View>
      </View>
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainerStyle}
        >
          <Text style={styles.comingUpTitle}>Coming Up</Text>
          {renderEvents()}
          <View style={styles.articleContainer}>
            <Text style={styles.articlesTitle}>Articles</Text>
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
    paddingTop: 15,
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainerStyle: {
    paddingBottom: deviceInfoModule.hasNotch() ? 25 : 15,
  },
  articleContainer: {
    paddingHorizontal: 15,
  },
  scrollView: {
    flex: 1,
  },
  comingUpTitle: {
    paddingHorizontal: 15,
  },
  articlesTitle: {
    paddingBottom: 15,
  },
  header: {
    alignSelf: 'center',
    paddingVertical: 15,
    width: Metrics.screenWidth - 30,
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.2)',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    paddingTop: 3,
    fontSize: 20,
  },
  headerSubtitle: {
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
