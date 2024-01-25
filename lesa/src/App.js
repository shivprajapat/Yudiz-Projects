import React, { Suspense, useEffect, useState } from 'react'
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

const Routes = React.lazy(() => import('routes'))

export const history = createBrowserHistory()

function App() {
  const [currentLocale, setCurrentLocale] = useState('en')
  const [toast, setToast] = useState({})

  const localeStore = useSelector((state) => state.lang.locale)
  const toastStore = useSelector((state) => state.toast)

  useEffect(() => {
    localeStore && setCurrentLocale(localeStore)
  }, [localeStore])

  useEffect(() => {
    if (toastStore.message) {
      setToast(toastStore)
    } else {
      setToast(toastStore)
    }
  }, [toastStore])

  const getMessages = () => {
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
  }

  return (
    <>
      <IntlProvider messages={getMessages()} locale={currentLocale} defaultLocale="en">
        <Router history={history}>
          <Suspense fallback={<Loading />}>
            <Routes />
          </Suspense>
          {toast.message && <Toaster type={toast.type} msg={toast.message} btnTxt={toast.btnTxt} />}
        </Router>
      </IntlProvider>
    </>
  )
}

export default App
