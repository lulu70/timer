import React, { Component } from 'react'
import './App.css'
import TimerSidebar from './TimerSidebar'
import { Route, Switch } from 'react-router-dom'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <Route exact path="/" render={() => <TimerSidebar />} />
        </Switch>
      </div>
    )
  }
}

export default App
