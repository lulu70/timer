import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import 'semantic-ui-css/semantic.min.css'
import store from './redux/redux.js'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root')
)
registerServiceWorker()
