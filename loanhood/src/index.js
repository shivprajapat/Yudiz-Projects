import React from 'react'
import ReactDOM from 'react-dom'
import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'
import App from 'App'
import reportWebVitals from './reportWebVitals'
import { Provider } from 'react-redux'
import { store } from 'state/store'
import './index.css'

Sentry.init({
  dsn: 'https://0ca35021e2b6492c9f119e9d3258ee08@o1038793.ingest.sentry.io/6007361',
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0
})

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
