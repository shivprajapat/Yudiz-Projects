import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Link as RouterLink } from 'react-router-dom'
import { Box, Button, Divider, IconButton, makeStyles, Popover, Typography } from '@material-ui/core'
// import { useDispatch } from 'react-redux'
import NotificationsIcon from '@material-ui/icons/Notifications'

const useStyles = makeStyles((theme) => ({
  menuItem: {
    padding: theme.spacing(1, 2.5)
  },
  icon: {
    margin: theme.spacing(1)
  },
  hr: {
    margin: theme.spacing(1, 0)
  },
  popover: {
    width: 500
  }
}))
function NotificationPopover() {
  //   const dispatch = useDispatch()
  const anchorRef = useRef(null)
  const [open, setOpen] = useState(false)

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const style = useStyles()
  return (
    <>
      <IconButton ref={anchorRef} onClick={handleOpen} size={'small'}>
        <NotificationsIcon className={style.icon} />
      </IconButton>
      <Popover
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        className={style.popover}
      >
        <Box my={1.5} px={2.5}>
          <Typography variant="subtitle1" noWrap>
            Notifications
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            You have unread notifications
          </Typography>
        </Box>
        <Divider className={style.hr} />

        <Box p={1}>
          <Button fullWidth disableRipple component={RouterLink} to="/notifications">
            View All Notifications
          </Button>
        </Box>
      </Popover>
    </>
  )
}

NotificationPopover.propTypes = {
  user: PropTypes.object
}

export default NotificationPopover
