import React, { lazy, Suspense } from 'react'
import { FormattedMessage } from 'react-intl'

// Components
import UserHeader from '../../User/components/UserHeader'
import Loading from '../../../component/Loading'

const ComplaintsList = lazy(() => import('./ComplaintsList'))

function Complaints (props) {
  return (
    <>
      <UserHeader
        {...props}
        backURL="/more"
        title={<FormattedMessage id='Complaints_and_Feedback' />}
      />
      <Suspense fallback={<Loading />}>
        <ComplaintsList
          {...props}
        />
      </Suspense>
    </>
  )
}

export default Complaints
