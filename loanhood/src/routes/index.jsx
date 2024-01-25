import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Routes from 'routes/Routes'

const PublicRoute = React.lazy(() => import('routes/PublicRoutes'))
const PrivateRoutes = React.lazy(() => import('routes/PrivateRoutes'))

function Router() {
  return (
    <Switch>
      {Routes.map((route) => {
        return route.children.map((child) => {
          if (route.isRequiredLoggedIn) {
            return <PrivateRoutes path={route.path + child.path} exact={child.exact} component={child.component} />
          } else {
            return <PublicRoute path={route.path + child.path} exact={child.exact} component={child.component} />
          }
        })
      })}
      <Route path="/*" render={() => <Redirect to="/" />} />
    </Switch>
  )
}
export default Router
