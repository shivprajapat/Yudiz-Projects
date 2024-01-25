import React from 'react'
import PropTypes from 'prop-types'
import { Box, Button, ButtonGroup, makeStyles, Tooltip, Typography } from '@material-ui/core'
import AsyncCSV from './AsyncCSV'

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  secondBtn: {
    marginLeft: '15px'
  }
}))

function PageTitle({
  title,
  rightButton,
  icon,
  handleBtnEvent,
  secondRightButton,
  handleUserChange,
  disabledDeleteRental,
  disabledChangeUser,
  inbox,
  showInbox,
  showAllNotification,
  inboxState,
  showAllNotificationState,
  EditBtnInDetail,
  handleEditInDetail,
  EditIcon,
  EditBtnDisabled,
  downloadBtn,
  id
}) {
  const style = useStyles()
  return (
    <Box className={style.root} mb={5}>
      <Typography variant="h4">{title}</Typography>
      <Box component="div">
        {secondRightButton && (
          <Button onClick={handleUserChange} disabled={disabledChangeUser} variant="contained" color="primary">
            {secondRightButton}
          </Button>
        )}
        {rightButton && (
          <Button
            onClick={handleBtnEvent}
            disabled={disabledDeleteRental}
            className={style.secondBtn}
            variant="contained"
            style={{ backgroundColor: disabledDeleteRental ? '' : '#ff0000', color: disabledDeleteRental ? '' : '#ffffff' }}
            startIcon={icon}
          >
            {rightButton}
          </Button>
        )}
        {inbox && (
          <ButtonGroup color="primary">
            <Button onClick={showInbox} variant={inboxState === 'inbox' && 'contained'}>
              Inbox
            </Button>
            <Button onClick={showAllNotification} variant={showAllNotificationState === 'all' && 'contained'}>
              All
            </Button>
          </ButtonGroup>
        )}
        {EditBtnDisabled && (
          <Tooltip title="Disabled because rental transaction state is not editable">
            <span>
              <Button color="primary" disabled variant="contained" startIcon={(EditIcon && EditIcon) || icon}>
                {EditBtnInDetail}
              </Button>
            </span>
          </Tooltip>
        )}
        {EditBtnInDetail && !EditBtnDisabled && (
          <Button color="primary" onClick={handleEditInDetail} variant="contained" startIcon={(EditIcon && EditIcon) || icon}>
            {EditBtnInDetail}
          </Button>
        )}
        {downloadBtn && <AsyncCSV id={id} />}
      </Box>
    </Box>
  )
}

PageTitle.propTypes = {
  title: PropTypes.string,
  rightButton: PropTypes.string,
  secondRightButton: PropTypes.string,
  icon: PropTypes.node,
  EditIcon: PropTypes.node,
  handleBtnEvent: PropTypes.func,
  handleUserChange: PropTypes.func,
  disabledChangeUser: PropTypes.bool,
  disabledDeleteRental: PropTypes.bool,
  inbox: PropTypes.bool,
  showAllNotification: PropTypes.func,
  showInbox: PropTypes.func,
  showAllNotificationState: PropTypes.string,
  inboxState: PropTypes.string,
  EditBtnInDetail: PropTypes.string,
  handleEditInDetail: PropTypes.func,
  EditBtnDisabled: PropTypes.bool,
  downloadBtn: PropTypes.bool,
  id: PropTypes.string
}

export default PageTitle
