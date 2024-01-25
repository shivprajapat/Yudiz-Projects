import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import App from './App'
import 'bootstrap/scss/bootstrap.scss'
import 'assets/scss/main.scss'
import { store } from 'redux/store'

const Index = () => {
  return (
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  )
}
ReactDOM.render(<Index />, document.getElementById('root'))
