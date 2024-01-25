import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { QueryClientProvider } from '@tanstack/react-query'
import 'bootstrap/dist/css/bootstrap.min.css'

import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import './assests/css/styles.scss'
import { registerServiceWorker } from './serviceWorker'
import { store } from './redux/store'
import { client } from './api/client'

const container = document.getElementById('root')
const root = createRoot(container)

root.render(
  <Provider store={store}>
    <QueryClientProvider client={client}>
      <App />
    </QueryClientProvider>
  </Provider>
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
registerServiceWorker()
serviceWorker.unregister()
