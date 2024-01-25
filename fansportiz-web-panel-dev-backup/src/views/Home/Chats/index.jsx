import React from 'react'
import PropTypes from 'prop-types'
import UserHeader from '../../User/components/UserHeader'
import ChatsPage from './Chats'
import { FormattedMessage } from 'react-intl'

function Chats () {
  return (
    <>
      <UserHeader title={<FormattedMessage id="Chat" />} />
      <ChatsPage />
    </>
  )
}

Chats.propTypes = {
  history: PropTypes.shape().isRequired,
  location: PropTypes.shape().isRequired,
  match: PropTypes.shape().isRequired
}

export default Chats
