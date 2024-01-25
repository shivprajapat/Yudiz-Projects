import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'

import { Button } from 'react-bootstrap'
import ConfirmationModal from 'shared/components/confirmation-modal'
import { deleteCategory, getCategories } from 'modules/category/redux/service'

function CategoryItemRow({ name, id, page, perPage }) {
  const dispatch = useDispatch()

  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  const confirmationTitle = 'Category Delete Confirmation'
  const confirmationDescription = 'Are you sure you want to delete this category?'

  const handleClose = () => {
    setIsConfirmOpen(false)
  }
  const handleConfirmation = () => {
    dispatch(deleteCategory(id))
    dispatch(getCategories({ page, perPage }))
    setIsConfirmOpen(false)
  }

  return (
    <>
      <ConfirmationModal
        show={isConfirmOpen}
        handleConfirmation={handleConfirmation}
        handleClose={handleClose}
        title={confirmationTitle}
        description={confirmationDescription}
      />
      <tr key={id}>
        <td>
          <span className="admin-asset-name">{name}</span>
        </td>
        <td>
          <Button className="white-btn" onClick={() => setIsConfirmOpen(true)}>
            Delete
          </Button>
        </td>
      </tr>
    </>
  )
}
CategoryItemRow.propTypes = {
  name: PropTypes.string,
  id: PropTypes.number,
  page: PropTypes.number,
  perPage: PropTypes.number,
  onStatusChange: PropTypes.func
}

export default CategoryItemRow
