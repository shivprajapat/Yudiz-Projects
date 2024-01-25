// ** React Imports
import { Fragment, useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Utils
import { isUserLoggedIn } from '@utils'

// ** Store & Actions
import { useDispatch } from 'react-redux'

// ** Third Party Components
import { UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem } from 'reactstrap'
import { User, Power } from 'react-feather'

// ** Default Avatar Image
import defaultAvatar from '@src/assets/images/portrait/small/avatar-s-11.jpg'
import { handleLogout } from '../../../../redux/actions/auth'

const UserDropdown = () => {
  // ** Store Vars
  const dispatch = useDispatch()
  const history = useHistory()
  // ** State
  const [userData, setUserData] = useState(null)

  const [userProfileData, setUserProfileData] = useState()

  //* * ComponentDidMount
  useEffect(() => {
    if (isUserLoggedIn() !== null) {
      setUserData(localStorage.getItem('userData'))
    }
  }, [])

  useEffect(() => {
    if (isUserLoggedIn()) {
      setUserProfileData(JSON.parse(localStorage.getItem('userData')))
    }
  }, [])

  //* * Vars
  const userAvatar = (userProfileData && userProfileData.sAvatar) || defaultAvatar

  const handleUserLogout = () => {
    dispatch(handleLogout(() => history.push('/login')))
  }
  return (
    <UncontrolledDropdown tag="li" className="dropdown-user nav-item">
      <DropdownToggle href="/" tag="a" className="nav-link dropdown-user-link" onClick={(e) => e.preventDefault()}>
        <div className="user-nav d-sm-flex d-none">
          <span className="user-name font-weight-bold">{userProfileData && userProfileData.sUserName}</span>
          <span className="user-status">{(userData && userData.role) || 'Admin'}</span>
        </div>
        <Avatar img={userAvatar} imgHeight="40" imgWidth="40" status="online" />
      </DropdownToggle>
      <DropdownMenu right>
        {window.location.pathname === '/pages/profile' ? (
          <Fragment></Fragment>
        ) : (
          <DropdownItem tag={Link} to="/pages/profile">
            <User size={14} className="mr-75" />
            <span className="align-middle">Profile</span>
          </DropdownItem>
        )}

        <DropdownItem tag={Link} to="/login" onClick={handleUserLogout}>
          <Power size={14} className="mr-75" />
          <span className="align-middle">Logout</span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default UserDropdown
