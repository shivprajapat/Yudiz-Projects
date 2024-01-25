import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { Form } from 'react-bootstrap'

import { FaRegEye } from 'react-icons/fa'
import { allRoutes } from 'shared/constants/allRoutes'
import ConfirmationModal from 'shared/components/confirmation-modal'
import { adminBlockUnblockUser } from 'admin/modules/user/redux/service'

function CustomerItemRow({ customer }) {
  const dispatch = useDispatch()

  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [checkBoxTarget, setCheckBoxTarget] = useState(null)
  const [isCheckBoxOn, setIsCheckBoxOn] = useState(customer.isBlocked)

  const blockedUnblockedCustomer = useSelector((state) => state.adminUser.blockUnblockUser)

  const confirmationTitle = `Customer ${isCheckBoxOn ? 'Unblock' : 'Block'} Confirmation`
  const confirmationDescription = `Are you sure to ${isCheckBoxOn ? 'unblock' : 'block'} the customer?`
  const userId = localStorage.getItem('userId')

  const handleStatusChange = (target) => {
    dispatch(adminBlockUnblockUser(target.id, { blockedBy: target.checked ? userId : null, isBlocked: target.checked }))
    setIsConfirmOpen(false)
  }

  const handleCheckBoxStatusChange = ({ target }) => {
    setIsConfirmOpen(!isConfirmOpen)
    setCheckBoxTarget(target)
  }

  const handleConfirmation = () => {
    handleStatusChange(checkBoxTarget)
  }

  const handleClose = () => {
    setIsConfirmOpen(false)
  }

  useEffect(() => {
    if (blockedUnblockedCustomer?.user?.id === customer.id) {
      setIsCheckBoxOn(blockedUnblockedCustomer.user.isBlocked)
    }
  }, [blockedUnblockedCustomer])

  return (
    <>
      <ConfirmationModal
        show={isConfirmOpen}
        handleConfirmation={handleConfirmation}
        handleClose={handleClose}
        title={confirmationTitle}
        description={confirmationDescription}
      />
      <tr key={customer.id}>
        <td>{(customer.firstName || customer.lastName) ? `${customer.firstName} ${customer.lastName}` : '-'}</td>
        <td>{customer.email || '-'}</td>
        <td>{customer?.userName || '-'}</td>
        <td>
          {customer.role !== 'admin' && (
            <Form.Check
              className="admin-switch d-inline-block"
              type="switch"
              id={customer.id}
              checked={!customer.isBlocked}
              // onChange={onStatusChange}
              onChange={handleCheckBoxStatusChange}
            />
          )}
          <a target="_blank" rel="noreferrer" href={`${window.location.origin}${allRoutes.creatorCollected(customer.id)}`}>
            <FaRegEye />
          </a>
        </td>
      </tr>
    </>
  )
}
CustomerItemRow.propTypes = {
  customer: PropTypes.object
}
export default CustomerItemRow
