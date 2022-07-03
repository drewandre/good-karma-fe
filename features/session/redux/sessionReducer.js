import { produce } from 'immer'

import {
  SET_USER,
  LOGOUT,
  SET_TOPIC_SUBSCRIPTION_STATUS_BEGIN,
  SET_TOPIC_SUBSCRIPTION_STATUS_SUCCESS,
  SET_TOPIC_SUBSCRIPTION_STATUS_ERROR,
  SET_ONBOARDING_MODAL_PREVIOUSLY_SHOWN,
} from './sessionTypes'

const INITIAL_STATE = {
  user: null,
  onboardingModalPreviouslyShown: false,
  notificationTopics: {},
}

export { INITIAL_STATE }
export default produce((draft, action) => {
  switch (action.type) {
    case SET_USER:
      draft.user = action.payload
      return draft
    case LOGOUT:
      draft.user = null
      return draft
    case SET_ONBOARDING_MODAL_PREVIOUSLY_SHOWN:
      draft.onboardingModalPreviouslyShown = action.payload
      return draft
    case SET_TOPIC_SUBSCRIPTION_STATUS_BEGIN:
    case SET_TOPIC_SUBSCRIPTION_STATUS_SUCCESS:
    case SET_TOPIC_SUBSCRIPTION_STATUS_ERROR:
      if (!draft.notificationTopics) {
        draft.notificationTopics = {}
      }
      draft.notificationTopics[action.payload.topic] = {
        subscribed: action.payload.subscribed,
      }
      return draft
    default:
      return draft
  }
}, INITIAL_STATE)
