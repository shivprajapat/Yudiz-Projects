import React from 'react'
import { Typography } from '@material-ui/core'
import { Route } from 'react-router'
import { Link as RouterLink, useHistory } from 'react-router-dom'
import Link from '@material-ui/core/Link'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'

function Breadcrumb() {
  const history = useHistory()
  function handleClick() {
    history.goBack()
  }
  return (
    <Route>
      {({ location }) => {
        const pathNames = location.pathname.split('/').filter((x) => x)
        const items = pathNames.filter((value) => isNaN(value))
        return (
          <Breadcrumbs aria-label="breadcrumb">
            <Link component={RouterLink} color="inherit" to="/rentals">
              Home
            </Link>
            {items.map((value, index) => {
              const last = index === items.length - 1
              const to = location.pathname.split(value)[0]
              return last ? (
                <Typography color="textPrimary" key={to}>
                  {value}
                </Typography>
              ) : value === 'transaction' ? (
                <Link color="inherit" key={to} onClick={handleClick}>
                  {value}
                </Link>
              ) : (
                <Link color="inherit" component={RouterLink} to={to + value} key={to}>
                  {value}
                </Link>
              )
            })}
          </Breadcrumbs>
        )
      }}
    </Route>
  )
}

export default Breadcrumb
