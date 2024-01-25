import React, { useEffect } from 'react'
import { Switch, Route, Redirect, useHistory } from 'react-router-dom'

import Router from 'routes/Router'
// import { allRoutes } from 'shared/constants/AllRoutes'

const PublicRoute = React.lazy(() => import('routes/PublicRoutes'))
const PrivateRoutes = React.lazy(() => import('routes/PrivateRoutes'))

function Routes() {
  const history = useHistory()
  useEffect(() => {
    window.addEventListener('login', (e) => {
      history.push(e.detail.path)
    })
  }, [])
  return (
    <Switch>
      {Router.map((route) => {
        return route.children.map((child, i) => {
          if (route.isRequiredLoggedIn) {
            return (
              <PrivateRoutes
                key={`r${i}`}
                isAllowedTo={child.isAllowedTo}
                path={child.path}
                exact={child.exact}
                roles={child.roles}
                component={child.component}
                {...child}
              />
            )
          } else {
            return <PublicRoute key={`r${i}`} path={child.path} exact={child.exact} component={child.component} />
          }
        })
      })}
      <Route path='/*' render={() => <Redirect to='/' />} />
    </Switch>
  )
}
export default React.memo(Routes)
