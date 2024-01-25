import React, { Suspense, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'

/* NPM-Packages */
import './App.css'
import { Provider } from 'react-redux'
/* Store-File */
import configureStore from './Reducers/store'
/* Components */
import RoutesFile from './Routes'
import { SnackbarProvider } from 'react-notistack'
import { AppContext } from './context'
import { Helmet } from 'react-helmet'
// import Fade from '@material-ui/core/Fade'
function App () {
  const [userDetails, setUserDetails] = useState({})
  const [educationdetails, setEducationDetails] = useState({})
  return (
    <>
     <Helmet>
     <title>Ollato</title>
     </Helmet>

        {/* <meta name="description" content="App Description" /> */}
        {/* <meta name="theme-color" content="#008f68" /> */}
    <AppContext.Provider value={{ userDetails: [userDetails, setUserDetails], educationdetails: [educationdetails, setEducationDetails] }} >
      <Provider store={configureStore()} >
      <SnackbarProvider maxSnack={2} anchorOrigin={{
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
          <div className="App">
          <BrowserRouter>
            <Suspense fallback={''}>
              <RoutesFile />
            </Suspense>
            </BrowserRouter>
        {/* <SignUp /> */}
        </div>
      </SnackbarProvider >
      </Provider>
      </AppContext.Provider>
    </>
  )
}

export default App
