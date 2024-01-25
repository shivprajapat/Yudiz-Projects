import React, { Fragment, useEffect, useRef, useState } from 'react'
import './App.css'
import { createBrowserHistory } from 'history'
import { BrowserRouter as Router } from 'react-router-dom'
import Routes from './routes/index'
import ModalComponent from './helpers/ModalComponent'
import { store } from './Store'
import { useSelector } from 'react-redux'
export const history = createBrowserHistory()

function App () {
  const error = useSelector(state => state.auth.error)
  const previousProps = useRef({ error }).current
  const [initialFlag, setInitialFlag] = useState(false)
  const token = localStorage.getItem('Token')
  const adminData = JSON.parse(localStorage.getItem('adminData'))
  const permission = JSON.parse(localStorage.getItem('adminPermission'))

  useEffect(() => {
    if (previousProps.error !== error) {
      if (error) {
        setInitialFlag(true)
      }
    }
    setTimeout(() => {
      setInitialFlag(false)
    }, 3000)
    return () => {
      previousProps.error = error
    }
  }, [error])

  if (token) {
    store.dispatch({
      type: 'TOKEN_LOGIN',
      payload: {
        token,
        adminData,
        permission
      }
    })
    if (history.location.pathname === '/auth/login' || history.location.pathname === '/auth/forgot-password') {
      history.push('/dashboard')
    } else {
      history.push({ pathname: history.location.pathname, search: history.location.search })
    }
  } else {
    history.push({ pathname: history.location.pathname })
  }

  return (
    <Fragment>
      {error && initialFlag && <ModalComponent error={error} />}
      <Router history={history}>
        <Routes />
      </Router>
    </Fragment>
  )
}

export default App
