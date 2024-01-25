import React, { useState } from 'react'

//component
import Sidebar from 'Components/Sidebar'

//Icons
// import { ReactComponent as NotificationLogo } from 'Assets/Icons/Notification.svg'
import { ReactComponent as Hamburger } from 'Assets/Icons/Hamburger.svg'
import { ReactComponent as Profile } from 'Assets/Icons/Profile.svg'
import { ReactComponent as Logout } from 'Assets/Icons/Logout.svg'
import { ReactComponent as Lock } from 'Assets/Icons/Lock.svg'
import { ReactComponent as Down } from 'Assets/Icons/Down.svg'

//query
import { getMyProfile } from 'Query/My-Profile/myprofile.query'
import { useMutation, useQuery } from 'react-query'
import { logoutApi } from 'Query/Auth/auth.query'

//helper
import { handleAlterImage, removeToken } from 'helpers'
import { ReactComponent as HeaderLogo } from 'Assets/Images/Logo.svg'

import { Dropdown, Offcanvas } from 'react-bootstrap'
import { AiOutlineClose } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'



export default function Navigationbar() {
  const navigate = useNavigate()

  const [sidebarview, setSidebarView] = useState(false)


  // get my profile data
  const { data, isLoading } = useQuery('myProfile', getMyProfile, {
    select: (data) => data?.data.user,
  })

  //mutation logout
  const { mutate } = useMutation('logout', () => logoutApi(), {
    retry: false,
    onSuccess: () => {
      const isLocalStorage = !!localStorage.getItem('token')
      removeToken(isLocalStorage)
      navigate('/login')
    },
  })


  function handleLogout() {
    mutate()
  }

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

            <div className="hamburger" onClick={() => setSidebarView(true)}>
              <Hamburger />
            </div>

            <Offcanvas style={{ width: '200px' }} show={sidebarview} onHide={() => setSidebarView((p) => !p)}>
              <div className="offcanvas-header"></div>
              <div className="offcanvas-body p-0">
                <AiOutlineClose className='sidebarClose' onClick={() => setSidebarView(false)} />
                <Sidebar onClose={() => setSidebarView(false)} isSidebarWrapped={false} />
              </div>
            </Offcanvas>

            <HeaderLogo className='logo' />
          </div>

          {
            !isLoading ? (
              <div className="user_actions">
                {/* <NotificationLogo className="mx-2" /> */}

                <Dropdown>
                  <Dropdown.Toggle as={CustomToggle} id="dropdown-basic">
                    <div className="d-flex align-items-center">
                      <div className="profile_picture">
                        <img
                          onError={handleAlterImage}
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
                    <Dropdown.Item as="button" onClick={handleLogout}>
                      <div className="d-flex align-items-center p-2">
                        <Logout className="me-3" /> Logout
                      </div>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            ) : null
          }
        </div>
      </section>
    </>
  )
}
