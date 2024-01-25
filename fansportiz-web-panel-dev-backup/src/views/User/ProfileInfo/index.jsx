import React from 'react'
import UserHeader from '../components/UserHeader'
import ProfileInfoPage from './ProfileInfo'
function ProfileInfo (props) {
  return (
    <>
      <UserHeader {...props} backURL="/profile" title="Edit Profile"/>
      <ProfileInfoPage {...props}/>
    </>
  )
}

export default ProfileInfo
