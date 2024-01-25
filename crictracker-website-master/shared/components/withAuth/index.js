import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Spinner } from 'react-bootstrap'

import { allRoutes } from '@shared/constants/allRoutes'
import { getToken } from '@shared/libs/token'

function WithAuth(Component, routeType) {
  const withDisplayName = props => {
    const router = useRouter()
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
      const token = getToken()
      if (token && routeType === 'public') {
        router.replace('/')
      } else if (!token && routeType === 'private') {
        router.replace(allRoutes.signIn)
      } else {
        setIsVisible(false)
      }
    }, [])

    return (
      <>
        <div hidden={isVisible}>
          <Component {...props} />
        </div>
        {isVisible && (
          <div className="d-flex justify-content-center align-items-center">
            <Spinner className="ms-2 align-middle" animation="border" />
          </div>
        )}
      </>
    )
  }

  withDisplayName.displayName = 'withAuthComponent'
  return withDisplayName
}

export default WithAuth

// import React from 'react'
// import Router from 'next/router'
// import { getToken } from '@shared/libs/menu'
// import { allRoutes } from '@shared/constants/allRoutes'

// export default (WrappedComponent, routeType, url) => {
//   const hocComponent = ({ ...props }) => <WrappedComponent {...props} />

//   hocComponent.getInitialProps = async (context) => {
//     console.log('inn')
//     const token = context?.req?.cookies?.token || getToken()
//     // Are you an authorized user or not?
//     if (token && routeType === 'public') {
//       console.log('public')
//       handleRouteChange(context?.res, '/')
//     } else if (!token && routeType === 'private') {
//       handleRouteChange(context?.res, allRoutes.signIn)
//     } else if (WrappedComponent.getInitialProps) {
//       console.log('else if')
//       const wrappedProps = await WrappedComponent.getInitialProps({ ...context })
//       return { ...wrappedProps }
//     }
//     return { token }
//   }

//   return hocComponent
// }

// // Handle server-side and client-side rendering.
// function handleRouteChange(res, url) {
//   if (res) {
//     console.log({ server: true })
//     res.setHeader('Cache-Control', 'no-store, must-revalidate')
//     // res?.writeHead(302, {
//     //   Location: url
//     // })
//     // res?.end()
//   } else if (!res) {
//     console.log({ Client: true })
//     Router.replace(url)
//   }
// }
