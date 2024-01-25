import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Link as RouterLink } from 'react-router-dom'
import { Avatar, Box, Button, Divider, IconButton, makeStyles, MenuItem, Popover, Typography } from '@material-ui/core'
import SettingsIcon from '@material-ui/icons/Settings'
import { useDispatch } from 'react-redux'
import { Logout } from 'state/actions/auth'

const useStyles = makeStyles((theme) => ({
  menuItem: {
    padding: theme.spacing(1, 2.5)
  },
  icon: {
    marginRight: theme.spacing(2)
  },
  hr: {
    margin: theme.spacing(1, 0)
  },
  popover: {
    width: 220
  }
}))
function AccountPopover({ user }) {
  const dispatch = useDispatch()
  const anchorRef = useRef(null)
  const [open, setOpen] = useState(false)

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const logout = () => {
    dispatch(Logout())
    localStorage.removeItem('filteredData')
    // localStorage.removeItem('UserCurrentPage')
    // localStorage.removeItem('RentalCurrentPage')
  }
  const style = useStyles()
  return (
    <>
      <IconButton ref={anchorRef} onClick={handleOpen} size={'small'}>
        <Avatar src={'https://minimal-kit-react.vercel.app/static/mock-images/avatars/avatar_default.jpg'} alt="photoURL" />
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
            {user.firstName} {user.lastName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user.emailId}
          </Typography>
        </Box>
        <Divider className={style.hr} />
        <MenuItem key={'Settings'} to={'/setting'} component={RouterLink} onClick={handleClose} className={style.menuItem}>
          <SettingsIcon className={style.icon} />
          Settings
        </MenuItem>
        <Box p={2} pt={1.5}>
          <Button onClick={logout} fullWidth color="inherit" variant="outlined">
            Logout
          </Button>
        </Box>
      </Popover>
    </>
  )
}

AccountPopover.propTypes = {
  user: PropTypes.object
}

export default AccountPopover
