import React from 'react'
import { FormattedMessage } from 'react-intl'
import UserHeader from '../components/UserHeader'
import ProfileInfoPage from './Preference'
function PreferenceInfo (props) {
  return (
    <>
      <UserHeader {...props} backURL="/profile" title={<FormattedMessage id="Preferences" />}/>
      <ProfileInfoPage {...props}/>
    </>
  )
}

export default PreferenceInfo
