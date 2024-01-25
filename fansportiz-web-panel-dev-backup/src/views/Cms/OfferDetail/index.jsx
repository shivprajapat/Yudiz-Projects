import React, { lazy, Suspense } from 'react'
import { FormattedMessage } from 'react-intl'

// Components
import UserHeader from '../../User/components/UserHeader'
import Loading from '../../../component/Loading'

const OfferDetailPage = lazy(() => import('./OfferDetail'))

function OfferDetail () {
  return (
    <>
      <UserHeader
        backURL="/offers"
        title={<FormattedMessage id="Offer_details" />}
      />
      <Suspense fallback={<Loading />}>
        <OfferDetailPage />
      </Suspense>
    </>
  )
}

export default OfferDetail
