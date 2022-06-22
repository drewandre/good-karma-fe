import {
  SET_USER,
  LOGOUT,
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
