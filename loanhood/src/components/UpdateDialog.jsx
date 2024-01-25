import React from 'react'
import PropTypes from 'prop-types'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '300px'
  }
}))
function UpdateDialog({ open, message, handleResponse, component, secondComponent, disabled, add }) {
  const style = useStyles()

  return (
    <Dialog open={open}>
      <DialogTitle className={style.root}>Are you sure?</DialogTitle>
      <DialogContent dividers>
        {message}
        <Box>{component && component}</Box>
        <Box>{secondComponent && secondComponent}</Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={() => handleResponse(false)} size="medium" color="primary">
          Cancel
        </Button>
        <Button onClick={() => handleResponse(true)} size="medium" color="primary" disabled={disabled}>
          {add ? 'Add' : 'Update'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
UpdateDialog.propTypes = {
  open: PropTypes.bool,
  disabled: PropTypes.bool,
  add: PropTypes.bool,
  message: PropTypes.string,
  handleResponse: PropTypes.func,
  component: PropTypes.node,
  secondComponent: PropTypes.node
}
export default UpdateDialog
