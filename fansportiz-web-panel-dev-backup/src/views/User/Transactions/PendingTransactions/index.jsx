import React from 'react'
import { FormattedMessage } from 'react-intl'
import UserHeader from '../../components/UserHeader'
import PendingTransactions from './PendingTransactions'
// import PropTypes from 'prop-types'

function PendingTransactionIndex (props) {
  return (
    <>
      <UserHeader {...props} backURL="/transactions" title={<FormattedMessage id='Pending_transactions' />} />
      <PendingTransactions {...props} />
    </>
  )
}

PendingTransactionIndex.propTypes = {}

export default PendingTransactionIndex
