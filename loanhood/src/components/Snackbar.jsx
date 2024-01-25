import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'

function OpenSnackbar({ isOpen, message }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    isOpen ? setOpen(true) : setOpen(false)
  }, [isOpen])

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
      message={message}
      action={
        <React.Fragment>
          <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </React.Fragment>
      }
    />
  )
}

OpenSnackbar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired
}

export default OpenSnackbar
