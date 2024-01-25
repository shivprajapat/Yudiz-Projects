import React from 'react'
import UserHeader from '../components/UserHeader'
import ChangePasswordPage from './ChangePassword'
function ChangePassword (props) {
  return (
    <>
      <UserHeader {...props} backURL="/profile" title="Change Password"/>
      <ChangePasswordPage {...props} />
    </>
  )
}

export default ChangePassword
