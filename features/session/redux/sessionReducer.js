import { produce } from 'immer'

import {
  SET_USER,
  LOGOUT,
  SET_ONBOARDING_MODAL_PREVIOUSLY_SHOWN,
} from './sessionTypes'

const INITIAL_STATE = {
  user: null,
  onboardingModalPreviouslyShown: false,
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
    default:
      return draft
  }
}, INITIAL_STATE)
