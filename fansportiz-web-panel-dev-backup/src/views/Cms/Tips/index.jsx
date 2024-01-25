import React, { lazy, Suspense } from 'react'

// Components
import UserHeader from '../../User/components/UserHeader'
import Loading from '../../../component/Loading'
import { FormattedMessage } from 'react-intl'

const MatchTipsPage = lazy(() => import('./MatchTips'))

function MatchTips () {
  return (
    <>
      <UserHeader title={<FormattedMessage id="Match_Tips" />} />
      <Suspense fallback={<Loading />}>
        <MatchTipsPage />
      </Suspense>
    </>
  )
}

export default MatchTips
