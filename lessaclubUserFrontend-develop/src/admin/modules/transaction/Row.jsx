/* eslint-disable react/prop-types */
import React from 'react'
import { FaRegEye } from 'react-icons/fa'
import PropTypes from 'prop-types'
import { convertDateToMDY } from 'shared/utils'
import { adminRoutes } from 'shared/constants/adminRoutes'
import './index.scss'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

const Row = (props) => {
  const { transaction = {} } = props

  const renderTooltip = (props) => {
    return props.value ? <Tooltip id="button-tooltip" {...props}>
      {props.value}
    </Tooltip> : null
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
        {convertDateToMDY(transaction.createdAt)}
      </td>
      <td>{transaction.amount || '-'}</td>
      <td>{formatPaymentMode(transaction.paymentMode) || '-'}</td>
      <td>{transaction.typeName || '-'}</td>
      <td>
        <OverlayTrigger placement="top" overlay={(overlayProps) => renderTooltip({ ...overlayProps, value: transaction.fromWalletAddress })}>
          <span>{transaction.fromWalletAddress || '-'}</span>
        </OverlayTrigger>
      </td>
      <td>
        <OverlayTrigger placement="top" overlay={(overlayProps) => renderTooltip({ ...overlayProps, value: transaction.toWalletAddress })}>
         <span>{transaction.toWalletAddress || '-'}</span>
        </OverlayTrigger>
      </td>
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
