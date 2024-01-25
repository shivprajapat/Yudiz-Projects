/* eslint-disable no-unused-vars */
import React from 'react'

// component
import CustomToolTip from 'Components/TooltipInfo'

// icons
import LifeCycle from 'Assets/Icons/LifeCycle'
import Payment from 'Assets/Icons/Payment'
import Delete from 'Assets/Icons/Delete'
import Edit from 'Assets/Icons/Edit'
import Eye from 'Assets/Icons/Eye'

// query
import { queryClient } from 'queryClient'
import { useQuery } from 'react-query'

// helper
import { isGranted } from 'helpers'

import PropTypes from 'prop-types'
import './_actionColumn.scss'

export default function ActionColumn({ handlePayment, handleLifeCycle, handleView, handleEdit, handleDelete, className, permissions, disabled, paymentButtonDisabled = false, paymentButtonToolTip }) {
  const PaymentStyle = !isGranted(permissions?.UPDATE) ? 'hide' : ''
  const LifeCycleStyle = !isGranted(permissions?.UPDATE) ? 'hide' : ''
  const ViewStyle = !isGranted(permissions?.READ) ? 'hide' : ''
  const EditStyle = !isGranted(permissions?.UPDATE) ? 'hide' : ''
  const DeleteStyle = !isGranted(permissions?.DELETE) ? 'hide' : ''


  return (
    <td
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'end',
        textAlign: 'right',
        opacity: disabled ? 0.4 : 1,
      }}
      className={className}
    >
      {handlePayment && (
        <CustomToolTip tooltipContent={paymentButtonToolTip} position="top">
          {({ target }) => (
            <span ref={target} className={`1mx-1 cursor-pointer box-highlight ${!paymentButtonDisabled ? 'table-payment' : 'table-payment-disabled '}  ${PaymentStyle}`} onClick={() => { if (!paymentButtonDisabled && !disabled) { handlePayment() } }}>
              <Payment fill={paymentButtonDisabled ? 'gray' : "#0EA085"} />
            </span>
          )}
        </CustomToolTip>
      )}
      {handleLifeCycle && (
        <CustomToolTip tooltipContent="Life Cycle" position="top">
          {({ target }) => (
            <span ref={target} className={`1mx-1 cursor-pointer box-highlight table-lifecycle ${LifeCycleStyle}`} onClick={!disabled && handleLifeCycle}>
              <LifeCycle fill="#288BE8" />
            </span>
          )}
        </CustomToolTip>
      )}
      {handleView && (
        <CustomToolTip tooltipContent="View" position="top">
          {({ target }) => (
            <span ref={target} className={`1mx-1 cursor-pointer box-highlight table-view ${ViewStyle}`} onClick={!disabled && handleView}>
              <Eye fill="#716cff" />
            </span>
          )}
        </CustomToolTip>
      )}
      {handleEdit && (
        <CustomToolTip tooltipContent="Edit" position="top">
          {({ target }) => (
            <span ref={target} className={`mx-1 cursor-pointer box-highlight table-edit ${EditStyle}`} onClick={!disabled && handleEdit}>
              <Edit fill="#ffb700" />
            </span>
          )}
        </CustomToolTip>
      )}
      {handleDelete && (
        <CustomToolTip tooltipContent="Delete" position="top">
          {({ target }) => (
            <span
              ref={target}
              className={`mx-1 cursor-pointer box-highlight table-delete ${DeleteStyle}`}
              onClick={!disabled && handleDelete}
            >
              <Delete fill="#ff2e69" />
            </span>
          )}
        </CustomToolTip>
      )}
    </td>
  )
}

ActionColumn.propTypes = {
  view: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  handlePayment: PropTypes.func,
  handleLifeCycle: PropTypes.func,
  handleView: PropTypes.func,
  handleEdit: PropTypes.func,
  handleDelete: PropTypes.func,
  permissions: PropTypes.object,
  paymentButtonDisabled: PropTypes.bool,
  paymentButtonToolTip: PropTypes.string
}
