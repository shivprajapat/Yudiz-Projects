import React from 'react'
import PropTypes from 'prop-types'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core'

function ConfirmDialog({ open, message, handleResponse, component }) {
  return (
    <Dialog maxWidth={'xs'} fullWidth={true} open={open}>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogContent dividers>{message}</DialogContent>
      {component && component}
      {component ? (
        <DialogActions>
          <Button onClick={() => handleResponse(false)} size="medium" color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleResponse(true)} size="medium" color="primary">
            Update
          </Button>
        </DialogActions>
      ) : (
        <DialogActions>
          <Button onClick={() => handleResponse(false)} size="medium" color="primary">
            No
          </Button>
          <Button onClick={() => handleResponse(true)} size="medium" type="submit" color="primary">
            Yes
          </Button>
        </DialogActions>
      )}
    </Dialog>
  )
}
ConfirmDialog.propTypes = {
  open: PropTypes.bool,
  message: PropTypes.string,
  handleResponse: PropTypes.func,
  component: PropTypes.node
}
export default ConfirmDialog
