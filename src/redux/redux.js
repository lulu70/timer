import { createStore, combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import timer from './reducers/timerReducer'
import timerSidebar from './reducers/timerSidebarReducer'
const reducers = combineReducers({
  timer,
  timerSidebar
})

const store = createStore(reducers, composeWithDevTools())
export default store
