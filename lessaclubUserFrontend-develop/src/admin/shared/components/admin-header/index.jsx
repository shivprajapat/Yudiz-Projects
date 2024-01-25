import React, { useState } from 'react'
import { Dropdown } from 'react-bootstrap'
import './style.scss'
import { userProfileIcon } from 'assets/images'
import { useNavigate } from 'react-router-dom'

const AdminHeader = () => {
  const navigate = useNavigate()

  const [showDropdown, setShowDropdown] = useState(false)

  const handleDropDown = () => {
    setShowDropdown((prev) => !prev)
  }

  const logout = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <div className="admin-navigation active">
      <div className="admin-user">
        <Dropdown onClick={() => handleDropDown()}>
          <Dropdown.Toggle id="dropdown-basic">
            <img src={userProfileIcon} alt="" className="img-fluid" />
            <span>admin</span>
          </Dropdown.Toggle>

          <Dropdown.Menu show={showDropdown}>
            <Dropdown.Item>Profile</Dropdown.Item>
            <Dropdown.Item onClick={() => navigate('/admin/settings')}>Setting</Dropdown.Item>
            <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  )
}
export default AdminHeader
