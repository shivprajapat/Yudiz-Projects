import React from 'react'
import { FormattedMessage } from 'react-intl'
import UserHeader from '../components/UserHeader'
import TransactionsPage from './Transactions'
function Transactions (props) {
  return (
    <>
      <UserHeader {...props} backURL="/profile" title={<FormattedMessage id='Transactions' />} />
      <TransactionsPage {...props}/>
    </>
  )
}

export default Transactions
