const initialState = {
  visible: true,
  settingIconStyle: {
    position: 'absolute',
    bottom: '5px',
    right: '5px',
    zIndex: '10'
  },
  pusherStyle: {
    height: '100vh',
    background: 'black',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
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
    default: {
      return state
    }
  }
}
export default timerSidebarReducer
