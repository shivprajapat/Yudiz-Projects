import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { AppBar, Badge, Box, Hidden, IconButton, makeStyles, Toolbar } from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import MenuIcon from '@material-ui/icons/Menu'
import { hexToRGB } from 'theme/palette'
import NotificationsIcon from '@material-ui/icons/Notifications'
import { socketConnection } from 'layout/main-layout/index'

const AccountPopover = React.lazy(() => import('./AccountPopover'))
// const NotificationPopover = React.lazy(() => import('./NotificationPopover'))

const DRAWER_WIDTH = 280
const APPBAR_MOBILE = 64
const APPBAR_DESKTOP = 92

function Navbar({ onOpenSidebar, user, socket }) {
  const [isNotification, setIsNotification] = useState(0)
  const history = useHistory()
  const useStyles = makeStyles((theme) => ({
    root: {
      boxShadow: 'none',
      backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
      backgroundColor: hexToRGB(theme.palette.background.default, 0.72),
      [theme.breakpoints.up('lg')]: {
        width: `calc(100% - ${DRAWER_WIDTH + 1}px)`
      }
    },
    toolbar: {
      minHeight: APPBAR_MOBILE,
      flexGrow: 1,
      [theme.breakpoints.up('lg')]: {
        minHeight: APPBAR_DESKTOP,
        padding: theme.spacing(0, 5)
      }
    }
  }))
  useEffect(() => {
    socketConnection.on('adminMessage', (data) => {
      setIsNotification(1)
    })
  }, [socket])
  function gotoNotification() {
    setIsNotification(0)
    history.push('/notifications')
  }
  const style = useStyles()
  return (
    <AppBar className={style.root}>
      <Toolbar className={style.toolbar}>
        <Hidden lgUp implementation="css">
          <IconButton onClick={onOpenSidebar} edge="start" color="primary" aria-label="menu">
            <MenuIcon />
          </IconButton>
        </Hidden>
        <Box style={{ flexGrow: 1 }} />
        <IconButton onClick={gotoNotification}>
          <Badge badgeContent={isNotification} color="primary" variant="dot">
            <NotificationsIcon className={style.icon} />
          </Badge>
        </IconButton>
        <AccountPopover socket={socket} user={user} />
      </Toolbar>
    </AppBar>
  )
}

Navbar.propTypes = {
  onOpenSidebar: PropTypes.func,
  socket: PropTypes.object,
  user: PropTypes.object
}

export default Navbar
