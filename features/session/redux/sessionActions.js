import {
  SET_USER,
  LOGOUT,
  SET_TOPIC_SUBSCRIPTION_STATUS_BEGIN,
  SET_TOPIC_SUBSCRIPTION_STATUS_SUCCESS,
  SET_TOPIC_SUBSCRIPTION_STATUS_ERROR,
  SET_ONBOARDING_MODAL_PREVIOUSLY_SHOWN,
} from './sessionTypes'

export const setUser = (payload) => {
  return {
    type: SET_USER,
    payload,
  }
}

export const setOnboardingModalPreviouslyShown = (bool) => {
  return {
    type: SET_ONBOARDING_MODAL_PREVIOUSLY_SHOWN,
    payload: bool,
  }
}

export const logout = () => {
  if (global.axios?.defaults?.headers?.common?.Authorization) {
    global.axios.defaults.headers.common.Authorization = null
  }
  return {
    type: LOGOUT,
  }
}

export function setTopicSubscriptionStatusBegin(topic, subscribed) {
  return {
    type: SET_TOPIC_SUBSCRIPTION_STATUS_BEGIN,
    payload: {
      topic,
      subscribed,
    },
  }
}

export function setTopicSubscriptionStatusSuccess(topic, subscribed) {
  return {
    type: SET_TOPIC_SUBSCRIPTION_STATUS_SUCCESS,
    payload: {
      topic,
      subscribed,
    },
  }
}

export function setTopicSubscriptionStatusError(topic, subscribed) {
  return {
    type: SET_TOPIC_SUBSCRIPTION_STATUS_ERROR,
    payload: {
      topic,
      subscribed,
    },
  }
}
