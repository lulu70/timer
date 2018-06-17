import React, { Component } from 'react'
import { Sidebar, Menu, Icon, Button, Label } from 'semantic-ui-react'
import Timer from './Timer'
import 'rc-time-picker/assets/index.css'
import TimePicker from 'rc-time-picker'
import moment from 'moment'
import { connect } from 'react-redux'
import isElectron from 'is-electron'
import throttle from 'lodash/throttle'

class TimerSidebar extends Component {
  componentDidMount() {
    if (isElectron()) {
      window.ipcRenderer.on('timer', (e, timer) => {
        this.props.timerFromController(timer)
      })
      window.ipcRenderer.on('twoScreenMode', (e, mode) => {
        this.props.setAppMode(mode)
      })
    }
    this.getStateFromLocalStorage()
  }

  componentDidUpdate() {
    this.saveStateToLocalStorage()
  }

  saveStateToLocalStorage = throttle(() => {
    try {
      localStorage.setItem('buttons', JSON.stringify(this.props.buttons))
    } catch (error) {
      console.error(error)
    }
  }, 1000)

  getStateFromLocalStorage = () => {
    try {
      const localStorageState = localStorage.getItem('buttons')
      localStorageState &&
        this.props.setStateFromLocalStorage(JSON.parse(localStorageState))
    } catch (error) {
      console.error(error)
    }
  }

  toogleSidebarVisibility = () => this.props.toogleSidebarVisibility()

  handleTimerPickerChange = value => {
    this.props.timerRunning && this.props.pauseTimer()
    let hours = value && parseInt(value.format('HH'), 10)
    let minutes = value && parseInt(value.format('mm'), 10)
    let seconds = value && parseInt(value.format('ss'), 10)
    const duration = seconds + minutes * 60 + hours * 3600 - 1
    minutes = minutes < 10 ? '0' + minutes : minutes
    seconds = seconds < 10 ? '0' + seconds : seconds
    this.props.updateTimer(
      `${hours < 1 ? '' : hours + ':'}${minutes}:${seconds}`,
      hours,
      minutes,
      seconds,
      duration
    )
    this.props.messageIsOn && this.props.toggleMessage()
  }

  handlePlayPauseClick = () => {
    if (this.props.timerRunning) {
      this.props.pauseTimer()
    } else {
      this.props.playTimer()
      this.props.toogleSidebarVisibility()
    }
  }

  handleResetClick = () => {
    this.timePicker.setState({
      value: moment().set({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0
      })
    })
    this.handleTimerPickerChange(
      moment().set({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0
      })
    )
  }

  hadleResetToLastValueClick = () => {
    this.handleTimerPickerChange(this.timePicker.state.value)
  }

