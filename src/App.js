import React, { Component } from 'react'
import './App.css'
import TimerSidebar from './TimerSidebar'
import Preferences from './Preferences'
import { Route, Switch } from 'react-router-dom'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <Route exact path="/" render={() => <TimerSidebar />} />
          <Route exact path="/preferences" render={() => <Preferences />} />
        </Switch>
      </div>
    )
  }
}

export default App
