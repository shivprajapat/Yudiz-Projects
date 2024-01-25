import React, { lazy, Suspense } from 'react'
import { FormattedMessage } from 'react-intl'
import { useLocation } from 'react-router-dom'

// Components
import UserHeader from '../../User/components/UserHeader'
import Loading from '../../../component/Loading'

const PointSystemPage = lazy(() => import('./PointSystem'))

function PointSystem () {
  const { pathname } = useLocation()

  return (
    <>
      <UserHeader
        backURL={pathname === '/point-system/v1' ? '/more/v1' : '/more'}
        title={<FormattedMessage id="Point_System" />}
      />

      <Suspense fallback={<Loading />}>
        <PointSystemPage />
      </Suspense>
    </>
  )
}

export default PointSystem
