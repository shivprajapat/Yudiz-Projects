import React from 'react'
import { useRouter } from 'next/router'
import { Spinner } from 'react-bootstrap'

import { getToken } from '@shared/libs/menu'

function WithAuth(WrappedComponent, routeType, pageURL) {
  function WithAuthDisplayName(props) {
    if (typeof window !== 'undefined') {
      const Router = useRouter()
      const token = getToken()
      const { pathname } = window.location
      if (!token && routeType === 'private') {
        if (pathname === pageURL) Router.replace('/')
        return (
          <div className="common-height d-flex justify-content-center align-items-center">
            <Spinner className="ms-2 align-middle" animation="border" />
          </div>
        )
      }
      if (token && routeType === 'public') {
        if (pathname === pageURL) Router.replace('/')
        return (
          <div className="common-height d-flex justify-content-center align-items-center">
            <Spinner className="ms-2 align-middle" animation="border" />
          </div>
        )
      }

      return <WrappedComponent {...props} />
    } else return null
  }
  WithAuthDisplayName.displayName = 'withAuthDisplayName'
  return WithAuthDisplayName
}

export default WithAuth
