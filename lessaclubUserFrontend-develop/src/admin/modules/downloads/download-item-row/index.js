import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { Button } from 'react-bootstrap'
import { downloadFile } from '../downloadFile'
import ConfirmationModal from 'shared/components/confirmation-modal'

const DownloadItemRow = ({ name, id, awsUrl, page, perPage, deleteTransactionCsv, fetchTransactionCsvs }) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  const downloadHandler = () => {
    downloadFile({ downloadUrl: awsUrl, fileName: name })
  }

  const deleteHandler = async (name) => {
    await deleteTransactionCsv(name)
    fetchTransactionCsvs({ page, perPage })
    setIsConfirmOpen(false)
  }

  const handleClose = () => {
    setIsConfirmOpen(false)
  }

  return (
    <>
      {isConfirmOpen && (
        <ConfirmationModal
          show={isConfirmOpen}
          handleConfirmation={() => deleteHandler(name)}
          handleClose={handleClose}
          title={'Delete Download'}
          description={'Are you sure you want to delete this download?'}
        />
      )}
      <tr key={id}>
        <td>
          <span className="admin-asset-name">{name}</span>
        </td>
        <td>
          <Button className="white-btn me-1" onClick={downloadHandler}>
            Download
          </Button>
          <Button className="black-btn" onClick={() => setIsConfirmOpen(true)}>
            Delete
          </Button>
        </td>
      </tr>
    </>
  )
}
DownloadItemRow.propTypes = {
  name: PropTypes.string,
  awsUrl: PropTypes.string,
  id: PropTypes.number,
  page: PropTypes.number,
  perPage: PropTypes.number,
  fetchTransactionCsvs: PropTypes.func,
  deleteTransactionCsv: PropTypes.func
}

export default DownloadItemRow
