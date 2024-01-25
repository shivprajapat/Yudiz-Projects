import React, { Suspense, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Container, makeStyles } from '@material-ui/core'
import { GetCurrentUser } from 'state/actions/user'
import { GetAllCategories, GetAllColors } from 'state/actions/filter'
import { io } from 'socket.io-client'

const Navbar = React.lazy(() => import('./Navbar'))
const SideBar = React.lazy(() => import('./SideBar'))
const Breadcrumb = React.lazy(() => import('components/Breadcrumb'))

const APP_BAR_MOBILE = 64
const APP_BAR_DESKTOP = 92

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    minHeight: '100%',
    overflow: 'hidden'
  },
  main: {
    flexGrow: 1,
    overflow: 'auto',
    minHeight: '100%',
    paddingTop: APP_BAR_MOBILE + 24,
    paddingBottom: theme.spacing(10),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    [theme.breakpoints.up('lg')]: {
      paddingTop: APP_BAR_DESKTOP + 24,
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  }
}))

const socketConnection = io('wss://app.loanhood.com', { extraHeaders: { authorization: localStorage.getItem('userToken') } })

function MainLayout(props) {
  const style = useStyles()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.currentUser)
  const [open, setOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState({})
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    dispatch(GetCurrentUser())
    // For Filters
    dispatch(GetAllCategories())
    // dispatch(GetAllMaterials())
    dispatch(GetAllColors())
  }, [])

  useEffect(() => {
    console.log(process.env.NODE_ENV)
    setSocket(socketConnection)
  }, [setSocket])

  useEffect(() => {
    user && setCurrentUser(user)
  }, [user])

  return (
    <Box className={style.root} component="div">
      <Suspense fallback={<div style={{ width: 280, borderRight: '1px solid rgba(145,158,171,0.24)' }}>Loading...</div>}>
        <SideBar user={currentUser} isOpen={open} onCloseSidebar={() => setOpen(false)} />
      </Suspense>
      <Box className={style.main} component="div">
        <Suspense fallback={<div>Loading...</div>}>
          <Navbar socket={socket} user={currentUser} onOpenSidebar={() => setOpen(true)} />
        </Suspense>
        <Container>
          <Suspense fallback={<div>Loading...</div>}>
            <Breadcrumb />
          </Suspense>
          <Suspense fallback={<div>Loading...</div>}>{props.childComponent}</Suspense>
        </Container>
      </Box>
    </Box>
  )
}

MainLayout.propTypes = {
  childComponent: PropTypes.node.isRequired
}

export default MainLayout
export { socketConnection }
