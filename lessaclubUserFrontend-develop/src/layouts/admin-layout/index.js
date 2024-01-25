/* eslint-disable no-unused-vars */
import React, { Suspense, useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import './style.scss'
import Loading from 'shared/components/loading'
import AdminSidebar from 'admin/shared/components/admin-sidebar'
// import AdminFooter from 'admin/shared/components/admin-footer'
import AdminHeader from 'admin/shared/components/admin-header'
import { GlobalEventsContext } from 'shared/components/global-events'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { getUser } from 'modules/user/redux/service'

const AdminLayout = ({ childComponent }) => {
  const [side, setSide] = useState(true)
  const openSidebar = () => setSide(!side)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { dispatch: editProfileEvent } = useContext(GlobalEventsContext)
  const userId = localStorage.getItem('userId')

  const {
    state: { profileData }
  } = React.useContext(GlobalEventsContext)

  useEffect(() => {
    if (userId && !profileData) {
      getUserData()
      return
    }
    if (profileData?.role !== 'admin') {
      localStorage.clear()
      navigate('/login')
    }
  }, [profileData])

  const getUserData = () => {
    dispatch(
      getUser(userId, (data) => {
        editProfileEvent({
          type: 'CHANGE_PROFILE',
          payload: { profileData: data?.users }
        })
      })
    )
  }

  return (
    <div className="admin-layout">
      <AdminSidebar side={side} openSidebar={openSidebar} />
      <AdminHeader />
      <div className={side ? 'active admin-container' : 'admin-container'}>
        <Suspense fallback={<Loading />}>{childComponent}</Suspense>
      </div>
      {/* <AdminFooter /> */}
    </div>
  )
}
AdminLayout.propTypes = {
  childComponent: PropTypes.node.isRequired
}
export default AdminLayout
