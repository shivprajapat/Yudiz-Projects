import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useParams } from 'react-router-dom'
import UserHeader from '../components/UserHeader'
import ChangeProfileDetails from './ChangeProfileDetails'

function ChangeProfile (props) {
  const { type } = useParams()

  return (
    <>
      <UserHeader
        {...props}
        backURL='/profile/user-info'
        title={type === 'email' ? <FormattedMessage id='Enter_New_Email' /> : type === 'mobile-number' ? <FormattedMessage id='Enter_New_Mobile' /> : ''}
      />
      <ChangeProfileDetails {...props} Type={type}/>
    </>
  )
}

export default ChangeProfile
