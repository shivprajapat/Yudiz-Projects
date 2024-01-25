import React, { useState, Suspense } from 'react'

/* NPM-Packages */
import { BrowserRouter } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import {
  connect
} from 'react-redux'
import './App.css'

/* Auth Action file */
// import { getDummyData } from './Actions/auth'

/* react-intl provider */
import { I18Provider, LOCALES } from './i18n'

/* react-intl property to show messages */
// import { FormattedMessage } from 'react-intl'

// Components
// import Login from './Views/auth/login'
// const Routes = React.lazy(() => import('./routes'))
import RoutesFile from './routes'
import { AppContext } from './context'

export const history = createBrowserHistory()
function App () {
  const [userDetails, setUserDetails] = useState([])

  return (
    <>
    <AppContext.Provider value={{ userDetails: [userDetails, setUserDetails] }} >
      <I18Provider locale={LOCALES.ENGLISH} >
       <BrowserRouter history={history}>
         <Suspense fallback={''}>
          <RoutesFile />
         </Suspense>
       </BrowserRouter>
      </I18Provider>
      </AppContext.Provider>
      {/* Toastify notiifcations */}
    </>
  )
}

export default connect()(App)

// REACT_APP_AXIOS_BASE_URL_DEV=http://3.7.98.19:1340/api
// REACT_APP_AXIOS_BASE_URL_LOCAL_PATH=http://192.168.11.32:1340/api
