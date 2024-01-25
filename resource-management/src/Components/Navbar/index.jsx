import React, { useState } from 'react'
import { Dropdown } from 'react-bootstrap'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'

import { ReactComponent as Profile } from 'Assets/Icons/Profile.svg'
import { ReactComponent as Lock } from 'Assets/Icons/Lock.svg'
import { ReactComponent as Logout } from 'Assets/Icons/Logout.svg'
import { ReactComponent as Hamburger } from 'Assets/Icons/Hamburger.svg'
import { ReactComponent as Down } from 'Assets/Icons/Down.svg'
import Sidebar from 'Components/Sidebar'
import { logoutApi } from 'Query/Auth/auth.query'
import { ReactComponent as NotificationLogo } from 'Assets/Icons/Notification.svg'
import { handleAlterImage, removeToken } from 'helpers/helper'
import { getMyProfile } from 'Query/My-Profile/myprofile.query'

export default function Navigationbar() {
  const [data, setData] = useState({})
  const navigate = useNavigate()
  const { refetch } = useQuery('logout', () => logoutApi(), {
    enabled: false,
    retry: false,
  })

  function handleLogout() {
    refetch()
    setTimeout(() => {
      removeToken()
      navigate('/login')
    }, 500)
  }

  useQuery('myProfile', getMyProfile, {
    select: (data) => {
      return data?.data
    },
    onSuccess: (data) => {
      setData(data?.user)
    },
  })

  // eslint-disable-next-line react/prop-types
  const CustomToggle = React.forwardRef(function toggle({ children, onClick }, ref) {
    return (
      <div
        className="cursor-pointer"
        ref={ref}
        onClick={(e) => {
          e.preventDefault()
          onClick(e)
        }}
      >
        {children}
      </div>
    )
  })

  return (
    <>
      <section className="d-flex justify-content-center align-items-center sticky-top navbar_section">
        <div className="d-flex justify-content-between align-items-center w-100 mx-3">
          <div className="d-flex align-items-center">
            <div className="hamburger" data-bs-toggle="offcanvas" href="#offcanvasExample">
              <Hamburger />
            </div>
            <div
              className="offcanvas offcanvas-start"
              style={{ width: '250px' }}
              tabIndex="-1"
              id="offcanvasExample"
              aria-labelledby="offcanvasExampleLabel"
            >
              <div className="offcanvas-header"></div>
              <div className="offcanvas-body p-0">
                <Sidebar />
              </div>
            </div>
            <div className="logo"></div>
          </div>
          <div className="user_actions">
            <NotificationLogo className="mx-2" />

            <Dropdown>
              <Dropdown.Toggle as={CustomToggle} id="dropdown-basic">
                <div className="d-flex align-items-center">
                  <div className="profile_picture">
                    <img
                      onError={(e) => handleAlterImage(e)}
                      src={data?.sProfilePic ? 'https://jr-web-developer.s3.ap-south-1.amazonaws.com/' + data?.sProfilePic : ''}
                    />
                  </div>
                  <div className="user-name ">{data?.sName}</div>
                  <div className="down-arrow">
                  <Down className="mx-3" />
                  </div>
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item as="button" onClick={() => navigate('/my-profile')}>
                  <div className="d-flex align-items-center p-2">
                    <Profile className="me-3" /> My Profile
                  </div>
                </Dropdown.Item>
                <Dropdown.Item as="button" onClick={() => navigate('/change-password')}>
                  <div className="d-flex align-items-center p-2">
                    <Lock className="me-3" /> Change Password
                  </div>
                </Dropdown.Item>
                <Dropdown.Item as="button" onClick={() => handleLogout()}>
                  <div className="d-flex align-items-center p-2">
                    <Logout className="me-3" /> Logout
                  </div>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </section>
      <div className="test"></div>
    </>
  )
}
