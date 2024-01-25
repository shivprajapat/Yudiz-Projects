import React from 'react'
// import PropTypes from 'prop-types'
import UserHeader from '../components/UserHeader'
import { FormattedMessage } from 'react-intl'
import ReferFriend from './Referrals'

function ReferFriendIndex (props) {
  return (
    <>
      <UserHeader {...props} backURL="/profile" title={<FormattedMessage id="Refer_a_friend" />}/>
      <ReferFriend {...props}/>
    </>
  )
}

// ReferFriendIndex.propTypes = {}

export default ReferFriendIndex
