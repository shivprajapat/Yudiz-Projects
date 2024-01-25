import React from 'react'

import { IntlProvider } from 'react-intl'
import { createRoot } from 'react-dom/client'
import App from 'App'
import reportWebVitals from 'reportWebVitals'
import 'bootstrap/scss/bootstrap.scss'
import 'assets/scss/main.scss'
import en from './lang/en.json'

import { ToastrContext, ToastrReducers } from 'shared/components/toastr'

console.log('React version', React.version)
const rootElement = document.getElementById('root')
const root = createRoot(rootElement)

function Index() {
  const [state, dispatch] = React.useReducer(ToastrReducers, {})

  return (
    <React.StrictMode>
      <IntlProvider messages={en} locale="en" defaultLocale="en">
        <ToastrContext.Provider
          value={{
            state,
            dispatch
          }}
        >
          <App />
        </ToastrContext.Provider>
      </IntlProvider>
    </React.StrictMode>
  )
}

root.render(<Index />)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
