/* eslint-disable import/no-duplicates */
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import 'bootstrap/scss/bootstrap.scss'
import 'react-datepicker/dist/react-datepicker.css'
import { SnackbarProvider } from 'react-notistack'
// import Fade from '@material-ui/core/Fade'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './assets/scss/main.scss'
/* Store-File */
import configureStore from './Reducers/store'
import axios from 'axios'
/* Redux-Property */
import { Provider } from 'react-redux'

// axios.defaults.baseURL = 'http://3.7.98.19:1340/api'/
// eslint-disable-next-line dot-notation
// axios.defaults.headers.common['Authorization'] = 'token'
axios.interceptors.request.use((request) => {
  request.headers.channelName = 'Ollato web app'
  return request
})

axios.interceptors.response.use((response) => {
  return response
})
// Add a 401 response interceptor
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  // <React.StrictMode>
    <Provider store={configureStore()} >
    <SnackbarProvider maxSnack={0} autoHideDuration={3000} anchorOrigin={{
      vertical: 'top',
      horizontal: 'right'
    }}
    iconVariant={{
      success: '✅',
      error: '✖️',
      warning: '⚠️',
      info: 'ℹ️'
    }}
    // TransitionComponent={Fade}
    >
       <App />
      </SnackbarProvider >
     </Provider>
  // </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
