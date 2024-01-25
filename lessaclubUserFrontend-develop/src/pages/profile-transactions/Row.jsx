import React from 'react'
import { FaRegEye } from 'react-icons/fa'
import PropTypes from 'prop-types'
import { convertDateToMDY } from 'shared/utils'
import { adminRoutes } from 'shared/constants/adminRoutes'
import { orderTypes } from 'admin/modules/orders/constants'
import './index.scss'
const Row = (props) => {
  const { transaction = {} } = props

  const getTransactionTypes = (type) => {
    let typeValue = null
    // eslint-disable-next-line no-unused-vars
    for (const [key, value] of Object.entries(orderTypes)) {
      if (value === Number(type)) {
        typeValue = key
      }
    }
    return typeValue
  }

  const formatPaymentMode = (mode = '') => {
    if (mode === 'Nuu coin') {
      return 'Nuucoin'
    }
    return mode
  }

  return (
    <tr key={transaction.id}>
      <td>
        {transaction.id}
      </td>
      <td>
        {convertDateToMDY(transaction.createdAt) || '-'}
      </td>
      <td>{transaction.amount}</td>
      <td>{formatPaymentMode(transaction.paymentMode) || '-'}</td>
      <td>{getTransactionTypes(transaction.type) || '-'}</td>
      <td>{transaction.fromWalletAddress || '-'}</td>
      <td>{transaction.toWalletAddress || '-'}</td>
      <td>
        {transaction.statusName || '-'}
      </td>
      <td>
        <a target="_blank" rel="noreferrer" href={`${window.location.origin}${adminRoutes.transactionDetails(transaction?.id)}`}>
          <FaRegEye />
        </a>
      </td>
    </tr>
  )
}

export default Row

Row.propTypes = {
  transaction: PropTypes.object
}
