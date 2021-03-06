import React, { Component } from 'react'
import './App.css'
import { connect } from 'react-redux'
import Sound from 'react-sound'
import chimes from './assets/chimes.mp3'

class Timer extends Component {
  componentDidUpdate(prevProps) {
    if (!this.props.twoScreenMode) {
      if (prevProps.timerRunning !== this.props.timerRunning) {
        this.props.timerRunning ? this.startTimer() : this.pauseTimer()
      }
    }
  }

  startTimer = () => {
    let timer = this.props.duration
    let hours
    let minutes
    let seconds

    const interval = setInterval(() => {
      hours = parseInt(timer / 3600, 10)
      minutes = parseInt(timer / 60, 10)
      seconds = parseInt(timer % 60, 10)

      minutes = minutes > 59 ? minutes % 60 : minutes

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
      timer = timer - 1
      //when time is up
      if (timer < 0) {
        this.props.pauseTimer()
        this.pauseTimer()
        this.props.toggleMessage()
      }
    }, 1000)
    this.props.setTimerInterval(interval)
  }

  pauseTimer = () => {
    clearInterval(this.props.timerInterval)
  }

  closeSidebar = () => {
    this.props.sidebarVisibility && this.props.toogleSidebarVisibility()
  }

  render() {
    return (
      <div
        id='timerContainer'
        style={{ ...this.props.containerStyle, background: this.props.bgColor }}
        onTouchStart={this.closeSidebar}
        onClick={this.closeSidebar}
      >
        {this.props.messageIsOn && (
          <div>
            <p
              id='message'
              style={{
                ...this.props.pStyle,
                fontSize: '17vh',
                letterSpacing: '1vh',
                textAlign: 'center',
                color: this.props.warningColor
              }}
              className='blinking'
            >
              TIME IS UP
            </p>
            <Sound url={chimes} playStatus={Sound.status.PLAYING} />
          </div>
        )}
        <p
          id='timer'
          style={{
            ...this.props.pStyle,
            color: this.props.messageIsOn
              ? this.props.warningColor
              : this.props.pStyle.color
          }}
        >
          {this.props.time}
        </p>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  duration: state.timer.duration,
  time: state.timer.time,
  pStyle: state.timer.pStyle,
  containerStyle: state.timer.containerStyle,
  timerRunning: state.timer.timerRunning,
  timerInterval: state.timer.timerInterval,
  messageIsOn: state.timer.messageIsOn,
  twoScreenMode: state.timer.twoScreenMode,
  warningColor: state.timer.warningColor,
  sidebarVisibility: state.timerSidebar.visible
})

const mapDispatchToProps = dispatch => ({
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
  setTimerInterval: interval => {
    dispatch({
      type: 'SET_TIMER_INTERVAL',
      interval
    })
  },
  toggleMessage: () => {
    dispatch({
      type: 'TOGGLE_MESSAGE'
    })
  },
  pauseTimer: () => {
    dispatch({ type: 'PAUSE_TIMER' })
  },
  toogleSidebarVisibility: () => {
    dispatch({
      type: 'TOGGLE_SIDEBAR_VISIBILITY'
    })
  }
})

const TimerContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Timer)
export default TimerContainer
