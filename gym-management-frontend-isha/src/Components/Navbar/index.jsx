import React, { useContext, useState } from 'react'

// component
import Sidebar from 'Components/Sidebar'

// query
import { getProfile } from 'Query/Profile/profile.query'
import { useMutation, useQuery } from 'react-query'
import { logoutApi } from 'Query/Auth/auth.query'

// icons
import { ReactComponent as Hamburger } from 'Assets/Icons/Hamburger.svg'
import { ReactComponent as Logout } from 'Assets/Icons/Logout.svg'
import { ReactComponent as Down } from 'Assets/Icons/Down.svg'
import { AiOutlineClose } from 'react-icons/ai'

// helper
import { removeToken } from 'helpers'

import { Dropdown, Offcanvas } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { route } from 'Routes/route'
import { userContext } from 'context/user'


export default function Navigationbar() {
  const navigate = useNavigate()
  const { dispatch } = useContext(userContext)

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

  const [sidebarview, setSidebarView] = useState(false)
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

  const { data, isLoading } = useQuery('myProfile', getProfile, {
    select: (data) => data?.data.data,
    onSuccess: (data) => {
      dispatch({ type: 'USER', payload: data || '' })
    }
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

            <div className="logo" onClick={() => navigate(route.dashboard)}>
              <img src={data?.iOrganizationId?.sLogo} alt="Raw" />
            </div>
          </div>
          {!isLoading ? (
            <div className="user_actions">
              <Dropdown>
                <Dropdown.Toggle as={CustomToggle} id="dropdown-basic">
                  <div className="d-flex align-items-center">
                    {/* <div className="profile_picture">
                      <img onError={handleAlterImage} src={data?.sLogo} />
                    </div> */}
                    <div className="user-name ">{data?.sUserName}</div>
                    <div className="down-arrow">
                      <Down className="mx-3" />
                    </div>
                  </div>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as="button" onClick={handleLogout}>
                    <div className="px-1">
                      <Logout className="me-2 mb-1" /> Logout
                    </div>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          ) : null}
        </div>
      </section>
    </>
  )
}
