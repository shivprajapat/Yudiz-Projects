import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Sidebar from 'Components/Sidebar'
import { Alert, Snackbar } from '@mui/material'
import { NavLink } from 'react-router-dom'
import { route } from 'Constants/AllRoutes'
import { useSelector } from 'react-redux'

const Wrapper = ({ children }) => {
  const [open, setOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const notification = useSelector((state) => state.notification.isNotification)

  const staticData = [
    { message: 'Notification From Audit Dashboard', path: route.audit, variant: 'success' },
    { message: 'Notification From Patch Dashboard', path: route.patch, variant: 'error' },
    { message: 'Notification From Vulnerabillity Dashboard', path: route.vulnerability, variant: 'warning' },
    { message: 'Notification From All Dashboard', path: route.allDashboard, variant: 'info' }
  ]

  useEffect(() => {
    if (notification) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % staticData.length)
        setOpen(true)
      }, 6000)

      return () => clearInterval(interval)
    }
  }, [staticData.length, notification])

  const handleClose = () => {
    setOpen(false)
  }

  const currentNotification = staticData[currentIndex]
  return (
    <section className='flex '>
      <NavLink to={currentNotification?.path}>
        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
          <Alert severity={currentNotification?.variant} sx={{ width: '100%' }} className='cursor-pointer'>
            {currentNotification.message}
          </Alert>
        </Snackbar>
      </NavLink>
      <Sidebar />
      {children}
    </section>
  )
}

Wrapper.propTypes = {
  children: PropTypes.node
}
export default Wrapper
