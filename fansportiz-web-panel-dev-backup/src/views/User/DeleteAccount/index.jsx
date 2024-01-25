import React from 'react'
// import PropTypes from 'prop-types'
import UserHeader from '../components/UserHeader'
import { FormattedMessage } from 'react-intl'
import DeleteAccount from './DeleteAccount'

function DeleteAccountIndex (props) {
  return (
    <>
      <UserHeader
        {...props}
        backURL="/profile"
        title={<FormattedMessage id="Delete_Account" />}
      />
      <DeleteAccount {...props}/>
    </>
  )
}

DeleteAccountIndex.propTypes = {}

export default DeleteAccountIndex
