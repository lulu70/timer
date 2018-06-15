import React, { Component } from 'react'
import { Sidebar, Menu, Icon } from 'semantic-ui-react'
import Timer from './Timer'
import 'rc-time-picker/assets/index.css'
import TimePicker from 'rc-time-picker'
import moment from 'moment'
import { connect } from 'react-redux'

class TimerSidebar extends Component {
  toggleVisibility = () => this.props.toggleVisibility()

  handleTimerPickerChange = value => {
    this.props.timerRunning && this.props.pauseTimer()
    let hours = value && parseInt(value.format('HH'), 10)
    let minutes = value && parseInt(value.format('mm'), 10)
    let seconds = value && parseInt(value.format('ss'), 10)
    const duration = seconds + minutes * 60 + hours * 3600 - 1
    minutes = minutes < 10 ? '0' + minutes : minutes
    seconds = seconds < 10 ? '0' + seconds : seconds
    this.props.updateTimer(`${hours < 1 ? '' : hours + ':'}${minutes}:${seconds}`, duration)
  }

  handlePlayPauseClick = () => {
    this.props.timerRunning ? this.props.pauseTimer() : this.props.playTimer()
  }

  render() {
    const { visible, settingIconStyle, pusherStyle } = this.props
    return (
      <div id="sidebarContainer">
        <Icon
          inverted
          id="settings"
          size="big"
          name="setting"
          onClick={this.toggleVisibility}
          style={settingIconStyle}
        />
        <Sidebar.Pushable>
          <Sidebar
            as={Menu}
            animation="overlay"
            width="thin"
            direction="right"
            visible={visible}
            icon="labeled"
            vertical
            inverted
          >
            <Menu.Item name="time">
              <TimePicker
                style={{ width: 100 }}
                showSecond
                defaultValue={moment().set({
                  hour: 0,
                  minute: 5,
                  second: 0,
                  millisecond: 0
                })}
                onChange={this.handleTimerPickerChange}
              />
            </Menu.Item>
            <Menu.Item name="playPause" onClick={this.handlePlayPauseClick}>
              <Icon name={this.props.timerRunning ? 'pause' : 'play'} />
            </Menu.Item>
          </Sidebar>
          <Sidebar.Pusher style={pusherStyle}>
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
  pusherStyle: state.timerSidebar.pusherStyle,
  timerRunning: state.timer.timerRunning,
  duration: state.timer.duration
})

const mapDispatchToProps = dispatch => ({
  toggleVisibility: () => {
    dispatch({
      type: 'TIMER_SIDEBAR_TOGGLE_VISIBILITY'
    })
  },
  playTimer: () => {
    dispatch({ type: 'PLAY_TIMER' })
  },
  pauseTimer: () => {
    dispatch({ type: 'PAUSE_TIMER' })
  },
  updateTimer: (time, duration) => {
    dispatch({
      type: 'UPDATE_TIMER',
      time,
      duration
    })
  }
})

const TimerSidebarContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(TimerSidebar)

export default TimerSidebarContainer
