import React, { Component } from 'react'
import './App.css'
import { connect } from 'react-redux'

class Timer extends Component {
  componentDidUpdate(prevProps) {
    if (prevProps.timerRunning !== this.props.timerRunning) {
      this.props.timerRunning ? this.startTimer() : this.pauseTimer()
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
      
      minutes = minutes > 59 ? (minutes % 60) : minutes

      const duration = seconds + minutes * 60 + hours * 3600 - 1
      
      minutes = minutes < 10 ? '0' + minutes : minutes
      seconds = seconds < 10 ? '0' + seconds : seconds


      this.props.updateTimer(
        `${hours < 1 ? '' : hours + ':'}${minutes}:${seconds}`,
        duration
      )
      timer = timer - 1
      if (timer < 0) {
        timer = this.props.duration
      }
    }, 1000)
    this.props.setTimerInterval(interval)
  }

  pauseTimer = () => {
    clearInterval(this.props.timerInterval)
  }

  render() {
    const { time, pStyle } = this.props
    return (
      <div id="timerContainer">
        <p id="timer" style={pStyle}>
          {time}
        </p>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  duration: state.timer.duration,
  time: state.timer.time,
  pStyle: state.timer.pStyle,
  timerRunning: state.timer.timerRunning,
  timerInterval: state.timer.timerInterval
})

const mapDispatchToProps = dispatch => ({
  updateTimer: (time, duration) => {
    dispatch({
      type: 'UPDATE_TIMER',
      time,
      duration
    })
  },
  setTimerInterval: interval => {
    dispatch({
      type: 'SET_TIMER_INTERVAL',
      interval
    })
  }
})

const TimerContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Timer)
export default TimerContainer