  handleSaveButtonClick = () => {
    this.props.addButton(
      this.props.time,
      this.props.hours,
      this.props.minutes,
      this.props.seconds
    )
  }
  handleDeleteButtonClick = index => {
    this.props.deleteButton(index)
  }
  handleButtonClick = (hour, minute, second) => {
    this.timePicker.setState({
      value: moment().set({
        hour,
        minute,
        second,
        millisecond: 0
      })
    })
    this.handleTimerPickerChange(
      moment().set({
        hour,
        minute,
        second,
        millisecond: 0
      })
    )
    this.handlePlayPauseClick()
  }
  render() {
    return (
      <div id="sidebarContainer">
        {!this.props.twoScreenMode && (
          <Icon
            inverted
            id="settings"
            size="large"
            name="setting"
            onClick={this.toogleSidebarVisibility}
            style={{
              ...this.props.settingIconStyle,
              color: this.props.messageIsOn ? 'red' : this.props.pStyle.color
            }}
          />
        )}
        <Sidebar.Pushable style={{ background: this.props.bgColor }}>
          <Sidebar
            as={Menu}
            animation="scale down"
            width="thin"
            direction="right"
            visible={this.props.visible}
            icon="labeled"
            vertical
            inverted
          >
            <Menu.Item name="time">
              <TimePicker
                style={{ width: 100 }}
                className="timePicker"
                ref={ref => (this.timePicker = ref)}
                allowEmpty={false}
                defaultValue={moment().set({
                  hour: 0,
                  minute: 5,
                  second: 0,
                  millisecond: 0
                })}
                onChange={this.handleTimerPickerChange}
              />
            </Menu.Item>
            {this.props.duration >= 0 && (
              <Menu.Item name="playPause" onClick={this.handlePlayPauseClick}>
                <Icon name={this.props.timerRunning ? 'pause' : 'play'} />
              </Menu.Item>
            )}
            <Menu.Item
              name="resetToLastValue"
              onClick={this.hadleResetToLastValueClick}
            >
              <Icon name="undo" />
            </Menu.Item>
            <Menu.Item as="a" onClick={this.handleResetClick}>
              00:00
            </Menu.Item>
            {this.props.duration >= 0 && (
              <Menu.Item
                name="save to a button"
                onClick={this.handleSaveButtonClick}
              >
                <Icon name="save" />
              </Menu.Item>
            )}
            {this.props.buttons.map((button, i) => (
              <Menu.Item key={i}>
                <Label
                  as="a"
                  size="mini"
                  corner="right"
                  color="red"
                  icon="delete"
                  onClick={() => this.handleDeleteButtonClick(i)}
                />
                <Button
                  basic
                  inverted
                  onClick={() =>
                    this.handleButtonClick(
                      button.hours,
                      button.minutes,
                      button.seconds
                    )
                  }
                >
                  {button.time}
                </Button>
              </Menu.Item>
            ))}
          </Sidebar>
          <Sidebar.Pusher>
            <Timer />
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  visible: state.timerSidebar.visible,
  settingIconStyle: state.timerSidebar.settingIconStyle,
  timerRunning: state.timer.timerRunning,
  duration: state.timer.duration,
  time: state.timer.time,
  hours: state.timer.hours,
  minutes: state.timer.minutes,
  seconds: state.timer.seconds,
  messageIsOn: state.timer.messageIsOn,
  timePickerStyle: state.timerSidebar.timePickerStyle,
  buttons: state.timerSidebar.buttons,
  bgColor: state.timer.bgColor,
  pStyle: state.timer.pStyle,
  twoScreenMode: state.timer.twoScreenMode
})

const mapDispatchToProps = dispatch => ({
  toogleSidebarVisibility: () => {
    dispatch({
      type: 'TOGGLE_SIDEBAR_VISIBILITY'
    })
  },
  playTimer: () => {
    dispatch({ type: 'PLAY_TIMER' })
  },
  pauseTimer: () => {
    dispatch({ type: 'PAUSE_TIMER' })
  },
  updateTimer: (time, hours, minutes, seconds, duration) => {
    dispatch({
      type: 'UPDATE_TIMER',
      time,
      hours,
      minutes,
      seconds,
      duration
    })
  },
  toggleMessage: () => {
    dispatch({
      type: 'TOGGLE_MESSAGE'
    })
  },
  addButton: (time, hours, minutes, seconds) => {
    dispatch({
      type: 'ADD_BUTTON',
      time,
      hours,
      minutes,
      seconds
    })
  },
  deleteButton: index => {
    dispatch({
      type: 'DELETE_BUTTON',
      index
    })
  },
  timerFromController: timer => {
    dispatch({
      type: 'TIMER_FROM_CONTROLLER',
      timer
    })
  },
  setAppMode: mode => {
    dispatch({
      type: 'SET_APP_MODE',
      mode
    })
  },
  setStateFromLocalStorage: buttons => {
    dispatch({
      type: 'SET_STATE_FROM_LOCAL_STORAGE',
      buttons
    })
  }
})

const TimerSidebarContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(TimerSidebar)

export default TimerSidebarContainer
