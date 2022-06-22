import { combineReducers } from 'redux'
import session from '../../features/session/redux/sessionReducer'
import content from '../../features/content/redux/contentReducer'
import { LOGOUT } from '../../features/session/redux/sessionTypes'

const rootReducer = combineReducers({
  session,
  content,
})

// https://stackoverflow.com/a/35641992
export default (state, action) => {
  return rootReducer(action.type === LOGOUT ? undefined : state, action)
}
