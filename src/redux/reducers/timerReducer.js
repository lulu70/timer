const initialState = {
  twoScreenMode: false,
  duration: 5 * 60 - 1,
  time: '05:00',
  hours: '0',
  minutes: '5',
  seconds: '0',
  timerRunning: false,
  timerInterval: '',
  messageIsOn: false,
  warningColor: 'red',
  pStyle: {
    fontSize: '20vw',
    letterSpacing: '2vw',
    fontWeight: 'bold',
    margin: '0',
    color: 'white'
  },
  containerStyle: {
    height: '100vh',
    background: 'black',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  bgColor: 'black'
}

const timerReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_TIMER': {
      return {
        ...state,
        duration: action.duration,
        time: action.time,
        hours: action.hours,
        minutes: action.minutes,
        seconds: action.seconds
      }
    }
    case 'SET_DURATION': {
      return { ...state, duration: action.duration }
    }
    case 'PLAY_TIMER': {
      return { ...state, timerRunning: true }
    }
    case 'PAUSE_TIMER': {
      return { ...state, timerRunning: false }
    }
    case 'SET_TIMER_INTERVAL': {
      return { ...state, timerInterval: action.interval }
    }
    case 'TOGGLE_MESSAGE': {
      return { ...state, messageIsOn: !state.messageIsOn }
    }
    case 'TIMER_FROM_CONTROLLER': {
      return action.timer
    }
    case 'SET_APP_MODE': {
      return {
        ...state,
        twoScreenMode: action.mode
      }
    }
    case 'SET_STATE_FROM_LOCAL_STORAGE': {
      return {
        ...state,
        warningColor: action.warningColor,
        bgColor: action.bgColor,
        pStyle: {
          ...state.pStyle,
          color: action.textColor
        }
      }
    }
    default: {
      return state
    }
  }
}
export default timerReducer
