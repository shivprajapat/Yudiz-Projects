import React, { lazy, Suspense } from 'react'
import { FormattedMessage } from 'react-intl'
import { useLocation } from 'react-router-dom'

// Components
import UserHeader from '../../User/components/UserHeader'
import Loading from '../../../component/Loading'

const OffersPage = lazy(() => import('./Offers'))

function Offers () {
  const location = useLocation()

  return (
    <>
      <UserHeader
        backURL={location?.pathname === '/offers/v1' ? '/more/v1' : '/more'}
        title={<FormattedMessage id="Offers" />}
      />

      <Suspense fallback={<Loading />}>
        <OffersPage />
      </Suspense>
    </>
  )
}

export default Offers
