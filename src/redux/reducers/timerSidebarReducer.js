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
    case 'TIMER_SIDEBAR_TOGGLE_VISIBILITY': {
      return {
        ...state,
        visible: !state.visible
      }
    }
    case 'ADD_BUTTON': {
      return {
        ...state,
        buttons: [...state.buttons,{
          id: action.id,
          hours: action.hours,
          minutes: action.minutes,
          seconds: action.seconds,
          time: action.time
        }]
      }
    }
    case 'DELETE_BUTTON': {
      return {
        ...state, 
        buttons: [...state.buttons.slice(0,action.index),...state.buttons.slice(action.index+1)]
      }
    }
    default: {
      return state
    }
  }
}
export default timerSidebarReducer
