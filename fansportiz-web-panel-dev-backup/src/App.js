import React, { useEffect, useReducer, useState } from 'react'
import { createBrowserHistory } from 'history'
import { BrowserRouter as Router } from 'react-router-dom'
import Intl from '../src/intl/index'
import firebase from 'firebase'
import Ads from './component/Ads'
import ReactGA from 'react-ga'
import configs from './config/config'
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import userReducer from './redux/reducers/userReducers'
import { UserContext } from './redux/userContext'
import AllRoutes from './routes/index'
import useVerifyToken from './api/auth/mutations/useVerifyToken'
import useGetUrl from './api/url/queries/useGetUrl'
import useGetNotificationCount from './api/notification/queries/useGetNotificationCount'
import useGetBackground from './api/settings/queries/useGetBackground'
export const history = createBrowserHistory()

const config = {
  apiKey: 'AIzaSyAaGJDH6RvCuI0_hhoaZl3pX0clHOpoiB4',
  authDomain: 'fantasy-wl.firebaseapp.com',
  projectId: 'fantasy-wl',
  storageBucket: 'fantasy-wl.appspot.com',
  messagingSenderId: '218538323308',
  appId: '1:218538323308:web:0f2ee2f13f110a59db9749',
  measurementId: 'G-VK4CQMC2N7'
}

firebase.initializeApp(config)
firebase.analytics()
let fbToken = ''
if (firebase.messaging.isSupported()) {
  const messaging = firebase.messaging()

  messaging.onMessage((payload) => {
    navigator.serviceWorker.getRegistrations().then((registration) => {
      registration[0].showNotification(payload && payload.notification && payload.notification.title, {
        data: payload?.data,
        body: payload.notification.body,
        icon: '/firebase-logo.png',
        title: payload.notification.title
      })
    })
  })

  messaging.getToken().then(function (token) {
    fbToken = token
    localStorage.setItem('FirebaseToken', fbToken)
  }).catch(function (err) {
    console.log('Error Occurred. ' + err)
  })
}

function App () {
  let visitorId = ''
  const [state, dispatch] = useReducer(userReducer, { token: '' })
  const token = localStorage.getItem('Token')

  const { mutate: VerifyToken } = useVerifyToken()
  const { sMediaUrl } = useGetUrl()
  useGetNotificationCount({ token })
  const { sImage, sBackImage } = useGetBackground()

  const [showingImage, setShowingImage] = useState(false)
  const [bannerImg, setBannerImg] = useState('')

  async function setSystemIdFunc () {
    if (window) {
      const fp = await FingerprintJS.load()
      const result = await fp.get()
      visitorId = result.visitorId
      localStorage.setItem('ID', visitorId)
      ReactGA.initialize('UA-204021649-1')
    }
  }

  useEffect(() => {
    setSystemIdFunc()
  }, [])

  useEffect(() => {
    if (token) VerifyToken({ sPushToken: token, sDeviceId: visitorId })
  }, [token])

  return (
    <div className='full-screen' style={{ backgroundImage: sMediaUrl && sBackImage ? `url(${sMediaUrl}${sBackImage})` : '' }}>
      {
        sImage && sMediaUrl && (
          <img className='back-Img' src={sMediaUrl && sImage ? `${sMediaUrl}${sImage}` : ''} />
        )
      }
      <div className='left-bar' onClick={() => showingImage && setShowingImage(false)}>
        {
          configs?.environment && (
            <div className='ui-feedback'>
              <p>{configs.environment}</p>
            </div>
          )
        }
        <UserContext.Provider value={{ state, dispatch }}>
          <Intl>
            <Router history={history}>
              <Ads bannerImg={bannerImg} history={history} setBannerImg={setBannerImg} setShowingImage={setShowingImage} showingImage={showingImage} url={sMediaUrl} />
              <div className={`${showingImage && sMediaUrl && bannerImg ? 'blur' : 'left-bar'}`}>
                <AllRoutes />
              </div>
            </Router>
          </Intl>
        </UserContext.Provider>
      </div>
    </div>
  )
}

export default App
