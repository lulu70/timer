import React, { Component } from 'react'
import { SketchPicker } from 'react-color'
import { connect } from 'react-redux'
import isElectron from 'is-electron'
import { Popup, Label, Segment, Divider } from 'semantic-ui-react'

class Preferences extends Component {
  handleBGColorChange = color => {
    this.props.changeBGColor(color.hex)
    // isElectron() && window.ipcRenderer.send('bgColor', color.hex)
  }

  handleTextColorChange = color => {
    this.props.changeTextColor(color.hex)
    // isElectron() && window.ipcRenderer.send('textColor', color.hex)
  }
  render() {
    return (
      <div
        style={{
          ...this.props.containerStyle,
          justifyContent: 'flex-start',
          background: 'black',
          paddingTop: '110px'
        }}
      >
        <Segment inverted style={{ width: '90vw' }}>
          <p>Background Color</p>
          <Popup
            hoverable
            inverted
            position="right center"
            trigger={
              <Label
                size="large"
                style={{
                  background: this.props.bgColor,
                  border: 'solid white'
                }}
              />
            }
            on="click"
          >
            <SketchPicker
              onChangeComplete={this.handleBGColorChange}
              color={this.props.bgColor}
              disableAlpha
            />
          </Popup>
          <Divider />
          <p>Text Color</p>
          <Popup
            hoverable
            inverted
            position="right center"
            trigger={
              <Label
                size="large"
                style={{
                  background: this.props.pStyle.color,
                  border: 'solid white'
                }}
              />
            }
            on="click"
          >
            <SketchPicker
              onChangeComplete={this.handleTextColorChange}
              color={this.props.pStyle.color}
              disableAlpha
            />
          </Popup>
        </Segment>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  pStyle: state.timer.pStyle,
  bgColor: state.timer.bgColor,
  containerStyle: state.timer.containerStyle
})

const mapDispatchToProps = dispatch => ({
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

const PreferencesContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Preferences)

export default PreferencesContainer
