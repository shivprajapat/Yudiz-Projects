import React, { Fragment } from 'react'
import { Route, useParams, Link as RouterLink } from 'react-router-dom'
import { Breadcrumb, BreadcrumbItem } from 'reactstrap'

function Breadcrumbs() {
  const { id } = useParams()
  return (
    <Route>
      {({ location }) => {
        const pathNames = location.pathname.split('/').filter((x) => x)
        const items = pathNames.filter((value) => value !== id)
        return (
          <Breadcrumb className="breadcrumb-main" style={{ '--bs-breadcrumb-divider': '>' }}>
            {items.map((value, index) => {
              const last = index === items.length - 1
              const to = location.pathname.split(value)[0]
              return last ? (
                <BreadcrumbItem active key={value}>
                  {value}
                </BreadcrumbItem>
              ) : (
                <Fragment key={value}>
                  <BreadcrumbItem>
                    <RouterLink to={to + value}>{value}</RouterLink>
                  </BreadcrumbItem>
                  <i className="icon-chevron-right"></i>
                </Fragment>
              )
            })}
          </Breadcrumb>
        )
      }}
    </Route>
  )
}

export default Breadcrumbs
