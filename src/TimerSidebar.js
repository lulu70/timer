import React, { Component } from 'react'
import { Sidebar, Menu, Icon, Button, Label, Popup } from 'semantic-ui-react'
import Timer from './Timer'
import 'rc-time-picker/assets/index.css'
import TimePicker from 'rc-time-picker'
import moment from 'moment'
import { connect } from 'react-redux'
import uuid from 'uuid'
import { SketchPicker } from 'react-color'

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
      this.props.toggleVisibility()
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
  handleBGColorChange = color => {
    this.props.changeBGColor(color.hex)
  }
  handleTextColorChange = color => {
    this.props.changeTextColor(color.hex)
  }
  render() {
    const { visible, settingIconStyle } = this.props
    return (
      <div id="sidebarContainer">
        <Icon
          inverted
          id="settings"
          size="large"
          name="setting"
          onClick={this.toggleVisibility}
          style={{
            ...settingIconStyle,
            color: this.props.messageIsOn && 'red'
          }}
        />
        <Sidebar.Pushable style={{ background: this.props.bgColor }}>
          <Sidebar
            as={Menu}
            animation="scale down"
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
              <div>
                <Menu.Item name="playPause" onClick={this.handlePlayPauseClick}>
                  <Icon name={this.props.timerRunning ? 'pause' : 'play'} />
                </Menu.Item>
                <Menu.Item
                  name="save to a button"
                  onClick={this.handleSaveButtonClick}
                >
                  <Icon name="save" />
                </Menu.Item>
              </div>
            )}
            <Menu.Item
              name="resetToLastValue"
              onClick={this.hadleResetToLastValueClick}
            >
              <Icon name="undo" />
            </Menu.Item>
            <Menu.Item
              as="a"
              name="Reset To Zero"
              onClick={this.handleResetClick}
            />

            <Popup
              trigger={<Menu.Item as="a" name="Background color" />}
              on="click"
              basic
            >
              <SketchPicker
                onChangeComplete={this.handleBGColorChange}
                color={this.props.bgColor}
              />
            </Popup>

            <Popup
              trigger={<Menu.Item as="a" name="text color" />}
              on="click"
              basic
            >
              <SketchPicker
                onChangeComplete={this.handleTextColorChange}
                color={this.props.pStyle.color}
              />
            </Popup>
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
  pStyle: state.timer.pStyle
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
      id: uuid.v4(),
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
  changeBGColor: color => {
    dispatch({
      type: 'CHANGE_BG_COLOR',
      color
    })
  },
  changeTextColor: color => {
    dispatch({
      type: 'CHANGE_TEXT_COLOR',
      color
    })
  }
})

const TimerSidebarContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(TimerSidebar)

export default TimerSidebarContainer
