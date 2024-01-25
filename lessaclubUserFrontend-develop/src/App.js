import React, { Suspense, useMemo } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { IntlProvider } from 'react-intl'
import { createBrowserHistory } from 'history'

import en from 'lang/en.json'
import es from 'lang/es.json'
import ar from 'lang/ar.json'
import ru from 'lang/ru.json'
import Toaster from 'shared/components/toast'
import Loading from 'shared/components/loading'
import { GlobalEventsContext, GlobalEventsReducer } from 'shared/components/global-events'

const Routes = React.lazy(() => import('routes'))

export const history = createBrowserHistory()

function App() {
  const [state, dispatch] = React.useReducer(GlobalEventsReducer, {})

  const localeStore = useSelector((state) => state.lang.locale)
  const toastStore = useSelector((state) => state.toast)
  const getMessages = useMemo(() => {
    switch (localeStore) {
      case 'en':
        return en
      case 'es':
        return es
      case 'ar':
        return ar
      case 'ru':
        return ru
      default:
        return en
    }
  }, [localeStore])

  return (
    <>
      <IntlProvider messages={getMessages} locale={localeStore} defaultLocale="en">
        <GlobalEventsContext.Provider
          value={{
            state,
            dispatch
          }}
        >
          <Router history={history}>
            <Suspense fallback={<Loading />}>
              <Routes />
            </Suspense>
            {toastStore?.message && <Toaster type={toastStore?.type} msg={toastStore?.message} btnTxt={toastStore?.btnTxt} />}
          </Router>
        </GlobalEventsContext.Provider>
      </IntlProvider>
    </>
  )
}

export default App
