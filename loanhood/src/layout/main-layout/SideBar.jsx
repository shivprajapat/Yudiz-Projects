import React from 'react'
import PropTypes from 'prop-types'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { Avatar, Box, Drawer, Hidden, List, makeStyles, Typography, useTheme } from '@material-ui/core'

import logo from 'assets/images/logo.png'
import sidebarConfig from './SidebarConfig'

const NavItem = React.lazy(() => import('./NavItem'))

const DRAWER_WIDTH = 280

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.up('lg')]: {
      flexShrink: 0,
      width: DRAWER_WIDTH
    }
  },
  drawerPaper: {
    width: DRAWER_WIDTH
  },
  accountStyle: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2, 2.5),
    borderRadius: theme.shape.borderRadiusSm,
    backgroundColor: theme.palette.grey[200]
  }
}))

function SideBar({ user, isOpen, onCloseSidebar }) {
  const classes = useStyles()
  const { pathname } = useLocation()
  const theme = useTheme()
  const renderContent = (
    <>
      <Box px={2.5} py={3}>
        <Box component={RouterLink} to="/" style={{ display: 'inline-flex' }}>
          <Box component="img" src={logo} width={80} />
        </Box>
      </Box>
      <Box mb={5} mx={2.5}>
        <div className={classes.accountStyle}>
          <Avatar src={'https://minimal-kit-react.vercel.app/static/mock-images/avatars/avatar_default.jpg'} alt="photoURL" />
          <Box ml={2}>
            <Typography variant="subtitle2" color={'textPrimary'}>
              {user.firstName} {user.lastName}
            </Typography>
          </Box>
        </div>
      </Box>
      <Box>
        <List disablePadding>
          {sidebarConfig.map((item, index) => {
            return <NavItem key={index} item={item} activePath={pathname} />
          })}
        </List>
      </Box>
    </>
  )

  return (
    <>
      <Box className={classes.root}>
        <Hidden mdUp implementation="css">
          <Drawer
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={isOpen}
            onClose={onCloseSidebar}
            classes={{
              paper: classes.drawerPaper
            }}
            ModalProps={{
              keepMounted: true // Better open performance on mobile.
            }}
          >
            {renderContent}
          </Drawer>
        </Hidden>
        <Hidden mdDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper
            }}
            variant="permanent"
            open
          >
            {renderContent}
          </Drawer>
        </Hidden>
      </Box>
    </>
  )
}

SideBar.propTypes = {
  isOpen: PropTypes.bool,
  onCloseSidebar: PropTypes.func,
  user: PropTypes.object
}

export default SideBar
