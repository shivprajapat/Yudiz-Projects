import React, { useState, useEffect, useContext } from 'react'
import { Dropdown } from 'react-bootstrap'
import { FormattedMessage, useIntl } from 'react-intl'
import { useHistory } from 'react-router'

import { allRoutes } from 'shared/constants/AllRoutes'
import { TOAST_TYPE } from 'shared/constants'
import ChangePassword from '../change-password'
import { GlobalEventsContext } from '../global-events'
import PopUpModal from '../pop-up-modal'
import { clearLocalStorage, getFromLocalStorage } from 'shared/helper/localStorage'
import { logout } from 'shared/apis/auth'
import { ToastrContext } from '../toastr'

function Header() {
  const [user, setUser] = useState()
  const [isChangePassOpen, setIsChangePassOpen] = useState(false)
  const [isDropDown, setIsDropDown] = useState(false)
  const { dispatch } = useContext(ToastrContext)
  const history = useHistory()

  const {
    state: { profileData }
  } = React.useContext(GlobalEventsContext)

  useEffect(() => {
    profileData && setUser({ ...user, ...profileData })
  }, [profileData])

  async function handleLogout() {
    const role = getFromLocalStorage('role')
    const response = await logout(role)
    if (response?.status === 200) {
      clearLocalStorage()
      dispatch({
        type: 'SHOW_TOAST',
        payload: { message: response.message, type: TOAST_TYPE.Success, btnTxt: 'Close' }
      })
      role === 'admin' ? history.push(allRoutes.admin) : history.push(allRoutes.login)
    }
  }

  function handleEditProfile() {
    history.push(allRoutes.editProfile)
  }
  function handleChangePass() {
    setIsChangePassOpen(!isChangePassOpen)
  }

  return (
    <header className='header d-flex align-items-center justify-content-between'>
      <div className='header-left'>
        <Dropdown show={isDropDown} onMouseEnter={() => setIsDropDown(true)} onMouseLeave={() => setIsDropDown(false)}>
          <Dropdown.Toggle variant='link' className='square p-0 d-flex align-items-center'>
            <div className='img d-flex align-items-center justify-content-center'>
                <i className='icon-account'></i>
            </div>
            {user && user.sDisplayName}
          </Dropdown.Toggle>
          <Dropdown.Menu className='up-arrow'>
            <Dropdown.Item onClick={handleEditProfile}>
              <i className='icon-account'></i>
              <FormattedMessage id='myProfile' />
            </Dropdown.Item>
            <Dropdown.Item onClick={handleChangePass}>
              <i className='icon-lock'></i>
              <FormattedMessage id='changePassword' />
            </Dropdown.Item>
            <Dropdown.Item onClick={handleLogout}>
              <i className='icon-logout'></i>
              <FormattedMessage id='logout' />
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      {isChangePassOpen && (
        <PopUpModal isOpen={isChangePassOpen} onClose={handleChangePass} title={useIntl().formatMessage({ id: 'changePassword' })}>
          <ChangePassword onClose={handleChangePass} />
        </PopUpModal>
      )}
    </header>
  )
}

export default Header
