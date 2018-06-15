const initialState = {
  duration: 5 * 60 - 1,
  time: '05:00',
  timerRunning: false,
  timerInterval: '',
  pStyle: {
    fontSize: '20vw',
    letterSpacing: '2vw',
    fontWeight: 'bold',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100vh',
    color: 'white'
  }
}

const timerReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_TIMER': {
      return {
        ...state,
        duration: action.duration,
        time: action.time
      }
    }
    case 'SET_DURATION': {
      return {
        ...state,
        duration: action.duration
      }
    }
    case 'PLAY_TIMER': {
      return {
        ...state,
        timerRunning: true
      }
    }
    case 'PAUSE_TIMER': {
      return {
        ...state,
        timerRunning: false
      }
    }
    case 'SET_TIMER_INTERVAL': {
      return {
        ...state,
        timerInterval: action.interval
      }
    }
    default: {
      return state
    }
  }
}
export default timerReducer
