const initialState = {
  visible: false,
  buttons: [],
  settingIconStyle: {
    position: 'absolute',
    bottom: '5px',
    right: '5px',
    zIndex: '10'
  }
}

const timerSidebarReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'TOGGLE_SIDEBAR_VISIBILITY': {
      return {
        ...state,
        visible: !state.visible
      }
    }
    case 'ADD_BUTTON': {
      const newButton = {
        id: action.id,
        hours: action.hours,
        minutes: action.minutes,
        seconds: action.seconds,
        time: action.time
      }
      return {
        ...state,
        buttons:
          state.buttons ? [...state.buttons, newButton] : [newButton]
      }
    }
    case 'DELETE_BUTTON': {
      return {
        ...state,
        buttons: [
          ...state.buttons.slice(0, action.index),
          ...state.buttons.slice(action.index + 1)
        ]
      }
    }
    case 'SET_STATE_FROM_LOCAL_STORAGE': {
      return {
        ...state,
        buttons: action.buttons
      }
    }
    default: {
      return state
    }
  }
}
export default timerSidebarReducer
