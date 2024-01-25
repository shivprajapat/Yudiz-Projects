import React, { lazy, Suspense } from 'react'
import UserHeader from '../components/UserHeader'
import { FormattedMessage } from 'react-intl'
import Loading from '../../../component/Loading'
const KycVerificationPage = lazy(() => import('./KycVerification'))

function KycVerification (props) {
  return (
    <>
      <UserHeader
        {...props}
        backURL="/profile"
        title={<FormattedMessage id="KYC_Verification" />}
      />
      <Suspense fallback={<Loading />}>
        <KycVerificationPage {...props}/>
      </Suspense>
    </>
  )
}

export default KycVerification
