import React, { lazy, Suspense } from 'react'
import { FormattedMessage } from 'react-intl'

// Components
import UserHeader from '../../User/components/UserHeader'
import Loading from '../../../component/Loading'

const ContactUsForm = lazy(() => import('./ContactUs'))

function ContactUS (props) {
  return (
    <>
      <UserHeader {...props} backURL="/complaints" title={<FormattedMessage id='Complaints_and_Feedback' />} />
      <Suspense fallback={<Loading />}>
        <ContactUsForm {...props} />
      </Suspense>
    </>
  )
}

export default ContactUS
